import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
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

  const messages = [
    { id: '1', username: 'Jane Doe', listingName: 'Denim Vest', message: 'Is this still available?' },
    { id: '2', username: 'John Doe', listingName: 'Leather Jacket', message: 'Can I get it by tomorrow?' },
    { id: '3', username: 'Buzz', listingName: 'Pom Poms', message: 'Need it now!!' },
  ];

  // const [chats, setChats] = useState<ChatData[]>([]); // Specify the type of chats state
  const [chatData, setChats] = useState([]);
  const [info, setInfo] = useState<[]>([]);

  const handlePress = (id: string) => {
    setClicked(id);
    navigation.navigate('Chat');
  };

  const currentUser = auth?.currentUser;
  // console.log(currentUser)
  // const listingName = data?.vkozCM2e4XQA7QVXdrNOoi1HXr02?.userInfo?.listingName;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatData = await getChats(currentUser);

        setChats(chatData);
        const keys = Object.keys(chatData);
        console.log(chatData)
        // console.log(keys)
        // console.log(chatData)
        // console.log(chatData[keys[0]].userInfo)

      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    currentUser && fetchData(); // Fetch data if currentUser is available
  }, [currentUser]);


  return (
    <View style={styles.container}>
    {Object.entries(chatData)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
      <TouchableOpacity
        style={styles.messageContainer}
        key={chat[0]}
        // onPress={() => handleSelect(chat[1].userInfo)}
        activeOpacity={0.7}
      >
        <View style={styles.circle}></View>
        <View style={styles.userInfoText}>
          <Text style={styles.username}>{chat[1].userInfo.displayName}</Text>
          <Text numberOfLines={1} style={styles.message}>Testing</Text>
          <Text style={styles.time}>Today</Text>
        </View>
        {chat[1].imageUri ? (
          <Image
            source={{ uri: chat[1].imageUri }}
            style={{
              width: 115,
              height: 115,
              borderRadius: 7
          }}
          />
        ) : (
          <View >
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
    // <View style={styles.container}>
    //   {Object.entries(chatData)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
    //     <TouchableOpacity
    //       style={styles.userChat}
    //       key={chat[0]}
    //       // onPress={() => handleSelect(chat[1].userInfo)}
    //     >
    //       <Image source={{ uri: chat[1].userInfo.photoURL }} style={styles.userChatImage} />
    //       <View style={styles.userChatInfo}>
    //         <Text style={styles.username}>{chat[1].userInfo.displayName}</Text>
    //         <Text>{chat[1].lastMessage?.text}</Text>
    //       </View>
    //     </TouchableOpacity>
    //   ))}
    // </View>

  //   <View style={styles.container}>
  //   <FlatList
  //     data={chatData}
  //     keyExtractor={(item) => item.id}
  //     renderItem={({ item }) => (
  //       <TouchableOpacity onPress={() => handlePress(item.id)} activeOpacity={0.7}>
  //         <View style={[styles.messageContainer, clicked === item.id && styles.clickedContainer]}>
  //           <View style={styles.circle}></View>
  //           <View style={styles.userInfoText}>
  //             <Text style={styles.username}>{item.displayName}</Text>
  //             <Text numberOfLines={1} style={styles.message}>Testing</Text>
  //             <Text style={styles.time}>Today</Text>
  //           </View>
  //           {item.imageUri ? (
  //             <Image
  //               source={{ uri: item.imageUri }}
  //               style={{ width: 80, height: 80, borderRadius: 40 }}
  //             />
  //           ) : (
  //             <IconWithBackground
  //               width={80}
  //               height={80}
  //               iconSize={40}
  //               iconColor="#000"
  //               iconComponent={EntypoIcon}
  //               iconName="image"
  //               backgroundColor="#eBeBeB"
  //             />
  //           )}
  //         </View>
  //       </TouchableOpacity>
  //     )}
  //     style={{ marginTop: 10, marginBottom: 10 }}
  //   />
  // </View>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   userChat: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   userChatImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   userChatInfo: {
//     flex: 1,
//   },
//   username: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
// });


export default MessageScreen;
