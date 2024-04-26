import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FollowButton from '../../components/FollowButton';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext, BinItemInfo, fetchBinItemsInfo, fetchBinName, fetchUserInfo, fetchUserListings, isFollowingUser, UserInfo } from "../../database/index";
import ListingScroll from '../../components/ListingScroll';
import BinScroll from '../../components/BinScroll';
import { ScrollView } from 'react-native-gesture-handler';


interface ProfileScreenProps {
  navigation: NavigationProp<any>;
  route: any;
}

const screenWidth = Dimensions.get('window').width;
const profilePhotoSize = screenWidth * 0.3;
const followButtonWidth = screenWidth * 0.6;
const windowWidth = Dimensions.get('window').width;
const itemWidth = (windowWidth - 40) / 3;


const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userID } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { currentUserID } = useContext(AuthContext);
  const isCurrentUser = currentUserID === userID;
  const [isFollowing, setIsFollowing] = useState(false);
  const [listingsInfo, setListingsInfo] = useState<BinItemInfo[]>([]);
  const [likedListingsInfo, setLikedListingsInfo] = useState<BinItemInfo[]>([]);
  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
  const [binNames, setBinNames] = useState<string[]>([]);


  const Tab = createMaterialTopTabNavigator();

  const ListingsTab: React.FC<any> = ({ listingsInfo, navigation }) => {
    return (
      <View style={styles.tabContainer}>
        {listingsInfo.length > 0 ? (
          <ListingScroll binItemsInfo={listingsInfo} navigation={navigation} />
        ) : (
          <View style={styles.centerContainer}>
            {isCurrentUser ? (
              <>
                <Text style={styles.tabText}>No listings yet</Text>
                <Text style={styles.tabText}>
                  Tap on <Ionicons name="pricetags-outline" size={20} color="gray" /> to get started!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.tabText}>No listings yet</Text>
                <Ionicons name="pricetags-outline" size={80} color="gray" />
              </>
            )}
          </View>
        )}
      </View>
    );
  };
  
  const LikedTab: React.FC<any> = ({ likedListingsInfo, navigation }) => {
    return (
      <View style={styles.tabContainer}>
        { likedListingsInfo.length ? (
          <ListingScroll binItemsInfo={likedListingsInfo} navigation={navigation} />
        ) : (
          <View style={styles.centerContainer}>
            {isCurrentUser ? (
              <>
                <Text style={styles.tabText}>No likes yet</Text>
                <Text style={styles.tabText}>
                  Tap on <Ionicons name="home-outline" size={20} color="gray" /> to get started!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.tabText}>No likes yet</Text>
                <EntypoIcon name="heart-outlined" size={80} color="gray"/>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const BinsTab: React.FC<any> = ({ binsInfo, binNames, navigation }) => (
    <View style={styles.tabContainer}>
      {binsInfo.length ? (
        <ScrollView>
          <BinScroll binsInfo={binsInfo} binNames={binNames} navigation={navigation} itemWidth={itemWidth}/>
        </ScrollView>
      ) : (
        <View style={styles.centerContainer}>
          {isCurrentUser ? (
            <>
              <Text style={styles.tabText}>No bins yet</Text>
              <Text style={styles.tabText}>
                Tap on <Ionicons name="pricetags-outline" size={20} color="gray" /> to get started!
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.tabText}>No bins yet</Text>
              <FontAwesome5Icon name="box-open" size={80} color="gray" />
            </>
          )}
        </View>
      )}
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

        const binsInfoArray: BinItemInfo[][] = await Promise.all(user.binIDs.map(async (bin) => {
          return await fetchBinItemsInfo(bin);
        }));
        setBinsInfo(binsInfoArray);
          const binNamesArray: string[] = await Promise.all(user.binIDs.map(async (bin) => {
            return await fetchBinName(bin);
        }));
        setBinNames(binNamesArray);
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

  const userInfoCallback = (updatedFields) => {
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
                <TouchableOpacity style={styles.editProfileButton} onPress={()=>navigation.navigate("EditProfile", { navigation, userInfo, userInfoCallback })}>
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
                  userInfoCallback={userInfoCallback}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>0</Text>
            <Text>Sold</Text>
          </View>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>0</Text>
            <Text>Purchased</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("UserList", { userIDList: userInfo.followers, userInfoCallback })}>
            <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
              <Text style={styles.statsNumber}>{userInfo ? userInfo.followers.length : 0}</Text>
              <Text>Followers</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("UserList", { userIDList: userInfo.following, userInfoCallback })}>
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
        <Tab.Screen name="Bins">
          {() => <BinsTab binsInfo={binsInfo} binNames={binNames} navigation={navigation} />}
        </Tab.Screen>
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
    paddingTop: 5,
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
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "gray",
  }
});

export default ProfileScreen;
