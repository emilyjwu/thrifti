import  React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import IconWithBackground from '../../components/IconWithBackground';
import EntypoIcon from "react-native-vector-icons/Entypo";



interface MessageScreenProps {
  navigation: NavigationProp<any>;
}

const MessageScreen: React.FC<MessageScreenProps> = ({ navigation }) => {
  const messages = [
    { id: '1', uname: 'Jane Doe', listingName: 'Denim Vest', message: 'Is this still available?' },
    { id: '2', uname: 'John Doe', listingName: 'Leather Jacket', message: 'Can I get it by tomorrow?' },
    { id: '3', uname: 'Buzz', listingName: 'Pom Poms', message: 'Need it now!!' },

  ];
  const [clicked, setClicked] = useState(false);
  const { navigate } = useNavigation();

  const handlePress = () => {
    setClicked(true);
    navigate('Chat');
};


  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <View style={[styles.messageContainer, clicked && styles.clickedContainer]}>
                <View style={styles.circle}>
                </View>
                    <View style={styles.userInfoText}>
                        <Text style={styles.username}>{username}</Text>
                        <Text  numberOfLines={1} style={styles.message}>{message}</Text>
                        <Text style={styles.time}> Today </Text>
                    </View>

                <IconWithBackground  width={80}
                    height={80}
                    iconSize={40}
                    iconColor="#000"
                    iconComponent={EntypoIcon}
                    iconName="image"
                    backgroundColor="#eBeBeB"
                ></IconWithBackground>
            </View>
        </TouchableOpacity>
        )}
        style={{ marginTop: 10, marginBottom: 10}}
      />
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  messageContainer: {
    width: '100%',  // Use 100% width to fill the container
    height: 90,
    backgroundColor: '#d3d3d3',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10
 },
 circle: {
     width: 80,
     height: 80,
     borderRadius: 80 / 2,
     backgroundColor: "gray",
     marginLeft: -5
 },
 username: {
     fontSize: 18,
     fontWeight: 'bold',
     marginRight: 0,
     marginBottom: 4,
 },
 userInfoText: {
     flexDirection: 'column',
     marginLeft: 7, // Adjust the margin as needed
     flex: 1, // Allow the text to take up remaining space



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