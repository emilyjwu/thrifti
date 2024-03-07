import React, { useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import SelectDropdown from 'react-native-select-dropdown';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IconWithBackground from '../components/IconWithBackground';

interface DetectObjectProps {
    binNames: string[]; 
  }

const DetectObject: React.FC<DetectObjectProps> = ({ binNames }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [labels, setLabels] = useState<any[]>([]);
    const [itemPrice, setItemPrice] = useState<number>(0);
    const [labelsGenerated, setLabelsGenerated] = useState<boolean>(false);
    const [selectedBin, setSelectedBin] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isReadyToNavigate, setIsReadyToNavigate] = useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        pickImage();
      }, []);

    useEffect(() => {
        if (imageUri && !labelsGenerated) {
            generateLabels(imageUri);
        }
    }, [imageUri, labelsGenerated]);

    useEffect(() => {
        if (itemPrice > 0 && selectedBin && labels.length > 0) {
            setIsReadyToNavigate(true);
        } else {
            setIsReadyToNavigate(false);
        }
    }, [itemPrice, selectedBin, labels]);

    const pickImage = async () => {
        try {
            setLoading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
               // await generateLabels(result.assets[0].uri);
            }
            console.log(result);
        } catch (error) {
            console.error('Error Picking Image: ', error);
        } finally {
            setLoading(false);
        }
    };

    const generateLabels = async (uri: string) => {
        try {
            if (!imageUri && !loading) {
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
                        features: [{ type: 'LABEL_DETECTION', maxResults: 7 }],
                    },
                ],
            };
            const apiResponse = await axios.post(apiURL, requestData);
            setLabels(apiResponse.data.responses[0].labelAnnotations);
            setLabelsGenerated(true);
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
            <View style={styles.centeredContainer}>
                <Text style={styles.title}>
                    List Item
                </Text>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 250, height: 250, marginBottom: 10 }}
                    />
                ) : (
                    <IconWithBackground width={250} height={250} iconSize={60} iconColor="#000" iconComponent={EntypoIcon} iconName="image" backgroundColor="#eBeBeB" />
                )}
            </View>
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
                <Text style={styles.label}>Bin:</Text>
                <SelectDropdown
                    data={binNames}
                    onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        setSelectedBin(selectedItem);

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
                <Text style={styles.label}>Tags</Text>
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
                </ScrollView>
                {
                    isReadyToNavigate && 
                    <TouchableOpacity onPress={onNextPress} style={styles.nextButton}>
                        <Text style={styles.text}> Next </Text>
                    </TouchableOpacity>
                }
             </View>

    );
}

export default DetectObject;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        padding: 20,
        position: 'relative',
      },
      centeredContainer: {
        justifyContent: 'center', 
        alignItems: 'center',
      },
      tagsContainer: {
        marginBottom: -10,
        paddingBottom:0,
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
        height: 50,
      },
      scrollViewContent: {
        paddingBottom: 0,
      },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 0,
        marginRight: 10,
        marginBottom: 10,
        textAlign: 'left'
    },
    labelsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        textAlign: 'left',
    },
    imagePlaceholderContainer: {
        width: 250,
        height: 250,
        backgroundColor: '#eBeBeB',
        marginBottom: 10,
    },
});