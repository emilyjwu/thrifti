import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Touchable,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FollowButton from "../../components/FollowButton";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  AuthContext,
  fetchUserInfo,
  isFollowingUser,
  UserInfo,
} from "../../database/index";

interface ProfileScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const screenWidth = Dimensions.get("window").width;
const profilePhotoSize = screenWidth * 0.3;
const followButtonWidth = screenWidth * 0.5;

const Tab = createMaterialTopTabNavigator();
const ListingsTab = () => (
  <View style={styles.tabContainer}>
    <Text>Listings Screen</Text>
  </View>
);

const BinsTab = () => (
  <View style={styles.tabContainer}>
    <Text>Bins Screen</Text>
  </View>
);

const LikedTab = () => (
  <View style={styles.tabContainer}>
    <Text>Liked Items Screen</Text>
  </View>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userID } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { currentUserID } = useContext(AuthContext);
  const isCurrentUser = currentUserID === userID;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Current userID: ", currentUserID);
      console.log("Other userID: ", userID);
      const user = await fetchUserInfo(userID);
      setUserInfo(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("UserInfo changed:", userInfo);
  }, [userInfo]);

  useEffect(() => {
    const checkFollowing = async () => {
      const following = await isFollowingUser(currentUserID, userID);
      setIsFollowing(following);
    };
    checkFollowing();
  }, []);

  return (
    <View style={styles.container}>
      {!isCurrentUser && (
        <View style={styles.header}>
          <MaterialIcons name="keyboard-arrow-left" size={30} />
          <View style={styles.usernameContainer}>
            <Text>{userInfo ? userInfo.userName : ""}</Text>
          </View>
        </View>
      )}
      <View style={{ paddingBottom: 10, paddingHorizontal: 10 }}>
        <View style={styles.topContainer}>
          <FontAwesome
            name="user-circle"
            size={profilePhotoSize}
            color="gray"
            style={styles.profilePhoto}
          />
          <View style={styles.verticalColumn}>
            <Text style={styles.nameText}>
              {userInfo ? userInfo.fullName : ""}
            </Text>
            <View style={styles.horizontalRow}>
              {isCurrentUser ? (
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={() => navigation.navigate("hi")}
                >
                  <Text style={{ fontSize: 17 }}>Edit profile</Text>
                </TouchableOpacity>
              ) : (
                <FollowButton
                  userID={currentUserID}
                  otherUserID={userID}
                  initialIsFollowing={isFollowing}
                  buttonWidth={followButtonWidth}
                  buttonHeight={35}
                  fontSize={17}
                />
              )}
              <Feather name="mail" size={40} style={{ marginLeft: 5 }} />
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.verticalColumn, { alignItems: "center" }]}>
            <Text style={styles.statsNumber}>5</Text>
            <Text>Sold</Text>
          </View>
          <View style={[styles.verticalColumn, { alignItems: "center" }]}>
            <Text style={styles.statsNumber}>8</Text>
            <Text>Purchased</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserList", {
                userIDList: userInfo.followers,
              })
            }
          >
            <View style={[styles.verticalColumn, { alignItems: "center" }]}>
              <Text style={styles.statsNumber}>
                {userInfo ? userInfo.followers.length : 0}
              </Text>
              <Text>Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UserList", {
                userIDList: userInfo.following,
              })
            }
          >
            <View style={[styles.verticalColumn, { alignItems: "center" }]}>
              <Text style={styles.statsNumber}>
                {userInfo ? userInfo.following.length : 0}
              </Text>
              <Text>Following</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{userInfo ? userInfo.bio : ""}</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 15, textTransform: "none" },
          tabBarIndicatorStyle: { backgroundColor: "black" },
        }}
      >
        <Tab.Screen name="Listings" component={ListingsTab} />
        <Tab.Screen name="Bins" component={BinsTab} />
        <Tab.Screen name="Likes" component={LikedTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  usernameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePhoto: {
    height: profilePhotoSize,
    width: profilePhotoSize,
    marginRight: 10,
  },
  verticalColumn: {
    flexDirection: "column",
  },
  nameText: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 5,
  },
  horizontalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editProfileButton: {
    backgroundColor: "lightblue",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: followButtonWidth,
    height: 35,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bioText: {
    fontSize: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
