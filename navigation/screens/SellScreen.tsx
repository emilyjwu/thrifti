import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import DetectObject from '../../api';

interface SellScreenProps {
  navigation: NavigationProp<any>;
}

const SellScreen: React.FC<SellScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
       <DetectObject/>
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

export default SellScreen;