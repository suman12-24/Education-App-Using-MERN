import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Modal, StatusBar } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../Redux/slices/authSlice';

import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const AccountScreenofGuardian = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { email, token } = useSelector((state) => state.auth);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Add address state with a structure that accommodates both the expected format and API format
    const [address, setAddress] = useState({
        homeAddress: null,
        billingAddress: null,
        location: null // To store the API location data
    });

    // Animation values
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLogout = () => {
        // Reset animations when opening modal
        opacityAnim.setValue(0);
        scaleAnim.setValue(0.8);

        // Show the modal
        setShowLogoutModal(true);

        // Animate in
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();
    };

    useEffect(() => {
        const fetchProfileDetails = async () => {
            if (email) {
                try {
                    const response = await axiosConfiguration.get('/user/display-Profile-Details', {
                        params: { email },
                    });

                    if (response.data.success) {
                        setProfile(response.data.profile);

                        // Handle address data based on API response
                        const addressData = {
                            homeAddress: null,
                            billingAddress: null,
                            location: null
                        };

                        // Check if location data exists in the API response
                        if (response.data.profile.location) {
                            addressData.location = response.data.profile.location;

                            // Convert location data to home address format
                            addressData.homeAddress = {
                                street: '',
                                city: response.data.profile.location.District || '',
                                state: response.data.profile.location.StateName || '',
                                zipCode: response.data.profile.location.Pincode || '',
                                country: 'India', // Assuming country is India based on state and region
                                region: response.data.profile.location.RegionName || ''
                            };

                            // Use the same for billing address for now
                            addressData.billingAddress = { ...addressData.homeAddress };
                        } else {
                            // Set default address only if no location data from API
                            addressData.homeAddress = {
                                street: '',
                                city: '',
                                state: '',
                                zipCode: '',
                                country: ''
                            };
                            addressData.billingAddress = { ...addressData.homeAddress };
                        }

                        setAddress(addressData);
                    } else {
                        setError(response.data.message);
                    }
                } catch (err) {
                    setError('Failed to fetch profile details.');
                    console.error('Error fetching profile:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfileDetails();
    }, [email, token]);



    const handleCancelLogout = () => {
        // Animate out before closing
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowLogoutModal(false);
        });
    };

    const handleConfirmLogout = () => {
        // Close modal first with animation
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowLogoutModal(false);
            dispatch(clearAuth());
            navigation.reset({
                index: 0,
                routes: [{
                    name: 'BottomTabNavigator',
                    state: {
                        routes: [{
                            name: 'HomeStackNavigatior',
                            state: {
                                routes: [{ name: 'HomeScreenOfGuardian' }]
                            }
                        }]
                    }
                }]
            });
        });
    };

    // Format address either from the location API data or from address object
    const formatAddress = (addressObj) => {
        if (!addressObj) return 'No address available';

        // Format address based on available fields
        const addressParts = [];

        if (addressObj.street && addressObj.street.trim()) {
            addressParts.push(addressObj.street);
        }

        if (addressObj.city && addressObj.city.trim()) {
            addressParts.push(addressObj.city);
        }

        if (addressObj.state && addressObj.state.trim()) {
            addressParts.push(addressObj.state);
        }

        if (addressObj.zipCode && addressObj.zipCode.trim()) {
            addressParts.push(addressObj.zipCode);
        }

        if (addressObj.country && addressObj.country.trim()) {
            addressParts.push(addressObj.country);
        }

        if (addressObj.region && addressObj.region.trim()) {
            addressParts.push(`(${addressObj.region})`);
        }

        return addressParts.length > 0 ? addressParts.join(', ') : 'No address available';
    };

    // Format location data directly from API format
    const formatLocationData = (location) => {
        if (!location) return 'No location data available';

        const locationParts = [];

        if (location.RegionName) {
            locationParts.push(location.RegionName);
        }

        if (location.District) {
            locationParts.push(location.District);
        }

        if (location.StateName) {
            locationParts.push(location.StateName);
        }

        if (location.Pincode) {
            locationParts.push(location.Pincode);
        }

        return locationParts.length > 0 ? locationParts.join(', ') : 'No location data available';
    };

    return (
        <View style={styles.outerContainer}>
            <LinearGradient
                colors={['#4a56e2', '#5c67e5', '#7985f0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>My Profile</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconCircle}>
                            <MaterialCommunityIcons name="bell" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconCircle}
                            onPress={() => navigation.navigate('EditScreenofGuardian')}
                        >
                            <MaterialCommunityIcons name="pencil" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* Profile image container positioned absolutely to overlap the header */}
            <View style={styles.profileImageContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        resizeMode='cover'
                        source={require('../ScreensOfGuardian/assets/Images/avatar.jpeg')}
                        style={styles.profileImage}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.profileName}>{profile?.userName || 'No User Name Found'}</Text>
                    <Text style={styles.profileEmail}>{profile?.email || 'No Email Found'}</Text>
                    <Text style={styles.profilePhone}>{profile?.phone || 'No Phone Number Found'}</Text>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.cardItem}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#e1e4ff' }]}>
                            <MaterialCommunityIcons name="school" size={24} color="#4a56e2" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>Educational Information</Text>
                            <Text style={styles.cardSubtitle}>School, degree, certifications</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4a56e2" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={() => setAddressModalVisible(true)}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: '#deeef8' }]}>
                            <MaterialCommunityIcons name="map-marker" size={24} color="#4a56e2" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>Address Details</Text>
                            <Text style={styles.cardSubtitle}>
                                {address.location ?
                                    `${address.location.District || ''}, ${address.location.StateName || ''}` :
                                    'Home address, billing address'}
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4a56e2" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardItem}>
                        <View style={[styles.iconWrapper, { backgroundColor: '#e0efff' }]}>
                            <MaterialCommunityIcons name="credit-card" size={24} color="#4a56e2" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>Payment History</Text>
                            <Text style={styles.cardSubtitle}>Recent transactions, receipts</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4a56e2" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cardItem}
                        onPress={handleLogout}
                    >
                        <View style={[styles.iconWrapper, { backgroundColor: '#ffe5e5' }]}>
                            <MaterialCommunityIcons name="logout" size={24} color="#ff4e4e" />
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle}>Logout</Text>
                            <Text style={styles.cardSubtitle}>Exit your account</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#4a56e2" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Address Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={addressModalVisible}
                onRequestClose={() => setAddressModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={0.9}
                    onPress={() => setAddressModalVisible(false)}
                >
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true} // Prevents touch events from bubbling up
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>Address Details</Text>

                        {/* Location Section from API */}
                        {address.location && (
                            <View style={styles.addressSection}>
                                <View style={styles.addressHeader}>
                                    <MaterialCommunityIcons name="map-marker-outline" size={22} color="#4a56e2" />
                                    <Text style={styles.addressType}>Location Information</Text>
                                </View>
                                <View style={styles.addressInfo}>
                                    {address.location.RegionName && (
                                        <View style={styles.addressRow}>
                                            <Text style={styles.addressLabel}>Region:</Text>
                                            <Text style={styles.addressValue}>{address.location.RegionName}</Text>
                                        </View>
                                    )}
                                    {address.location.District && (
                                        <View style={styles.addressRow}>
                                            <Text style={styles.addressLabel}>District:</Text>
                                            <Text style={styles.addressValue}>{address.location.District}</Text>
                                        </View>
                                    )}
                                    {address.location.StateName && (
                                        <View style={styles.addressRow}>
                                            <Text style={styles.addressLabel}>State:</Text>
                                            <Text style={styles.addressValue}>{address.location.StateName}</Text>
                                        </View>
                                    )}
                                    {address.location.Pincode && (
                                        <View style={styles.addressRow}>
                                            <Text style={styles.addressLabel}>Pincode:</Text>
                                            <Text style={styles.addressValue}>{address.location.Pincode}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {!address.location && (
                            <>
                                {/* Home Address Section - Fallback when no location data */}
                                <View style={styles.addressSection}>
                                    <View style={styles.addressHeader}>
                                        <MaterialCommunityIcons name="home" size={22} color="#4a56e2" />
                                        <Text style={styles.addressType}>Home Address</Text>
                                    </View>
                                    <View style={styles.addressInfo}>
                                        <Text style={styles.addressText}>{formatAddress(address.homeAddress)}</Text>
                                    </View>
                                </View>

                                <Divider style={styles.divider} />

                            </>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setAddressModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Logout Confirmation Modal */}
            <Modal
                transparent={true}
                visible={showLogoutModal}
                animationType="none"
                onRequestClose={handleCancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.logoutModalContainer,
                            {
                                opacity: opacityAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <View style={styles.warningIconContainer}>
                            <MaterialCommunityIcons name="alert-circle" size={50} color="#FF6B6B" />
                        </View>

                        <Text style={styles.logoutModalTitle}>Logout Confirmation</Text>
                        <Text style={styles.logoutModalText}>
                            Are you sure you want to logout from your account?
                        </Text>

                        <View style={styles.logoutButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.logoutButton, styles.cancelButton]}
                                onPress={handleCancelLogout}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.logoutButton, styles.confirmButton]}
                                onPress={handleConfirmLogout}
                            >
                                <Text style={styles.confirmButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    header: {
        height: height * 0.15,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        zIndex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: height * 0.02,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: width * 0.06,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    scrollContainer: {
        paddingTop: 70,  // Add padding to account for the profile image
        paddingBottom: 30,
    },
    profileImageContainer: {
        position: 'absolute',
        top: height * 0.15 - 60,  // Position to overlap with the bottom of header
        alignSelf: 'center',
        zIndex: 2,  // Higher zIndex to appear in front
    },
    imageWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        borderWidth: 3,
        borderColor: 'white',
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    userInfoContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    profileName: {
        fontSize: width * 0.055,
        fontWeight: 'bold',
        color: '#333',
    },
    profileEmail: {
        fontSize: width * 0.038,
        color: '#666',
        marginTop: 5,
    },
    profilePhone: {
        fontSize: width * 0.038,
        color: '#666',
        marginTop: 2,
    },
    cardContainer: {
        marginHorizontal: 20,
        marginTop: 25,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: width * 0.042,
        fontWeight: '600',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: width * 0.032,
        color: '#888',
        marginTop: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#4a56e2',
        marginBottom: 20,
        textAlign: 'center',
    },
    addressSection: {
        marginBottom: 15,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressType: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    addressInfo: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 12,
    },
    addressText: {
        fontSize: width * 0.038,
        color: '#555',
        lineHeight: 22,
    },
    addressRow: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    addressLabel: {
        fontSize: width * 0.038,
        color: '#666',
        width: '30%',
    },
    addressValue: {
        fontSize: width * 0.038,
        color: '#333',
        width: '70%',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    closeButton: {
        backgroundColor: '#4a56e2',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: width * 0.04,
    },
    logoutModalContainer: {
        width: width * 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    warningIconContainer: {
        backgroundColor: '#FFEEEE',
        padding: 15,
        borderRadius: 40,
        marginBottom: 15,
    },
    logoutModalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#2E3A59',
        marginBottom: 15,
    },
    logoutModalText: {
        fontSize: width * 0.04,
        color: '#6D778B',
        textAlign: 'center',
        marginBottom: 20,
    },
    logoutButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
    },
    confirmButton: {
        backgroundColor: '#FF6B6B',
    },
    cancelButtonText: {
        fontSize: width * 0.04,
        fontWeight: '500',
        color: '#6D778B',
    },
    confirmButtonText: {
        fontSize: width * 0.04,
        fontWeight: '500',
        color: 'white',
    }
});

export default AccountScreenofGuardian;