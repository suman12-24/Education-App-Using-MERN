import React, { useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { updateFavouriteSchools } from '../../../Redux/slices/authSlice';
import { updateFavouriteSchoolsForUser } from '../../../Redux/addSchoolToFavourite';
import MasterLoginRegistrationModal from '../../MasterLoginRegistrationModal';

const VerticalSchoolCard = ({ schoolData }) => {
    const SchoolId = schoolData._id;
    const dispatch = useDispatch();
    const { token, favouriteSchools = [] } = useSelector((state) => state.auth);
    const navigation = useNavigation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const [imageError, setImageError] = useState(false);

    // Animation values for the floating message
    const messageOpacity = useRef(new Animated.Value(0)).current;
    const messageScale = useRef(new Animated.Value(0.5)).current;
    const [messageVisible, setMessageVisible] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [messageType, setMessageType] = useState('success');

    // Extract address components
    const street = schoolData?.reachUs?.address?.street;
    const district = schoolData?.reachUs?.address?.district;
    const state = schoolData?.reachUs?.address?.state;

    const defaultImage = require('../Images/DemoBanner/artFaci.png');

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
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

        // Auto hide after 3 seconds
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
                showFloatingMessage(
                    updatedFavouriteSchools.includes(SchoolId)
                        ? 'School added to favourites!'
                        : 'School removed from favourites!',
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

    return (
        <>
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
                {/* Top viewed badge */}
                <View style={styles.badgeContainer}>
                    <LinearGradient
                        colors={['#505ce2', '#3a47df']}
                        style={styles.badge}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="eye" size={14} color="#fff" />
                        <Text style={styles.badgeText}>Top Viewed</Text>
                    </LinearGradient>
                </View>

                {/* School Image - Fixed Height */}
                <View style={styles.imageContainer}>
                    <Image
                        source={imageError ? defaultImage : { uri: `${baseURL}/uploads/${schoolData?.profilePicture?.image}` }}
                        style={styles.schoolImage}
                        onError={() => setImageError(true)}
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={handleFavouriteToggle}
                    >
                        <MaterialCommunityIcons
                            name={(favouriteSchools || []).includes(SchoolId) ? "heart" : "heart-outline"}
                            size={24}
                            color="#4a56e2"
                        />
                    </TouchableOpacity>
                </View>

                {/* School Info - Fixed Heights for Text Elements */}
                <View style={styles.infoContainer}>
                    <View style={styles.titleContainer}>
                        <Feather name="award" size={16} color="#e65c00" style={styles.titleIcon} />
                        <View style={styles.nameWrapper}>
                            <Text style={styles.schoolName} numberOfLines={2} ellipsizeMode="tail">
                                {schoolData.name || "School Name"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.addressContainer}>
                        <Ionicons name="location-sharp" size={14} color="#666666" style={styles.addressIcon} />
                        <View style={styles.addressWrapper}>
                            <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
                                {street ? street : <Text style={{ color: 'red' }}>Street not available</Text>}
                                {", " + street && district ? ', ' : ''}{district}
                                {(street || district) && state ? ', ' : ''}{state}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={handleViewDetails}
                >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                    <Feather name="chevron-right" size={16} color="#4a56e2" />
                </TouchableOpacity>

                {/* Floating message */}
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
                                size={18}
                                color="#fff"
                                style={styles.messageIcon}
                            />
                            <Text style={styles.messageText}>{messageText}</Text>
                            <TouchableOpacity onPress={hideFloatingMessage} style={styles.closeButton}>
                                <Feather name="x" size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </Animated.View>
           
        </TouchableWithoutFeedback>
         <MasterLoginRegistrationModal
         visible={isModalVisible}
         onClose={toggleModal}
         title="Custom Modal"
         navigationRoute="SchoolDetailsScreen"
         SchoolId={SchoolId}
     />
     </>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 240, // Fixed card height
        borderRadius: 12,
        marginHorizontal: 3,
        marginBottom: 3,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
        marginLeft: 4,
    },
    imageContainer: {

        height: 110, // Fixed image height
        width: '100%',
        position: 'relative',
    },
    schoolImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        padding: 6,
    },
    infoContainer: {
        padding: 8,
        height: 90, // Fixed info container height
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 3,
        height: 30, // Fixed title container height
    },
    titleIcon: {
        marginRight: 5,
        marginTop: 2,
    },
    nameWrapper: {
        flex: 1,
        height: 35, // Exact height for 2 lines of text at this font size
    },
    schoolName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#303030',
        lineHeight: 15,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 40, // Fixed address container height
    },
    addressIcon: {
        marginRight: 4,
        marginTop: 2,
    },
    addressWrapper: {
        flex: 1,
        height: 30, // Exact height for 2 lines of text at this font size
    },
    addressText: {
        fontSize: 12,
        color: '#666666',
        lineHeight: 16,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        height: 35, // Fixed button height
    },
    detailsButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4a56e2',
        marginRight: 4,
    },
    messageContainer: {
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        padding: 8,
        borderRadius: 6,
        zIndex: 1000,
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageIcon: {
        marginRight: 6,
    },
    messageText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    closeButton: {
        padding: 2,
    }
});

export default VerticalSchoolCard;