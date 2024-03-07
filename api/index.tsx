import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import SelectDropdown from 'react-native-select-dropdown';

const DetectObject: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [labels, setLabels] = useState<any[]>([]);
    const [itemPrice, setItemPrice] = useState<number>(0);
    const binNames = ["Winter Bin", "Dorm Items", "Jane's Bin"];
    const navigation = useNavigation();

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                await generateLabels(result.assets[0].uri);
                setImageUri(result.assets[0].uri);
            }
            console.log(result);
        } catch (error) {
            console.error('Error Picking Image: ', error);
        }
    };

    const generateLabels = async (uri: string) => {
        try {
            if (!imageUri) {
                alert('Please select an image first!!');
                return;
            }
            // Test private key
            const apiKey = "AIzaSyAuL70Y1v_C-Zb-B8fgCYdfLkvPGwigXxQ";
            const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

            const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestData = {
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [{ type: 'LABEL_DETECTION', maxResults: 10 }],
                    },
                ],
            };
            const apiResponse = await axios.post(apiURL, requestData);
            setLabels(apiResponse.data.responses[0].labelAnnotations);
        } catch (error) {
            console.error('Error analyzing image: ', error);
            alert('Error analyzing images. Please try again later');
        }
    };

    const onNextPress = () => {
        navigation.navigate('AdditionalInformationScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                List Item
            </Text>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 250, height: 250, marginBottom: 10 }}
                />
            )}
            <TouchableOpacity
                onPress={pickImage}
                style={styles.button}
            >
                <Text style={styles.text}> Upload Image . . .</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Price: $</Text>
                <TextInput
                    placeholder="Enter"
                    style={[styles.input, { fontSize: 16 }]}
                    onChangeText={(value) => {
                        const price = parseInt(value, 10);
                        if (!isNaN(price)) {
                            setItemPrice(price);
                        } else {
                            setItemPrice(0);
                        }
                    }}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label2}>Bin:</Text>
                <SelectDropdown
                    data={binNames}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                    }}
                    defaultButtonText="Choose Bin"
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
                    }}
                    buttonTextStyle={{
                        color: '#333',
                        fontSize: 14,
                        textAlign: 'left',
                    }}
                />
            </View>
            <View style={styles.tagsContainer}>
                <Text style={styles.label2}>TAGS</Text>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    {labels.length > 0 && (
                    <View style={styles.labelsContainer}>
                        {labels.map((label) => (
                        <View key={label.mid} style={styles.labelPill}>
                            <Text style={styles.labelText}>{label.description}</Text>
                        </View>
                        ))}
                    </View>
                    )}
                    <TouchableOpacity onPress={onNextPress} style={styles.nextButton}>
                    <Text style={styles.text}> Next </Text>
                    </TouchableOpacity>
                </ScrollView>
                </View>

    );
}

export default DetectObject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
        position: 'relative',
      },
      tagsContainer: {
        marginBottom: 0,
      },
      nextButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'lightblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      scrollView: {
        flex: 1,
        width: '100%',
      },
      scrollViewContent: {
        paddingBottom: 80,
      },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 300,
    },
    button: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        marginBottom: 10,
        borderRadius: 15,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 0,
    },
    label2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
        marginBottom: 10,
         alignSelf: 'center',
    },
    outputtext: {
        fontSize: 18,
        marginBottom: 10,
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        justifyContent: 'center',
    },
    labelPill: {
        backgroundColor: '#DDDDDD',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    labelText: {
        fontSize: 16,
    },
    input: {
        borderWidth: 0,
        borderColor: '#777',
        padding: 8,
        width: 200,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});