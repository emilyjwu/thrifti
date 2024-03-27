import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ListingProps {
  navigation: any;
}

const Listing: React.FC<ListingProps> = ({ navigation }) => {
  const [liked, setLiked] = useState(false);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.horizontalBox}>
            <View style={styles.profilePhoto}/>
            <Text style={styles.profileName}>@janeDoe</Text>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.square}/>
          </View>
          <View style={styles.horizontalBox}>
            <Text style={styles.title}>Denim Vest</Text>
            <TouchableOpacity onPress={() => {setLiked(!liked)}}>
              <EntypoIcon name={liked ? "heart" : "heart-outlined"} size={25} color={liked ? "red" : "black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.listingDescription}>
            <Text>Lightly worn but still in good condition! Fits size small.</Text>
          </View>
          <Text style={styles.subtitle}>Tags</Text>
        </ScrollView>
        <View style={styles.bottomBar}>
          <Text style={styles.title}>$15</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <MaterialCommunityIcon name="message" size={65} color="white" />
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
  horizontalBox: {
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
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  square: {
    flex: 1,
    backgroundColor: 'lightblue',
    borderRadius: 20,
  },
  title: {
    marginTop: 10,
    marginRight: 5,
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

