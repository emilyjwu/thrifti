import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StripeProvider, CardField, useConfirmPayment } from "@stripe/stripe-react-native";


interface StripeViewModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedBin: string;
}

const StripeViewModal: React.FC<StripeViewModalProps> = ({
  isVisible,
  onClose,
  selectedBin,
}) => {

  const navigation = useNavigation();
  const [cardDetails, setCardDetails] = useState()
  const {confirmPayment, loading} = useConfirmPayment();

  const handlePayPress = async() => {

  };

  const handleClose = () => {
    onClose();
  };

  return (
    <StripeProvider
      publishableKey="pk_test_51P9UmWAlnVITPMWk3Kl5vzD7tT6sW5ssVCr5hodGm4qXVJIPYsujWr0SrZ4f4URiHLcsgSluzsmCxMbXXxeWjzdJ00FvevaEWW"
    >
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.xButton} onPress={handleClose}>
            <FontAwesome5Icon name="times" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.popupTitle}>Pay for your Boosting</Text>
          <TextInput></TextInput>
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: "4242 4242 4242 4242"
            }}
            cardStyle={styles.card}
            style ={styles.cardContainer}
            onCardChange={cardDetails => {
              setCardDetails(cardDetails);
            }}

          />
          <Button onPress={handlePayPress} title="Pay"
          disabled={loading}
          />


        </View>
      </View>
    </Modal>
    </StripeProvider>
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
  card: {
    backgroundColor:  "efefefef"
  },
  cardContainer: {
    height: 50,
    marginVertical: 50
  }
});

export default StripeViewModal;
