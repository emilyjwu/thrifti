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
  const uid = useContext(AuthContext).userAuth.uid;

  // retrives the ID of all of a user's bins as a [] of binIDs
  const fetchBins = async (userID: string) => {
    try {
      const binQuerySnapshot = await getDocs(
        query(
          collection(firestore, "bins"),
          where("userID", "==", uid),
          limit(1)
        )
      );
      const binIDs = binQuerySnapshot.docs.map((doc) => doc.id);
      console.log("Bins: ", binIDs);
      return binIDs;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return [];
    }
  };

  // accesses items for a given bin and returns the image URLs as a [] of URLs
  const fetchURLs = async (binID: string) => {
    if (!binID) {
      return [];
    }
    try {
      const itemQuerySnapshot = await getDocs(
        query(collection(firestore, "items"), where("binID", "==", binID))
      );
      const imgRefs = itemQuerySnapshot.docs.map((doc) => {
        return ref(storage, "/" + binID + "/" + doc.id);
      });
      const urls = await Promise.all(
        imgRefs.map(async (ref) => {
          const downloadURL = await getDownloadURL(ref);
          return downloadURL;
        })
      );
      console.log("URLs: ", urls);
      return urls;
    } catch (error) {
      console.error("Problem retrieving URLs:", error);
      return [];
    }
  };

  useEffect(() => {
    const the = async () => {
      // these generally should be called in series with await
      // unless you already have a bin ID you want to get image URLs for
      // *** uid is temporary to retrieve your own bins
      const bins = await fetchBins(uid);

      // this will likely be called for each bin that will be displayed
      // on the screen
      /* TODO: figure out how to store image links for various bins instead of just 1
          to show multiple bins on explore page */
      // bins[0] will retrieve a random bin of yours bc the queries do not order items
      const urls = await fetchURLs(bins[0]);

      // this just sets the images them to render
      setImgURLs(urls);
    };

    // Call fetchStoragePath to start the data fetching process
    the();
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
