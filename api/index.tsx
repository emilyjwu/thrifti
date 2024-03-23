import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import SelectDropdown from "react-native-select-dropdown";
import EntypoIcon from "react-native-vector-icons/Entypo";
import IconWithBackground from "../components/IconWithBackground";
import { limit, getDocs, collection, query, where } from "firebase/firestore";

// FIREBASE IN QUARANTINE UNTIL IT WORKS
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
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

export { firestore, storage, auth };
