import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

interface ListingProps {
  navigation: any;
}

const Listing: React.FC<ListingProps> = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.sellerInfomation}>
            <View style={styles.profilePhoto}/>
            <Text style={styles.profileName}>@janeDoe</Text>
          </View>
          <View style={styles.square}/>
          <Text style={styles.title}>Denim Vest</Text>
          <View style={styles.listingDescription}>
            <Text>Lightly worn but still in good condition! Fits size small.</Text>
          </View>
          <Text style={styles.subtitle}>Tags</Text>
        </ScrollView>
        <View style={styles.bottomBar}>
          <Text style={styles.title}>$15</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <Icon name="message" size={65} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  sellerInfomation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightblue',
    marginRight: 5,
  },
  profileName: {
    fontSize: 16,
  },
  square: {
    flex: 1,
    backgroundColor: 'lightblue',
    aspectRatio: 1, 
    borderRadius: 20,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  listingDescription: {
    backgroundColor: '#eBeBeB',
    padding: 10,
    borderRadius: 10,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 20,
    height: 100, 
    backgroundColor: 'lightblue', 
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Listing;