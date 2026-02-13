import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axiosConfiguration, { baseURL } from "../../Axios_BaseUrl_Token_SetUp/axiosConfiguration";
import { useDispatch, useSelector } from "react-redux";
import { updateFavouriteSchools } from "../../Redux/slices/authSlice";
import { updateFavouriteSchoolsForUser } from "../../Redux/addSchoolToFavourite";

const { width, height } = Dimensions.get('window');

// Custom Animated Message Component
const AnimatedMessage = ({ message, type, visible, onHide }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true

                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]).start(() => {
                // Hide message after 3 seconds

                setTimeout(() => {

                    Animated.parallel([
                        Animated.timing(translateY, {
                            toValue: -100,
                            duration: 300,
                            easing: Easing.in(Easing.ease),
                            useNativeDriver: true
                        }),
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true
                        })
                    ]).start(onHide);
                }, 3000);
            });
        }
    }, [visible]);

    const backgroundColor = type === 'error' ? '#dc3545' : '#28a745';
    const iconName = type === 'error' ? 'close-circle' : 'checkmark-circle';

    return (
        <Animated.View
            style={[
                styles.animatedMessageContainer,
                {
                    backgroundColor,
                    transform: [{ translateY }],
                    opacity
                }
            ]}
        >
            <Ionicons name={iconName} size={20} color="white" style={styles.messageIcon} />
            <Text style={styles.animatedMessageText}>{message}</Text>
        </Animated.View>
    );
};

const FavoriteScreen = ({ navigation }) => {
    const { token, email, favouriteSchools = [] } = useSelector((state) => state.auth);
    const [favorites, setFavorites] = useState([]);
    const [animations, setAnimations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState({ visible: false, text: '', type: '' });
    const dispatch = useDispatch();

    const fetchFavoriteSchools = async () => {
        try {
            setLoading(true);

            const payload = {
                schoolIds: favouriteSchools
            };
            const response = await axiosConfiguration.post('/user/get-favourite-schools-by-ids', payload);
           
            if (response.data && response.data) {
                const schoolData = response.data.map(school => ({
                    id: school._id,
                    name: school.name,
                    address: `${school?.reachUs?.address?.street}, ${school?.reachUs?.address?.region}, ${school?.reachUs?.address?.district}, ${school?.reachUs?.address?.state} - ${school?.reachUs?.address?.pin}`,
                    image: `${baseURL}/uploads/${school.profilePicture?.image}`
                }));

                setFavorites(schoolData);
                setAnimations(schoolData.map(() => new Animated.Value(0)));
                setLoading(false);
                setRefreshing(false);
            } else {
                throw new Error('No schools found');
            }
        } catch (err) {
            console.error('Fetch Favorites Error:', err);
            setMessage({
                visible: true,
                text: 'Failed to fetch favorite schools',
                type: 'error'
            });
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setFavorites([]);
        fetchFavoriteSchools();
    }, [favouriteSchools]);

    useEffect(() => {
        if (animations.length > 0) {
            animations.forEach((animation, index) => {
                Animated.spring(animation, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    delay: index * 150,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [animations]);

    const removeFavorite = async (id) => {
        try {
            // Remove the school ID from favouriteSchools
            const updatedFavouriteSchools = favouriteSchools.filter(schoolId => schoolId !== id);

            // Dispatch the updated list to Redux
            dispatch(updateFavouriteSchools(updatedFavouriteSchools));

            // Call API to sync changes with backend
            const success = await updateFavouriteSchoolsForUser(updatedFavouriteSchools);

            if (success) {
                // Optimistically update the local state
                setFavorites(favorites.filter(school => school.id !== id));

                // Show success message
                setMessage({
                    visible: true,
                    text: 'School removed from favourites!',
                    type: 'success'
                });
            } else {
                throw new Error('Failed to update favourite schools.');
            }
        } catch (error) {
            console.error('Error updating favourites:', error);
            setMessage({
                visible: true,
                text: 'An error occurred. Please try again.',
                type: 'error'
            });
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchFavoriteSchools();
    };

    const navigateToSchoolDetails = (schoolId) => {
        if (token) {
            navigation.navigate('HomeStackNavigatior', {
                screen: 'SchoolDetailsScreen',
                params: { SchoolId: schoolId }  // Note: passing directly, not under another 'params' key
            });
        }
    };


    const renderSchool = ({ item, index }) => {
        const scale = animations[index] || new Animated.Value(1);
        const opacity = animations[index] || new Animated.Value(1);

        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [{ scale }],
                        opacity,
                    },]}
            >
                <LinearGradient
                    colors={['#f0f4f8', '#e6eaf0']}
                    style={styles.cardGradient}
                >
                    <TouchableOpacity
                        onPress={() => navigateToSchoolDetails(item.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardContent}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.schoolBadge}>
                                    <MaterialCommunityIcons name="school" size={16} color="white" />
                                </View>
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.name} numberOfLines={2}>
                                    {item.name}
                                </Text>
                                <View style={styles.addressContainer}>
                                    <MaterialIcons name="location-on" size={16} color="#7f8c8d" style={styles.addressIcon} />
                                    <Text style={styles.address} numberOfLines={2}>
                                        {item.address}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.viewDetailsButton}
                                    onPress={() => navigateToSchoolDetails(item.id)}
                                >
                                    <Text style={styles.viewDetailsText}>View Details</Text>
                                    <MaterialIcons name="arrow-forward" size={14} color="#4A56E2" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeFavorite(item.id)}
                            >
                                <Ionicons name="trash-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>
        );
    };

    if (loading) {
        return (
            <LinearGradient
                colors={['#f2f2f2', '#f2f2f2']}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size="large" color="#4A56E2" />
                <View style={styles.loadingTextContainer}>
                    <MaterialCommunityIcons name="school-outline" size={24} color="#4A56E2" style={styles.loadingIcon} />
                    <Text style={styles.loadingText}>Fetching Your Schools</Text>
                </View>
            </LinearGradient>
        );
    }
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#f8f9fa', '#e9ecef']}
                style={styles.gradientContainer}
            >
                <AnimatedMessage
                    message={message.text}
                    type={message.type}
                    visible={message.visible}
                    onHide={() => setMessage({ ...message, visible: false })}
                />
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <Ionicons name="heart" size={28} color="#dc3545" style={styles.headerIcon} />
                        <Text style={styles.header}>My Wishlisted Schools</Text>
                    </View>
                    <View style={styles.schoolCountContainer}>
                        <Text style={styles.schoolCount}>{favorites.length}</Text>
                        <MaterialCommunityIcons name="school" size={16} color="#333" />
                    </View>
                </View>

                <FlatList
                    data={favorites}
                    renderItem={renderSchool}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <MaterialCommunityIcons name="school-outline" size={64} color="#adb5bd" />
                                <Ionicons name="heart-dislike-outline" size={45} color="#dc3545" style={styles.overlayIcon} />
                            </View>
                            <Text style={styles.emptyText}>
                                No favorite schools found
                            </Text>
                            <Text style={styles.emptySubText}>
                                Explore schools and add them to your wishlist
                            </Text>
                            <TouchableOpacity
                                style={styles.exploreButton}
                                onPress={() => navigation.navigate('HomeStackNavigatior')}
                            >
                                <Ionicons name="search" size={18} color="white" style={styles.exploreIcon} />
                                <Text style={styles.exploreText}>Explore Schools</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#505ce2', '#3a47df']}
                        />
                    }
                />
            </LinearGradient>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    animatedMessageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    messageIcon: {
        marginRight: 8,
    },
    animatedMessageText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
        backgroundColor: 'rgba(255,255,255,0.9)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 10,
    },
    header: {
        fontSize: width * 0.055,
        fontWeight: '700',
        color: '#333',
    },
    schoolCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(74, 86, 226, 0.12)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    schoolCount: {
        fontWeight: 'bold',
        marginRight: 5,
        color: '#333',
    },
    list: {
        padding: width * 0.04,
    },
    card: {
        marginBottom: height * 0.02,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    cardGradient: {
        borderRadius: 15,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: width * 0.04,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: width * 0.25,
        height: width * 0.25,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    schoolBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#4A56E2',
        borderRadius: 12,
        padding: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    details: {
        flex: 1,
        paddingHorizontal: width * 0.04,
        justifyContent: "center",
    },
    name: {
        fontSize: width * 0.045,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    addressIcon: {
        marginRight: 4,
        marginTop: 2,
    },
    address: {
        fontSize: width * 0.035,
        color: "#7f8c8d",
        flex: 1,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailsText: {
        color: '#4A56E2',
        fontWeight: '600',
        marginRight: 5,
        fontSize: width * 0.035,
    },
    removeButton: {
        backgroundColor: "#dc3545",
        borderRadius: 10,
        padding: width * 0.025,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    loadingIcon: {
        marginRight: 8,
    },
    loadingText: {
        fontSize: 16,
        color: '#4A56E2',
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignContent: 'center',
        alignSelf: 'center',
        marginVertical: height * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyIconContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    overlayIcon: {
        position: 'absolute',
        top: 33,
        right: 10,
    },
    emptyText: {
        fontSize: 18,
        color: '#495057',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    emptySubText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 20,
    },
    exploreButton: {
        backgroundColor: '#4A56E2',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#4A56E2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    exploreIcon: {
        marginRight: 8,
    },
    exploreText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FavoriteScreen;