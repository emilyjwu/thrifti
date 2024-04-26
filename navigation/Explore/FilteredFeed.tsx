import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions, Image, ScrollView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAllBins, fetchBinItemsInfo, BinItemInfo, fetchBinName, auth } from "../../database/index";
import IconWithBackground from "../../components/IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { usePostHog } from "posthog-react-native";
import ListingScroll from "../../components/ListingScroll";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BinScroll from "../../components/BinScroll";



interface FilteredFeedProps {
  navigation: NavigationProp<any>;
}

const FilteredFeed: React.FC<FilteredFeedProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 40) / 3;

    const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
    const [binNames, setBinNames] = useState<string[]>([]);
    const [isBinsView, setIsBinsView] = useState(true);
    const currentUser = auth?.currentUser;
    const currentUserID = currentUser?.uid;


  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
  const [binNames, setBinNames] = useState<string[]>([]);
  const [isBinsView, setIsBinsView] = useState(true);
  const posthog = usePostHog();
  const [startTime, setStartTime] = useState(Date.now());
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
          posthog.screen("Filtered Feed Screen", { timeSpent, emailAddr });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  const handleIndexChange = (index: number) => {
    setIsBinsView(index === 0);
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bins = await fetchAllBins();
                const binsInfoArray: BinItemInfo[][] = await Promise.all(bins.map(async (bin) => {
                    // Fetch bin items info
                    let binItems = await fetchBinItemsInfo(bin);
                    // Filter out items where userID matches current auth/uid
                    binItems = binItems.filter(binItem => binItem.userID !== currentUserID);
                    binItems = binItems.filter(binItem => !binItem.sold);
                    return binItems;
                }));

                setBinsInfo(binsInfoArray);

        const binNamesArray: string[] = await Promise.all(
          bins.map(async (bin) => {
            return await fetchBinName(bin);
          })
        );
        setBinNames(binNamesArray);
      } catch (error) {
        console.error("Error fetching bin items info:", error);
      }
    };

    fetchData();
  }, []);

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
          <ListingScroll
            navigation={navigation}
            binItemsInfo={binsInfo.flat()}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#fff",
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
    backgroundColor: "pink",
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
    marginTop: 5,
  },
  scrollView: {
    flex: 2,
    marginTop: 5,
  },
  segmentContainer: {
    alignItems: "center",
  },
});

export default FilteredFeed;
