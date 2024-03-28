import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { usePostHog } from "posthog-react-native";

interface ExpandBinProps {
  navigation: NavigationProp<any>;
  route: any;
}

const ExpandBin: React.FC<ExpandBinProps> = ({ navigation, route }) => {
  const { binItems, binName } = route.params;
  const [loadingIndices, setLoadingIndices] = useState<number[]>([]); // State to track loading indices

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("EXPANDED_BIN");
  }, []);

  useEffect(() => {
    // Reset loading state when component unmounts
    return () => setLoadingIndices([]);
  }, []);

  const renderListing = ({ item, index }) => {
    const isLoading = loadingIndices.includes(index);

    return (
      <View style={styles.itemContainer}>
        {isLoading && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        )}
        <TouchableOpacity onPress={() => {
          navigation.navigate("Listing", { imageUri: item.imageUri, binItemInfo: item });
        }}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.image}
            resizeMode="cover"
            onLoadStart={() => setLoadingIndices(prevIndices => [...prevIndices, index])} // Set loading state when image starts loading
            onLoadEnd={() => setLoadingIndices(prevIndices => prevIndices.filter(idx => idx !== index))} // Remove loading state when image is loaded
          />
        </TouchableOpacity>
        {!item.imageUri && (
          <View>
            <IconWithBackground
              width={200}
              height={200}
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
      <View style={styles.topBar}>
        <Text style={styles.title}>{binName}</Text>
      </View>
      <FlatList
        data={binItems}
        renderItem={renderListing}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    marginBottom: 10,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 7
  },
  loadingIndicator: {
    marginBottom: 10, // Adjust spacing between loading indicators and images
  },
});

export default ExpandBin;
