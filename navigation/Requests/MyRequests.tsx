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
  fetchUserInfo,
  fetchFieldsAnyCollection,
} from "../../database/index";
import { usePostHog } from "posthog-react-native";

interface MyRequestsProps {
  navigation: NavigationProp<any>;
  route: any;
}

const MyRequests: React.FC<MyRequestsProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [requestDetails, setRequestDetails] = useState<any[]>([]);
  const currentUserID = useContext(AuthContext).userAuth.uid;
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
          posthog.screen("My Requests Screen", { timeSpent, uid });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user-specific request IDs
        const userRequestIDs = (await fetchUserInfo(currentUserID)).requestIDs;
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
    const index = requests.indexOf(item);

    // Retrieve the corresponding requestDetail using the index
    const requestDetail = requestDetails[index];
    if (!requestDetail) return null;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("RequestListing", { requestID: requests[index] });
          console.log("RequestID: " + requests[index]);
        }}
      >
        <View style={styles.requestItem}>
          <Text style={styles.requestTitle}>{requestDetail.title}</Text>
          <Text style={styles.requestText}>{requestDetail.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 0,
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
});

export default MyRequests;
