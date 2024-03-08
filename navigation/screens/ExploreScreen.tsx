import * as React from "react";
import { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        onPress={() => alert("This is the Explore Page")}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Explore Screen
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

export default ExploreScreen;
