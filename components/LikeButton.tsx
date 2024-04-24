import React, { useContext, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { AuthContext, addLikedListing, removeLikedListing } from '../database';

const LikeButton = ({ initialIsLiked, binItemInfo }) => {
  const [isLiked, setLiked] = useState(initialIsLiked);
  const { currentUserID } = useContext(AuthContext);

  const handleLikeButton = async () => {
    try {
      if (isLiked) {
        await removeLikedListing(currentUserID, binItemInfo.id);
      } else {
        await addLikedListing(currentUserID, binItemInfo.id);
      }
      setLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLikeButton}>
      <EntypoIcon
        name={isLiked ? "heart" : "heart-outlined"}
        size={25}
        color={isLiked ? "red" : "black"}
      />
    </TouchableOpacity>
  );
};

export default LikeButton;