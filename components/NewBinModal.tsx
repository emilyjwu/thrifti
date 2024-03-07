import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

interface NewBinModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const NewBinModal: React.FC<NewBinModalProps> = ({ isVisible, onClose, onSave }) => {
  const [newBinName, setNewBinName] = useState('');

  const saveBin = () => {
    onSave(newBinName);
    setNewBinName('');
  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <TouchableOpacity style={styles.xButton} onPress={onClose}>
                    <FontAwesome5Icon name="times" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Name your bin</Text>
                <TextInput
                style={styles.input}
                placeholder="Enter bin name"
                onChangeText={text => setNewBinName(text)}
                value={newBinName}
                />
                <Button title="Save" onPress={saveBin} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
    backgroundColor: '#fff',
    width: '80%', 
    padding: 20,
    borderRadius: 10,
    alignItems: 'center', 
    },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  xButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
  },
});

export default NewBinModal;