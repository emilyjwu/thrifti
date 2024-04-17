import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface RequestsScreenProps {
  navigation: NavigationProp<any>;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
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
      {/* Invisible box */}
      <View style={styles.invisibleBox}></View>

      {/* List */}
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={Array.from({ length: 30 }, (_, index) => index)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Two small buttons at the top */}
      <TouchableOpacity style={styles.leftButton} onPress={() => navigation.navigate('MyRequests')}>
        <Text style={styles.buttonText}>My Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rightButton} onPress={() => navigation.navigate('CreateRequest')}>
        <Text style={styles.buttonText}>Create Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  invisibleBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80, // Adjust height as needed
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 80, // Adjust to account for the height of the invisible box
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
  leftButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 150,
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 150,
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default RequestsScreen;
