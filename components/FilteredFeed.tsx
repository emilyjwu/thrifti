import React, { Component } from 'react'
import { useEffect, useState, useContext } from "react";
import { limit, getDocs, collection, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { ScrollView} from "react-native-gesture-handler";
import { useNavigation, NavigationProp} from "@react-navigation/native";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
interface FilteredFeedProps {
    navigation: NavigationProp<any>;
  }

const FilteredFeed: React.FC<FilteredFeedProps> = ({ navigation }) =>  {
    //need the bin name and images in the bin
    const renderBinItem = ({binData}) => {
    return (
    <View style={styles.itemContainer} >
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
    <View style={{ flex: 1 }}>
  <View style={{ flexDirection: 'row', backgroundColor: 'white', padding: 10 }}>
    <TouchableOpacity onPress={() => navigation.navigate("ListingScroll")}
      style={styles.button}>
      <Text style={styles.buttonText}>
        Listings
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("ExpandBin")}
      style={styles.button}>
      <Text style={styles.buttonText}>
        Bins
      </Text>
    </TouchableOpacity>
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 10 }}>
  <ScrollView>
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("ExpandBin")}>
        <Text style={styles.title}>Bin Name</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Message")} style={styles.message}>
            <MaterialCommunityIcon name="message" size={30} color="#75D7FF" />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={data}
        renderItem={renderBinItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>

    </ScrollView>
  </View>
</View>
  );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom:0,
        marginRight: 0
    },
    itemContainer: {
        marginBottom: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        alignSelf: 'flex-end',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    buttonText: {

        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    button: {
      width: 100,
      height: 50,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    }

});

export default FilteredFeed;