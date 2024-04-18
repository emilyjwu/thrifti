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
  } from "firebase/firestore";
  import React, { useState, useEffect } from 'react';



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
    console.log("here")
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));
      console.log("awaitung chats")

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
