import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


interface ExploreScreenProps {
  navigation: any; // Replace 'any' with the correct type for navigation prop
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 26, fontWeight: 'bold' }}>'This is the Sell Screen Main.'</Text>
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

export default ExploreScreen;
