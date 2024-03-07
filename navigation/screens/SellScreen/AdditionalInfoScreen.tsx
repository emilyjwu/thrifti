import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

interface ExploreScreenProps {
  navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');
  const [itemCondition, setItemCondition] = useState<string | null>(null);
  const conditions = ["Brand New", "Used-Excellent", "Used-Good", "Used-Fair"]

  const handleInputChange = (text) => {
    setInputValue(text);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Optional Item Info</Text>
      <View style={styles.subContainer}>
        <Text style={styles.subTitle}>Description</Text>
        <View style={styles.textAreaContainer} >
          <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="Type something"
            placeholderTextColor="grey"
            numberOfLines={4}
            multiline={true}
            value={inputValue}
            onChangeText={handleInputChange}
            />
        </View>
        <View style={styles.dropDownContainer}>
          <Text style={styles.dropDownLabelText}>Condition:</Text>
          <SelectDropdown
                    data={conditions}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        setItemCondition(selectedItem);

                    }}
                    defaultButtonText="Select Item Condition"
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        return item;
                    }}
                    dropdownStyle={{
                        backgroundColor: '#DDDDDD',
                        padding: 5,
                        marginBottom: 10,
                        borderRadius: 20,
                    }}
                    buttonStyle={{
                        backgroundColor: '#DDDDDD',
                        padding: 5,
                        marginBottom: 10,
                        borderRadius: 20,
                        alignItems: 'center',
                    }}
                    buttonTextStyle={{
                        color: '#333',
                        fontSize: 14,
                        textAlign: 'left',
                    }}
                />
        </View>
       </View>
       <TouchableOpacity style={styles.button}>
            <Text style={styles.subTitle}> Done </Text>
       </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
    // marginLeft: 20,
    // paddingHorizontal: 20,
  },
  textAreaContainer: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
},
dropDownLabelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 0,
    marginRight: 10,
    marginBottom: 10,
    textAlign: 'left'
  },
  button: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'lightblue',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
  }
});

export default ExploreScreen;
