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
  console.log(currentUserID)




  export const createChat = async (recieverInfo) => {

    //check whether the group(chats in firestore) exists, if not create
    const currentUserInfo = await fetchBasicUserInfo(currentUserID);


    const combinedId =
    currentUserID > recieverInfo.userID
        ? currentUserID + recieverInfo.userID
        : recieverInfo.userID + currentUserID;
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(firestore, "userChats", recieverInfo.userID), {
          [combinedId + ".userInfo"]: {
            uid: recieverInfo.userID,
            displayName: recieverInfo.userName,
            photoURL: recieverInfo.profilePicURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });


        await updateDoc(doc(firestore, "userChats", currentUserID), {
          [combinedId + ".userInfo"]: {
            uid: currentUserID,
            displayName: currentUserInfo.userName,
            photoURL: currentUserInfo.profilePicURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}


  };