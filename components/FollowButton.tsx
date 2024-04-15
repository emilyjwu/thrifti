import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Dimensions } from 'react-native';

interface FollowButtonProps {
  isFollowing: boolean;
  followUser: () => void; 
  unfollowUser: () => void;
  buttonWidth: number;
  buttonHeight: number;
  fontSize: number;
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, followUser, unfollowUser, buttonWidth, buttonHeight, fontSize }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const confirmUnfollow = () => {
    setShowConfirmationModal(false);
    unfollowUser();
  };

  const cancelUnfollow = () => {
    setShowConfirmationModal(false);
  };

  const handlePress = () => {
    if (isFollowing) {
      setShowConfirmationModal(true);
    } else {
      followUser();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.followButton, { width: buttonWidth }, { height: buttonHeight}, isFollowing && styles.followingButton]}
        onPress={handlePress}
      >
        <Text style={[styles.followText, {fontSize: fontSize }]}>{isFollowing ? 'Following' : 'Follow'}</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={showConfirmationModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to unfollow?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelUnfollow}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={confirmUnfollow}>
                <Text style={styles.buttonText}>Unfollow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: 'lightblue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    fontSize: 17,
  },
  followingButton: {
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'black', 
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: 'lightblue',
  },
  cancelButton: {
    backgroundColor: 'lightgrey',
  },
});

export default FollowButton;