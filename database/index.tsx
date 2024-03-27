import React, { useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";

// FIREBASE IN QUARANTINE UNTIL IT WORKS
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { User, getAuth } from "firebase/auth";
import { createContext } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Store this data secretly in the future
  apiKey: "AIzaSyDOR2CXlRn8HrJWgNupyohQsZ7kcFGiW0c",
  authDomain: "thrifti-26fa9.firebaseapp.com",
  projectId: "thrifti-26fa9",
  storageBucket: "thrifti-26fa9.appspot.com",
  messagingSenderId: "951891213336",
  appId: "1:951891213336:web:aecbec5aaeac09a12e576d",
  measurementId: "G-S14MRGXS0L",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore();
const storage = getStorage(firebaseApp);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const uploadImageToStorage = async (
  imageUri: string,
  binID: string,
  listingName: string
) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageName = listingName; // Set a unique name for your image
    const storageRef = ref(storage, `${binID}/${imageName}`);
    await uploadBytesResumable(storageRef, blob);
    console.log("Image uploaded successfully");
    return 200;
  } catch {
    console.log("Issue storing image in FBS");
    return 400;
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);

  const setAuthAfterLogin = (userData: User) => {
    setUserAuth(userData);
  };

  return (
    <AuthContext.Provider value={{ userAuth, setAuthAfterLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// retrives the ID of all of a user's bins as a [] of binIDs
export const fetchUserBins = async (userID: string) => {
  try {
    const binQuerySnapshot = await getDocs(
      query(collection(firestore, "bins"), where("userID", "==", userID))
    );
    const binIDs = binQuerySnapshot.docs.map((doc) => doc.id);
    console.log("Bins: ", binIDs);
    return binIDs;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return [];
  }
};

// retrives the ID of all bin in the DB as a [] of binIDs
export const fetchAllBins = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "bins"));
    const ids = querySnapshot.docs.map((doc) => doc.id);
    return ids;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

// accesses items for a given bin and returns the image URLs as a [] of URLs
export const fetchURLs = async (binID: string) => {
  if (!binID) {
    return [];
  }
  try {
    const itemQuerySnapshot = await getDocs(
      query(collection(firestore, "items"), where("binID", "==", binID))
    );
    const imgRefs = itemQuerySnapshot.docs.map((doc) => {
      return ref(storage, "/" + binID + "/" + doc.id);
    });
    const urls = await Promise.all(
      imgRefs.map(async (ref) => {
        const downloadURL = await getDownloadURL(ref);
        return downloadURL;
      })
    );
    console.log("URLs: ", urls);
    return urls;
  } catch (error) {
    console.error("Problem retrieving URLs:", error);
    return [];
  }
};

export { firestore, storage, auth };
