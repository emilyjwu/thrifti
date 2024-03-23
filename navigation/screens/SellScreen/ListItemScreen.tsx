import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import SelectDropdown from "react-native-select-dropdown";
import EntypoIcon from "react-native-vector-icons/Entypo";
import IconWithBackground from "../../../components/IconWithBackground";
import { limit, getDocs, collection, query, where } from "firebase/firestore";
import { firestore, AuthContext } from "../../../api/index";

interface ListItemScreenProps {
  navigation: any;
}

interface RouteParams {
  binNames?: string[]; // Define the bins property in the route params
}

interface DetectObjectProps {
  binNames: string[];
}

const DetectObject: React.FC<DetectObjectProps> = ({ binNames }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [labelsGenerated, setLabelsGenerated] = useState<boolean>(false);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReadyToNavigate, setIsReadyToNavigate] = useState<boolean>(false);
  const navigation = useNavigation();
  const uid = useContext(AuthContext).userAuth.uid;

  // pick image
  useEffect(() => {
    pickImage();
  }, []);

  // generate labels on image upload
  useEffect(() => {
    if (imageUri && !labelsGenerated) {
      generateLabels(imageUri);
    }
  }, [imageUri, labelsGenerated]);

  // check valid price
  useEffect(() => {
    if (itemPrice > 0 && selectedBin && labels.length > 0) {
      setIsReadyToNavigate(true);
    } else {
      setIsReadyToNavigate(false);
    }
  }, [itemPrice, selectedBin, labels]);

  const pickImage = async () => {
    try {
      setLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);

        // await generateLabels(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error Picking Image: ", error);
    } finally {
      setLoading(false);
    }
  };

  const generateLabels = async (uri: string) => {
    try {
      if (!imageUri && !loading) {
        alert("Please select an image first!!");
        return;
      }
      // Test private key
      const apiKey = "AIzaSyAuL70Y1v_C-Zb-B8fgCYdfLkvPGwigXxQ";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: "LABEL_DETECTION", maxResults: 7 }],
          },
        ],
      };
      const apiResponse = await axios.post(apiURL, requestData);
      setLabels(apiResponse.data.responses[0].labelAnnotations);
      setLabelsGenerated(true);
    } catch (error) {
      console.error("Error analyzing image: ", error);
      alert("Error analyzing images. Please try again later");
    }
  };

  const onNextPress = async () => {
    // set image and tags in firestore
    // get binID
    async function createListingDetails() {
      const binQuery = query(
        collection(firestore, "bins"),
        where("binName", "==", selectedBin),
        where("userID", "==", uid),
        limit(1)
      );

      try {
        const binQuerySnapshot = await getDocs(binQuery);

        if (!binQuerySnapshot.empty) {
          const doc = binQuerySnapshot.docs[0];
          return {
            tags: labels,
            binID: doc.id,
            price: itemPrice,
            condition: "",
            description: "",
          };
        } else {
          console.log("Bin not found.");
          return;
        }
      } catch (error) {
        console.error("Error retrieving bin names:", error);
      }
    }
    const listingData = await createListingDetails();

    navigation.navigate("AdditionalInformationScreen", {
      selectedBin,
      listingData,
      imageUri,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>List Item</Text>
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
        <Text style={styles.label}>Price: $</Text>
        <TextInput
          placeholder="Enter"
          style={[styles.input, { fontSize: 16 }]}
          onChangeText={(value) => {
            const price = parseInt(value, 10);
            if (!isNaN(price)) {
              setItemPrice(price);
            } else {
              setItemPrice(0);
            }
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bin:</Text>
        <SelectDropdown
          data={binNames}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setSelectedBin(selectedItem);
          }}
          defaultButtonText="Choose Bin"
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
          }}
          buttonTextStyle={{
            color: "#333",
            fontSize: 14,
            textAlign: "left",
          }}
        />
      </View>
      <View style={styles.tagsContainer}>
        <Text style={styles.label}>Tags</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {labels.length > 0 && (
          <View style={styles.labelsContainer}>
            {labels.map((label) => (
              <View key={label.mid} style={styles.labelPill}>
                <Text style={styles.labelText}>{label.description}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {isReadyToNavigate && (
        <TouchableOpacity onPress={onNextPress} style={styles.nextButton}>
          <Text style={styles.text}> Next </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ListItemScreen: React.FC<ListItemScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { binNames }: RouteParams = route.params || {};
  console.log("binNames:", binNames);
  //console.log("UID: ", userAuth.uid);
  return (
    <View style={styles.container}>
      <DetectObject binNames={binNames} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    padding: 20,
    position: "relative",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    marginBottom: -10,
    paddingBottom: 0,
  },
  nextButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "lightblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    height: 50,
    minWidth: "100%",
    maxWidth: "100%",
  },
  scrollViewContent: {
    paddingBottom: 0,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 0,
    marginRight: 10,
    marginBottom: 10,
    textAlign: "left",
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  labelPill: {
    backgroundColor: "lightslategrey",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  labelText: {
    fontSize: 16,
    color: "white",
  },
  input: {
    borderWidth: 0,
    borderColor: "#777",
    padding: 8,
    width: 200,
  },
  inputContainer: {
    flexDirection: "row",
    textAlign: "left",
  },
});

export default ListItemScreen;
