import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface RequestsScreenProps {
  navigation: NavigationProp<any>;
}

const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        onPress={() => navigation.navigate('Explore')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>Requests Screen</Text>
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

export default RequestsScreen;
