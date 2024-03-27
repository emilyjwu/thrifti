import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListingSquare = ({ marginBottom = false }) => {
    const navigation = useNavigation();
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Listing')}>
        <View style={[styles.listingSquare, marginBottom && { marginBottom: 5 }]} />
      </TouchableOpacity>
    );
};

const BinSquare = ({ marginLeft = false, marginRight = false }) => {
    const navigation = useNavigation();
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ExpandBin')}>
        <View style={[
          styles.binSquare,
          marginLeft && { marginLeft: 5 },
          marginRight && { marginRight: 5 }
        ]} />
      </TouchableOpacity>
    );
  };

const Type1Component = ({ item }) => (
  <View style={styles.type1}>
    <ListingSquare />
    <ListingSquare />
    <ListingSquare />
  </View>
);

const Type2Component = ({ item }) => (
  <View style={styles.type2}>
    <BinSquare marginRight />
    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <ListingSquare marginBottom/>
        <ListingSquare />
    </View>
  </View>
);

const Type3Component = ({ item }) => (
  <View style={styles.type2}>
    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <ListingSquare marginBottom/>
        <ListingSquare />
    </View>
    <BinSquare marginLeft />
  </View>
);

// Set up your data
const data = [
  { id: '1', type: 1, /* other data */ },
  { id: '2', type: 2, /* other data */ },
  { id: '1', type: 1, /* other data */ },
  { id: '1', type: 1, /* other data */ },
  { id: '3', type: 3, /* other data */ },
];

const renderItem = ({ item }) => {
  switch (item.type) {
    case 1:
      return <Type1Component item={item} />;
    case 2:
      return <Type2Component item={item} />;
    case 3:
      return <Type3Component item={item} />;
    default:
      return null;
  }
};

const MixedFeed = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 9,
  },
  listingSquare: {
    backgroundColor: 'lightblue',
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  binSquare: {
    backgroundColor: 'blue',
    width: 246,
    height: 246,
    borderRadius: 10,
  },
  type1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  type2: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  type3: {
    flexDirection: 'row',
    marginBottom: 5,
  },
});

export default MixedFeed;