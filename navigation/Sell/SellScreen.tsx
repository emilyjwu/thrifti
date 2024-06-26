import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useContext, useEffect } from "react";
import NewBinModal from "../../components/NewBinModal";
import IconWithBackground from "../../components/IconWithBackground";
import {
  firestore,
  AuthContext,
  fetchBinSize,
  addBinToUser,
  updateTimeAnalytics,
} from "../../database/index";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { usePostHog } from "posthog-react-native";

interface SellScreenMain {
  navigation: any;
}
const SquareButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.addBinButton}>
      <EntypoIcon name="plus" size={50} color="black" />
    </TouchableOpacity>
  );
};

const Bin = ({ name }) => {
  return (
    <View style={styles.binContainer}>
      <FontAwesome5Icon name="box-open" size={80} color="#000" />
      <Text style={styles.binTitle}>{name}</Text>
    </View>
  );
};

const SellScreenMain: React.FC<SellScreenMain> = ({ navigation }) => {
  const [bins, setBins] = useState([]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [updatedBins, setUpdatedBins] = useState(false);
  const { currentUserID } = useContext(AuthContext);
  const [startTime, setStartTime] = useState(Date.now());
  const posthog = usePostHog();
  const emailAddr = useContext(AuthContext).userAuth.email;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setStartTime(Date.now());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (startTime) {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);
        if (timeSpent > 0) {
          updateTimeAnalytics("sellMainTime", timeSpent);
          posthog.screen("Sell Main Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  async function getBinNames(firestoreObject, currentUserID) {
    const binQuery = query(
      collection(firestoreObject, "bins"),
      where("userID", "==", currentUserID)
    );

    try {
      const querySnapshot = await getDocs(binQuery);
      const binNames = querySnapshot.docs.map((doc) => {
        // get name from each doc
        return doc.data().binName;
      });
      setBins(binNames);
    } catch (error) {
      console.error("Error retrieving bin names:", error);
    }
  }

  React.useEffect(() => {
    console.log(currentUserID);
    getBinNames(firestore, currentUserID);
  }, [updatedBins]);

  const addBin = async () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const saveBin = async (name: string) => {
    const newBinData = {
      binName: name,
      userID: currentUserID,
    };
    const docRef = await addDoc(collection(firestore, "bins"), newBinData);
    addBinToUser(currentUserID, docRef.id);
    setUpdatedBins(!updatedBins);
    setIsModalVisible(false);
  };

  const navigateToListItemScreen = () => {
    const binNames = bins.map((bin) => bin);
    navigation.navigate("ListItemScreen", { binNames });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>My Bins</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.scrollContainer}
        >
          {bins.map((bin, index) => (
            <Bin key={index} name={bin} />
          ))}
          <SquareButton onPress={() => addBin()} />
        </ScrollView>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>List Item</Text>
        <View style={styles.centeredContainer}>
          <TouchableOpacity onPress={navigateToListItemScreen}>
            <IconWithBackground
              width={250}
              height={250}
              iconSize={65}
              iconColor="#000"
              iconComponent={MaterialCommunityIcons}
              iconName="camera-plus-outline"
              backgroundColor="#eBeBeB"
            />
          </TouchableOpacity>
        </View>
      </View>
      <NewBinModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSave={saveBin}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  scrollContainer: {
    backgroundColor: "#eBeBeB",
    height: 150,
    minWidth: Dimensions.get("window").width,
    padding: 25,
    alignItems: "flex-start",
    borderRadius: 10,
    flexDirection: "row",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
  },
  binContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  binTitle: {
    fontSize: 15,
  },
  addBinButton: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SellScreenMain;
