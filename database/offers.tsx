import {firestore, auth, fetchBasicUserInfo, makeItemSold} from '../database/index';
import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    onSnapshot,
    Timestamp,
  } from "firebase/firestore";
  import uuid from 'react-native-uuid';
  import { handleSend } from './messaging';





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

    if(currentUserID == sellerID) {
      console.log("u cant buy an item from urself");
      return;
    }

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
            listingID: listingID,
            sold: false,
        };
        await setDoc(offerDocRef, offerData);
        console.log("added offer in DB successfully ")
        return "success";

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


  //function to set the status of a pending offer --> decline & accept can be 2 different functions
  /**
 * Send a message between two people (updates the chats document in the DB)
 * by adding the message to the messages array
 *
 * @param text message sent
 * @param chatID id in the chats DB that is the conversation (current uid + reciever id + listing name)
 * @param otherUserID recipient id
 */
  export const acceptOffer = async (listingId, otherUser) => {

    const currentUser = auth?.currentUser;
    const currentUserID = currentUser?.uid;
    const combinedId =
    currentUserID > otherUser
        ? currentUserID + otherUser + listingId
        : otherUser + currentUserID + listingId;

        try {
            const offerDocRef = doc(firestore, "offers", combinedId);
            const offerDocSnapshot = await getDoc(offerDocRef);
            const offerData = offerDocSnapshot.data();
            if (offerData.pending) {
                await updateDoc(offerDocRef, {
                    pending: false,
                    date: Timestamp.now(),
                    sold: true
                });
                console.log("Offer Accepted in DB");
                const text = "Offer of $" + offerData.price + " accepted."
                handleSend(text, combinedId, otherUser);
                makeItemSold(listingId);
                return 'accepted';
            }



        } catch (err) {
            console.log("Could not accept offer in the DB", err)
        }


  };

  /* Decline an offer and delete it from the database
  * @param listingId ID of the listing associated with the offer
  * @param otherUser ID of the user who made the offer
  */
 export const declineOffer = async (listingId, otherUser) => {
   const currentUser = auth?.currentUser;
   const currentUserID = currentUser?.uid;
   const combinedId =
     currentUserID > otherUser
       ? currentUserID + otherUser + listingId
       : otherUser + currentUserID + listingId;

   try {
    const offerDocRef = doc(firestore, "offers", combinedId);
    const offerDocSnapshot = await getDoc(offerDocRef);
    const offerData = offerDocSnapshot.data();
    if (offerData.pending) {
        await updateDoc(offerDocRef, {
            pending: false,
            date: Timestamp.now(),
            sold: false,
        });

       console.log("Offer Declined in DB");
       const text = "Offer of $" + offerData.price + " declined.";
       handleSend(text, combinedId, otherUser);
       return 'declined';
     }
   } catch (err) {
     console.log("Could not decline offer in the DB", err);
   }
 };

