import {firestore, auth, fetchBasicUserInfo} from '../database/index';
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp,
    onSnapshot,
    Timestamp

  } from "firebase/firestore";
  import uuid from 'react-native-uuid';


  export const getDate = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    return {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
      hours: currentHours,
      minutes: currentMinutes,
      seconds: currentSeconds
    };
  };



/**
 * Create a chat when a user clicks the chat icon on a listing
 *
 * @param recieverInfo the person selling the item/receiving the image
 * @param imageURi image of the listing
 * @param listingName name of the listing
 * @param listingID listingID
 * @param binID binID to navigate back to listing form a specific chat
 * @retruns the chat ID and chat data that shows on the chat page
 */
  export const createChat = async (recieverInfo, imageUri, listingName, listingId, binId, seller) => {
    const currentUser = auth?.currentUser;
    const currentUserID = currentUser?.uid;

    if(currentUserID == recieverInfo.userID) {
      console.log("u cant message urself duhh");
      return;
    }

    if (!currentUserID) {
        console.log("Authentication state not ready");
        return;
    }
    //check whether the group(chats in firestore) exists, if not create
    const currentUserInfo = await fetchBasicUserInfo(currentUserID);



    const combinedId =
    currentUserID > recieverInfo.userID
        ? currentUserID + recieverInfo.userID + listingId
        : recieverInfo.userID + currentUserID + listingId;

    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));
      // console.log("awaiting chats")

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });

        //create user chats --> ex: Jane texts John. We store Jane's info in John's user chat!
        console.log(recieverInfo.userName)
        await updateDoc(doc(firestore, "userChats", recieverInfo.userID), {
          [combinedId + ".userInfo"]: {
            uid: currentUserID,
            displayName: currentUserInfo?.userName,
            photoURL: currentUserInfo?.profilePicURL,
            imageUri: imageUri,
            listingName: listingName,
            listingId: listingId,
            binId: binId,
            seller: seller,
          },
        //   [combinedId + ".date"]: serverTimestamp(),
        [combinedId + ".date"]: Timestamp.now(),
        // [combinedId + ".date"]: getDate(),
        });
        console.log("updated user chats for reciever")


        await updateDoc(doc(firestore, "userChats", currentUserID), {

          [combinedId + ".userInfo"]: {
            uid: recieverInfo?.userID,
            displayName: recieverInfo?.userName,
            photoURL: recieverInfo?.profilePicURL,
            imageUri: imageUri,
            listingName: listingName,
            listingId: listingId,
            binId: binId,
          },
        //   [combinedId + ".date"]: serverTimestamp(),
        [combinedId + ".date"]: Timestamp.now(),
        // [combinedId + ".date"]: new Date(),
        });
        console.log("updated user chats for sender")
      }
    } catch (err) {
        console.log(err)
    }

    //this is added because I need to pass this info to create a chat (chat screen)
    try {
      const chatData = await getChats(currentUser);

      if (chatData) {
          const chatArray = Object.keys(chatData).map((key) => ({
              id: key,
              date: chatData[key]?.date,
              lastMessage: chatData[key]?.lastMessage?.text || '',
              userInfo: chatData[key]?.userInfo,
              displayName: chatData[key]?.userInfo?.displayName,
              imageUri: chatData[key]?.userInfo?.imageUri,
              listingName: chatData[key]?.userInfo?.listingName,
              listingId: chatData[key]?.userInfo?.listingId,
              photoURL: chatData[key]?.userInfo?.photoURL,
              binId: chatData[key]?.userInfo?.binId,
              userId: chatData[key]?.userInfo?.uid,
              seller:chatData[key]?.userInfo?.seller,
          }));

          return { combinedId, chatArray}; // Return combinedId along with chat data
      }
  } catch (err) {
      console.log(err);
  }

};



/**
 * Get all of the chats a user has
 *
 * @param currentUSer the current user
 */
  export const getChats = (currentUser) => {
    return new Promise((resolve, reject) => {
      if (!currentUser || !currentUser.uid) {
        reject(new Error('User or UID not available'));
        return;
      }

      const unsubscribe = onSnapshot(doc(firestore, "userChats", currentUser.uid), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          resolve(data); // Resolve the promise with the retrieved data
        } else {
          reject(new Error('Chat data not found'));
        }
      });

      return () => {
        unsubscribe(); // Return the unsubscribe function
      };
    });
  };




/**
 * Send a message between two people (updates the chats document in the DB)
 * by adding the message to the messages array
 *
 * @param text message sent
 * @param chatID id in the chats DB that is the conversation (current uid + reciever id + listing name)
 * @param otherUserID recipient id
 */
  export const handleSend = async (text, chatId, otherUserId) => {
    console.log("in handle send")
    // console.log(text)

    const currentUser = auth?.currentUser;

    try {
        const chatDocRef = doc(firestore, "chats", chatId);

        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            id: uuid.v4(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        console.log("Updated chats in DB");
      } catch (error) {
        console.error("Error updating chats in DB:", error);
      }



    const userChatsRef = doc(firestore, "userChats", currentUser.uid);
    const otherUserChatsRef = doc(firestore, "userChats", otherUserId);

    await updateDoc(userChatsRef, {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: Timestamp.now(),

    });

    await updateDoc(otherUserChatsRef, {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: Timestamp.now(),
    });
    console.log("updated user chats in DB")

    // Clear the text input after sending the message
    // setText("");
  };


/**
 * Get a specific conversation between two users to display on the chats page
 *
 * @param chatID id in the chats DB that is the conversation (current uid + reciever id + listing name)
 */
export const getConvo = (chatId) => {
    const currentUser = auth?.currentUser;
    console.log('Fetching conversation for chatId:', chatId);
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (snapshot) => {
        const data = snapshot.data();
        if (data) {
          const lastMessage = data.messages[data.messages.length - 1];
          resolve(data);
        } else {
          reject(new Error('Chat data not found'));
        }
      });

      return () => {
        unsubscribe();
      };
    });
  };