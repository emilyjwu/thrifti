import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation, useRoute } from "@react-navigation/native";
import DoneListingModal from "../../components/DoneListingModal";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import {
  createRequest,
  AuthContext,
} from "../../database/index";

interface CreateRequestProps {
  navigation: any;
}

const CreateRequest: React.FC<CreateRequestProps> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [listingName, setListingName] = useState("");
  // const navigation = useNavigation();
  const route = useRoute();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const uid = useContext(AuthContext).userAuth.uid;

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleNameChange = (text) => {
    setListingName(text);
  };

  const onDonePress = async () => {
    
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {
          navigation.navigate('MyRequests')
          createRequest(uid, listingName, inputValue)
          }}>
          <Text style={styles.subTitle}> Done </Text>
        </TouchableOpacity>
        <DoneListingModal
          isVisible={isModalVisible}
          onClose={closeModal} selectedBin={""}        />
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
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default CreateRequest;
