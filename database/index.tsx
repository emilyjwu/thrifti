import React, { useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
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
import { upsertListingPC } from "../search/search";

// Your web app's Firebase configuration
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

export const uploadListing = async (imageUri: string, listingData: any) => {
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
        timestamp: new Date().toString(),
      },
    };
    await uploadBytesResumable(storageRef, blob, metadata);
    await addListingToUser(listingData.userID, docRef.id);
    console.log("Image uploaded successfully");
    const imageURL = await getImage(imgRef);

    updateDoc(docRef, {
      imgURL: imageURL,
    });
    console.log(await (await getDoc(docRef)).data().imgURL);
    console.log(docRef);

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;
    console.log(listingData.tags);
    await upsertListingPC(listingData.tags, docRef.id, formattedDate);
    return 200;
  } catch (error) {
    console.log("Issue storing image in FBS: ", error);
    return 400;
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [currentUserID, setCurrentUserID] = useState<String | null>(null);

  const setAuthAfterLogin = (userData: User) => {
    setUserAuth(userData);
    setCurrentUserID(userData.uid);
  };

  return (
    <AuthContext.Provider
      value={{ userAuth, currentUserID, setAuthAfterLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ********** FETCHING BIN INFORMATION **********

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
      return binData.binName;
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
  id: string;
  binID: string;
  condition: string;
  date: string;
  description: string;
  imageUri: string;
  listingName: string;
  price: number;
  sold: boolean;
  tags: string[];
  userID: string;
  boosted: boolean;
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
        const data = doc.data();
        return {
          id: doc.id,
          binID: data.binID,
          condition: data.condition,
          date: data.date,
          description: data.description,
          imageUri: data.imgURL,
          listingName: data.listingName,
          price: data.price,
          sold: data.sold,
          tags: data.tags,
          userID: data.userID,
          boosted: data.boosted,
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
export const fetchUserListings = async (
  listingIDs: string[]
): Promise<BinItemInfo[]> => {
  try {
    const binItemsInfoPromises: Promise<BinItemInfo | null>[] = listingIDs.map(
      async (listingID) => {
        try {
          const docSnap = await getDoc(
            doc(collection(firestore, "items"), listingID)
          );
          if (docSnap.exists()) {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              binID: data.binID,
              condition: data.condition,
              date: data.date,
              description: data.description,
              imageUri: data.imgURL,
              listingName: data.listingName,
              price: data.price,
              sold: data.sold,
              tags: data.tags,
              userID: data.userID,
              boosted: data.boosted,
            };
          } else {
            console.log(`No document found with ID ${listingID}`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching document with ID ${listingID}:`, error);
          return null;
        }
      }
    );

    const binItemsInfo: (BinItemInfo | null)[] = await Promise.all(
      binItemsInfoPromises
    );
    return binItemsInfo;
  } catch (error) {
    console.error("Issue getting user listings: ", error);
    return [];
  }
};

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

export const makeItemSold = async (listingID: string) => {
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

export interface UserInfo {
  userName: string;
  fullName: string;
  email: string;
  bio: string;
  profilePicURL: string;
  joinedDate: string;
  following: string[];
  followers: string[];
  likedListings: string[];
  transactions: string[];
  requestIDs: string[];
  binIDs: string[];
  listingIDs: string[];
}

/**
 * Gets information from a user
 * @param userID the user fetch from database
 * @returns UserInfo object with all user fields
 */
export const fetchUserInfo = async (
  userID: string
): Promise<UserInfo | null> => {
  const userDocRef = doc(firestore, "users", userID);

  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      const userInfo: UserInfo = {
        userName: userData.userName,
        fullName: userData.fullName,
        email: userData.email,
        bio: userData.bio || "",
        profilePicURL: userData.profilePicURL || "",
        joinedDate: userData.joinedDate,
        following: userData.following || [],
        followers: userData.followers || [],
        likedListings: userData.likedListings || [],
        transactions: userData.transactions || [],
        requestIDs: userData.requestIDs || [],
        binIDs: userData.binIDs || [],
        listingIDs: userData.listingIDs || [],
      };
      return userInfo;
    } else {
      console.error("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
};

export interface BasicUserInfo {
  userID: string;
  userName: string;
  fullName: string;
  profilePicURL: string;
}

/**
 * Gets information from a user
 * @param userID the user fetch from database
 * @returns BasicUserInfo object with only the necessary user fields
 */
export const fetchBasicUserInfo = async (
  userID: string
): Promise<BasicUserInfo> => {
  const userDocRef = doc(firestore, "users", userID);

  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();

      const basicUserInfo: BasicUserInfo = {
        userID: userID,
        userName: userData.userName,
        fullName: userData.fullName,
        profilePicURL: userData.profilePicURL || "",
      };
      return basicUserInfo;
    } else {
      console.error("User document does not exist");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
};

/**
 * Updates user profile information
 * @param userID The ID of the user to update information for
 * @param updatedInfo An object containing the updated information
 * @param profilePicData Profile picture data to upload
 * @returns A Promise<void> indicating the completion of the update operation
 */
export const updateUserInfo = async (
  userID: string,
  updatedInfo: Partial<UserInfo>
): Promise<void> => {
  const userDocRef = doc(firestore, "users", userID);
  const storage = getStorage();

  try {
    const response = await fetch(updatedInfo.profilePicURL);
    const blob = await response.blob();
    const storageRef = ref(storage, `profilePictures/${userID}`);
    await uploadBytesResumable(storageRef, blob);
    const profilePicURL = await getDownloadURL(storageRef);
    updatedInfo.profilePicURL = profilePicURL;

    await updateDoc(userDocRef, updatedInfo);
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user information:", error);
    throw error;
  }
};

/**
 * Check if the current user is following another user
 * @param currentUserID the current
 * @param otherUserID the user to check
 * @returns true or false
 */

export const isFollowingUser = async (
  currentUserID: string,
  otherUserID: string
) => {
  try {
    const userDoc = doc(collection(firestore, "users"), currentUserID);
    const userDocSnapshot = await getDoc(userDoc);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      if (userData.following && userData.following.includes(otherUserID)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if user is following another user:", error);
    return false;
  }
};

/**
 * Add follower to follower list
 *
 * @param userID userID the user to follow
 * @param followerID the user following that user
 * @returns the updated following list of the follower
 */
export const addFollowerToUser = async (
  userID: string,
  followerID: string
): Promise<string[]> => {
  try {
    const userDoc = doc(firestore, "users", userID);
    updateDoc(userDoc, {
      followers: arrayUnion(followerID),
    });

    const followerDoc = doc(firestore, "users", followerID);
    updateDoc(followerDoc, {
      following: arrayUnion(userID),
    });

    console.log("Follower added successfully!");

    const followingSnapshot = await getDoc(followerDoc);
    const followingData = followingSnapshot.data();
    const updatedFollowingList: string[] = followingData?.following || [];
    return updatedFollowingList;
  } catch (error) {
    console.error("Error adding follower to user:", error);
    throw error;
  }
};

/**
 * Remove follower from follower list
 *
 * @param userID the user to unfollow
 * @param followerID the user unfollowing that user
 */
export const removeFollowerFromUser = async (
  userID: string,
  followerID: string
): Promise<string[]> => {
  try {
    const userDoc = doc(firestore, "users", userID);
    updateDoc(userDoc, {
      followers: arrayRemove(followerID),
    });

    const followerDoc = doc(firestore, "users", followerID);
    updateDoc(followerDoc, {
      following: arrayRemove(userID),
    });

    console.log("Follower removed successfully!");

    const followingSnapshot = await getDoc(followerDoc);
    const followingData = followingSnapshot.data();
    const updatedFollowingList: string[] = followingData?.following || [];
    return updatedFollowingList;
  } catch (error) {
    console.error("Error removing follower from user:", error);
    throw error;
  }
};

/**
 * Check if the current user is following another user
 * @param currentUserID the current
 * @param otherUserID the user to check
 * @returns true or false
 */

export const isListingLiked = async (
  currentUserID: string,
  listingID: string
) => {
  try {
    const userDoc = doc(collection(firestore, "users"), currentUserID);
    const userDocSnapshot = await getDoc(userDoc);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      if (
        userData.likedListings &&
        userData.likedListings.includes(listingID)
      ) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking if the listing is liked:", error);
    return false;
  }
};

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

export const removeLikedListing = async (userID: string, listingID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    likedListings: arrayRemove(listingID),
  })
    .then(() => {
      console.log("Listing removed from LikedListings successfully!");
    })
    .catch((error) => {
      console.error("Error removing listing from LikedListings: ", error);
    });
};

// add request to requests list
const addRequestToUser = async (userID: string, requestID: string) => {
  const docRef = doc(firestore, "users", userID);
  updateDoc(docRef, {
    requestIDs: arrayUnion(requestID),
  })
    .then(() => {
      console.log("Request added to the requests successfully!");
    })
    .catch((error) => {
      console.error("Error adding request to the requests: ", error);
    });
};

// add transaction to transaction list
const addTransactionToUser = async (
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

// add Bin to Bin list
export const addBinToUser = async (userID: string, binID: string) => {
  const docRef = doc(firestore, "users", userID);
  await updateDoc(docRef, {
    binIDs: arrayUnion(binID),
  })
    .then(() => {
      console.log("Bin added to the BinIDs successfully!");
    })
    .catch((error) => {
      console.error("Error adding Bin to the BinIDs: ", error);
    });
};

// add Listing to Listing list
export const addListingToUser = async (userID: string, listingID: string) => {
  const docRef = doc(firestore, "users", userID);
  await updateDoc(docRef, {
    listingIDs: arrayUnion(listingID),
  })
    .then(() => {
      console.log("Listing added to the ListingIDs successfully!");
    })
    .catch((error) => {
      console.error("Error adding Listing to the ListingIDs: ", error);
    });
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
    addRequestToUser(userID, docRef.id);
  } catch (error) {
    console.error("Problem creating request: " + error);
  }
};

export const fetchAllRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "requests"));
    const ids = querySnapshot.docs.map((doc) => doc.id);
    return ids;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
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
    addTransactionToUser(sellerID, buyerID, docRef.id);
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

export const updateTimeAnalytics = async (timerField, val) => {
  const docRef = doc(firestore, "analytics", "pageTimes");
  const doccy = await getDoc(docRef);
  let array = doccy.data()[timerField];
  array.push(val);
  updateDoc(docRef, {
    [timerField]: array,
  });
};

export const updateNewUsers = async () => {
  const docRef = doc(firestore, "analytics", "activityData");
  const doccy = await getDoc(docRef);
  const map = doccy.data().newUsers;
  const date = getFormattedDate();
  if (map.hasOwnProperty(date)) {
    map[date] += 1;
  } else {
    map[date] = 1;
  }
  await updateDoc(docRef, {
    newUsers: map,
  });
};

export const updateBoosted = async () => {
  const docRef = doc(firestore, "analytics", "activityData");
  const doccy = await getDoc(docRef);
  const map = doccy.data().boosted;
  const date = getFormattedDate();
  if (map.hasOwnProperty(date)) {
    map[date] += 1;
  } else {
    map[date] = 1;
  }
  await updateDoc(docRef, {
    boosted: map,
  });
};

export const updateDailyUsers = async () => {
  const docRef = doc(firestore, "analytics", "activityData");
  const doccy = await getDoc(docRef);
  const map = doccy.data().dailyUsers;
  const date = getFormattedDate();
  if (map.hasOwnProperty(date)) {
    map[date] += 1;
  } else {
    map[date] = 1;
  }
  await updateDoc(docRef, {
    dailyUsers: map,
  });
};

export const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let da = "" + day;
  let mo = "" + month;
  if (month < 10) {
    mo = `0${month}`;
  }
  if (day < 10) {
    da = `0${day}`;
  }
  const formattedDate = `${year}-${mo}-${da}`;
  return formattedDate;
};
