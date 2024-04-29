import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import FollowButton from "../../components/FollowButton";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  fetchBasicUserInfo,
  BasicUserInfo,
  isFollowingUser,
  AuthContext,
  updateTimeAnalytics,
} from "../../database";
import { usePostHog } from "posthog-react-native";

interface UserListProps {
  navigation: NavigationProp<any>;
  route: any;
}
const screenWidth = Dimensions.get("window").width;
const followButtonWidth = screenWidth * 0.4;
const profilePhotoSize = 55;

const UserList: React.FC<UserListProps> = ({ navigation, route }) => {
  const { userIDList, userInfoCallback } = route.params;
  const { currentUserID } = useContext(AuthContext);
  const [userInfoList, setUserInfoList] = useState<BasicUserInfo[]>([]);
  const [initialIsFollowing, setInitialIsFollowing] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const posthog = usePostHog();
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
          updateTimeAnalytics("userListTime", timeSpent);
          posthog.screen("User List Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userPromises = userIDList.map((userID) =>
          fetchBasicUserInfo(userID)
        );
        const userList = await Promise.all(userPromises);
        setUserInfoList(userList);

        const isFollowingPromises = userIDList.map((userID) =>
          isFollowingUser(currentUserID, userID)
        );
        const isFollowingValues = await Promise.all(isFollowingPromises);
        setInitialIsFollowing(isFollowingValues);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userIDList]);

  const renderUserItem = ({ item, index }) => {
    return (
      <View style={styles.userContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("OtherProfile", { userID: item.userID })
          }
        >
          <View style={styles.rowContainer}>
            {item.profilePicURL ? (
              <Image
                source={{ uri: item.profilePicURL }}
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
            <View style={styles.verticalColumn}>
              <Text style={styles.nameText}>{item.fullName}</Text>
              <Text style={styles.usernameText}>{item.userName}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <FollowButton
          userID={currentUserID}
          otherUserID={item.userID}
          initialIsFollowing={initialIsFollowing[index]}
          buttonWidth={followButtonWidth}
          buttonHeight={30}
          fontSize={15}
          userInfoCallback={userInfoCallback}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <FlatList
          data={userInfoList}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.userID}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePhoto: {
    height: profilePhotoSize,
    width: profilePhotoSize,
    borderRadius: profilePhotoSize,
    marginRight: 5,
  },
  verticalColumn: {
    flexDirection: "column",
  },
  nameText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  usernameText: {
    fontSize: 13,
  },
});

export default UserList;
