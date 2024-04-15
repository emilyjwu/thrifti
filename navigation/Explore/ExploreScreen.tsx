import * as React from "react";
import { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AuthContext} from "../../database/index";

import MixedFeed from "./MixedFeed";
import FilteredFeed from "./FilteredFeed";


interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const uid = useContext(AuthContext).userAuth.uid;

  return (
    <View style={styles.container}>
      {/* <MixedFeed navigation={navigation} /> */}
      <FilteredFeed navigation={navigation} />
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
    width: "100%",
    height: 200,
  },
});

export default ExploreScreen;
