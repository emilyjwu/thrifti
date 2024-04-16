import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface MyRequestsProps {
  navigation: NavigationProp<any>;
}

const MyRequests: React.FC<MyRequestsProps> = ({ navigation }) => {
  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('RequestListing')}>
        <View style={styles.requestItem}>
          <Text style={styles.requestTitle}>{"randomItem"}</Text>
          <Text style={styles.requestText}>{"randomDescription"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* List */}
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={Array.from({ length: 3 }, (_, index) => index)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      position: 'relative',
    },
    flatList: {
      flex: 1,
    },
    flatListContent: {
      paddingTop: 0, // Adjust to account for the height of the invisible box
    },
    requestItem: {
      height: 100,
      backgroundColor: '#ccc',
      marginVertical: 5,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    requestText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center'
    },
    requestTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center'
    },
  });

export default MyRequests;

import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface MyRequestsProps {
  navigation: NavigationProp<any>;
}

const MyRequests: React.FC<MyRequestsProps> = ({ navigation }) => {
  // Sample data for demonstration
  const requestDetails = {
    name: "Liam Neeson",
    description:
      "I don’t know who you are. I don’t know what you want. If you are looking for ransom I can tell you I don’t have money, but what I do have are a very particular set of skills. Skills I have acquired over a very long career. Skills that make me a nightmare for people like you. If you let my daughter go now that’ll be the end of it. I will not look for you, I will not pursue you, but if you don’t, I will look for you, I will find you and I will kill you.",
  };

  const handleMessaging = () => {
    // Handle messaging functionality here
    // For demonstration, you can navigate to a messaging screen
    navigation.navigate("Message");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{requestDetails.name}</Text>
      <Text style={styles.description}>{requestDetails.description}</Text>
      <TouchableOpacity onPress={handleMessaging} style={styles.button}>
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyRequests;
