import React, { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, Dimensions, Image, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { AuthContext, BinItemInfo } from "../database/index";
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
    userID?: string,
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation, binItemsInfo, userID }) => {
    const { currentUserID } = useContext(AuthContext);
    const isCurrentUser = currentUserID === userID;
    const renderListing = ({ item , index}) => {
        const isLastInRow = (index + 1) % numColumns === 0;
        const marginRight = isLastInRow ? 0 : totalMarginSpace;

        return (
            <View style={[styles.itemContainer, { width: itemWidth, marginRight }]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo: item })}>
                    {item.imageUri ? (
                        <View style={styles.imageContainer}>
                        <Image source={{ uri: item.imageUri }} style={styles.image}/>
                        {(item.sold || (item.boosted && isCurrentUser)) && (
                            <>
                                {item.sold ? (
                                    <>
                                        <View style={styles.imageOverlay}/>
                                        <Text style={styles.soldText}>SOLD</Text>
                                    </>
                                ) : (
                                    <EntypoIcon style={styles.boostedIcon} name="flash" size={24} color="white" />
                                )}
                            </>
                        )}
                        </View>
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
    imageContainer: {
        position: "relative",
        aspectRatio: 1,
        width: itemWidth,
        height: itemWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "cover",
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    soldText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        position: "absolute",
    },
    boostedIcon: {
        position: "absolute",
    },
    itemContainer: {
        marginBottom: 7,
        alignItems: 'flex-start',
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