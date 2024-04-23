import {firestore, auth, fetchBasicUserInfo} from '../database/index';
import {
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp,
    onSnapshot,
    Timestamp,
    addDoc,
    collection
  } from "firebase/firestore";
  import uuid from 'react-native-uuid';





/**
 * Create an offer when the buyer clicks "Send Offer"
 *
 * @param price the person selling the item/receiving the image
 * @param listingID listingID
 * @param sellerID seller ID
 * @return string stating the offer status for the alert
 */
  export const createOffer = async (price, listingID, sellerID) => {
    const currentUser = auth?.currentUser;
    const currentUserID = currentUser?.uid;

    if (!currentUserID) {
        console.log("Authentication state not ready");
        return;
    }

    const currentUserInfo = await fetchBasicUserInfo(currentUserID);


     //check whether the group(chats in firestore) exists, if not create
    const combinedId =
    currentUserID > sellerID
        ? currentUserID + sellerID + listingID
        : sellerID + currentUserID + listingID;

    try {
        const offerDocRef = doc(firestore, "offers", combinedId);
        console.log(offerDocRef);
        const offerDocSnapshot = await getDoc(offerDocRef);

      if (!offerDocSnapshot.exists()) {
        //create a chat in chats collection
        const offerData = {
            price: price,
            pending: true,
            buyerID: currentUserID,
            sellerID: sellerID,
            date: Timestamp.now(),
            listingID: listingID
        };
        await setDoc(offerDocRef, offerData);
        console.log("added offer in DB successfully ")
        return "sucess";

      } else {
        const offerData = offerDocSnapshot.data();
        if (!offerData.pending) {
            await updateDoc(offerDocRef, {
                price: price,
                pending: true,
                date: Timestamp.now()
            });
            console.log("Offer document updated successfully");
            return "success";
        } else {
            const pendingPrice = offerData.price;
            console.log("Offer exists but is not pending");
            return "pending";
        }

      }
    } catch (err) {
        console.log("Could not add offer to DB", err)
    }

};



/**
 * Get all of the chats a user has
 *
 * @param listingId the listingId
 * @param otherUser the other user uid
 * @returns exisiting offer
 */
  export const getExisitingOffer = (listingId, otherUser) => {
    const currentUser = auth?.currentUser;
    const currentUserID = currentUser?.uid;

    if (!currentUserID) {
        console.log("Authentication state not ready");
        return;
    }

    const combinedId =
    currentUserID > otherUser
        ? currentUserID + otherUser + listingId
        : otherUser + currentUserID + listingId;

    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(doc(firestore, "offers", combinedId), (snapshot) => {
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
      [chatId + ".date"]: serverTimestamp(),

    });

    await updateDoc(otherUserChatsRef, {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
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
    // console.log('Fetching conversation for chatId:', chatId);
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