import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface RequestListingProps {
  navigation: NavigationProp<any>;
}

const RequestListing: React.FC<RequestListingProps> = ({ navigation }) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity>
      <View style={styles.requestItem} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Array.from({ length: 30 }, (_, index) => index)}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  requestItem: {
    height: 100,
    backgroundColor: '#000',
    marginVertical: 5,
    marginHorizontal: 10,
  },
});

export default RequestListing;
