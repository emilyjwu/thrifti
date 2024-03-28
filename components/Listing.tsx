import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { firestore } from '../database';

interface ListingProps {
  navigation: any;
  route: any;
}

const Listing: React.FC<ListingProps> = ({ navigation, route}) => {
  const [liked, setLiked] = useState(false);
  const labels = ['Denim', 'Blue', 'Outerwear'];
  const { imageUri} = route.params;


  // const fetchData = async () => {
  //   try {
  //     const docSnapshot = await getDoc(doc(firestore, "items", binItem));
  //     const listingName = docSnapshot.data().listingName;
  //     console.log("Listing Name:", listingName);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // Call the async function


  // const name = (await getDoc(doc(firestore, "items", binItem))).data().listingName;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.horizontalBox}>
            <View style={styles.profilePhoto}/>
            <Text style={styles.profileName}>@janeDoe</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
            style={styles.square}
            source={{ uri: imageUri }}
            />
          </View>
          <View style={styles.horizontalBox}>
            <Text style={styles.title}>Item for Sale</Text>
            <TouchableOpacity onPress={() => {setLiked(!liked)}}>
              <EntypoIcon name={liked ? "heart" : "heart-outlined"} size={25} color={liked ? "red" : "black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.listingDescription}>
            <Text>Lightly worn but still in good condition! Fits size small.</Text>
          </View>
          <View style={styles.horizontalBox}>
              <Text style={styles.subtitle}>Condition:</Text>
            <View style={styles.listingCondition}>
              <Text>Like New</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Tags</Text>
          <View style={styles.labelsContainer}>
            {labels.map((label, index) => (
              <View key={index} style={styles.labelPill}>
                <Text style={styles.labelText}>{label}</Text>
              </View>
            ))}
          </View>
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
    // backgroundColor: 'pink',
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
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    borderRadius: 20,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    marginRight: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  listingDescription: {
    backgroundColor: '#eBeBeB',
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  listingCondition: {
    backgroundColor: '#eBeBeB',
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginLeft: 5,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
  },
  labelPill: {
    backgroundColor: "lightslategrey",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  labelText: {
    fontSize: 16,
    color: "white",
  },
  bottomBar: {
    padding: 20,
    height: 100,
    backgroundColor: '#778899',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Listing;

