import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import IconWithBackground from '../../components/IconWithBackground';
import EntypoIcon from "react-native-vector-icons/Entypo";
import { getChats } from '../../database/messaging';
import {auth} from '../../database/index';

// import { format } from "date-fns";


interface MessageScreenProps {
  navigation: NavigationProp<any>;
}


const MessageScreen: React.FC<MessageScreenProps> = ({ navigation }) => {
  const [clicked, setClicked] = useState<string | null>(null);

  const messages = [
    { id: '1', username: 'Jane Doe', listingName: 'Denim Vest', message: 'Is this still available?' },
    { id: '2', username: 'John Doe', listingName: 'Leather Jacket', message: 'Can I get it by tomorrow?' },
    { id: '3', username: 'Buzz', listingName: 'Pom Poms', message: 'Need it now!!' },
  ];

  // const [chats, setChats] = useState<ChatData[]>([]); // Specify the type of chats state
  const [chatData, setChats] = useState([]);
  const [info, setInfo] = useState<[]>([]);

  const handlePress = (chat) => {
    setClicked(chat);
    console.log(chat)

    console.log("date", chat.date)
    // console.log("chat2",  { chatData: chat })

    navigation.navigate('Chat', { chatId: chat.id, chatData: chat, chatTitle: 'Chat Title'});
  };

  const currentUser = auth?.currentUser;
  // console.log(currentUser)
  // const listingName = data?.vkozCM2e4XQA7QVXdrNOoi1HXr02?.userInfo?.listingName;


  const formatDate = (date) => {
    const currentDate = new Date();
    const messageDate = new Date(date);
    const isToday = currentDate.toDateString() === messageDate.toDateString();
    // console.log(date.toDateString())
    let formattedDate;
    if (isToday) {
      formattedDate = 'Today';
    } else {
      const options = { month: 'long', day: 'numeric' };
      formattedDate = messageDate.toLocaleDateString();
    }
    return formattedDate;
  }







useEffect(() => {
  const fetchData = async () => {
    try {
      const chatData = await getChats(currentUser);
      console.log(chatData);

      if (chatData) {
        const chatArray = Object.keys(chatData).map((key) => ({
          id: key,
          date: chatData[key]?.date,
          lastMessage: chatData[key]?.lastMessage?.text || '',
          userInfo: chatData[key]?.userInfo,
          displayName: chatData[key]?.userInfo?.displayName,
          imageUri: chatData[key]?.userInfo?.imageUri,
          listingName: chatData[key]?.userInfo?.listingName,
          photoURL: chatData[key]?.userInfo?.photoURL,
          binID: chatData[key]?.userInfo?.binID,
          userId: chatData[key]?.userInfo?.uid,
        }));
        // Sort the array by date in descending order
        const sortedChats = chatArray.sort((a, b) => b.date - a.date);
        setChats(sortedChats);
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  currentUser && fetchData(); // Fetch data if currentUser is available
}, [currentUser]);


  return (
    <View style={styles.container}>
      {chatData.map((chat) => (
        <TouchableOpacity
          style={styles.messageContainer}
          key={chat.id}
          onPress={() => handlePress(chat)}
          activeOpacity={0.7}
        >
          <View style={styles.circle}></View>
          <View style={styles.userInfoText}>
            <Text style={styles.username}>{chat.userInfo.displayName}</Text>
            <Text numberOfLines={1} style={styles.message}>{chat.lastMessage}</Text>
            <Text style={styles.time}>{formatDate(chat.date)}</Text>
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
