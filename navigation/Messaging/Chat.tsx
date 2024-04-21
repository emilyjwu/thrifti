import React, { useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchBinItemsInfo, auth, firestore} from '../../database';
import { getConvo, handleSend } from '../../database/messaging';
import { ScrollView } from 'react-native-gesture-handler';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface ChatProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Message {
  date: Date;
  id: string;
  senderId: string;
  text: string;
}

const Chats: React.FC<ChatProps> = ({ navigation, route }) => {
  const { chatId, chatData} = route.params;
  const { userInfo, date } = chatData;
  const { imageUri, listingName, binID, uid, photoURL, displayName } = userInfo;
  const [text, setText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = auth?.currentUser;
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;


  const handleArrow = () => {
    const listingInfo = fetchBinItemsInfo(binID);
    navigation.navigate('Listing', { imageUri: imageUri, binItemInfo: listingInfo });
  };

  const handleSendButton = () => {
    handleSend(text, chatId, uid);
    setText('');
  };


  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;

    return (

      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchMessages = async () => {
    try {
      const messageData = await getConvo(chatId);
      if (messageData) {
        const messageList: Message[] = Object.values(messageData.messages);
        setMessages(messageList);
        scrollToBottom();

      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 5,
                    marginLeft: screenWidth/3
                  }}
                />
              ) : (
                <View style={[styles.grayCircle, { width: 40, height: 40, borderRadius: 20, marginRight: 5,  marginLeft: screenWidth/3 }]} />
              )}
              <Text style={styles.profileText}>{displayName}</Text>
            </View>
    </View>

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
        <TouchableOpacity style={styles.arrow} onPress={handleArrow}>
          <Icon name="angle-right" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.inputContainer}
        keyboardVerticalOffset={keyboardVisible ? 0 : 100}
      >
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          onChangeText={(text) => setText(text)}
          value={text}
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSendButton()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center'
      },
      profileBanner: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          height: 50,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
      },
      profileText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 90,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        marginLeft: 10
      },
      makeOfferButton: {
        backgroundColor: '#007bff',
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginLeft: 10,
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
      arrow: {
        paddingBottom: 30,
        marginLeft: 'auto',
        marginRight: 10,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
      },
      input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
      },
      sendButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      messageContainer: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 20,
        maxWidth: '80%',
        alignSelf: 'flex-start',
      },
      messageText: {
        fontSize: 16,
      },
      sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        color: '#fff',

      },
      receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e0e0e0',
        color: '#333',
      },
      messageList: {
        flexGrow: 1,
        justifyContent: 'flex-end',
      },
      grayCircle: {
        backgroundColor: '#ccc',
        borderRadius: 10,
      },
});

export default Chats;
