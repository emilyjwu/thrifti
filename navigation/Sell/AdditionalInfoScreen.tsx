import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation, useRoute } from "@react-navigation/native";
import DoneListingModal from "../../components/DoneListingModal";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {
  firestore,
  uploadListing,
  AuthContext,
  addListingToUser,
} from "../../database/index";
import { StripeProvider } from '@stripe/stripe-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import {StripeViewModal} from "../../components/StripeViewModal";

const { initPaymentSheet, presentPaymentSheet } = useStripe();




interface ExploreScreenProps {
  navigation: any;
}

const AdditionalInfoScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [itemCondition, setItemCondition] = useState<string | null>(null);
  const [listingName, setListingName] = useState("");
  const conditions = ["Brand New", "Used-Excellent", "Used-Good", "Used-Fair"];
  // const navigation = useNavigation();
  const route = useRoute();
  const { selectedBin, listingData, imageUri } = route.params;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isStripeVisible, setIsStripeVisible] = React.useState(false);
  const uid = useContext(AuthContext).userAuth.uid;
  const currentDate = new Date();

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleNameChange = (text) => {
    setListingName(text);
  };

  const onDonePress = async () => {
    if (listingName == "") {
      console.log("TYUIJHBVFGHJN");
    } else {
      listingData.condition = itemCondition;
      listingData.description = inputValue;
      listingData.listingName = listingName;
      listingData.userID = uid;
      listingData.date =
        currentDate.getFullYear() +
        "-" +
        (currentDate.getMonth() + 1) +
        "-" +
        currentDate.getDate();
      listingData.imgURL = "";
      listingData.sold = false;
      if ((await uploadListing(imageUri, listingData)) == 400) {
        console.log("Unable to store image.");
        return;
      }
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsStripeVisible(false);
  };



  const handleBoostPress = async () => {
    setIsStripeVisible(true);
  };





  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Optional Info</Text>
        <View style={styles.subContainer}>
          <Text style={styles.subTitle}>Description</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.titleArea}
              underlineColorAndroid="transparent"
              placeholder="Listing Name"
              placeholderTextColor="grey"
              numberOfLines={1}
              multiline={false}
              value={listingName}
              onChangeText={handleNameChange}
            />
          </View>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              underlineColorAndroid="transparent"
              placeholder="Type something"
              placeholderTextColor="grey"
              numberOfLines={4}
              multiline={true}
              value={inputValue}
              onChangeText={handleInputChange}
            />
          </View>
          <View style={styles.dropDownContainer}>
            <Text style={styles.dropDownLabelText}>Condition:</Text>
            <SelectDropdown
              data={conditions}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setItemCondition(selectedItem);
              }}
              defaultButtonText="Select Item Condition"
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              dropdownStyle={{
                backgroundColor: "#eBeBeB",
                padding: 5,
                marginBottom: 10,
                borderRadius: 10,
              }}
              buttonStyle={{
                backgroundColor: "#eBeBeB",
                padding: 5,
                marginBottom: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
              buttonTextStyle={{
                color: "#333",
                fontSize: 14,
                textAlign: "left",
              }}
            />
          </View>
          <TouchableOpacity style={styles.boostButton} onPress={() => handleBoostPress()}>
            <EntypoIcon name="flash" size={20} color="white" />
            <Text style={styles.buttonText}>Boost</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={onDonePress}>
          <Text style={styles.subTitle}> Done </Text>
        </TouchableOpacity>
        <DoneListingModal
          isVisible={isModalVisible}
          onClose={closeModal}
          selectedBin={selectedBin}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
  },
  subContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  textAreaContainer: {
    padding: 5,
    margin: 5,
    backgroundColor: "#eBeBeB",
    borderRadius: 20,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
  titleArea: {
    height: 30,
    justifyContent: "flex-start",
  },
  dropDownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  dropDownLabelText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginRight: 10,
    marginBottom: 10,
    textAlign: "left",
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "lightblue",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  boostButton: {
    flexDirection: 'row',
    // backgroundColor: "lightblue",
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'flex-start',
    maxWidth: 100,
    marginTop: 10,
  },
  buttonText: {
    color: 'white', // Text color
    marginLeft: 5, // Space between icon and text
    fontSize: 20, // Font size
    fontWeight: "bold",

  },
});

export default AdditionalInfoScreen;
