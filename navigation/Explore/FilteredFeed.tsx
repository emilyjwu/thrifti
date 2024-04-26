import React, { useEffect, useState, useContext } from "react";
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
  fetchBinName,
} from "../../database/index";
import IconWithBackground from "../../components/IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { usePostHog } from "posthog-react-native";
import ListingScroll from "../../components/ListingScroll";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BinScroll from "../../components/BinScroll";
import { AuthContext } from "../../database/index";

interface FilteredFeedProps {
  navigation: NavigationProp<any>;
}

const FilteredFeed: React.FC<FilteredFeedProps> = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const itemWidth = (windowWidth - 40) / 3;

  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
  const [binNames, setBinNames] = useState<string[]>([]);
  const [isBinsView, setIsBinsView] = useState(true);

  const posthog = usePostHog();

  const [startTime, setStartTime] = useState(Date.now());
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
          posthog.screen("Filtered Feed Screen", { timeSpent, uid });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  useEffect(() => {
    posthog.capture("VIEWED_FILTERED_FEED");
  }, []);

  const handleIndexChange = (index: number) => {
    setIsBinsView(index === 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if data exists in local storage
        // const [storedBinsInfo, storedBinNames] = await Promise.all([
        //     AsyncStorage.getItem('binsInfo'),
        //     AsyncStorage.getItem('binNames')
        // ]);

        // if (storedBinsInfo && storedBinNames) {
        //     setBinsInfo(JSON.parse(storedBinsInfo));
        //     setBinNames(JSON.parse(storedBinNames));
        // } else {
        const bins = await fetchAllBins();
        const binsInfoArray: BinItemInfo[][] = await Promise.all(
          bins.map(async (bin) => {
            return await fetchBinItemsInfo(bin);
          })
        );
        setBinsInfo(binsInfoArray);

        const binNamesArray: string[] = await Promise.all(
          bins.map(async (bin) => {
            return await fetchBinName(bin);
          })
        );
        setBinNames(binNamesArray);

        // Store data in local storage
        // AsyncStorage.setItem('binsInfo', JSON.stringify(binsInfoArray));
        // AsyncStorage.setItem('binNames', JSON.stringify(binNamesArray));
        // }
      } catch (error) {
        console.error("Error fetching bin items info:", error);
      }
    };

    fetchData();
  }, []);

  //TEST: Try to keep data in local storage so switching between screens does not cause a full data reload!

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const bins = await fetchAllBins();
  //             const binsInfoArray: BinItemInfo[][] = await Promise.all(bins.map(async (bin) => {
  //                 return await fetchBinItemsInfo(bin);
  //             }));
  //             setBinsInfo(binsInfoArray);

  //             const binNamesArray: string[] = await Promise.all(bins.map(async (bin) => {
  //               return await fetchBinName(bin);
  //           }));
  //           setBinNames(binNamesArray);

  //         } catch (error) {
  //             console.error("Error fetching bin items info:", error);
  //         }
  //     };

  //     fetchData();
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segmentedControl}
          values={["Bins", "Listings"]}
          selectedIndex={isBinsView ? 0 : 1}
          onChange={(event) => {
            handleIndexChange(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {isBinsView ? (
          <BinScroll
            binsInfo={binsInfo}
            binNames={binNames}
            navigation={navigation}
            itemWidth={itemWidth}
          />
        ) : (
          <ListingScroll navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#fff",
    padding: 10,
    position: "relative",
    alignContent: "center",
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 10,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#d3d3d3",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 7,
    overflow: "hidden",
  },
  segmentedControl: {
    width: 200,
    alignSelf: "center",
    marginBottom: 5,
    // width: 200,
    // fontSize: 14,
    // position: 'absolute',
    // marginBottom: 20,
    // zIndex: 1,
    // left: 70,
  },
  scrollView: {
    flex: 2,
    marginTop: 5,
  },
  segmentContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});

export default FilteredFeed;
