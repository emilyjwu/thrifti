import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetectObject: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [labels, setLabels] = useState<any[]>([]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                await generateLabels(result.assets[0].uri)
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
                        features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Create New Listing
            </Text>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 300, height: 300 }}
                />
            )}
            <TouchableOpacity
                onPress={pickImage}
                style={styles.button}
            >
                <Text style={styles.text}> Upload an image . . .</Text>
            </TouchableOpacity>
            
            {
                labels.length > 0 && (
                    <View style={styles.labelsContainer}>
                        {labels.map((label) => (
                            <View key={label.mid} style={styles.labelPill}>
                                <Text style={styles.labelText}>{label.description}</Text>
                            </View>
                        ))}
                    </View>
                )
            }
        </View>
    );
}

export default DetectObject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50, 
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
        borderRadius: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
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
});