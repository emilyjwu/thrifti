import * as React from "react";
import { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { AuthContext } from "../../database/index";

import MixedFeed from "./MixedFeed";
import FilteredFeed from "./FilteredFeed";
import { searchKListings } from "../../search/search";

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const uid = useContext(AuthContext).userAuth.uid;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      // Perform search logic here
      console.log("Searching now");
      const searchResults = await searchKListings(searchQuery, 10);
      console.log(searchQuery);
      setIsSearching(false);
      setSearchQuery("");
      navigation.navigate("Search", { searchResults });
    } else {
      console.log("Empty search query");
    }
  };

  return (
    <View style={styles.container}>
      {/* <MixedFeed navigation={navigation} /> */}
      {isSearching ? (
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholderTextColor="grey"
            placeholder="Search for Something!"
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>
      ) : (
        <></>
      )}
      <FilteredFeed navigation={navigation} />
      <View style={styles.searchButtonContainer}>
        <Button title="Search" onPress={() => setIsSearching(!isSearching)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  textArea: {
    height: 15,
    justifyContent: "flex-start",
  },
  textAreaContainer: {
    padding: 10,
    margin: 5,
    backgroundColor: "#eBeBeB",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  searchButtonContainer: {
    alignSelf: "flex-start",
    align: "left",
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default ExploreScreen;
