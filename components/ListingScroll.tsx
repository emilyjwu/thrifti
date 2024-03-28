import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAllBins, fetchBinItemsInfo } from "../database/index";
import { BinItemInfo } from "../database/index";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";

interface ListingScrollProps {
    navigation: NavigationProp<any>;
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 40) / 3;

    const [binItemsInfo, setBinItemsInfo] = useState<BinItemInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bins = await fetchAllBins();
                const binItemsInfoArray: BinItemInfo[][] = await Promise.all(bins.map(async (bin) => {
                    return await fetchBinItemsInfo(bin);
                }));
                const flattenedBinItemsInfo = binItemsInfoArray.flat();
                setBinItemsInfo(flattenedBinItemsInfo);
            } catch (error) {
                console.error("Error fetching bin items info:", error);
            }
        };

        fetchData();
    }, []);

    const renderListing = ({ item }) => {
        const binItemInfo = item;
        return (
            <View style={[styles.itemContainer, { width: itemWidth }]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo })}>
                    <Image
                        source={{ uri: item.imageUri }}
                        style={{
                            width: 115,
                            height: 115,
                            borderRadius: 7,
                        }}
                    />
                </TouchableOpacity>
                {item.imageUri ? null : (
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
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("ListingScroll")}
                      style={styles.buttonGray}>
                      <Text style={styles.buttonGrayText}>
                        Listings
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("ExploreFeed")}
                      style={styles.button}>
                      <Text style={styles.buttonText}>
                        Bins
                      </Text>
                    </TouchableOpacity>
              </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={binItemsInfo}
                    renderItem={renderListing}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.flatList}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 9,
        flexDirection: 'column',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        marginRight: 0
    },
    itemContainer: {
        marginBottom: 7,
        marginRight: 7,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    contentContainer: {
        flex: 1,
    },
    flatList: {
        alignItems: 'flex-start',
    },
    button: {
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginRight: 10
      },
      buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
      marginLeft: 0, // Adjusted to move buttons left
      marginRight: 10
    },
    buttonGray: {
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: 'gray', // Set border color to gray
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // Keep background transparent
        marginRight: 10
      },
      buttonGrayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'gray', // Set text color to gray
      },
});

export default ListingScroll;



