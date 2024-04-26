import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  BinItemInfo,
  fetchAllBins,
  fetchBinItemsInfo,
  fetchBinName,
} from "../../database";
import { usePostHog } from "posthog-react-native";

interface MixedFeedProps {
  navigation: NavigationProp<any>;
}

interface DataEntry {
  id: string;
  type: number;
  binItems: BinItemInfo[];
}

interface ListingSquareProps {
  imageUri: string;
  binItemInfo: BinItemInfo;
  marginBottom?: boolean;
}

interface BinSquareProps {
  imageUri: string;
  binItemInfo: BinItemInfo;
  isLeftBin: boolean;
}

const ListingSquare: React.FC<ListingSquareProps> = ({
  imageUri,
  binItemInfo,
  marginBottom = false,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Listing", { imageUri, binItemInfo });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        style={[styles.listingSquare, marginBottom && { marginBottom: 5 }]}
        source={{ uri: imageUri }}
      />
    </TouchableOpacity>
  );
};

const BinSquare: React.FC<BinSquareProps> = ({
  imageUri,
  binItemInfo,
  isLeftBin,
}) => {
  const navigation = useNavigation();
  const [binName, setBinName] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBinName = await fetchBinName(binItemInfo.binID);
        setBinName(fetchedBinName);
      } catch (error) {
        console.error("Error fetching bin name: ", error);
      }
    };

    fetchData();
  }, [binItemInfo.binID]);

  const handlePress = async () => {
    try {
      const binItems = await fetchBinItemsInfo(binItemInfo.binID);
      navigation.navigate("ExpandBin", { binItems, binName });
    } catch (error) {
      console.error("Error fetching bin items: ", error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.binContainer}>
        <Image style={[styles.binImage]} source={{ uri: imageUri }} />
        <View style={[styles.binOverlay]} />
        <Text
          style={[
            styles.binTitle,
            isLeftBin && { left: 10 },
            !isLeftBin && { right: 10 },
          ]}
        >
          {binName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ListingRow = ({ item }: { item: DataEntry }) => {
  if (item.binItems.length < 3) {
    return null;
  }

  return (
    <View style={styles.type1}>
      <ListingSquare
        imageUri={item.binItems[0].imageUri}
        binItemInfo={item.binItems[0]}
      />
      <ListingSquare
        imageUri={item.binItems[1].imageUri}
        binItemInfo={item.binItems[1]}
      />
      <ListingSquare
        imageUri={item.binItems[2].imageUri}
        binItemInfo={item.binItems[2]}
      />
    </View>
  );
};

const BinListingRow = ({ item }: { item: DataEntry }) => {
  if (item.binItems.length < 3) {
    return null;
  }

  return (
    <View style={styles.type2}>
      <BinSquare
        imageUri={item.binItems[0].imageUri}
        binItemInfo={item.binItems[0]}
        isLeftBin={true}
      />
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <ListingSquare
          imageUri={item.binItems[1].imageUri}
          binItemInfo={item.binItems[1]}
          marginBottom
        />
        <ListingSquare
          imageUri={item.binItems[2].imageUri}
          binItemInfo={item.binItems[2]}
        />
      </View>
    </View>
  );
};

const ListingBinRow = ({ item }: { item: DataEntry }) => {
  if (item.binItems.length < 3) {
    return null;
  }

  return (
    <View style={styles.type2}>
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <ListingSquare
          imageUri={item.binItems[0].imageUri}
          binItemInfo={item.binItems[0]}
          marginBottom
        />
        <ListingSquare
          imageUri={item.binItems[1].imageUri}
          binItemInfo={item.binItems[1]}
        />
      </View>
      <BinSquare
        imageUri={item.binItems[2].imageUri}
        binItemInfo={item.binItems[2]}
        isLeftBin={false}
      />
    </View>
  );
};

const renderItem = ({ item }: { item: DataEntry }) => {
  switch (item.type) {
    case 0:
      return <ListingRow item={item} />;
    case 1:
      return <BinListingRow item={item} />;
    case 2:
      return <ListingRow item={item} />;
    case 3:
      return <ListingBinRow item={item} />;
    default:
      return null;
  }
};

const MixedFeed: React.FC<MixedFeedProps> = ({ navigation }) => {
  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
  const [data, setData] = useState<DataEntry[]>([]);

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("MIXED_FEED");
  }, []);

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
      } catch (error) {
        console.error("Error fetching bin items info:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newData = [];
    let currentType = 0;
    binsInfo.forEach((binItems, index) => {
      let j = 0;
      while (j < binItems.length) {
        const binItemsSlice = binItems.slice(j, j + 3);
        if (binItemsSlice.length === 3) {
          const dataEntry = {
            id: `${index}-${j / 3}`,
            type: currentType,
            binItems: binItemsSlice,
          };
          newData.push(dataEntry);
          currentType = (currentType + 1) % 4;
        }
        j += 3;
      }
    });
    setData(newData);
  }, [binsInfo]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  listingSquare: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  binContainer: {
    position: "relative",
  },
  binImage: {
    width: 246,
    height: 246,
    borderRadius: 10,
    resizeMode: "cover",
  },
  binOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  binTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    bottom: 10,
  },
  type1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  type2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});

export default MixedFeed;
