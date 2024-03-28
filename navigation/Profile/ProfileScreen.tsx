import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import ListingScroll from "../../components/ListingScroll";
import { ScrollView } from "react-native";

interface ProfileScreenProps {
  navigation: NavigationProp<any>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container} ph-label="profile">
      <Text
        onPress={() => navigation.navigate("Explore")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Profile Screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;
