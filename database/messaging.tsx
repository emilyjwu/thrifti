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
    serverTimestamp
  } from "firebase/firestore";
  import React, { useState, useEffect } from 'react';


  const currentUserID = auth?.currentUser?.uid;
//   console.log(currentUserID)




  export const createChat = async (recieverInfo) => {
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
        ? currentUserID + recieverInfo.userID
        : recieverInfo.userID + currentUserID;
    console.log("here")
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));
      console.log("awaitung chats")

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });

        //create user chats
        console.log(recieverInfo.userName)
        await updateDoc(doc(firestore, "userChats", recieverInfo.userID), {
          [combinedId + ".userInfo"]: {
            uid: recieverInfo?.userID,
            displayName: recieverInfo?.userName,
            photoURL: recieverInfo?.profilePicURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("updated user chats for reciever")


        await updateDoc(doc(firestore, "userChats", currentUserID), {

          [combinedId + ".userInfo"]: {
            uid: currentUserID,
            displayName: currentUserInfo?.userName,
            photoURL: currentUserInfo?.profilePicURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("updated user chats for sender")
      }
    } catch (err) {
        console.log(err)
    }


  };