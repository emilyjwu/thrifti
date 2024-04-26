import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

interface DoneProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
}

const DoneProfileModal: React.FC<DoneProfileModalProps> = ({
  isVisible,
  onClose,
  navigation,
}) => {

  const handleClose = () => {
    onClose();
    navigation.navigate("ProfileScreen");
  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.xButton} onPress={handleClose}>
            <FontAwesome5Icon name="times" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.popupTitle}>Done</Text>
          <Text style={styles.text}>Profile updated successfully!</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  xButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 5,
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
  },
});

export default DoneProfileModal;
