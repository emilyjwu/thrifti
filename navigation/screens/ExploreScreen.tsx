import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { FlatList, View, Text, StyleSheet, Image } from "react-native";
import { AuthContext, storage, firestore } from "../../api/index";
import { limit, getDocs, collection, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [imgURLs, setImgURLs] = useState([]);
  const [imgRefs, setImgRefs] = useState([]);
  const [binID, setBinID] = useState("");
  const uid = useContext(AuthContext).userAuth.uid;

  useEffect(() => {
    const fetchStoragePath = async () => {
      try {
        const binQuerySnapshot = await getDocs(
          query(
            collection(firestore, "bins"),
            where("userID", "==", uid),
            limit(1)
          )
        );
        console.log("RETRIEVING BIN FOR EXPLORE");
        const binIDs = binQuerySnapshot.docs.map((doc) => doc.id);
        console.log(binIDs);
        setBinID(binIDs[0]);

        const itemQuerySnapshot = await getDocs(
          query(collection(firestore, "items"), where("binID", "==", binIDs[0]))
        );
        console.log("RETRIEVING ITEMS FOR EXPLORE");
        const imgRefs = itemQuerySnapshot.docs.map((doc) => {
          console.log("an item");
          return ref(storage, "/" + binIDs[0] + "/" + doc.id);
        });
        setImgRefs(imgRefs);

        fetchBinImages(imgRefs);
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    const fetchBinImages = async (imgRefs) => {
      try {
        const urls = await Promise.all(
          imgRefs.map(async (ref) => {
            const downloadURL = await getDownloadURL(ref);
            return downloadURL;
          })
        );
        console.log("Got urls");
        console.log(urls);
        setImgURLs(urls);
      } catch (error) {
        console.error("Problem retrieving URLs:", error);
      }
    };

    // Call fetchStoragePath to start the data fetching process
    fetchStoragePath();
  }, []);

  return (
    <View style={styles.container}>
      {imgURLs.map((url, index) => (
        <Image key={index} style={styles.image} source={{ uri: url }} />
      ))}
      <Text
        onPress={() => alert("This is the Explore Page")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Explore Screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: "100%", // Adjust as needed
    height: 200, // Adjust as needed
  },
});

export default ExploreScreen;
