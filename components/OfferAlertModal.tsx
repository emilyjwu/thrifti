import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation} from "@react-navigation/native";
import {getExisitingOffer} from "../database/offers";
import { auth} from '../database/index';


//Nested Modal
interface OfferAlertModalProps {
  isVisible: boolean;
  onClose: () => void;
  sellerName: string;
  alert: string;
  listingId: string;
  sellerUid: string;

}

const OfferAlertModal: React.FC<OfferAlertModalProps > = ({
  isVisible,
  onClose,
  sellerName,
  alert,
  // price,
  listingId,
  sellerUid

}) => {

  const navigation = useNavigation();
  const [existingPrice, setExistingPrice] = useState<number>(0);
  const [seller, setSeller] = useState<string>("");


  const getOffer = async () => {
    try {
      const offerData = await getExisitingOffer(listingId, sellerUid);
      if (offerData) {
        setExistingPrice(offerData.price);
        setSeller(offerData.sellerID);
      }
    } catch (error) {
      console.error('Error fetching offer data in OfferAlertModal: ', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
      getOffer();
  }, [alert, listingId, seller]);


  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.xButton} onPress={handleClose}>
            <FontAwesome5Icon name="times" size={30} color="#000" />
          </TouchableOpacity>
            {alert === 'success' && (
            <>
              <Text style={styles.popupTitle}>Done</Text>
              <View style={styles.line}></View>
              <Text style={styles.text}>Offer Sent to {sellerName}</Text>
            </>
          )}
          {alert === 'accepted' && (
            <>
              <Text style={styles.popupTitle}>Offer Accepted!</Text>
              <View style={styles.line}></View>
              {seller === auth?.currentUser.uid ? (
                 <Text style={styles.text}> You accepted the offer of $ {existingPrice}</Text>
              ) : (
                <Text style={styles.text}> {sellerName} accepted your offer of $ {existingPrice}</Text>
              )}
            </>
          )}
          {alert === 'declined' && (
            <>
              <Text style={styles.popupTitle}>Offer Declined</Text>
              <View style={styles.line}></View>
              {seller === auth?.currentUser.uid ? (
                 <Text style={styles.text}> You declined the offer of ${existingPrice}</Text>
              ) : (
                <Text style={styles.text}> {sellerName} accepted your offer of ${existingPrice}</Text>
              )}
            </>
          )}
           {alert === 'pending' && (
            <>
              <Text style={styles.popupTitle}>Exisiting Offer Pending</Text>
              <View style={styles.line}></View>
              <Text style={styles.text}>You have a pending offer of ${existingPrice}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  xButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
  },
  line: {
    borderWidth: 1,
    width: '100%',
    marginBottom: 5,
    marginTop: -5,
    borderColor: 'gray',
  }
});

export default OfferAlertModal;
