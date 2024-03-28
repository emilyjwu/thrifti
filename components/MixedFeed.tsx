import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BinItemInfo, fetchAllBins, fetchBinItemsInfo } from '../database';

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

const ListingSquare: React.FC<ListingSquareProps> = ({ imageUri, binItemInfo, marginBottom = false }) => {
    const navigation = useNavigation();

    const handlePress = () => {
      navigation.navigate('Listing', { imageUri, binItemInfo });
    };
  
    return (
      <TouchableOpacity onPress={handlePress}>
        <Image style={[styles.listingSquare, marginBottom && { marginBottom: 5 }]}
               source= {{ uri: imageUri }}
        />
      </TouchableOpacity>
    );
};

const BinSquare = ({ marginLeft = false, marginRight = false }) => {
    const navigation = useNavigation();
    const handlePress = () => {
      navigation.navigate('Listing', { imageUri, binItemInfo });
    };
  
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ExpandBin')}>
        <View style={[
          styles.binSquare,
          marginLeft && { marginLeft: 5 },
          marginRight && { marginRight: 5 }
        ]} />
      </TouchableOpacity>
    );
};

  const ListingRow = ({ item }: { item: DataEntry }) => {
    if (item.binItems.length < 3) {
      return null; 
    }
  
    return (
      <View style={styles.type1}>
        <ListingSquare imageUri={item.binItems[0].imageUri} binItemInfo={item.binItems[0]} />
        <ListingSquare imageUri={item.binItems[1].imageUri} binItemInfo={item.binItems[1]} />
        <ListingSquare imageUri={item.binItems[2].imageUri} binItemInfo={item.binItems[2]} />
      </View>
    );
  };

  const BinListingRow = ({ item }: { item: DataEntry }) => {
    if (item.binItems.length < 3) {
      return null; 
    }
    return (
      <View style={styles.type2}>
      <BinSquare marginRight />
      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <ListingSquare imageUri={item.binItems[1].imageUri} binItemInfo={item.binItems[1]} marginBottom/>
          <ListingSquare imageUri={item.binItems[2].imageUri} binItemInfo={item.binItems[2]} />
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
      <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <ListingSquare imageUri={item.binItems[0].imageUri} binItemInfo={item.binItems[0]} marginBottom/>
          <ListingSquare imageUri={item.binItems[1].imageUri} binItemInfo={item.binItems[1]} />
      </View>
      <BinSquare marginLeft />
    </View>
    );
  };

const renderItem = ({ item }: { item: DataEntry }) => {
  switch (item.type) {
    case 1:
      return <ListingRow item={item} />;
    case 2:
      return <BinListingRow item={item} />;
    case 3:
      return <ListingRow item={item} />;
    case 4:
      return <ListingBinRow item={item} />;
    default:
      return null;
  }
};

const MixedFeed: React.FC<MixedFeedProps> = ({ navigation }) => {
  const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
  const [currentType, setCurrentType] = useState<number>(1);
  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const bins = await fetchAllBins();
            const binsInfoArray: BinItemInfo[][] = await Promise.all(bins.map(async (bin) => {
                return await fetchBinItemsInfo(bin);
            }));
            setBinsInfo(binsInfoArray);
        } catch (error) {
            console.error("Error fetching bin items info:", error);
        }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newData = [];
    let currentType = 1;
    binsInfo.forEach((binItems, index) => {
      let j = 0;
      while (j < binItems.length) {
        const dataEntry = {
          id: `${index}-${j / 3}`,
          type: currentType,
          binItems: binItems.slice(j, j + 3),
        };
        newData.push(dataEntry);
        currentType = (currentType + 1) % 5; 
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
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 9,
  },
  listingSquare: {
    backgroundColor: 'lightblue',
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  binSquare: {
    backgroundColor: 'blue',
    width: 246,
    height: 246,
    borderRadius: 10,
  },
  type1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  type2: {
    flexDirection: 'row',
    marginBottom: 5,
  },
});

export default MixedFeed;