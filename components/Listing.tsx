import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { usePostHog } from "posthog-react-native";
import {
  BasicUserInfo,
  fetchBasicUserInfo,
  isListingLiked,
  addLikedListing,
  removeLikedListing,
  AuthContext,
} from "../database";
import { createChat } from "../database/messaging";
import LikeButton from "./LikeButton";

interface ListingProps {
  navigation: any;
  route: any;
}
const profilePhotoSize = 50;

const Listing: React.FC<ListingProps> = ({ navigation, route }) => {
  const { imageUri, binItemInfo } = route.params;

  const [imageLoading, setImageLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<BasicUserInfo | null>(null);

  const posthog = usePostHog();
  const [startTime, setStartTime] = useState(Date.now());
  const emailAddr = useContext(AuthContext).userAuth.email;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setStartTime(Date.now());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (startTime) {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);
        if (timeSpent > 0) {
          posthog.screen("Listing Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  const handleMessageButton = () => {
    async function getAndCreateChat() {
      try {
        const { combinedId, chatArray } = await createChat(
          userInfo,
          imageUri,
          binItemInfo.listingName,
          binItemInfo.id,
          binItemInfo.binID,
          binItemInfo.userID
        );
        //i need the specific index where the id == combined ID but i can't index directly because i need all fields in the object
        const index = chatArray.findIndex((item) => item.id === combinedId);
        if (index !== -1) {
          const chatData = chatArray[index];
          navigation.navigate("Chat", {
            chatId: combinedId,
            chatData: chatData,
          });
        } else {
          console.log("Chat not found in the array.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    getAndCreateChat();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchBasicUserInfo(binItemInfo.userID);
        console.log(binItemInfo.sold);
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile", { userID: binItemInfo.userID });
          }}
        >
          <View style={[styles.horizontalBox, { marginBottom: 10 }]}>
            {userInfo && userInfo.profilePicURL != "" ? (
              <Image
                source={{ uri: userInfo.profilePicURL }}
                style={styles.profilePhoto}
              />
            ) : (
              <FontAwesome
                name="user-circle"
                size={profilePhotoSize}
                color="gray"
                style={styles.profilePhoto}
              />
            )}
            <Text style={styles.profileName}>
              {userInfo && userInfo.userName}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          {binItemInfo.sold ? (
            <View style={styles.soldContainer}>
              <Image
                style={styles.image}
                source={{ uri: imageUri }}
                onLoad={() => setImageLoading(false)}
              />
              <View style={[styles.imageOverlay]} />
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          ) : (

              <Image
                style={styles.square}
                source={{ uri: imageUri }}
                onLoad={() => setImageLoading(false)}
              />

          )}
          </View>

        <View style={styles.horizontalBox}>
          {binItemInfo.listingName ? (
            <Text style={styles.title}>{binItemInfo.listingName}</Text>
          ) : null}
          <LikeButton binItemInfo={binItemInfo} />
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
        {binItemInfo.sold ? (
          <Text style={[styles.title, styles.strikethrough]}>
            ${binItemInfo.price}
          </Text>
        ) : (
          <Text style={styles.title}>${binItemInfo.price}</Text>
        )}
        <TouchableOpacity onPress={() => handleMessageButton()}>
          <MaterialCommunityIcon name="message" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  horizontalBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePhoto: {
    height: profilePhotoSize,
    width: profilePhotoSize,
    borderRadius: profilePhotoSize,
    marginRight: 5,
  },
  profileName: {
    fontSize: 16,
  },
  soldContainer: {
    position: "relative",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 1,
  },
  square: {
    flex: 1,
    borderRadius: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  soldText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
  },
  titleContainer: {
    justifyContent: "center",
  },
  title: {
    marginRight: 5,
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: "black",
  },
  listingDescription: {
    backgroundColor: "#eBeBeB",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  conditionContainer: {
    backgroundColor: "#eBeBeB",
    padding: 5,
    borderRadius: 10,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    backgroundColor: "gray",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

});

export default Listing;
