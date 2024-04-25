import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FollowButton from '../../components/FollowButton';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext, BinItemInfo, fetchUserInfo, fetchUserListings, isFollowingUser, UserInfo } from "../../database/index";
import ListingScroll from '../../components/ListingScroll';


interface ProfileScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const screenWidth = Dimensions.get('window').width;
const profilePhotoSize = screenWidth * 0.3;
const followButtonWidth = screenWidth * 0.6;


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userID } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { currentUserID } = useContext(AuthContext);
  const isCurrentUser = currentUserID === userID;
  const [isFollowing, setIsFollowing] = useState(false);
  const [listingsInfo, setListingsInfo] = useState<BinItemInfo[]>([]);
  const [likedListingsInfo, setLikedListingsInfo] = useState<BinItemInfo[]>([]);


  const Tab = createMaterialTopTabNavigator();

  const ListingsTab: React.FC<any> = ({ listingsInfo, navigation }) => {
    return (
      <View style={styles.tabContainer}>
        <ListingScroll binItemsInfo={listingsInfo} navigation={navigation} />
      </View>
    );
  };
  
  const LikedTab: React.FC<any> = ({ likedListingsInfo, navigation }) => {
    return (
      <View style={styles.tabContainer}>
        <ListingScroll binItemsInfo={likedListingsInfo} navigation={navigation} />
      </View>
    );
  };

  const BinsTab = () => (
    <View style={styles.tabContainer}>
      <Text>Bins Screen</Text>
    </View>
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserInfo(userID);
        setUserInfo(user);

        const userListingInfo = await fetchUserListings(user.listingIDs);
        setListingsInfo(userListingInfo);

        const likedListingInfo = await fetchUserListings(user.likedListings);
        setLikedListingsInfo(likedListingInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkFollowing = async () => {
      const following = await isFollowingUser(currentUserID, userID);
      setIsFollowing(following);
    };
    checkFollowing();
  }, []);

  const finishEditProfile = (updatedFields) => {
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        ...updatedFields
    }));
  };

  return (
    <View style={styles.container}>
      { !isCurrentUser &&
        <View style={styles.header}>
          <MaterialIcons name="keyboard-arrow-left" size={30} />
          <View style={styles.usernameContainer}>
            <Text>{userInfo ? userInfo.userName : ""}</Text>
          </View>
        </View>
      }
      <View style={{paddingBottom: 10, paddingHorizontal: 10 }}>
        <View style={styles.topContainer}>
        {(userInfo && userInfo.profilePicURL) ? (
            <Image source={{ uri: userInfo.profilePicURL }} style={styles.profilePhoto} />
        ) : (
            <FontAwesome name="user-circle" size={profilePhotoSize} color='gray' style={styles.profilePhoto} />
        )}
          <View style={styles.verticalColumn}>
            <Text style={styles.nameText}>{userInfo ? userInfo.fullName : ""}</Text>
            <View style={styles.horizontalRow}>
              {(isCurrentUser) ? (
                <TouchableOpacity style={styles.editProfileButton} onPress={()=>navigation.navigate("EditProfile", { navigation, userInfo, finishEditProfile })}>
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
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>5</Text>
            <Text>Sold</Text>
          </View>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>8</Text>
            <Text>Purchased</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("UserList", { userIDList: userInfo.followers })}>
            <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
              <Text style={styles.statsNumber}>{userInfo ? userInfo.followers.length : 0}</Text>
              <Text>Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("UserList", { userIDList: userInfo.following })}>
            <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
              <Text style={styles.statsNumber}>{userInfo ? userInfo.following.length : 0}</Text>
              <Text>Following</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{userInfo ? userInfo.bio : ""}</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 15, textTransform: 'none' }, 
          tabBarIndicatorStyle: { backgroundColor: 'black' }, 
        }}
      >
        <Tab.Screen name="Listings">
          {() => <ListingsTab listingsInfo={listingsInfo} navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Bins" component={BinsTab} />
        <Tab.Screen name="Likes">
          {() => <LikedTab likedListingsInfo={likedListingsInfo} navigation={navigation} />}
        </Tab.Screen>
        </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  usernameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    height: profilePhotoSize,
    width: profilePhotoSize,
    borderRadius: profilePhotoSize,
    marginRight: 10,
  },
  verticalColumn: {
    flexDirection: 'column',
  },
  nameText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileButton: {
    backgroundColor: 'lightblue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: followButtonWidth,
    height: 35,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bioText: {
    fontSize: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5,
  }
});

export default ProfileScreen;
