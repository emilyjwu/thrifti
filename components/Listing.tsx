import React, { useState, useEffect } from 'react'
import { Text, View, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { usePostHog } from "posthog-react-native";
import { BasicUserInfo, fetchBasicUserInfo } from '../database';

interface ListingProps {
  navigation: any;
  route: any;
}

const Listing: React.FC<ListingProps> = ({ navigation, route}) => {
  const [liked, setLiked] = useState(false);
  const { imageUri, binItemInfo} = route.params;
  const [imageLoading, setImageLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<BasicUserInfo | null>(null);

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("FOUND_LISTING");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(binItemInfo.userID);
        const user = await fetchBasicUserInfo(binItemInfo.userID);
        console.log(user);
        setUserInfo(user);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetchUser();
  }, [binItemInfo.userID]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
      <TouchableOpacity onPress={() => {
        console.log("UserID in Listing.tsx:", binItemInfo.userID);
        navigation.navigate("Profile", { userID: binItemInfo.userID });
      }}>
        <View style={styles.horizontalBox}>
          { (userInfo && userInfo.profilePicURL != "") ?
            <FontAwesome name="user-circle" size={50} color='pink' style={styles.profilePhoto}/>
            : <FontAwesome name="user-circle" size={50} color='gray' style={styles.profilePhoto}/>
          }
          <Text style={styles.profileName}>{userInfo && userInfo.userName}</Text>
        </View>
        </TouchableOpacity>
          <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <Image
            style={styles.square}
            source={{ uri: imageUri }}
            onLoad={() => setImageLoading(false)}
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
        {binItemInfo.description !== "" ? (
          <View style={styles.listingDescription}>
          <Text>{binItemInfo.description}</Text>
          </View>
        ) : null}
        {binItemInfo.conditon !== "" ? (
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
    height: 60,
    backgroundColor: 'gray',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Listing;

