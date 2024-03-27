import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface RequestsScreenProps {
  navigation: NavigationProp<any>;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RequestListing')}>
      <View style={styles.requestItem} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Array.from({ length: 30 }, (_, index) => index)} // Creates an array of length 30 for rendering 30 items
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
  },
  requestItem: {
    height: 100,
    backgroundColor: '#ccc',
    marginVertical: 5,
    marginHorizontal: 15,
  },
});

export default RequestsScreen;
