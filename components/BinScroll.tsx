import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";

const BinScroll= ({ binsInfo, binNames, navigation, itemWidth }) => {
    return (
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
                                            {item.imageUri ? (
                                                <Image
                                                    source={{ uri: item.imageUri }}
                                                    style={{
                                                        width: 115,
                                                        height: 115,
                                                        borderRadius: 7
                                                    }}
                                                />
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
    );
};

const styles = StyleSheet.create({
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
    }
});

export default BinScroll;