import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
  AuthContext,
  fetchUserInfo,
  fetchFieldsAnyCollection,
} from "../../database/index";
import { usePostHog } from "posthog-react-native";

interface RequestListingProps {
  navigation: NavigationProp<any>;
  route: any;
}

const RequestListing: React.FC<RequestListingProps> = ({
  navigation,
  route,
}) => {
  // Sample data for demonstration
  const { requestID } = route.params;
  const [requestDetail, setRequestDetails] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [usersRequestBool, setUsersRequestBool] = useState<boolean>(false);
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
          posthog.screen("Request Listing Screen", { timeSpent, emailAddr });
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
        interface RequestDetails {
          title: string;
          description: string;
        }
        const details = (await fetchFieldsAnyCollection(
          "requests",
          requestID
        )) as RequestDetails;
        const { title, description } = details; // Destructuring to extract title and description
        setRequestDetails({ title, description }); // Setting details with only title and description
        // fetch the current user's request lists
        const userRequestIDs = (await fetchUserInfo(currentUserID)).requestIDs;
        // if the id is present in the user's request id's, isPresent == true
        const isPresentinit: boolean = userRequestIDs.includes(requestID);
        setUsersRequestBool(isPresentinit);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      }
    };

    fetchData();
  }, [currentUserID]);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("RequestListing")}>
        <View style={styles.container}>
          <Text style={styles.title}>{requestDetail.title}</Text>
          <Text style={styles.description}>{requestDetail.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleMessaging = () => {
    // Handle messaging functionality here
    // get chat data to send to chat window
    const formatDate = (chat) => {
      const messageDate = chat.date.toDate();
      if (!messageDate) {
        return "Date not available";
      }
      const formattedDate = `${messageDate.toDateString()} ${messageDate.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;

      return formattedDate;
    };

    navigation.navigate("Message");
  };

  return (
    <View style={styles.container}>
      {requestDetail && ( // Conditionally render if requestDetail is not null
        <>
          <Text style={styles.title}>{requestDetail.title}</Text>
          <Text style={styles.description}>{requestDetail.description}</Text>
        </>
      )}
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
  title: {
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
