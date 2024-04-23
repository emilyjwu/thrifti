import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  Image
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import IconWithBackground from "../components/IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {createOffer} from "../database/offers";
import OfferAlertModal from "../components/OfferAlertModal";

interface PendingOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  price: Double;
  imageUri: string;
  listingName: string;
  sendTo: string;
  chatId: string; //im gonna make the offer ID this as well
  listingId: string;
  displayName: string;
}

const PendingOfferModal: React.FC< PendingOfferModalProps> = ({
  isVisible,
  onClose,
  price,
  imageUri,
  listingName,
  sendTo,
  chatId,
  listingId,
  displayName

}) => {

  const navigation = useNavigation();
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [isNestedModalVisible, setIsNestedModalVisible] = React.useState(false);
  const [alertType, setAlertType] = useState<string>("");

  const handleClose = () => {
    onClose();
  };

  const closeModal = () => {
    setIsNestedModalVisible(false);
  };


  const sendOffer = () => {
    async function func() {
        try {
            const ret = await createOffer(itemPrice, listingId, sendTo);
            setAlertType(ret)
            console.log("Alert Types", alertType)
            setIsNestedModalVisible(true);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    func();

  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.xButton} onPress={handleClose}>
            <FontAwesome5Icon name="times" size={30} color="#000" />
          </TouchableOpacity>

        <View style={styles.centeredContainer}>
            <Text style={styles.title}>Offer for: {listingName}</Text>
            {imageUri ? (
            <Image
                source={{ uri: imageUri }}
                style={{
                width: 250,
                height: 250,
                marginBottom: 10,
                borderRadius: 10,
                }}
            />
            ) : (
            <IconWithBackground
                width={250}
                height={250}
                iconSize={60}
                iconColor="#000"
                iconComponent={EntypoIcon}
                iconName="image"
                backgroundColor="#eBeBeB"
            />
            )}
      </View>

        <View style={styles.inputContainer}>
            <Text style={styles.label}>Offer: ${price}</Text>
        </View>

        <TouchableOpacity style={styles.makeOfferButton} onPress={sendOffer}>
              <Text style={styles.makeOfferButtonText}> Accept Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.makeOfferButton} onPress={sendOffer}>
              <Text style={styles.makeOfferButtonText}> Decline Offer</Text>
        </TouchableOpacity>
        <OfferAlertModal
          isVisible={isNestedModalVisible}
          onClose={closeModal}
          sellerName={displayName}
          alert={alertType}
          price={itemPrice}
          listingId={listingId}
          sellerUid={sendTo}
        />

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
  inputContainer: {
    flexDirection: "row",
    textAlign: "left",
    paddingTop: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginRight: 10,
    marginBottom: 0,
    textAlign: "left",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  makeOfferButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginLeft: 10,
  },
  makeOfferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PendingOfferModal;
