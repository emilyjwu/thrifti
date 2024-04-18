import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchBinItemsInfo } from '../../database';
import { ScrollView } from 'react-native-gesture-handler';

interface ChatProps {
  navigation: NavigationProp<any>;
  route: any;
}

const Chats: React.FC<ChatProps> = ({ navigation, route }) => {
    const {chatData} = route.params;
    const { userInfo, date } = chatData;
    const { displayName, imageUri, listingName, photoURL, binID } = userInfo;

    const handleArrow = () => {
        const listingInfo = fetchBinItemsInfo(binID)
        navigation.navigate("Listing", { imageUri: imageUri, binItemInfo: listingInfo})
    };

  return (
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.banner}>
                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 7,
                            marginRight: 10,
                        }}
                    />
                <View style={styles.textContainer}>
                            <Text style={styles.title}>{listingName}</Text>
                            <TouchableOpacity style={styles.makeOfferButton} onPress={handleArrow}>
                                <Text style={styles.makeOfferButtonText}> Make Offer</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                <TouchableOpacity style={styles.arrow} onPress={handleArrow}>
                        <Icon name="angle-right" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingLeft: 0,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 0,
    marginBottom: 4,
  },
  makeOfferButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 5,
  },
  makeOfferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  arrow:{
    paddingBottom: 30,
    marginLeft: 'auto',
    marginTop: -10,
    marginRight: 10,
  }
});

export default Chats;