import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated, Modal } from 'react-native';
import { IconButton, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../Redux/slices/authSlice';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const AccountScreenForSchool = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { email, token } = useSelector(state => state.auth);
    const loginEmail = email;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [formData, setFormData] = useState({
        totalClasses: '',
        totalStaff: '',
        totalStudents: ''
    });

    const [isDataLoading, setIsDataLoading] = useState(true);
    // Animation refs
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchSchoolProfileDetails = async () => {
            if (email) {
                try {
                    const response = await axiosConfiguration.post('/school/school-profile-details', {
                        loginEmail: email
                    });

                    if (response?.data?.success) {
                        setProfile(response?.data?.data);
                    } else {
                        setError(response.data.message);
                    }
                } catch (err) {
                    setError('Failed to fetch profile details.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSchoolProfileDetails();
    }, [email, token]);

    useFocusEffect(
        useCallback(() => {
            fetchFacilitiesData();
        }, [])
    );

    // Function to fetch existing facilities data
    const fetchFacilitiesData = async () => {
        try {
            setIsDataLoading(true);
            const response = await axiosConfiguration.post("/school/get-school-details", { email: loginEmail });

            if (response.data && response?.data?.schoolDetails) {
                const facilityArray = response?.data?.schoolDetails?.facilitiesInfo;
                if (Array.isArray(facilityArray) && facilityArray.length > 0) {
                    const facilityData = facilityArray[0]; // taking the first item

                    setFormData({
                        totalClasses: facilityData.classes ? facilityData.classes.toString() : '',
                        totalStaff: facilityData.staff ? facilityData.staff.toString() : '',
                        totalStudents: facilityData.student ? facilityData.student.toString() : ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching facilities data:', error);
        } finally {
            setIsDataLoading(false);
        }
    };

    // Modal animation control
    useEffect(() => {
        if (showLogoutModal) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
        }
    }, [showLogoutModal]);

    const handleLogoutPress = () => {
        setShowLogoutModal(true);
    };

    const handleCancelLogout = () => {
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start(() => {
            setShowLogoutModal(false);
        });
    };

    const handleConfirmLogout = () => {
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
    };

    // Format the full address from API data
    const formatFullAddress = () => {
        if (!profile?.location?.address) return 'Address not available';

        const address = profile.location.address;
        const parts = [
            address.street,
            address.district,
            address.region,
            address.state,
            address.pin
        ].filter(Boolean); // Remove empty or null values

        return parts.join(', ');
    };

    // Get additional phone number if available
    const getSecondaryPhone = () => {
        if (profile?.location?.phones && profile.location.phones[1]) {
            return profile.location.phones[1];
        }
        return null;
    };

    // Get additional email if available
    const getSecondaryEmail = () => {
        if (profile?.location?.emails && profile.location.emails[1]) {
            return profile.location.emails[1];
        }
        return null;
    };

    const menuItems = [
        {
            icon: "school",
            text: "Educational Information",
            color: "#6246EA",
            bgColor: "#E2DBFF",
            onPress: () => { }
        },
        {
            icon: "package-variant",
            text: "Subscription Pack",
            color: "#2CB67D",
            bgColor: "#DCFFF1",
            onPress: () => { }
        },
        {
            icon: "credit-card-outline",
            text: "Payment History",
            color: "#3DA9FC",
            bgColor: "#DCF2FF",
            onPress: () => { }
        },
        {
            icon: "cog-outline",
            text: "Settings",
            color: "#FF8E3C",
            bgColor: "#FFEADC",
            onPress: () => { }
        },
        {
            icon: "logout",
            text: "Logout",
            color: "#EF4565",
            bgColor: "#FFE0E6",
            onPress: handleLogoutPress
        }
    ];

    return (
        <View style={styles.container}>
            {/* Header with gradient */}
            <LinearGradient
                colors={['#4361EE', '#3A0CA3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>School Profile</Text>
                    <View style={styles.headerIcons}>
                        <IconButton
                            icon="bell-outline"
                            size={26}
                            iconColor="#FFFFFF"
                            onPress={() => { }}
                            style={styles.iconButton}
                        />
                        <IconButton
                            icon="cog-outline"
                            size={26}
                            iconColor="#FFFFFF"
                            onPress={() => { }}
                            style={styles.iconButton}
                        />
                    </View>
                </View>

                {/* Profile summary in header */}
                <View style={styles.profileSummary}>
                    <Image
                        source={require('../ScreensOfGuardian/assets/Images/avatar.jpeg')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{profile?.userName || 'School Name'}</Text>
                        <Text style={styles.profileEmail}>{profile?.email || 'school@example.com'}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('EditScreenofGuardian')}
                            style={styles.editProfileButton}
                        >
                            <Text style={styles.editProfileText}>Edit Profile</Text>
                            <MaterialCommunityIcons name="pencil" size={16} color="#4361EE" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* Main content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* School stats section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{formData.totalClasses || '-'}</Text>
                        <Text style={styles.statLabel}>Classes</Text>
                    </View>
                    <View style={[styles.statItem, styles.statBorder]}>
                        <Text style={styles.statNumber}>{formData.totalStaff || '-'}</Text>
                        <Text style={styles.statLabel}>Teachers</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{formData.totalStudents || '-'}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                    </View>
                </View>

                {/* Menu items section */}
                <View style={styles.menuContainer}>
                    <Text style={styles.sectionTitle}>Account Management</Text>

                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: item.bgColor }]}>
                                <MaterialCommunityIcons
                                    name={item.icon}
                                    size={24}
                                    color={item.color}
                                />
                            </View>
                            <Text style={styles.menuText}>{item.text}</Text>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={26}
                                color="#94A3B8"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional information section - Updated with full address details */}
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>School Information</Text>

                    {/* Primary phone */}
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="phone-outline" size={20} color="#64748B" />
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>
                            {profile?.phone || profile?.location?.phones?.[0] || 'Not available'}
                        </Text>
                    </View>

                    {/* Secondary phone if available */}
                    {getSecondaryPhone() && (
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="phone-plus-outline" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>Alt Phone:</Text>
                            <Text style={styles.infoValue}>{getSecondaryPhone()}</Text>
                        </View>
                    )}

                    {/* Primary email */}
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="email-outline" size={20} color="#64748B" />
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{profile?.email || 'Not available'}</Text>
                    </View>

                    {/* Secondary email if available */}
                    {getSecondaryEmail() && (
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="email-plus-outline" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>Alt Email:</Text>
                            <Text style={styles.infoValue}>{getSecondaryEmail()}</Text>
                        </View>
                    )}

                    {/* Full address */}
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="map-marker-outline" size={20} color="#64748B" />
                        <Text style={styles.infoLabel}>Address:</Text>
                        <Text style={styles.infoValue}>{formatFullAddress()}</Text>
                    </View>

                    {/* Street */}
                    {profile?.location?.address?.street && (
                        <View style={styles.addressDetailItem}>
                            <MaterialCommunityIcons name="road-variant" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>Street:</Text>
                            <Text style={styles.infoValue}>{profile.location.address.street}</Text>
                        </View>
                    )}

                    {/* District */}
                    {profile?.location?.address?.district && (
                        <View style={styles.addressDetailItem}>
                            <MaterialCommunityIcons name="office-building-marker" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>District:</Text>
                            <Text style={styles.infoValue}>{profile.location.address.district}</Text>
                        </View>
                    )}

                    {/* Region */}
                    {profile?.location?.address?.region && (
                        <View style={styles.addressDetailItem}>
                            <MaterialCommunityIcons name="map" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>Region:</Text>
                            <Text style={styles.infoValue}>{profile.location.address.region}</Text>
                        </View>
                    )}

                    {/* State */}
                    {profile?.location?.address?.state && (
                        <View style={styles.addressDetailItem}>
                            <MaterialCommunityIcons name="map-marker-radius" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>State:</Text>
                            <Text style={styles.infoValue}>{profile.location.address.state}</Text>
                        </View>
                    )}

                    {/* PIN Code */}
                    {profile?.location?.address?.pin && (
                        <View style={styles.addressDetailItem}>
                            <MaterialCommunityIcons name="numeric" size={20} color="#64748B" />
                            <Text style={styles.infoLabel}>PIN Code:</Text>
                            <Text style={styles.infoValue}>{profile.location.address.pin}</Text>
                        </View>
                    )}

                    {/* Website */}
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="web" size={20} color="#64748B" />
                        <Text style={styles.infoLabel}>Website:</Text>
                        <Text style={styles.infoValue}>
                            {profile?.location?.website || 'Not available'}
                        </Text>
                    </View>

                    {/* Google Maps coordinates if available */}
                    {profile?.location?.address?.googleLocation?.latitude && profile?.location?.address?.googleLocation?.longitude && (
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => {/* Add navigation to map view here */ }}
                        >
                            <MaterialCommunityIcons name="google-maps" size={20} color="#FFFFFF" />
                            <Text style={styles.mapButtonText}>View on Map</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* App version info */}
                <Text style={styles.versionText}>App Version 1.2.3</Text>
            </ScrollView>

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
                            <MaterialCommunityIcons name="alert-circle" size={50} color="#EF4565" />
                        </View>

                        <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
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
            <View style={{ height: 100 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingTop: 5,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 2,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    profileSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        marginLeft: 15,
        flex: 1,
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    profileEmail: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        marginBottom: 5,
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    editProfileText: {
        color: '#4361EE',
        fontSize: 12,
        fontWeight: '600',
        marginRight: 4,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E2E8F0',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 10,
        marginTop: 5,
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#334155',
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    addressDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingLeft: 30,
    },
    infoLabel: {
        fontSize: 14,
        color: '#64748B',
        width: 65,
        marginLeft: 8,
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4361EE',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    mapButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 30,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutModalContainer: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
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
        backgroundColor: '#FFEDF0',
        padding: 16,
        borderRadius: 50,
        marginBottom: 20,
    },
    logoutModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 12,
    },
    logoutModalText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
    },
    logoutButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    logoutButton: {
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '47%',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    confirmButton: {
        backgroundColor: '#EF4565',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    }
});

export default AccountScreenForSchool;