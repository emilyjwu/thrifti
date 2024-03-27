import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";

interface ListingScrollProps {
    navigation: NavigationProp<any>;
}

const ListingScroll: React.FC<ListingScrollProps> = ({ navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 40) / 3;

    const renderListing = ({binData}) => {
        return (
            <View style={[styles.itemContainer, { width: itemWidth }]}>
                <TouchableOpacity onPress={() => navigation.navigate("Listing")}>
                    <IconWithBackground
                        width={115}
                        height={115}
                        iconSize={60}
                        iconColor="#000"
                        iconComponent={EntypoIcon}
                        iconName="image"
                        backgroundColor="#eBeBeB"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const data = Array.from(Array(100).keys());

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={data}
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
