import React, { Component } from 'react'
import {StyleSheet, Text, TouchableOpacityComponent, View, FlatList} from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, NavigationProp} from "@react-navigation/native";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import ExploreScreen from "../navigation/Explore/ExploreScreen"

interface ExpandBinProps {
  navigation: NavigationProp<any>;
}

const ExpandBin: React.FC<ExpandBinProps> = ({ navigation }) => {
  // const imgURLs = ExploreScreen.fetchURLs();

  const renderListing = ({listingData}) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Listing")}>
          <IconWithBackground
            width={170}
            height={170}
            iconSize={60}
            iconColor="#000"
            iconComponent={EntypoIcon}
            iconName="image"
            backgroundColor="#eBeBeB"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const data = Array.from(Array(100).keys());

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Bin Name</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderListing}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topBar: {
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  flatList: {
    paddingLeft: 15,
    paddingRight: 15,

  },
  itemContainer: {
    flex: 1,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExpandBin;