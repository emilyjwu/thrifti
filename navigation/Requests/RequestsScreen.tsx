import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface RequestsScreenProps {
  navigation: NavigationProp<any>;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate("RequestListing")}>
      <View style={styles.requestItem}>
        <Text style={styles.requestTitle}>Replace with random text</Text>
        <Text style={styles.requestText}>
          This is where the text of the request will be placed
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} ph-label="requests">
      <FlatList
        data={Array.from({ length: 30 }, (_, index) => index)}
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
    color: "#333", // Custom text color
    textAlign: "center",
  },
  requestTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default RequestsScreen;
