import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import FollowButton from '../../components/FollowButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { fetchBasicUserInfo, BasicUserInfo, isFollowingUser, AuthContext } from '../../database';

interface UserListProps {
  navigation: NavigationProp<any>;
  route: any;
}
const screenWidth = Dimensions.get('window').width;
const followButtonWidth = screenWidth * 0.4;

const UserList: React.FC<UserListProps> = ({navigation, route}) => {
  const { userIDList, updateUserInfo } = route.params;
  const { currentUserID } = useContext(AuthContext);
  const [userInfoList, setUserInfoList] = useState<BasicUserInfo[]>([]);
  const [initialIsFollowing, setInitialIsFollowing] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userPromises = userIDList.map(userID => fetchBasicUserInfo(userID)); 
        const userList = await Promise.all(userPromises); 
        setUserInfoList(userList.filter(user => user)); 

        const isFollowingPromises = userIDList.map(userID => isFollowingUser(currentUserID, userID));
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
        <TouchableOpacity onPress={()=> navigation.navigate("Profile", { userID: item.userID })}>
          <View style={styles.rowContainer}>
            <FontAwesome name="user-circle" size={55} color="gray" style={styles.profilePhoto} />
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
          updateUserInfo={updateUserInfo}
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
        keyExtractor={item => item.id}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    height: 55,
    width: 55,
    marginRight: 5,
  },
  verticalColumn: {
    flexDirection: 'column',
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 13,
  },
});

export default UserList;