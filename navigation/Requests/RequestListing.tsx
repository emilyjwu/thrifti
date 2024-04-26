import * as React from "react";
import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { AuthContext } from "../../database/index";
import { usePostHog } from "posthog-react-native";
interface RequestListingProps {
  navigation: NavigationProp<any>;
}

const RequestListing: React.FC<RequestListingProps> = ({ navigation }) => {
  const [startTime, setStartTime] = useState(Date.now());
  const posthog = usePostHog();
  const uid = useContext(AuthContext).userAuth.uid;

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
          posthog.screen("Request Listing Screen", { timeSpent, uid });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  // Sample data for demonstration
  const requestDetails = {
    name: "Liam Neeson",
    description:
      "I don’t know who you are. I don’t know what you want. If you are looking for ransom I can tell you I don’t have money, but what I do have are a very particular set of skills. Skills I have acquired over a very long career. Skills that make me a nightmare for people like you. If you let my daughter go now that’ll be the end of it. I will not look for you, I will not pursue you, but if you don’t, I will look for you, I will find you and I will kill you.",
  };

  const handleMessaging = () => {
    // Handle messaging functionality here
    // For demonstration, you can navigate to a messaging screen
    navigation.navigate("Message");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{requestDetails.name}</Text>
      <Text style={styles.description}>{requestDetails.description}</Text>
      <TouchableOpacity onPress={handleMessaging} style={styles.button}>
        <Text style={styles.buttonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RequestListing;
