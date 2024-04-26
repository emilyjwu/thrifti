import * as React from "react";
import { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../database/index";

import MixedFeed from "./MixedFeed";
import FilteredFeed from "./FilteredFeed";
import { searchKListings } from "../../search/search";
import Ionicons from "react-native-vector-icons/Ionicons";
import { usePostHog } from "posthog-react-native";

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const uid = useContext(AuthContext).userAuth.uid;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const posthog = usePostHog();

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
          posthog.screen("Explore Screen", { timeSpent, uid });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

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
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          underlineColorAndroid="transparent"
          placeholderTextColor="grey"
          placeholder="Start shopping..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FilteredFeed navigation={navigation} />
      {/* <MixedFeed navigation={navigation} /> */}
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
    padding: 9,
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
    justifyContent: "flex-start",
  },
  textAreaContainer: {
    marginVertical: 5,
    height: 40,
    paddingLeft: 5,
    backgroundColor: "#eBeBeB",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  searchButtonContainer: {
    alignSelf: "flex-start",
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default ExploreScreen;
