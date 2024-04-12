import React, { useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";

// FIREBASE IN QUARANTINE UNTIL IT WORKS
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  updateDoc,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StringFormat,
} from "firebase/storage";
import { User } from "firebase/auth";
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
const currentDate = new Date();

export const uploadImageToStorage = async (
  imageUri: string,
  listingData: any
) => {
  try {
    const docRef = await addDoc(collection(firestore, "items"), listingData);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${listingData.binID}/${docRef.id}`);
    const imgRef = "/" + listingData.binID + "/" + docRef.id;
    const metadata = {
      contentType: blob.type,
      customMetadata: {
        binID: listingData.binID,
        itemID: listingData.itemID,
        userID: auth.currentUser.uid,
        timestamp: new Date().toString(), // Custom metadata field (e.g., timestamp)
        // Add more custom metadata fields as needed
      },
    };
    await uploadBytesResumable(storageRef, blob, metadata);
    console.log("Image uploaded successfully");
    const imageURL = await getImage(imgRef);
    updateDoc(docRef, {
      imgURL: imageURL,
    });
    return 200;
  } catch (error) {
    console.log("Issue storing image in FBS: ", error);
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

// ********** FETCHING BIN INFORMATION **********

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

export const fetchBinName = async (binID: string) => {
  try {
    const binDocRef = doc(firestore, "bins", binID);
    const binDocSnap = await getDoc(binDocRef);
    if (binDocSnap.exists()) {
      const binData = binDocSnap.data();
      if (binData && binData.binName) {
        return binData.binName;
      } else {
        console.error("Bin document does not contain a name field.");
        return null;
      }
    } else {
      console.error("Bin document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching bin name:", error);
    return null;
  }
};

export const fetchBinItems = async (binID: string) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(firestore, "items"), where("binID", "==", binID))
    );
    return querySnapshot.docs.map((doc) => {
      return doc.id;
    });
  } catch (error) {
    console.log("Issue getting bin items: ", error);
    return [];
  }
};

export const fetchImageRefFromItem = async (itemID: string) => {
  try {
    const docRef = doc(firestore, "items", itemID);
    const docSnap = await getDoc(docRef);
    return docSnap.data().imgRef;
  } catch (error) {
    console.log("Issue getting bin items: ", error);
    return "";
  }
};

export const fetchBinSize = async (binID: string) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(firestore, "items"), where("binID", "==", binID))
    );
    return querySnapshot.size;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return 0;
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
      const imgRef = ref(storage, "/" + binID + "/" + doc.id);
      return imgRef;
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

export interface BinItemInfo {
  imageUri: any;
  id: string;
}

export const fetchBinItemsInfo = async (
  binID: string
): Promise<BinItemInfo[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(firestore, "items"), where("binID", "==", binID))
    );

    // Map each document to an object containing only the desired attributes
    const binItemsInfoPromises: Promise<BinItemInfo>[] = querySnapshot.docs.map(
      async (doc) => {
        const imageUri = await getImage(doc.data().imgRef);
        return {
          id: doc.id,
          binID: doc.data().binID,
          condition: doc.data().condition,
          description: doc.data().description,
          imgRef: doc.data().imgRef,
          listingName: doc.data().listingName,
          price: doc.data().price,
          tags: doc.data().tags,
          imageUri: imageUri,
        };
      }
    );

    // Wait for all promises to resolve
    const binItemsInfo: BinItemInfo[] = await Promise.all(binItemsInfoPromises);
    return binItemsInfo;
  } catch (error) {
    console.log("Issue getting bin items: ", error);
    return [];
  }
};

// ********** LISTING INFORMATION **********

export const getImageURL = async (listingID: string) => {
  try {
    const docRef = doc(firestore, "items", listingID);
    const docSnap = await getDoc(docRef);
    return docSnap.data().imgURL;
  } catch (error) {
    console.log("Issue getting Listing Image URL.");
    return null;
  }
};

//Emily and I added getImage
export const getImage = async (imageRef: string) => {
  try {
    const storageRef = ref(storage, imageRef);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error while downloading image:", error);
    return null;
  }
};

const makeItemSold = async (listingID: string) => {
  const docRef = doc(firestore, "items", listingID);
  updateDoc(docRef, {
    sold: true,
  })
    .then(() => {
      console.log("Item set to sold");
    })
    .catch((error) => {
      console.error("Failed to set Item to sold: ", error);
    });
};

// ********** EDIT USER FIELDS **********

// add follower to follower list
export const addFollower = async (userID: string, followerID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    followers: arrayUnion(followerID),
  })
    .then(() => {
      console.log("Item added to followers successfully!");
    })
    .catch((error) => {
      console.error("Error adding user to followers: ", error);
    });
};

// add following to list of people user follows
export const addFollowing = async (userID: string, followingID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    following: arrayUnion(followingID),
  })
    .then(() => {
      console.log("Following user added successfully!");
    })
    .catch((error) => {
      console.error("Error adding user to the following: ", error);
    });
};

// add liked listing to likedListings list
export const addLikedListing = async (userID: string, listingID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    likedListings: arrayUnion(listingID),
  })
    .then(() => {
      console.log("Listing added to LikedListings successfully!");
    })
    .catch((error) => {
      console.error("Error adding listing to LikedListings: ", error);
    });
};

// add request to requests list
const addRequest = async (userID: string, requestID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    requests: arrayUnion(requestID),
  })
    .then(() => {
      console.log("Request added to the requests successfully!");
    })
    .catch((error) => {
      console.error("Error adding request to the requests: ", error);
    });
};

// add transaction to transaction list
const addTransaction = async (
  sellerID: string,
  buyerID: string,
  transactionID: string
) => {
  try {
    const sellerRef = doc(firestore, "users", sellerID);
    const buyerRef = doc(firestore, "users", buyerID);
    updateDoc(sellerRef, {
      transactions: arrayUnion(transactionID),
    })
      .then(() => {
        console.log("Item added to transactions successfully!");
      })
      .catch((error) => {
        console.error("Error adding transaction ID to transactions: ", error);
      });
    updateDoc(buyerRef, {
      transactions: arrayUnion(transactionID),
    })
      .then(() => {
        console.log("Item added to transactions successfully!");
      })
      .catch((error) => {
        console.error("Error adding transaction ID to transactions: ", error);
      });
  } catch (error) {
    console.error("cannot add transaction for users given: ", error);
  }
};

// ********** GET FIELDS **********
export const fetchFieldsAnyCollection = async (
  collection: string,
  ID: string
) => {
  const docRef = doc(firestore, collection, ID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    console.log("No such document!");
    return {};
  } else {
    return docSnap.data();
  }
};

// ********** REQUESTS **********
export const createRequest = async (
  userID: string,
  title: string,
  description: string
) => {
  // create request
  const requestFields = {
    userID: userID,
    title: title,
    description: description,
    date:
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate(),
  };
  try {
    // THIS ASSUMES YOU ARE PASSING IN A VALID USERID
    // can be handled later...
    const docRef = await addDoc(
      collection(firestore, "requests"),
      requestFields
    );
    addRequest(userID, docRef.id);
  } catch (error) {
    console.error("Problem creating request: " + error);
  }
};

// ********** TRANSACTIONS **********
export const createTransaction = async (
  buyerID: string,
  sellerID: string,
  listingID: string
) => {
  const transactionFields = {
    buyerID: buyerID,
    sellerID: sellerID,
    listingID: listingID,
    date:
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate(),
  };
  try {
    // THIS ASSUMES YOU ARE PASSING IN A VALID SELLERID, BUYERID, AND LISTINGID
    // i do not know what horrors our database will endure otherwise
    const docRef = await addDoc(
      collection(firestore, "transactions"),
      transactionFields
    );
    addTransaction(sellerID, buyerID, docRef.id);
    makeItemSold(listingID);
  } catch (error) {
    console.error("Problem creating request: " + error);
  }
};

export { firestore, firebaseApp, storage, auth };

// posthog
import PostHog from "posthog-react-native";

export const posthog = new PostHog(
  "phc_aXULs8cpOn5cz6RR3ASO0PhAWgX0gNEz0euQSMDX2vn",
  {
    // usually 'https://app.posthog.com' or 'https://eu.posthog.com'

    host: "https://us.posthog.com",
  }
);
