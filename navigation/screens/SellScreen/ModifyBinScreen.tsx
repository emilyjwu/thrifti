import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import DetectObject from '../../../api';
import Bins from '../../../components/Bins';


interface SellScreenProps {
  navigation: NavigationProp<any>;
}

const SellScreen: React.FC<SellScreenProps> = ({ navigation }) => {
  const [binName, setBinName] = useState('');

  const handleCreateBin = () => {
    // Add box handling logic here for explore page
  };

  return (

    <View style={styles.titleContainer}>
        <Text style={styles.text}> Enter Bin Name: </Text>
        <TextInput
          placeholder= "e.g. My Winter Clothes"
          style={[styles.input, {fontSize: 18}]}
          onChangeText={(value) => setBinName(value)} />
         <ScrollView scrollEnabled={true} nestedScrollEnabled={true} contentContainerStyle={styles.container}>
             <Bins/>
          </ScrollView>

      </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 0,
    marginLeft: 5,
  },
  input: {
    borderWidth: 0,
    borderColor: '#777',
    padding: 8,
    width: 200,
  },
  addButtonContainer: {
    marginTop: 20,
  },
  scrollItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

});

export default SellScreen;
