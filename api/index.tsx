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
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
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

const uploadImageToFBS = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const imageName = "TEST_UPLOAD.jpg"; // Set a unique name for your image
  const storageRef = ref(storage, `7tJWpEXpelbqSEaiiMDR/${imageName}`);
  await uploadBytes(storageRef, blob);
  console.log("Image uploaded successfully");
};

export { firestore, storage };
