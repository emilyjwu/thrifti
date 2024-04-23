import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import IconWithBackground from '../../components/IconWithBackground';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { getChats } from '../../database/messaging';
import {auth} from '../../database/index';



interface MessageScreenProps {
  navigation: NavigationProp<any>;
}


const MessageScreen: React.FC<MessageScreenProps> = ({ navigation }) => {
  const [clicked, setClicked] = useState<string | null>(null);

  const [chatData, setChats] = useState([]);
  const [info, setInfo] = useState<[]>([]);

  const handlePress = (chat) => {
    setClicked(chat);
    // console.log(chat)


    navigation.navigate('Chat', { chatId: chat.id, chatData: chat});
  };

  const currentUser = auth?.currentUser;



  const formatDate = (chat) => {

    const messageDate = chat.date.toDate();
    const formattedDate = `${messageDate.toDateString()} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return formattedDate;

  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatData = await getChats(currentUser);

        if (chatData) {
          const chatArray = Object.keys(chatData).map((key) => ({
            id: key,
            date: chatData[key]?.date,
            lastMessage: chatData[key]?.lastMessage?.text || '',
            userInfo: chatData[key]?.userInfo,
            displayName: chatData[key]?.userInfo?.displayName,
            imageUri: chatData[key]?.userInfo?.imageUri,
            listingName: chatData[key]?.userInfo?.listingName,
            listingId: chatData[key]?.userInfo?.listingId,
            photoURL: chatData[key]?.userInfo?.photoURL,
            binId: chatData[key]?.userInfo?.binId,
            userId: chatData[key]?.userInfo?.uid,
            seller: chatData[key]?.userInfo?.seller,

          }));
          // Sort the array by date in descending order
          const sortedChats = chatArray.sort((a, b) => (b.date || 0) - (a.date || 0));
          setChats(sortedChats);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentUser]);


  return (
    <View style={styles.container}>
      {chatData.map((chat) => (
       <TouchableOpacity
          style={[styles.messageContainer, clicked === chat.id && styles.clickedContainer]}
          key={chat.id}
          onPress={() => handlePress(chat)}
          activeOpacity={0.7}
        >
          <View style={styles.circle}></View>
          <View style={styles.userInfoText}>
            <Text style={styles.username}>{chat.userInfo.displayName}</Text>
            <Text numberOfLines={1} style={styles.message}>{chat.lastMessage}</Text>
            <Text style={styles.time}>{formatDate(chat)}</Text>
            {/* <Text style={styles.time}>Today</Text> */}
          </View>
          {chat.imageUri ? (
            <Image
              source={{ uri: chat.imageUri }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 7
            }}
            />
          ) : (
            <View>
              <IconWithBackground
                width={80}
                height={80}
                iconSize={40}
                iconColor="#000"
                iconComponent={EntypoIcon}
                iconName="image"
                backgroundColor="#eBeBeB"
              />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    width: '100%',
    height: 90,
    backgroundColor: '#d3d3d3',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    backgroundColor: 'gray',
    marginLeft: -5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 0,
    marginBottom: 4,
  },
  userInfoText: {
    flexDirection: 'column',
    marginLeft: 7,
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    overflow: 'hidden',
  },
  time: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  clickedContainer: {
    opacity: 0.5,
  },
});

export default MessageScreen;
