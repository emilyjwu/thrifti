import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { FlatList, View, Text, StyleSheet, Image } from "react-native";
import { AuthContext, storage, firestore } from "../../database/index";
import { limit, getDocs, collection, query, where } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";
import { sys } from "typescript";
import FilteredFeed from "../../components/FilteredFeed";
import { ScrollView } from "react-native";
import MixedFeed from "../../components/MixedFeed";
import { fetchAllBins } from "../../database/index";
import { useFeatureFlag } from "posthog-react-native";

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [imgURLs, setImgURLs] = useState([]);
  const uid = useContext(AuthContext).userAuth.uid;
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const the = async () => {
      // these generally should be called in series with await
      // unless you already have a bin ID you want to get image URLs for
      // *** uid is temporary to retrieve your own bins
      //const bins = await fetchBins(uid);
      // this will likely be called for each bin that will be displayed
      // on the screen
      /* TODO: figure out how to store image links for various bins instead of just 1
          to show multiple bins on explore page */
      // bins[0] will retrieve a random bin of yours bc the queries do not order items
      //const urls = await fetchURLs(bins[0]);
      // this just sets the images them to render
      //setImgURLs(urls);
    };

    // Call fetchStoragePath to start the data fetching process
    the();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const binsData = await fetchAllBins();
      setBins(binsData);
    };

    fetchData();
  }, []);

  const variant = useFeatureFlag("experiment-feature-flag-key");

  if (variant === undefined) {
    // the response is undefined if the flags are being loaded
    return null;
  }

  if (variant == "variant-name") {
    // do something
  }

  return (
    <View style={styles.container} ph-label="explore">
      <FilteredFeed navigation={navigation} bins={bins} />
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
