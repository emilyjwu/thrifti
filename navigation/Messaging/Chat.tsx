import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface ChatProps {
  navigation: NavigationProp<any>;
}

const Chats: React.FC<ChatProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 26, fontWeight: 'bold' }}>Specific Convo</Text>
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

export default Chats;