import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Button, Modal } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useState } from 'react';
import NewBinModal from '../../../components/NewBinModal';


interface SellScreenMain {
  navigation: any;
}
const SquareButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.addBinButton}>
      <EntypoIcon name="plus" size={50} color="black" />
    </TouchableOpacity>
  );
};

const Bin = ({ name }) => {
  return (
    <View style={styles.binContainer}>
      <FontAwesome5Icon name="box-open" size={80} color="#000" />
      <Text style={styles.binTitle}>{name}</Text>
    </View>
  );
};

const SellScreenMain: React.FC<SellScreenMain> = ({ navigation }) => {
  const [bins, setBins] = useState(["Emily's Bin"]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const addBin = () => {
    setIsModalVisible(true);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const saveBin = (name: string) => {
    setBins([...bins, name]);
    setIsModalVisible(false);
  };
  const navigateToListItemScreen = () => {
    navigation.navigate('ListItemScreen');
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>My Bins</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContainer}>
          {bins.map((bin, index) => (
              <Bin key={index} name={bin} />
          ))}
          <SquareButton onPress={() => addBin()} title="Square Button" />
        </ScrollView>
        <Text style={styles.title}>List Item!!</Text>
        <TouchableOpacity onPress={navigateToListItemScreen}>
           <Text>Go to ListItemScreen</Text>
        </TouchableOpacity>
      </View>
      <NewBinModal isVisible={isModalVisible} onClose={closeModal} onSave={saveBin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  scrollContainer: {
    backgroundColor: '#eBeBeB',
    height: 150, 
    minWidth: Dimensions.get('window').width,
    padding: 25,
    alignItems: 'flex-start',
    borderRadius: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  binContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  binTitle: {
    fontSize: 15,
  },
  addBinButton: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  }
});

export default SellScreenMain;
