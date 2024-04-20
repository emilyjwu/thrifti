import {firestore, auth, fetchBasicUserInfo} from '../database/index';
import {
    getDocs,
    collection,
    query,
    where,
    arrayUnion,
    arrayRemove,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp,
    onSnapshot,
    Timestamp

  } from "firebase/firestore";
  import React, { useState, useEffect } from 'react';
//   import { v4 as uuid } from "uuid";
  import uuid from 'react-native-uuid';



  export const createChat = async (recieverInfo, imageUri, listingName, listingID, binID) => {
    const currentUserID = auth?.currentUser?.uid;
    console.log(currentUserID);

    if (!currentUserID) {
        console.log("Authentication state not ready");
        return;
    }
    //check whether the group(chats in firestore) exists, if not create
    const currentUserInfo = await fetchBasicUserInfo(currentUserID);


    const combinedId =
    currentUserID > recieverInfo.userID
        ? currentUserID + recieverInfo.userID + listingID
        : recieverInfo.userID + currentUserID + listingID;

    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));
      console.log("awaiting chats")

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
            binId: binID,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("updated user chats for reciever")


        await updateDoc(doc(firestore, "userChats", currentUserID), {

          [combinedId + ".userInfo"]: {
            uid: recieverInfo?.userID,
            displayName: recieverInfo?.userName,
            photoURL: recieverInfo?.profilePicURL,
            imageUri: imageUri,
            listingName: listingName,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("updated user chats for sender")
      }
    } catch (err) {
        console.log(err)
    }


  };


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




//pass in the text, and the other user uid, and the chatID(userId + otherUserId + listingID)
  export const handleSend = async (text, chatId, otherUserId) => {
    console.log("in handle send")
    console.log(text)

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


//   export const getConvo = (chatId) => {
//     const currentUser = auth?.currentUser;
//     return new Promise((resolve, reject) => {
//       const unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (snapshot) => {
//         const data = snapshot.data();
//         if (data) {
//           resolve(data); // Resolve the promise with the retrieved data
//         } else {
//           reject(new Error('Chat data not found'));
//         }
//       });

//       return () => {
//         unsubscribe(); // Return the unsubscribe function
//       };
//     });
//   };

// export const getConvo = (chatId) => {
//     const currentUser = auth?.currentUser;
//     return new Promise((resolve, reject) => {
//       const unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (snapshot) => {
//         const data = snapshot.data();
//         if (data) {
//           resolve(data); // Resolve the promise with the retrieved data
//         } else {
//           reject(new Error('Chat data not found'));
//         }
//       });

//       return () => {
//         unsubscribe(); // Return the unsubscribe function
//       };
//     });
//   };
export const getConvo = (chatId) => {
    const currentUser = auth?.currentUser;
    console.log('Fetching conversation for chatId:', chatId);
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (snapshot) => {
        const data = snapshot.data();
        console.log('Snapshot data:', data);
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