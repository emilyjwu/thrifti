import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
  fetchAllBins,
  fetchBinItemsInfo,
  BinItemInfo,
} from "../database/index";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { usePostHog } from "posthog-react-native";

interface FilteredFeedProps {
  navigation: NavigationProp<any>;
  bins: string[]; // Assuming bins is an array of bin names
}

const FilteredFeed: React.FC<FilteredFeedProps> = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = (windowWidth - 40) / 3;
  const posthog = usePostHog();

  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bins = await fetchAllBins();
        const binsInfoArray: BinItemInfo[][] = await Promise.all(
          bins.map(async (bin) => {
            return await fetchBinItemsInfo(bin);
          })
        );
        setBinsInfo(binsInfoArray);
        // console.log(binsInfoArray[0])
        // console.log(binsInfoArray[3])
      } catch (error) {
        console.error("Error fetching bin items info:", error);
      }
    };

    fetchData();
  }, []);

  const renderBinItems = (binItems: BinItemInfo[]) => {
    return binItems.map((item, index) => (
      <View key={index} style={[styles.itemContainer, { width: itemWidth }]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Listing", {
              imageUri: item.imageUri,
              binItemInfo: item,
            })
          }
        >
          <Image
            source={{ uri: item.imageUri }}
            style={{
              width: 115,
              height: 115,
            }}
          />
        </TouchableOpacity>
        {!item.imageUri && (
          <View>
            <IconWithBackground
              width={115}
              height={115}
              iconSize={60}
              iconColor="#000"
              iconComponent={EntypoIcon}
              iconName="image"
              backgroundColor="#eBeBeB"
            />
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ListingScroll");
              posthog.capture("VIEWING LISTING");
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ExploreFeed")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Bins</Text>
          </TouchableOpacity>
        </View>
        {binsInfo.map((binItems, index) => (
          <View key={index}>
            {binItems.length !== 0 ? (
              <View>
                <View style={styles.titleContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ExpandBin", { binItems })
                    }
                  >
                    <Text style={styles.title}>Bin Name</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Message")}
                    style={styles.message}
                  >
                    <MaterialCommunityIcon
                      name="message"
                      size={30}
                      color="#75D7FF"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                  <FlatList
                    horizontal
                    data={binItems}
                    renderItem={({ item }) => renderBinItems(binItems)}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled={true}
                  />
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 0,
    marginRight: 0,
  },
  itemContainer: {
    marginBottom: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    alignSelf: "flex-end",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  contentContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    width: 100,
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginLeft: 0, // Adjusted to move buttons left
    marginRight: 10,
  },
});

export default FilteredFeed;
