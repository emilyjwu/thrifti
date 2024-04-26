import React, { useState, useEffect, useRef, useContext } from "react";
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
  Dimensions,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  fetchBinItemsInfo,
  auth,
  firestore,
  AuthContext,
} from "../../database";
import { getConvo, handleSend } from "../../database/messaging";
import MakeOfferModal from "../../components/MakeOfferModal";
import { getExisitingOffer } from "../../database/offers";
import PendingOfferModal from "../../components/PendingOfferModal";
import OfferAlertModal from "../../components/OfferAlertModal";
import { usePostHog } from "posthog-react-native";

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

interface Offer {
  buyerId: string;
  date: Date;
  listingId: string;
  pending: boolean;
  price: number;
  sellerId: string;
}

//KEY Only a buyer can initiate a conversation!
const Chats: React.FC<ChatProps> = ({ navigation, route }) => {
  const { chatId, chatData } = route.params;
  const { userInfo, date } = chatData;
  const {
    imageUri,
    listingName,
    binId,
    uid,
    photoURL,
    displayName,
    listingId,
    seller,
  } = userInfo;

  const [text, setText] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUser = auth?.currentUser;
  const flatListRef = useRef<FlatList>(null);
  const screenWidth = Dimensions.get("window").width;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [offerData, setOfferData] = useState<Offer[]>([]);
  const [offerButtonText, setOfferButtonText] = useState<String>("");
  const [isPendingOfferModalVisible, setIsPendingOfferModalVisible] =
    React.useState(false);
  const [pendingButton, setIsPendingButton] = useState<Boolean>();
  const [isOfferAlertVisible, setIsOfferAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<string>("");
  const [startTime, setStartTime] = useState(Date.now());
  const posthog = usePostHog();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setStartTime(Date.now());
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (startTime) {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);
        if (timeSpent > 0) {
          posthog.screen("Chat Screen", { timeSpent, uid });
        }
        setStartTime(null);
      }
    });
    return unsubscribe;
  }, [navigation, startTime]);

  //if the current viewer of chat is NOT the buyer and there is a pending offer, show the pending offer modal

  const closeModal = () => {
    setIsModalVisible(false);
    setIsPendingOfferModalVisible(false);
    setIsOfferAlertVisible(false);
  };

  const onMakeOfferPress = () => {
    if (offerButtonText == "Make Offer") {
      setIsModalVisible(true);
    }
  };

  const onPendingPress = () => {
    if (offerButtonText === "Pending Offer") {
      setAlertType("pending");
      setIsOfferAlertVisible(true);
    } else if (offerButtonText === "SOLD") {
      setIsOfferAlertVisible(true);
      setAlertType("accepted");
    }
  };

  const handleArrow = () => {
    async function getBinItemData() {
      try {
        const binInfo = await fetchBinItemsInfo(binId);
        const binItemInfo = binInfo[0];
        navigation.navigate("Listing", { imageUri, binItemInfo });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    getBinItemData();
  };

  const handleSendButton = () => {
    handleSend(text, chatId, uid);
    setText("");
  };

  //Logic: If an offer exists, and it is PENDING --> the SELLER has the option to accept or deny
  //If an offer exists, and it is NOT pending --> that means it was accepted (i think i need a denied flag to show the offer alert modal)
  const getOffer = async () => {
    try {
      const offerData = await getExisitingOffer(listingId, uid);
      setOfferData(offerData);
      console.log(offerData.price);
      if (offerData) {
        if (seller !== currentUser.uid) {
          if (offerData.pending) {
            setOfferButtonText("Pending Offer");
            setIsPendingButton(true);
          } else if (offerData.sold) {
            setOfferButtonText("SOLD");
            setIsPendingButton(true);
          } else {
            setOfferButtonText("Make Offer");
            setIsPendingButton(false);
          }
        }
        if (offerData.pending && seller === currentUser.uid) {
          setIsPendingOfferModalVisible(true);
        }
      }
    } catch (error) {
      setOfferButtonText("Make Offer");
      console.error("Error fetching offer data:", error);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;
    const messageDate = item.date.toDate();
    if (!messageDate) {
      return "Date not available";
    }
    const formattedDate = `${messageDate.toDateString()} ${messageDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`;

    return (
      <View style={styles.messageWrapper}>
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <Text
          style={[styles.messageDate, isCurrentUser && styles.sentMessageDate]}
        >
          {formattedDate}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    setOfferButtonText("Make Offer");
    const intervalId = setInterval(() => {
      fetchMessages();
      getOffer();
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
      console.error("Error fetching chat data:", error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
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
    <SafeAreaView style={styles.container}>
      <View style={styles.profileBanner}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                marginRight: 5,
                marginLeft: screenWidth / 3,
              }}
            />
          ) : (
            <Icon
              name="user-circle"
              size={40}
              color="gray"
              style={[
                styles.profilePhoto,
                {
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                  marginRight: 5,
                  marginLeft: screenWidth / 3,
                },
              ]}
            />
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
          {/* <TouchableOpacity style={styles.makeOfferButton} onPress={onMakeOfferPress}>
              <Text style={styles.makeOfferButtonText}> {offerButtonText}</Text>
            </TouchableOpacity> */}
          {seller !== currentUser.uid &&
            !pendingButton && ( // Only render this if the current user is not the seller
              <TouchableOpacity
                style={styles.makeOfferButton}
                onPress={onMakeOfferPress}
              >
                <Text style={styles.makeOfferButtonText}>
                  {offerButtonText}
                </Text>
              </TouchableOpacity>
            )}
          {seller !== currentUser.uid &&
            pendingButton && ( // Only render this if the current user is not the seller
              <TouchableOpacity
                style={styles.pendingOfferButton}
                onPress={onPendingPress}
              >
                <Text style={styles.makeOfferButtonText}>
                  {offerButtonText}
                </Text>
              </TouchableOpacity>
            )}
          <MakeOfferModal
            isVisible={isModalVisible}
            onClose={closeModal}
            price={0}
            imageUri={imageUri}
            listingName={listingName}
            sendTo={uid}
            chatId={chatId}
            listingId={listingId}
            displayName={displayName}
          />
        </View>
        <TouchableOpacity style={styles.arrow} onPress={handleArrow}>
          <Icon name="angle-right" size={24} color="#000" />
        </TouchableOpacity>
        <PendingOfferModal
          isVisible={isPendingOfferModalVisible}
          onClose={closeModal}
          price={offerData.price}
          imageUri={imageUri}
          listingName={listingName}
          sendTo={uid}
          chatId={chatId}
          listingId={listingId}
          displayName={displayName}
        />
        <OfferAlertModal
          isVisible={isOfferAlertVisible}
          onClose={closeModal}
          sellerName={displayName}
          alert={alertType}
          // price={offerData?.price}
          listingId={listingId}
          sellerUid={uid}
        />
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
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendButton()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  profileBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 10,
  },
  makeOfferButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginLeft: 10,
  },
  pendingOfferButton: {
    backgroundColor: "#D3D3D3",
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginLeft: 10,
  },
  makeOfferButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
  },
  arrow: {
    paddingBottom: 30,
    marginLeft: "auto",
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageContainer: {
    padding: 10,
    marginBottom: 5,
    maxWidth: "80%",
    alignSelf: "flex-start",
    borderRadius: 10, // Add border radius
  },
  messageText: {
    fontSize: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 0,
    display: "flex",
    paddingRight: 15,
    marginRight: 5,
    minWidth: 20,
    marginTop: 2,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    color: "#333",
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: "flex",
    paddingLeft: 15,
    marginLeft: 5,
    minWidth: 20,
    marginTop: 2,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  profilePhoto: {
    height: 40,
    width: 40,
    borderRadius: 40,
  },
  messageDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  messageWrapper: {
    marginBottom: 10,
  },
  sentMessageDate: {
    alignSelf: "flex-end",
  },
});

export default Chats;
