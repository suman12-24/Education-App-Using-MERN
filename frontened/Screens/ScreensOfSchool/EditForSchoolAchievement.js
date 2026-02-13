import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert,
    BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useSelector } from 'react-redux';

const EditForSchoolAchievement = ({ route, navigation }) => {
    const { email } = useSelector((state) => state.auth);
    const loginEmail = email;

    const { achievement } = route.params;
    const [editedImage, setEditedImage] = useState(achievement.image?.uri || `${baseURL}/uploads/${achievement.image?.name}`);
    const [editedDescription, setEditedDescription] = useState(achievement.description || '');
    const [isModalVisible, setModalVisible] = useState(true); // Modal is visible by default
    const [characterCount, setCharacterCount] = useState(editedDescription.length); // Track character count

    // Handle the hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            handleBackAction();
            return true; // Prevent the default back action
        });

        return () => backHandler.remove();
    }, [editedImage, editedDescription]);

    const handleBackAction = () => {
        Alert.alert(
            'Unsaved Changes',
            'You have unsaved changes. Do you really want to go back?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => {
                        setModalVisible(false);
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled image picker');
                Alert.alert('Error', 'You did not select an image.');
            } else if (response.errorCode) {
                console.error('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Error', 'Failed to pick an image. Please try again.');
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setEditedImage(selectedImage.uri);
            }
        });
    };

    const handleSave = async () => {
        if (editedDescription.length < 130) {
            Alert.alert('Error', 'Description must be at least 130 characters long.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('loginEmail', loginEmail);
            formData.append('storyId', achievement._id);
            formData.append('description', editedDescription);

            if (editedImage && editedImage !== `${baseURL}/uploads/${achievement.image?.name}`) {
                const fileName = editedImage.split('/').pop();
                formData.append('image', {
                    uri: editedImage,
                    name: fileName,
                    type: 'image/jpeg',
                });
            }

            const response = await axiosConfiguration.put('/school/update-achievement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Achievement updated successfully!');
                setModalVisible(false);
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update achievement. Please try again later.');
            }
        } catch (error) {
            console.error('Error updating achievement:', error);
            Alert.alert('Error', 'An error occurred while updating the achievement.');
        }
    };

    // Update character count as the user types
    const handleDescriptionChange = (text) => {
        setEditedDescription(text);
        setCharacterCount(text.length);
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={false}
            animationType="slide"
            onRequestClose={handleBackAction} // Show confirmation dialog on modal close
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Achievement</Text>

                    <LinearGradient colors={['#ffffff', '#f2f2f2', '#e6e6e6']} style={styles.imagePicker}>
                        <TouchableOpacity onPress={handleImagePicker}>
                            <Text style={styles.imagePickerText}>Pick an Image</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    {editedImage && (
                        <Image source={{ uri: editedImage }} style={styles.previewImage} />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter achievement description"
                        value={editedDescription}
                        onChangeText={handleDescriptionChange}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Display character count */}
                    <Text style={styles.charCountText}>{characterCount} / 130</Text>

                    <View style={styles.buttonContainer}>
                        <LinearGradient colors={['#ffffff', '#f2f2f2', '#e6e6e6']} style={styles.gradientButton}>
                            <TouchableOpacity style={styles.buttonContent} onPress={handleSave}>
                                <Text style={styles.buttonText2}>Save</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient colors={['#ffffff', '#f2f2f2', '#e6e6e6']} style={styles.gradientButton}>
                            <TouchableOpacity
                                style={styles.buttonContent}
                                onPress={handleBackAction}
                            >
                                <Text style={styles.buttonText2}>Cancel</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        color: '#404040',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imagePicker: {
        backgroundColor: '#3396ff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    imagePickerText: {
        color: '#404040',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    previewImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
        borderRadius: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        fontSize: 16,
    },
    charCountText: {
        color: '#333',
        textAlign: 'right',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    gradientButton: {
        borderRadius: 8,
        width: '48%',
    },
    buttonContent: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText2: {
        color: '#404040',
        fontWeight: '500',
        fontSize: 17,
    },
});

export default EditForSchoolAchievement;
