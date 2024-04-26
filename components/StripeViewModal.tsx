import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  StripeProvider,
  CardField,
  useConfirmPayment,
} from "@stripe/stripe-react-native";

// const API_URL = "http://localhost:3000";
// const API_URL = "http://143.215.94.26:3000";
const API_URL = "https://lgastaldi-2003-kreubhtdsa-uc.a.run.app";

interface StripeViewModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const StripeViewModal: React.FC<StripeViewModalProps> = ({
  isVisible,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };

  const navigation = useNavigation();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  const [email, setEmail] = useState("");

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  const handlePayPress = async () => {
    //gather email, fetch intent client secret from the backend
    //confirm the payment with the card details
    if (!cardDetails?.complete || !email) {
      Alert.alert("Plear enter complete card details and email");
      return;
    }
    const billingDetails = {
      email: email,
    };

    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: billingDetails, // This needs to be nested under paymentMethodData
          },
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Sucessful");
          console.log("Payment sucessful", paymentIntent);
        }
      }
    } catch (e) {
      console.log("here");
      console.log(e);
    }
  };

  return (
    <StripeProvider publishableKey="pk_test_51P9UmWAlnVITPMWk3Kl5vzD7tT6sW5ssVCr5hodGm4qXVJIPYsujWr0SrZ4f4URiHLcsgSluzsmCxMbXXxeWjzdJ00FvevaEWW">
      <Modal visible={isVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.xButton} onPress={handleClose}>
              <FontAwesome5Icon name="times" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.popupTitle}>Boost your listing for $1</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="E-mail"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={styles.card}
              style={styles.cardContainer}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            />
            <Button onPress={handlePayPress} title="Pay" disabled={loading} />
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
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   padding: 20, // Added padding for better spacing
  // },
  // modalContent: {
  //   backgroundColor: "#fff",
  //   width: "90%", // Increase if necessary
  //   minHeight: "60%", // Ensuring there is enough height for all elements
  //   padding: 20,
  //   borderRadius: 10,
  //   alignItems: "center",
  // },
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
  // card: {
  //   backgroundColor:  "efefefef"
  // },
  // cardContainer: {
  //   height: 100,
  //   marginVertical: 0
  // }
  cardContainer: {
    height: 100,
    width: "100%", // Ensure it spans the full width of its container
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#ffffff", // Use a clearly visible color
  },
});

export default StripeViewModal;
