import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
  AuthContext,
  fetchAllRequests,
  fetchFieldsAnyCollection,
} from "../../database/index";
import { usePostHog } from "posthog-react-native";

interface RequestsScreenProps {
  navigation: NavigationProp<any>;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [requestDetails, setRequestDetails] = useState<any[]>([]);
  const currentUserID = useContext(AuthContext).userAuth.uid;
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
          posthog.screen("Request Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  //async blocc because renderitem flatlist gets pissed if you async
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user-specific request IDs
        const userRequestIDs = await fetchAllRequests();
        setRequests(userRequestIDs);

        // Fetch details for each request
        const details = await Promise.all(
          userRequestIDs.map((id) => fetchFieldsAnyCollection("requests", id))
        );

        setRequestDetails(details);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    fetchData();
  }, [currentUserID]);

  const renderItem = ({ item }: { item: any }) => {
    // Find the index of the item in the requests array
    const index = 0;
    if (item != null) {
      const index = requests.indexOf(item);
    }
    // Retrieve the corresponding requestDetail using the index
    const requestDetail = requestDetails[index];
    if (!requestDetail) return null;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('RequestListing', requests[index])}>
        <View style={styles.requestItem}>
          <Text style={styles.requestTitle}>{requestDetail.title}</Text>
          <Text style={styles.requestText}>{requestDetail.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Invisible box */}
      <View style={styles.invisibleBox}></View>

      {/* List */}
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Two small buttons at the top */}
      <TouchableOpacity
        style={styles.leftButton}
        onPress={() => navigation.navigate("MyRequests")}
      >
        <Text style={styles.buttonText}>My Requests</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rightButton}
        onPress={() => navigation.navigate("CreateRequest")}
      >
        <Text style={styles.buttonText}>Create Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  invisibleBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80, // Adjust height as needed
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 80, // Adjust to account for the height of the invisible box
  },
  requestItem: {
    height: 100,
    backgroundColor: "#ccc",
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  requestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  requestTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  leftButton: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 150,
    height: 50,
    backgroundColor: "grey",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  rightButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 150,
    height: 50,
    backgroundColor: "grey",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
});

export default RequestsScreen;
