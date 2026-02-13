import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Dimensions, Alert, Modal } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../Redux/slices/authSlice';

import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import MasterLoginRegistrationModal from '../MasterLoginRegistrationModal';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const AccountScreenofGuardian = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { email, token } = useSelector((state) => state.auth); // Get email and token from Redux
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const [addressModalVisible, setAddressModalVisible] = useState(false); // Address modal visibility
    const [translations, setTranslations] = useState({
        "Educational Information": "",
        "Address Details": "",
        "Payment History": "",
        "Logout": ""
    });

    // Function to translate text using Google Translate API
    const translateText = async () => {
        try {
            // Replace with your Google Cloud Translation API key
            const apiKey = 'AIzaSyCABrhNw_llyr99zvQEWBrTM1hjQ0H5MGc';
            const textsToTranslate = Object.keys(translations);

            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: textsToTranslate,
                        target: 'bn', // Bengali language code
                        format: 'text'
                    }),
                }
            );

            const data = await response.json();

            if (data && data.data && data.data.translations) {
                const newTranslations = {};
                data.data.translations.forEach((translation, index) => {
                    newTranslations[textsToTranslate[index]] = translation.translatedText;
                });
                setTranslations(newTranslations);
            }
        } catch (err) {
            console.error("Translation error:", err);
            // Fallback to original text in case of error
        }
    };

    useEffect(() => {
        // Translate text when component mounts
        translateText();
    }, []);

    const handleLogout = () => {
        setIsModalVisible(true); // Show the modal on logout
    };

    const handleLogoutConfirmation = () => {
        dispatch(clearAuth());
        navigation.navigate('BottomTabNavigator', {
            screen: 'HomeStackNavigatior',
            params: { screen: 'HomeScreenOfGuardian' },
        });
    };

    const handleModalClose = () => {
        setIsModalVisible(false); // Close the modal
    };

    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (email) {
                try {
                    const response = await axiosConfiguration.get('/user/display-Profile-Details', {
                        params: { email },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data.success) {
                        setProfile(response.data.profile); // Set profile data if success
                    } else {
                        setError(response.data.message); // Set error message if failure
                    }
                } catch (err) {
                    setError('Failed to fetch profile details.'); // Handle error
                } finally {
                    setLoading(false); // Stop loading
                }
            }
        };

        fetchProfileDetails();
    }, [email, token]); // Fetch data whenever email or token changes

    // Helper function to get translated text or original if translation not available
    const getTranslatedText = (originalText) => {
        return translations[originalText] || originalText;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Overlay when modal is visible */}
            {isModalVisible && <View style={styles.overlay} />}

            <LinearGradient
                colors={['#595959', '#404040', '#333333']} // Adjust colors as needed
                start={{ x: 0, y: 0 }} // Top of the gradient
                end={{ x: 0, y: 1 }} // Bottom of the gradient
                style={styles.header}
            >
                <Text style={styles.headerTitle}>My Profile</Text>

                <View style={styles.headerIcons}>
                    <IconButton icon="bell" size={24} iconColor="#FFFFFF" onPress={() => { }} />
                    <IconButton icon="pencil" size={24} iconColor="#FFFFFF" onPress={() => navigation.navigate('EditScreenofGuardian')} />
                </View>
            </LinearGradient>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image
                    resizeMode='contain'
                    source={require('../ScreensOfGuardian/assets/Images/avatar.jpeg')} // Replace with profile picture URL
                    style={styles.profileImage}
                />
                <Text style={styles.profileEmail}>{profile?.userName}</Text>
                <Text style={styles.profileName}>{profile?.email}</Text>
                <Text style={styles.profileEmail}>{profile?.phone}</Text>

                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.iconWrapper1}>
                            <IconButton icon="information" size={30} iconColor="#8292dc" />
                        </View>
                        <Text style={styles.cardText}>{getTranslatedText("Educational Information")}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF88" />
                    </View>
                    <Divider style={styles.divider} />

                    {/* Address Details Section */}
                    <TouchableOpacity
                        onPress={() => setAddressModalVisible(true)} // Open address modal
                        style={styles.cardContent}
                    >
                        <View style={styles.iconWrapper2}>
                            <IconButton icon="package" size={30} iconColor="#67a298" />
                        </View>
                        <Text style={styles.cardText}>{getTranslatedText("Address Details")}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF88" />
                    </TouchableOpacity>
                    <Divider style={styles.divider} />

                    <View style={styles.cardContent}>
                        <View style={styles.iconWrapper3}>
                            <IconButton icon="credit-card" size={30} iconColor="#6296da" />
                        </View>
                        <Text style={styles.cardText}>{getTranslatedText("Payment History")}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF88" />
                    </View>
                    <Divider style={styles.divider} />

                    <TouchableOpacity
                        onPress={handleLogoutConfirmation}
                        style={styles.cardContent}>
                        <View style={styles.iconWrapper4}>
                            <IconButton icon="logout" size={30} iconColor="#df9179" />
                        </View>
                        <Text style={styles.cardText}>{getTranslatedText("Logout")}</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4CAF88" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Address Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addressModalVisible}
                onRequestClose={() => setAddressModalVisible(false)}
            >
            </Modal>
            {/* Master Login Registration Modal */}
            <MasterLoginRegistrationModal
                visible={isModalVisible}
                onClose={handleModalClose}
                onConfirm={handleLogoutConfirmation} // Confirm logout action
                title="Confirm Logout"
                message="Are you sure you want to logout?"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create
    ({
        container: {
            flexGrow: 1,
            backgroundColor: '#EDF4F7', // Page background color
        },
        header: {
            backgroundColor: '#00b36b', // Header background color
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: height * 0.1, // Header height based on screen height
            marginBottom: 16,
            // borderBottomLeftRadius: 20, // Rounded corners on the bottom of the header
            // borderBottomRightRadius: 20, // Rounded corners on the bottom of the header
            shadowColor: '#000', // Shadow effect
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        headerTitle: {
            marginBottom: 20,
            color: '#FFFFFF',
            fontSize: width * 0.06, // Font size based on screen width
            fontWeight: 'bold',
        },
        headerIcons: {
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
        },
        profileContainer: {
            flex: 1,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            marginTop: -30,
            backgroundColor: '#F2F2F2', // Profile card background
            padding: 16,
            alignItems: 'center',
            elevation: 8, // More prominent shadow for the profile section
            shadowColor: '#000', // Shadow color for profile section
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
        },
        profileImage: {
            borderWidth: 1,
            width: 150,
            height: 130,
            borderRadius: 75,
            marginBottom: 8,
        },
        profileName: {
            fontSize: width * 0.05, // Font size based on screen width
            fontWeight: 'bold',
            color: '#2E3A59',
        },
        profileEmail: {
            fontSize: width * 0.04, // Font size based on screen width
            color: '#6D778B',
            marginBottom: 16,
        },

        infoBadgeTitle: {
            fontSize: width * 0.04, // Font size based on screen width
            color: '#fff', // Badge subtitle color
        },
        infoBadgeValue: {
            fontSize: width * 0.05, // Font size based on screen width
            fontWeight: 'bold',
            color: '#fff', // Badge value color
        },
        card: {
            width: '108%', // Ensure the card takes full width
            marginTop: 40,
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingVertical: 12,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        cardContent: {
            height: 35,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16, // Space between sections
        },
        iconWrapper1: {
            justifyContent: 'center',
            marginTop: 12,
            alignItems: 'center',
            height: 40,
            width: 40,
            backgroundColor: '#dfe4fe', // Circular border color
            borderRadius: 10, // Circular shape
            //padding: 8,
            marginRight: 12, // Space between icon and text
        },
        iconWrapper2: {
            justifyContent: 'center',
            marginTop: 12,
            alignItems: 'center',
            height: 40,
            width: 40,
            backgroundColor: '#deeced', // Circular border color
            borderRadius: 10, // Circular shape
            //padding: 8,
            marginRight: 12, // Space between icon and text
        },
        iconWrapper3: {
            justifyContent: 'center',
            marginTop: 12,
            alignItems: 'center',
            height: 40,
            width: 40,
            backgroundColor: '#d2f0ff', // Circular border color
            borderRadius: 10, // Circular shape
            //padding: 8,
            marginRight: 12, // Space between icon and text
        },
        iconWrapper4: {
            justifyContent: 'center',
            marginTop: 12,
            alignItems: 'center',
            height: 40,
            width: 40,
            backgroundColor: '#fee3d4', // Circular border color
            borderRadius: 10, // Circular shape
            //padding: 8,
            marginRight: 12, // Space between icon and text
        },
        cardText: {
            flex: 1,
            fontWeight: '500',
            fontSize: width * 0.04, // Font size based on screen width
            color: '#2E3A59',
        },
        divider: {
            backgroundColor: '#ddd',
            height: 1, // Thin divider line
            marginVertical: 12,
        },
    });

export default AccountScreenofGuardian;