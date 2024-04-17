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