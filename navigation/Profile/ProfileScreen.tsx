import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FollowButton from '../../components/FollowButton';


interface ProfileScreenProps {
  navigation: NavigationProp<any>;
}

const screenWidth = Dimensions.get('window').width;
const profilePhotoSize = screenWidth * 0.3; 

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const followUser = () => {
    setIsFollowing(!isFollowing);
  };

  const unfollowUser = () => {
    setIsFollowing(!isFollowing);
  }

  return (
    <View style={styles.container}>
      {/* This header should only appear if you navigate to Profile from ANOTHER page */}
      <View style={styles.header}>
          <MaterialIcons name="keyboard-arrow-left" size={30} />
          <View style={styles.usernameContainer}>
            <Text>janedoe123</Text>
          </View>
        </View>
      <View style={{paddingBottom: 10, paddingHorizontal: 10}}>
        <View style={styles.topContainer}>
          <FontAwesome name="user-circle" size={profilePhotoSize} color='gray' style={styles.profilePhoto}/>
          <View style={styles.verticalColumn}>
            <Text style={styles.nameText}>Jane Doe</Text>
            <View style={styles.horizontalRow}>
              <FollowButton isFollowing={isFollowing} followUser={followUser} unfollowUser={unfollowUser} />
              <Feather name="mail" size={40}/>
            </View>
          </View>
        </View>
        {/* Write this in a loop eventually */}
        <View style={styles.statsContainer}>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>5</Text>
            <Text>Sold</Text>
          </View>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>8</Text>
            <Text>Purchased</Text>
          </View>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>25</Text>
            <Text>Followers</Text>
          </View>
          <View style={[styles.verticalColumn, {alignItems: 'center'}]}>
            <Text style={styles.statsNumber}>24</Text>
            <Text>Following</Text>
          </View>
        </View>
        <View>
          <Text style={styles.bioText}>
            Hi I'm Jane! Feel free to message me about anything you're interested in.
          </Text>
        </View>
      </View>
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
});

export default ProfileScreen;
