import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import DetectObject from "../../../api";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { firebaseApp, firestore, firebaseAnalytics } from "../../../api";

interface ListItemScreenProps {
  navigation: any;
}

interface RouteParams {
  binNames?: string[]; // Define the bins property in the route params
}

const ListItemScreen: React.FC<ListItemScreenProps> = ({ navigation }) => {
  const route = useRoute();
  const { binNames }: RouteParams = route.params || {};
  console.log("binNames:", binNames);
  return (
    <View style={styles.container}>
      <DetectObject binNames={binNames} />
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

export default ListItemScreen;
