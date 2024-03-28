// import {StyleSheet, Text, TouchableOpacityComponent, View, FlatList, Image, ActivityIndicator} from 'react-native'
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation, NavigationProp} from "@react-navigation/native";
// import IconWithBackground from "./IconWithBackground";
// import EntypoIcon from "react-native-vector-icons/Entypo";
// import ExploreScreen from "../navigation/Explore/ExploreScreen"
// import React, { Component, useEffect, useState } from 'react';
// interface ExpandBinProps {
//   navigation: NavigationProp<any>;
//   route: any;
// }

// const ExpandBin: React.FC<ExpandBinProps> = ({ navigation, route }) => {
//   // const imgURLs = ExploreScreen.fetchURLs();
//   const {binItems} = route.params;
//   const [loading, setLoading] = useState(true);
//   // console.log(binItems)


//   const renderListing = ({item}) => {
//     console.log(item)
//     return (
//       <View style={styles.itemContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate("Listing", {imageUri: item.imageUri, item})}>
//         {loading ? (
//             <ActivityIndicator size="large" color="#0000ff" />
//           ) : (
//             <Image
//               source={{ uri: item.imageUri }}
//               style={{
//                 width: 170,
//                           height: 170,
//                       }}
//               resizeMode="cover"
//               onLoadEnd={() => setLoading(false)} // Set loading state to false once image is loaded
//             />
//           )}
//               {/* <Image
//                   source={{ uri: item.imageUri }}
//                   style={{
//                   width: 170,
//                             height: 170,
//                         }}
//                     /> */}
//           </TouchableOpacity>
//           {item.imageUri ? null : (
//                     <View>
//                        <IconWithBackground
//                         width={200}
//                         height={200}
//                         iconSize={60}
//                         iconColor="#000"
//                         iconComponent={EntypoIcon}
//                         iconName="image"
//                         backgroundColor="#eBeBeB"
//                     />
//                     </View>
//                 )}
//       </View>
//     );
//   };


//   return (
//     <View style={styles.container}>
//       <View style={styles.topBar}>
//         <Text style={styles.title}>Bin Name</Text>
//       </View>
//       <FlatList
//         data={binItems}
//         renderItem={renderListing}
//         keyExtractor={(item, index) => index.toString()}
//         numColumns={2}
//       />
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   topBar: {
//     justifyContent: 'center',
//     padding: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: {
//     marginTop: 10,
//     marginRight: 5,
//     marginBottom: 5,
//     fontSize: 25,
//     fontWeight: 'bold',
//   },
//   flatList: {
//     paddingLeft: 15,
//     paddingRight: 15,

//   },
//   itemContainer: {
//     flex: 1,
//     marginBottom: 10,
//     marginRight: 5,
//     marginLeft: 5,
//     marginTop: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default ExpandBin;

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import IconWithBackground from "./IconWithBackground";
import EntypoIcon from "react-native-vector-icons/Entypo";

interface ExpandBinProps {
  navigation: NavigationProp<any>;
  route: any;
}

const ExpandBin: React.FC<ExpandBinProps> = ({ navigation, route }) => {
  const { binItems } = route.params;
  const [loadingIndices, setLoadingIndices] = useState<number[]>([]); // State to track loading indices

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
        <TouchableOpacity onPress={() => navigation.navigate("Listing", { imageUri: item.imageUri, item })}>
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
        <Text style={styles.title}>Bin Name</Text>
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
  },
  loadingIndicator: {
    marginBottom: 10, // Adjust spacing between loading indicators and images
  },
});

export default ExpandBin;
