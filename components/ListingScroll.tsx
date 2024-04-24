import React from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BinItemInfo } from "../database/index";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";

const windowWidth = Dimensions.get('window').width;
const numColumns = 3;
const marginHorizontal = 5 * (numColumns - 1);
const itemWidth = (windowWidth - 20 * (numColumns - 1)) / numColumns;
const totalMarginSpace = marginHorizontal / numColumns;

interface ListingScrollProps {
    navigation: NavigationProp<any>;
    binItemsInfo: BinItemInfo[]; 
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation, binItemsInfo }) => {
    const renderListing = ({ item , index}) => {
        const isLastInRow = (index + 1) % numColumns === 0;
        const marginRight = isLastInRow ? 0 : totalMarginSpace;

        return (
            <View style={[styles.itemContainer, { width: itemWidth, marginRight }]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo: item })}>
                    {item.imageUri ? (
                        <Image
                            source={{ uri: item.imageUri }}
                            style={{
                                width: itemWidth,
                                height: itemWidth,
                                borderRadius: 7,
                            }}
                        />
                    ) : (
                        <View style={styles.itemContainer}>
                            <IconWithBackground
                                width={itemWidth}
                                height={itemWidth}
                                iconSize={60}
                                iconColor="#000"
                                iconComponent={EntypoIcon}
                                iconName="image"
                                backgroundColor="#eBeBeB"
                            />
                        </View>
                    )}
                 </TouchableOpacity>
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
        paddingLeft: 0, 
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