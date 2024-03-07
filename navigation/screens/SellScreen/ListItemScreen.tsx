import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DetectObject from '../../../api';

interface ListItemScreenProps {
  navigation: any;
}

const ListItemScreen: React.FC<ListItemScreenProps> = ({ navigation }) => {
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

export default ListItemScreen;
