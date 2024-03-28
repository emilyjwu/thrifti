import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ListingProps {
  navigation: any;
  route: any;
}

const Listing: React.FC<ListingProps> = ({ navigation, route}) => {
  const [liked, setLiked] = useState(false);
  const labels = ['Denim', 'Blue', 'Outerwear'];
  const { imageUri, binItemInfo} = route.params;
  console.log()
  console.log("inListing")
  console.log(binItemInfo)
  console.log()

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
            {binItemInfo.listingName ? (
            <Text style={styles.title}>{binItemInfo.listingName}</Text>
            ) : null}
              <TouchableOpacity onPress={() => {setLiked(!liked)}}>
                <EntypoIcon name={liked ? "heart" : "heart-outlined"} size={25} color={liked ? "red" : "black"} />
              </TouchableOpacity>
          </View>
          {binItemInfo.description ? (
            <View style={styles.listingDescription}>
            <Text>{binItemInfo.description}</Text>
            </View>
          ) : null}
          {binItemInfo.conditon ? (
            <View style={styles.horizontalBox}>
              <Text style={styles.subtitle}>Condition:</Text>
              <View style={styles.conditionContainer}>
                <Text>{binItemInfo.condition}</Text>
              </View>
            </View>
          ) : null}
          {binItemInfo.tags ? (
            <View>
            <Text style={styles.subtitle}>Tags</Text>
            <View style={styles.labelsContainer}>
              {binItemInfo.tags.map((tag, index) => (
                <View key={index} style={styles.labelPill}>
                  <Text style={styles.labelText}>{tag.description}</Text>
                </View>
              ))}
            </View>
          </View>
          ) : null}
        </ScrollView>
        <View style={styles.bottomBar}>
          <Text style={styles.title}>${binItemInfo.price}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Message")}>
            <MaterialCommunityIcon name="message" size={40} color="white" />
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
    marginBottom: 5,
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
    borderRadius: 10,
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
    marginTop: 5,
    marginBottom: 10,
  },
  conditionContainer: {
    backgroundColor: '#eBeBeB',
    padding: 5,
    borderRadius: 10, 
    marginLeft: 5,
  },
  subtitle: {
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
    backgroundColor: "lightblue",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  labelText: {
    fontSize: 16,
    color: "black",
  },
  bottomBar: {
    padding: 10,
    height: 65,
    backgroundColor: '#778899',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Listing;

