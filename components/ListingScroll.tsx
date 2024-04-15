import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAllBins, fetchBinItemsInfo } from "../database/index";
import { BinItemInfo } from "../database/index";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { usePostHog } from "posthog-react-native";


const windowWidth = Dimensions.get('window').width;
const numColumns = 3;
const marginHorizontal = 6 * (numColumns - 1);
// const itemWidth = (windowWidth - marginHorizontal) / numColumns;
const itemWidth = (windowWidth - marginHorizontal) / numColumns - (marginHorizontal / numColumns);
const totalMarginSpace = marginHorizontal / numColumns;
const spacing = windowWidth - (itemWidth * 3) / 2

interface ListingScrollProps {
    navigation: NavigationProp<any>;
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation }) => {


    const [binItemsInfo, setBinItemsInfo] = useState<BinItemInfo[]>([]);


    const posthog = usePostHog();




    useEffect(() => {
      posthog.capture("CHANGED_FILTER_TO_LISTINGSCROLL");
    }, []);

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
            <View style={[styles.itemContainer, { width: itemWidth}]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo })}>
                    <Image
                        source={{ uri: item.imageUri }}
                        style={{
                            width: itemWidth,
                            height: itemWidth,
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
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    itemContainer: {
        marginBottom: 7,
        alignItems: 'flex-start',
        paddingLeft: 0, // Ensure no padding on the left side
    },
    contentContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    flatList: {
        alignItems: 'flex-start',
    },
});

export default ListingScroll;



