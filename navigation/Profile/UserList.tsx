import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import FollowButton from '../../components/FollowButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface UserListProps {
  navigation: NavigationProp<any>;
}
const screenWidth = Dimensions.get('window').width;
const followButtonWidth = screenWidth * 0.4;

const UserList: React.FC<UserListProps> = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const followUser = () => {
    setIsFollowing(!isFollowing);
  };

  const unfollowUser = () => {
    setIsFollowing(!isFollowing);
  }

  const users = [
    { id: '1', name: 'Emily Wu', username: '@emilyjwuu' },
    { id: '2', name: 'Isha Perry', username: '@ishaperryy' },
  ];

  const renderUserItem = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.rowContainer}>
        <FontAwesome name="user-circle" size={55} color="gray" style={styles.profilePhoto} />
        <View style={styles.verticalColumn}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.usernameText}>{item.username}</Text>
        </View>
      </View>
      <FollowButton
        isFollowing={isFollowing}
        followUser={followUser}
        unfollowUser={unfollowUser}
        buttonWidth={followButtonWidth}
        buttonHeight={30}
        fontSize={15}
      />
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
      <FlatList 
        data={users} 
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