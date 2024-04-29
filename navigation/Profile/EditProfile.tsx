import React, { useContext, useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  AuthContext,
  updateUserInfo,
  updateTimeAnalytics,
} from "../../database";
import DoneProfileModal from "../../components/DoneProfileModal";
import { NavigationProp } from "@react-navigation/native";
import { usePostHog } from "posthog-react-native";

const screenWidth = Dimensions.get("window").width;
const profilePhotoSize = screenWidth * 0.3;
const columnWidth = screenWidth * 0.3;
const saveButtonWidth = screenWidth * 0.5;

interface EditProfileProps {
  navigation: NavigationProp<any>;
  route: any;
}

const EditProfile: React.FC<EditProfileProps> = ({ navigation, route }) => {
  const { currentUserID } = useContext(AuthContext);
  const { userInfo, userInfoCallback } = route.params;
  const [profilePicUri, setProfilePicUri] = useState(userInfo.profilePicURL);
  const [name, setName] = useState(userInfo.fullName);
  const [bio, setBio] = useState(userInfo.bio);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
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
          updateTimeAnalytics("editProfileTime", timeSpent);
          posthog.screen("Edit Profile Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  const handleProfilePhotoPress = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error Picking Image: ", error);
    }
  };

  const handleSave = async () => {
    try {
      const updatedInfo = {
        fullName: name,
        bio: bio,
        profilePicURL: profilePicUri,
      };
      await updateUserInfo(currentUserID, updatedInfo);
      setIsModalVisible(true);
      userInfoCallback(updatedInfo);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfilePhotoPress}>
        <View style={styles.photoContainer}>
          {profilePicUri ? (
            <Image
              source={{ uri: profilePicUri }}
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
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>User details</Text>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.fieldTitle}>Username</Text>
        </View>
        <Text>{userInfo ? "@" + userInfo.userName : "Username"}</Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.fieldTitle}>Email</Text>
        </View>
        <Text>{userInfo ? userInfo.email : "Email"}</Text>
      </View>
      <View style={[styles.rowContainer, { marginBottom: 25 }]}>
        <View style={styles.column}>
          <Text style={styles.fieldTitle}>Joined</Text>
        </View>
        <Text>
          {userInfo
            ? new Date(userInfo.joinedDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Date"}
        </Text>
      </View>
      <Text style={styles.title}>About me</Text>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.fieldTitle}>Name</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder={name}
        />
        <MaterialIcons name="keyboard-arrow-right" size={25} />
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.fieldTitle}>Bio</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setBio}
          value={bio}
          placeholder={bio}
        />
        <MaterialIcons name="keyboard-arrow-right" size={25} />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSave()}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <DoneProfileModal
        isVisible={isModalVisible}
        onClose={closeModal}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePhoto: {
    height: profilePhotoSize,
    width: profilePhotoSize,
    borderRadius: profilePhotoSize,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
  },
  column: {
    width: columnWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  fieldTitle: {
    fontSize: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  saveButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "darkslategrey",
    paddingVertical: 10,
    borderRadius: 5,
    width: saveButtonWidth,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default EditProfile;
