import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, Text, ImageBackground, StyleSheet, TouchableWithoutFeedback, Image, Pressable, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // For basic Material icons
import Ionicons from 'react-native-vector-icons/Ionicons'; // For modern iOS-style icons
import Feather from 'react-native-vector-icons/Feather'; // For minimalist icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // For more material icons
import MasterLoginRegistrationModal from '../../MasterLoginRegistrationModal';
import { useDispatch, useSelector } from 'react-redux';
import axiosConfiguration, { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { updateFavouriteSchools } from '../../../Redux/slices/authSlice';
import { updateFavouriteSchoolsForUser } from '../../../Redux/addSchoolToFavourite';

const CardDemo = ({ schoolData }) => {

    const SchoolId = schoolData._id;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();
    const { token, email, favouriteSchools = [] } = useSelector((state) => state.auth);

    const scaleValue = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();
    const [isFavourite, setIsFavourite] = useState(
        favouriteSchools ? favouriteSchools.includes(SchoolId) : false
    );

    // Animation values for the floating message
    const messageOpacity = useRef(new Animated.Value(0)).current;
    const messageScale = useRef(new Animated.Value(0.5)).current;
    const [messageVisible, setMessageVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
    const street = schoolData?.reachUs?.address?.street;
    const region = schoolData?.reachUs?.address?.region;
    const district = schoolData?.reachUs?.address?.district;
    const state = schoolData?.reachUs?.address?.state;
    const pin = schoolData?.reachUs?.address?.pin;
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.93,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleViewDetails = () => {
        if (token) {
            navigation.navigate('SchoolDetailsScreen', { SchoolId });

        } else {
            setIsModalVisible(true);
        }
    };

    // Show floating message
    const showFloatingMessage = (message, type = 'success') => {
        setMessageText(message);
        setMessageType(type);
        setMessageVisible(true);

        // Reset animations
        messageOpacity.setValue(0);
        messageScale.setValue(0.5);

        // Start animations
        Animated.parallel([
            Animated.timing(messageOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(messageScale, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto hide after 3 seconds (extended from 2 seconds)
        setTimeout(() => {
            hideFloatingMessage();
        }, 3000);
    };

    // Hide floating message
    const hideFloatingMessage = () => {
        Animated.parallel([
            Animated.timing(messageOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(messageScale, {
                toValue: 0.5,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setMessageVisible(false);
        });
    };

    const handleFavouriteToggle = async () => {
        if (!token) {
            showFloatingMessage('Please Login to favorite', 'error');
            return;
        }

        try {
            // Get updated favouriteSchools array
            let updatedFavouriteSchools = [...favouriteSchools];

            if (updatedFavouriteSchools.includes(SchoolId)) {
                updatedFavouriteSchools = updatedFavouriteSchools.filter(id => id !== SchoolId);
            } else {
                updatedFavouriteSchools.push(SchoolId);
            }

            // Dispatch the updated list to Redux
            dispatch(updateFavouriteSchools(updatedFavouriteSchools));

            // Call API to sync changes with backend
            const success = await updateFavouriteSchoolsForUser();

            if (success) {
                setIsFavourite(!isFavourite); // Toggle UI state
                showFloatingMessage(
                    updatedFavouriteSchools.includes(SchoolId)
                        ? 'School add to favourite!'
                        : 'School remove from favourite!',
                    'success'
                );
            } else {
                throw new Error('Failed to update favourite schools.');
            }
        } catch (error) {
            console.error('Error updating favourites:', error);
            showFloatingMessage('An error occurred. Please try again.', 'error');
        }
    };

    const [imageError, setImageError] = useState(false);  // State to track image load error
    const defaultImage = require('../Images/DemoBanner/artFaci.png');  // Default image path

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
                    <ImageBackground
                        source={require('../Images/cardBkg1111.png')} // Replace with your image path
                        style={styles.backgroundImage}
                        imageStyle={{ borderRadius: 10 }} // Ensures the background image has rounded corners
                    >
                        <View style={[styles.contentContainer, { flexDirection: 'row' }]}>
                            <View style={{ width: '25%', marginLeft: '2%' }}>
                                <Image
                                    source={imageError ? defaultImage : { uri: `${baseURL}/uploads/${schoolData?.profilePicture?.image}` }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50,
                                        backgroundColor: '#fff',
                                    }}
                                    onError={() => setImageError(true)} // Set the error state if image fails to load
                                />
                            </View>

                            <View style={{ width: '71%', height: '100%', paddingLeft: '4%', paddingBottom: '4%', paddingTop: '2%', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <View style={{ height: '65%', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <View style={styles.titleContainer}>
                                        <Feather name="award" size={18} color="#e65c00" style={styles.titleIcon} />
                                        <Text style={[styles.text, { marginBottom: 3 }]} numberOfLines={2}>
                                            {schoolData.name.length > 25 ? `${schoolData.name.slice(0, 25)}...` : schoolData.name}
                                        </Text>
                                    </View>

                                    <View style={styles.addressContainer}>
                                        <Ionicons name="location-sharp" size={18} color="#666666" style={styles.addressIcon} />
                                        <Text style={{ fontSize: 13 }} numberOfLines={3}>
                                            {street ? (
                                                street
                                            ) : (
                                                <Text style={{ color: 'red' }}>Street not available</Text>
                                            )}
                                            {", "}{region}, {district}, {state} - {pin}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5, }}>
                                    <TouchableOpacity onPress={handleFavouriteToggle} style={styles.favoriteButton}>
                                        <MaterialCommunityIcons
                                            name={(favouriteSchools || []).includes(SchoolId) ? "heart" : "heart-outline"}
                                            size={26}
                                            color="#4a56e2"
                                            style={{ marginRight: 20 }}
                                        />
                                    </TouchableOpacity>
                                    <LinearGradient
                                        colors={['#505ce2', '#3a47df']} // Gradient colors (red to coral)
                                        style={{
                                            height: 34,
                                            width: '38%',
                                            marginRight: '-10%',
                                            borderTopLeftRadius: 20,
                                            borderBottomLeftRadius: 20,
                                        }}
                                        start={{ x: 0.5, y: 0 }} // Vertical gradient start
                                        end={{ x: 0.5, y: 1 }}   // Vertical gradient end
                                    >
                                        <TouchableOpacity
                                            onPress={handleViewDetails}
                                            style={{
                                                flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                                                alignContent: 'center', alignSelf: 'center',
                                            }} >
                                            <Text style={{
                                                color: '#fff', fontWeight: '700', fontSize: 15, marginRight: 7
                                            }}>Details</Text>

                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>

                        <MasterLoginRegistrationModal
                            visible={isModalVisible}
                            onClose={toggleModal}
                            title="Custom Modal"
                            navigationRoute="SchoolDetailsScreen"
                            SchoolId={SchoolId}
                        />

                    </ImageBackground>
                </Animated.View>
            </TouchableWithoutFeedback>

            {/* Floating message with modern icon */}
            {messageVisible && (
                <Animated.View
                    style={[
                        styles.messageContainer,
                        {
                            opacity: messageOpacity,
                            transform: [{ scale: messageScale }],
                            backgroundColor: messageType === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)'
                        }
                    ]}
                >
                    <View style={styles.messageContent}>
                        <Ionicons
                            name={messageType === 'success' ? 'checkmark-circle' : 'alert-circle'}
                            size={22}
                            color="#fff"
                            style={styles.messageIcon}
                        />
                        <Text style={styles.messageText}>{messageText}</Text>
                        <TouchableOpacity onPress={hideFloatingMessage} style={styles.closeButton}>
                            <Feather name="x" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        marginBottom: 5,
    },
    card: {
        marginLeft: '2%',
        marginRight: '2%',
        width: "96%",
        borderRadius: 10,
        height: 'auto',
        overflow: 'hidden',
        marginBottom: 5,
        elevation: 2
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0)', // Optional overlay effect
        flex: 1,
        alignItems: 'center',
    },
    text: {
        color: '#404040',
        fontSize: 20,
        fontWeight: '700',
    },
    // New styles for icons and containers
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    titleIcon: {
        marginRight: 5,
    },
    addressContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    addressIcon: {
        marginRight: 5,
        marginTop: 2,
    },
    favoriteButton: {
        padding: 5,
    },
    // Floating Message Styles - Improved
    messageContainer: {
        height: 45,
        position: 'absolute',
        top: 30,
        right: 20,
        padding: 5,
        borderRadius: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        zIndex: 9999,
        minWidth: 250,
    },
    messageContent: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageIcon: {
        marginRight: 8,
    },
    messageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    closeButton: {
        padding: 3,
    }
});

export default CardDemo;

