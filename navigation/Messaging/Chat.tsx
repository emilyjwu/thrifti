import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface ChatProps {
  navigation: NavigationProp<any>;
  route: any;
}

const Chats: React.FC<ChatProps> = ({ navigation, route }) => {
    const {chatData} = route.params;
    const { userInfo, date } = chatData;
    const { displayName, imageUri, listingName, photoURL } = userInfo;

  return (
    <View style={styles.container}>
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
          <Text style={styles.title}>{listingName}</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    // flex: 1,
    // backgroundColor: '#fff',
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Align items in the center vertically
    paddingHorizontal: 20, // Add horizontal padding for spacing
    paddingVertical: 10, // Add vertical padding for spacing
    backgroundColor: '#f0f0f0', // Example background color
    borderRadius: 7, // Example border radius
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 0,
    marginBottom: 4,
  },
});

export default Chats;