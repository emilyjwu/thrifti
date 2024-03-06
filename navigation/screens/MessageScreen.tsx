import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface MessageScreenProps {
  navigation: NavigationProp<any>; // Replace 'any' with the correct type for navigation prop
}

const MessageScreen: React.FC<MessageScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        onPress={() => navigation.navigate('Explore')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>Message Screen</Text>
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
});

export default MessageScreen;
