import * as React from "react";
import { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext} from "../../database/index";

import MixedFeed from "./MixedFeed";
import FilteredFeed from "./FilteredFeed";


interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [imgURLs, setImgURLs] = useState([]);
  const uid = useContext(AuthContext).userAuth.uid;
  const [bins, setBins] = useState([]);

  return (
    <View style={styles.container}>
      <MixedFeed navigation={navigation} />
      {/* <FilteredFeed navigation={navigation} /> */}
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
