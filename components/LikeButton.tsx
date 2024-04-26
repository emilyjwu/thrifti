import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { AuthContext, addLikedListing, isListingLiked, removeLikedListing } from '../database';

const LikeButton = ({ binItemInfo }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { currentUserID } = useContext(AuthContext);

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const liked = await isListingLiked(currentUserID, binItemInfo.id);
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching like information:", error);
      }
    };
    fetchLike();
  }, []);
  
  const handleLikeButton = async () => {
    try {
      if (isLiked) {
        await removeLikedListing(currentUserID, binItemInfo.id);
      } else {
        await addLikedListing(currentUserID, binItemInfo.id);
      }
      setIsLiked(!isLiked);
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