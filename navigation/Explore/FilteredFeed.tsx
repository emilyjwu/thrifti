import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions, Image, ScrollView} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAllBins, fetchBinItemsInfo, BinItemInfo, fetchBinName } from "../../database/index";
import IconWithBackground from "../../components/IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { usePostHog } from "posthog-react-native";
import ListingScroll from '../../components/ListingScroll';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface FilteredFeedProps {
    navigation: NavigationProp<any>;
}

const FilteredFeed: React.FC<FilteredFeedProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 40) / 3;

    const [binsInfo, setBinsInfo] = useState<BinItemInfo[][]>([]);
    const [binNames, setBinNames] = useState<string[]>([]);
    const[isBinsView, setIsBinsView] = useState(true);

    const posthog = usePostHog();

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
                const [storedBinsInfo, storedBinNames] = await Promise.all([
                    AsyncStorage.getItem('binsInfo'),
                    AsyncStorage.getItem('binNames')
                ]);

                if (storedBinsInfo && storedBinNames) {
                    setBinsInfo(JSON.parse(storedBinsInfo));
                    setBinNames(JSON.parse(storedBinNames));
                } else {
                    const bins = await fetchAllBins();
                    const binsInfoArray: BinItemInfo[][] = await Promise.all(bins.map(async (bin) => {
                        return await fetchBinItemsInfo(bin);
                    }));
                    setBinsInfo(binsInfoArray);

                    const binNamesArray: string[] = await Promise.all(bins.map(async (bin) => {
                        return await fetchBinName(bin);
                    }));
                    setBinNames(binNamesArray);

                    // Store data in local storage
                    AsyncStorage.setItem('binsInfo', JSON.stringify(binsInfoArray));
                    AsyncStorage.setItem('binNames', JSON.stringify(binNamesArray));
                }
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
        <View style={styles.segmentContainer} >
            <SegmentedControl
                style={styles.segmentedControl}
                values={['Bins', 'Listings']}
                selectedIndex={isBinsView ? 0 : 1}
                onChange={(event) => {
                    handleIndexChange(event.nativeEvent.selectedSegmentIndex);
                }}

            />
        </View>
        <ScrollView style={styles.scrollView}>
                {isBinsView ? (
                    binsInfo.map((binItems, index) => (
                        <View key={index}>
                            {binItems.length !== 0 ? (
                                <View>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>{binNames[index]}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate("ExpandBin", { binItems, binName: binNames[index] })} style={styles.contentContainer}>
                                        <FlatList
                                            horizontal
                                            data={binItems}
                                            renderItem={({ item }) => (
                                                <View style={[styles.itemContainer, { width: itemWidth }]}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo: item })}>
                                                        {item.imageUri && (
                                                            <Image
                                                                source={{ uri: item.imageUri }}
                                                                style={{
                                                                    width: 115,
                                                                    height: 115,
                                                                    borderRadius: 7
                                                                }}
                                                            />
                                                        )}
                                                        {!item.imageUri && (
                                                            <IconWithBackground
                                                                width={115}
                                                                height={115}
                                                                iconSize={60}
                                                                iconColor="#000"
                                                                iconComponent={EntypoIcon}
                                                                iconName="image"
                                                                backgroundColor="#eBeBeB"
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            keyExtractor={(item, index) => item.id.toString()}
                                            pagingEnabled={true}
                                            style={{ marginTop: 10, paddingLeft: 5 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                    ))
                ) : (
                    <ListingScroll  navigation={navigation}/>
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
        position: 'relative',
        alignContent: 'center'

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 0,
        marginRight: 0
    },
    itemContainer: {
        marginBottom: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginTop: 10,
        flex: 1
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#d3d3d3',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 5,
        borderRadius: 7,
        overflow: 'hidden',

    },
    segmentedControl: {
        width: 200,
        fontSize: 14,
        position: 'absolute',
        marginBottom: 20,
        zIndex: 1,
        left: 70
    },
    scrollView: {
        flex: 1,
        marginTop: 20,
    },
    segmentContainer: {
        alignItems: 'center',
        marginBottom: 20,
    }

});

export default FilteredFeed;
