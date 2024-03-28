import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions, Image } from 'react-native'; // Import Image component
import { NavigationProp } from '@react-navigation/native';
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { fetchAllBins, fetchBinItems, fetchImageRefFromItem, getImage} from "../database/index"; // Import fetchImageRefFromItem function
import { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';


interface ListingScrollProps {
    navigation: NavigationProp<any>;
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 40) / 3;
    //call fetch all bins --> fetch all bin items --> fetch item refs --> fetch image uris
    const bins = fetchAllBins();
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [imageRef, setItemRefs] = useState<string[]>([]);
    const [binItems, setBinItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchItemRefs = async () => {
            try {
                const bins = await fetchAllBins();
                const itemRefsPromises = bins.map(async (bin) => {
                    const binItems = await fetchBinItems(bin);
                    setBinItems(binItems)
                    const binItemRefs = await Promise.all(binItems.map(fetchImageRefFromItem));
                    return binItemRefs;
                });
                const itemRefsArray = await Promise.all(itemRefsPromises);
                const flattenedItemRefs = itemRefsArray.flat();
                setItemRefs(flattenedItemRefs);
                // console.log("Item References:", flattenedItemRefs);
                Array.from(flattenedItemRefs)
                const urlsPromises = flattenedItemRefs.map(async (itemRef) => {
                    const url = await getImage(itemRef);
                    return url;
                });
                const urls = await Promise.all(urlsPromises);
                setImageUris(urls);
                // console.log("Image URLs:", urls);

            } catch (error) {
                console.error("Error fetching item references:", error);
            }
        };

        fetchItemRefs();
    }, []);


    const renderListing = ({ item: imageUri, index}) => {
        return (
            <View style={[styles.itemContainer, { width: itemWidth }]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri})}>
                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: 115,
                            height: 115,
                        }}
                    />
                </TouchableOpacity>
                {imageUri ? (
                    null
                ) : (
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
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={imageUris}
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
        justifyContent: 'space-between'
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
});

export default ListingScroll;

