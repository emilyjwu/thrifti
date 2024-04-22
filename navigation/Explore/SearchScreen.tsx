import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { firestore, fetchFieldsAnyCollection } from "../../database/index";
import {
  getDocs,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

interface ExploreScreenProps {
  navigation: any;
}

const SearchScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { searchResults } = route.params;
  const listingIDs: string[] = searchResults.map((item) => item.id);
  const [listingInfos, setListingInfos] = useState([]);

  const getIDs = async () => {
    const listings = await Promise.all(
      listingIDs.map(async (id) => {
        const docSnapshot = await fetchFieldsAnyCollection("items", id);
        return docSnapshot;
      })
    );
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
  },
  item: {
    width: "48%", // Adjust as needed based on your design
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
});

export default SearchScreen;
