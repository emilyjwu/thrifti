import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { FlatList, View, Text, StyleSheet, Image } from "react-native";
import { AuthContext, storage, firestore } from "../../database/index";
import { limit, getDocs, collection, query, where } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";
import { sys } from "typescript";
import FilteredFeed from '../../components/FilteredFeed';
import { ScrollView } from 'react-native';
import MixedFeed from "../../components/MixedFeed";
import { fetchAllBins } from "../../database/index";


interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [imgURLs, setImgURLs] = useState([]);
  const uid = useContext(AuthContext).userAuth.uid;
  const [bins, setBins] = useState([]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
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
