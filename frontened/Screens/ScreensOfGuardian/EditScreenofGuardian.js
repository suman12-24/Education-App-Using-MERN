import React, { useState } from 'react';
import { Platform, Alert, Modal, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, StatusBar, Dimensions, PermissionsAndroid } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const EditScreenofGuardian = () => {
    const navigation = useNavigation();

    // State variables to manage input values
    const [name, setName] = useState('Lidya Nada');
    const [email, setEmail] = useState('lidyanada@gmail.com');
    const [phone, setPhone] = useState('9869632138');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFocused, setIsFocused] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [profileImage, setProfileImage] = useState(null); // State for selected profile image
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Added state for confirm password visibility

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs camera access to take a photo.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const requestGalleryPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                if (Platform.Version >= 33) {
                    // Android 13 and above
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: 'Photo Library Access',
                            message: 'This app needs access to your photo library to select photos.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    // Android 12 and below
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: 'Storage Access',
                            message: 'This app needs access to your storage to select photos.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            }
            return true; // iOS permissions are handled in Info.plist
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const handleCamera = async () => {
        if (Platform.OS === 'android') {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
                Alert.alert(
                    'Permission Denied',
                    'You need to grant the required permissions to use this feature.',
                    [{ text: 'OK' }]
                );
                return;
            }

        }
        launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled camera');
                Alert.alert('Error', 'You did not select an image.');
            } else if (response.errorMessage) {
                console.error('Camera error:', response.errorMessage);
            } else {
                setProfileImage(response.assets[0].uri);
                setIsModalVisible(false);
            }
        });
    };

    const handleGallery = async () => {
        if (Platform.OS === 'android') {
            const hasPermission = await requestGalleryPermission();
            if (!hasPermission) {
                Alert.alert('Permission Denied', 'Gallery permission is required to select a photo.');
                return;
            }
        }
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                //console.log('User cancelled gallery');
                Alert.alert('Error', 'You did not select an image.');
            } else if (response.errorMessage) {
                console.error('Gallery error:', response.errorMessage);
            } else {
                setProfileImage(response.assets[0].uri);
                setIsModalVisible(false);
            }
        });
    };


    const handleSave = () => {
        // Implement the save functionality here (e.g., update profile in backend or state)
        if (password === confirmPassword) {
            //console.log('Profile Updated:', { name, email, phone, password });
            Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
        } else {
            Alert.alert("Passwords do not match");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar backgroundColor={'#477a71'} barStyle={'light-content'} />
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerIconsLeft}>
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        iconColor="#FFFFFF"
                        onPress={() => {
                            navigation.goBack()
                        }}
                    />
                </View>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={styles.headerIcons}>
                    <IconButton
                        icon="bell"
                        size={24}
                        iconColor="#FFFFFF"
                        onPress={() => {
                            // Handle notifications
                        }}
                    />
                </View>
            </View>


            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={profileImage ? { uri: profileImage } : require('../ScreensOfGuardian/assets/Images/avatar.jpeg')}
                        style={styles.profileImage}
                    />
                    {/* Photo Icon */}
                    <TouchableOpacity style={styles.photoIconContainer} onPress={() => setIsModalVisible(true)}>
                        <MaterialCommunityIcons name="camera" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="account" size={25} color="#353e3d" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.inputField, isFocused === 'name' && styles.inputFocused]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        onFocus={() => setIsFocused('name')}
                        onBlur={() => setIsFocused(null)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="email" size={25} color="#353e3d" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.inputField, isFocused === 'email' && styles.inputFocused]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        onFocus={() => setIsFocused('email')}
                        onBlur={() => setIsFocused(null)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="phone" size={25} color="#353e3d" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.inputField, isFocused === 'phone' && styles.inputFocused]}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone Number"
                        placeholderTextColor="#aaa"
                        keyboardType="phone-pad"
                        onFocus={() => setIsFocused('phone')}
                        onBlur={() => setIsFocused(null)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock" size={25} color="#353e3d" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.inputField, isFocused === 'password' && styles.inputFocused]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!isPasswordVisible}
                        onFocus={() => setIsFocused('password')}
                        onBlur={() => setIsFocused(null)}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconTouchable}>
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                            size={25}
                            color="#353e3d"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                    <MaterialCommunityIcons name="lock" size={25} color="#353e3d" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.inputField, isFocused === 'confirmPassword' && styles.inputFocused]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!isConfirmPasswordVisible} // Toggling confirm password visibility
                        onFocus={() => setIsFocused('confirmPassword')}
                        onBlur={() => setIsFocused(null)}
                    />
                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.iconTouchable}>
                        <MaterialCommunityIcons
                            name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                            size={25}
                            color="#353e3d"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
            {/* Modal for Camera/Gallery Options */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Image
                            resizeMode='cover'
                            source={profileImage ? { uri: profileImage } : require('../ScreensOfGuardian/assets/Images/avatar.jpeg')}
                            style={styles.modalImage}
                        />
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleCamera}
                        >
                            <Text style={styles.modalButtonText}>Choose from Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleGallery}
                        >
                            <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#EDF4F7', // Page background color
    },
    header: {
        backgroundColor: '#477a71', // Header background color
        justifyContent: 'center', // Centers the title horizontally
        alignItems: 'center', // Centers the title vertically
        paddingHorizontal: 16,
        height: height * 0.1, // Header height based on screen height
        marginBottom: 16,
        shadowColor: '#000', // Shadow effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerTitle: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: width * 0.06, // Font size based on screen width
        fontWeight: 'bold',
    },
    headerIconsLeft: {
        position: 'absolute',
        left: 5,
        top: 8,
    },

    headerIcons: {
        position: 'absolute',
        right: 5,
        top: 8,
    },
    profileContainer: {
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -30,
        backgroundColor: '#f7f7f7', // Profile card background
        padding: 16,
        alignItems: 'center',
        elevation: 8, // More prominent shadow for the profile section
        shadowColor: '#000', // Shadow color for profile section
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 8,
    },
    photoIconContainer: {
        position: 'absolute',
        bottom: 7,
        right: 7,
        backgroundColor: '#477a71',
        padding: 4,
        borderRadius: 25,
    },
    inputWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        paddingLeft: 12,
    },
    inputField: {
        flex: 1,
        height: 45,
        paddingHorizontal: 12,
        fontSize: width * 0.04, // Font size based on screen width
    },
    inputIcon: {
        marginRight: 10,
    },
    iconTouchable: {
        padding: 5,
    },
    inputFocused: {
        borderColor: '#477a71', // Highlight border color on focus
        backgroundColor: '#f0f8f8', // Slightly change background color on focus
    },
    saveButton: {
        backgroundColor: '#f7b934',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 24,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 5,
    },
    modalImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: '#477a71',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginVertical: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalCancelButton: {
        marginTop: 8,
    },
    modalCancelButtonText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditScreenofGuardian;

