import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


interface ExpandBinProps {
  navigation: any;
}

const ExpandBin: React.FC<ExpandBinProps> = ({ navigation }) => {
    return (
      <View>
        <Text> Expand Bin Component! </Text>
        <TouchableOpacity  onPress={() => navigation.navigate("Listing")}>
        <Text>
        Go to Listing!
        </Text>
      </TouchableOpacity>
      </View>
    )
}

export default ExpandBin;

