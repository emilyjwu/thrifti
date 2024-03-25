import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation, useRoute } from "@react-navigation/native";
import DoneListingModal from "../../../components/DoneListingModal";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { firestore } from "../../../api";
import { addDoc, collection } from "firebase/firestore";

interface ExploreScreenProps {
  navigation: any;
}

const AdditionalInfoScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [itemCondition, setItemCondition] = useState<string | null>(null);
  const conditions = ["Brand New", "Used-Excellent", "Used-Good", "Used-Fair"];
  // const navigation = useNavigation();
  const route = useRoute();
  const { selectedBin, listingData } = route.params;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const onDonePress = () => {
    listingData.condition = itemCondition;
    listingData.description = inputValue;
    addDoc(collection(firestore, "items"), listingData);
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
        <ScrollView contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='handled'>
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
        </ScrollView>

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
    backgroundColor: "#eBeBeB",
    borderRadius: 20,
  },
  textArea: {
    height: 150,
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

export default AdditionalInfoScreen;
