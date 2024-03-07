import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExploreScreenProps {
  navigation: any; // Replace 'any' with the correct type for navigation prop
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text
        onPress={() => alert('This is the List Item Screen.')}
        style={{ fontSize: 26, fontWeight: 'bold' }}>Explore Screen</Text>
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
