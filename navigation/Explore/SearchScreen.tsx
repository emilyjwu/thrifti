import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchFieldsAnyCollection, AuthContext } from "../../database/index";
import { usePostHog } from "posthog-react-native";

interface ExploreScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { searchResults } = route.params;
  const listingIDs: string[] = searchResults.map((item) => item.id);
  const [listingInfos, setListingInfos] = useState([]);
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
          posthog.screen("Search Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  const getIDs = async () => {
    const listings = await Promise.all(
      listingIDs.map(async (id) => {
        const docSnapshot = await fetchFieldsAnyCollection("items", id);
        return docSnapshot;
      })
    );
    console.log(searchResults);
    setListingInfos(listings);
  };

  useEffect(() => {
    getIDs();
  }, []);

  const handleImageClick = (binItemInfo) => {
    const imageUri = binItemInfo.imgURL;
    navigation.navigate("Listing", { imageUri, binItemInfo });
  };

  const renderItem = ({ item }: { item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleImageClick(item)}
    >
      <Image source={{ uri: item.imgURL }} style={styles.image} />
      <Text>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={listingInfos} renderItem={renderItem} numColumns={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
  },
  item: {
    width: "50%", 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
});

export default SearchScreen;
