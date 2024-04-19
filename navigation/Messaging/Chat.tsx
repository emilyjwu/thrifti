import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, FlatList} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchBinItemsInfo } from '../../database';
import { ScrollView } from 'react-native-gesture-handler';
import { handleSend, getConvo } from '../../database/messaging';

interface ChatProps {
  navigation: NavigationProp<any>;
  route: any;
}

interface Message {
    date: Date;
    id: string;
    senderId: string;
    text: string; // Adjust this type as per your Firestore data structure
    // Add other message fields as needed
  }

const Chats: React.FC<ChatProps> = ({ navigation, route }) => {
    const {chatId, chatData} = route.params;
    // console.log(chatId)
    const { userInfo, date } = chatData;
    const { displayName, imageUri, listingName, photoURL, binID, uid } = userInfo;
    const [text, setText] = useState("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const messageData = await getConvo(chatId);
            if (messageData) {
              const messageList: Message[] = Object.values(messageData); // Assuming messages are stored as an object with IDs as keys
              setMessages(messageList);
              console.log(messageData)
            }
          } catch (error) {
            console.error('Error fetching chat data:', error);
            // Handle error state or display an error message
          }
        };

        fetchData(); // Fetch data if currentUser is available

        return () => {
          // Clean up snapshot listener on unmount
          fetchData?.();
        };
      }, []);


    const handleArrow = () => {
        const listingInfo = fetchBinItemsInfo(binID)
        navigation.navigate("Listing", { imageUri: imageUri, binItemInfo: listingInfo})
    };

    // const renderMessage = ({ item }: { item: Message }) => {
    //     const isCurrentUser = item.senderId === currentUserUid;

    //     return (
    //       <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessageContainer : styles.otherUserMessageContainer]}>
    //         <Text style={isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage}>
    //           {item.text}
    //         </Text>
    //         {/* Render other message details as needed */}
    //       </View>
    //     );
    //   };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          () => {
            setKeyboardVisible(true);
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setKeyboardVisible(false);
          }
        );

        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);

  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollView}>
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
    </ScrollView>

    <KeyboardAvoidingView
      behavior='padding'
      style={styles.inputContainer}
      keyboardVerticalOffset={keyboardVisible ? 0 : 100}
    >
      <TextInput
        style={styles.input}
        placeholder="Type something..."
        onChangeText={(text) => setText(text)}
        value={text}
      />
      <TouchableOpacity style={styles.sendButton} onPress={() => handleSend(text, chatId, uid )}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </View>
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
  },
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    width: '80%',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    marginRight: 10,
  },
  imageButton: {
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
  icon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  currentUserMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  messageContainer: {
    padding: 10,
  },
});

export default Chats;