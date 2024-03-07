import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Button, Modal } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import NewBinModal from '../../../components/NewBinModal';
import IconWithBackground from '../../../components/IconWithBackground';


interface SellScreenMain {
  navigation: any;
}
const SquareButton = ({ onPress}) => {
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
    const binNames = bins.map(bin => bin);
    navigation.navigate('ListItemScreen', { binNames });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>My Bins</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollContainer}>
          {bins.map((bin, index) => (
              <Bin key={index} name={bin} />
          ))}
          <SquareButton onPress={() => addBin()}  />
        </ScrollView>
      </View>
      
      <View style={styles.contentContainer}>
          <Text style={styles.title}>List Item</Text>
          <View style={styles.centeredContainer}>
            <TouchableOpacity onPress={navigateToListItemScreen}>
            <IconWithBackground width={250} height={250} iconSize={65} iconColor="#000" iconComponent={MaterialCommunityIcons} iconName="camera-plus-outline" backgroundColor="#eBeBeB" />
            </TouchableOpacity>
          </View>
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
    marginBottom: 5,
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
  },
  centeredContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
  },
  listContainer: {
    width: 250,  
    height: 250,
    position: 'relative',
  },
  square: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#eBeBeB',
    borderRadius: 10,
    zIndex: 0,
  },
  cameraIcon: {
    position: 'absolute',
    top: '50%',  
    left: '50%',  
    transform: [{ translateX: -40 }, { translateY: -40 }], 
    zIndex: 1,
  },
});

export default SellScreenMain;
