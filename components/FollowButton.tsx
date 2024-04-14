import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Dimensions } from 'react-native';

interface FollowButtonProps {
    isFollowing: boolean;
    followUser: () => void; 
    unfollowUser: () => void; 
  }

const screenWidth = Dimensions.get('window').width;
const followButtonWidth = screenWidth * 0.5;

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, followUser, unfollowUser }) => {
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
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handlePress}
      >
        <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
      </TouchableOpacity>

      {/* Modal */}
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
    height: 35,
    width: followButtonWidth,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    },
followText: {
    fontSize: 17,
},
followingButton: {
    backgroundColor: 'lightgrey',
    height: 35,
    width: followButtonWidth,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
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