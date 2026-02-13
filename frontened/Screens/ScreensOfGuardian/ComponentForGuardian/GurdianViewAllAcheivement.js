import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Image,
    FlatList,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    Modal,
    ScrollView,
    StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

const THEME_COLOR = '#4361EE';
const SECONDARY_COLOR = '#6C63FF';
const ACCENT_COLOR = '#3F8EFC';

const GurdianViewAllAcheivement = ({ route, navigation }) => {
    const { achievementsData } = route.params;

    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    // Animation references
    const headerTranslateY = useRef(new Animated.Value(-100)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentScale = useRef(new Animated.Value(0.9)).current;
    const modalScale = useRef(new Animated.Value(0.8)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const headerAnimation = useRef(new Animated.Value(0)).current;

    // Create animation values for each achievement item
    // We'll manage them in an array instead of creating them in the render item function
    const itemAnimations = useRef(
        achievementsData?.map(() => ({
            translateY: new Animated.Value(50),
            opacity: new Animated.Value(0),
        })) || []
    ).current;

    // Initialize achievements and stop loading
    useEffect(() => {
        if (achievementsData && Array.isArray(achievementsData)) {
            setAchievements(achievementsData);

            // Initialize animations for each item if needed
            if (itemAnimations.length !== achievementsData.length) {
                itemAnimations.splice(0, itemAnimations.length);
                achievementsData.forEach(() => {
                    itemAnimations.push({
                        translateY: new Animated.Value(50),
                        opacity: new Animated.Value(0),
                    });
                });
            }
        }
        setIsLoading(false);
    }, [achievementsData]);

    // Animations
    useEffect(() => {
        // Header animation
        Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Content animations
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(contentScale, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ]).start();

        // Start header animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(headerAnimation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(headerAnimation, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animate each item with a staggered effect
        itemAnimations.forEach((animation, index) => {
            Animated.sequence([
                Animated.delay(index * 150),
                Animated.parallel([
                    Animated.timing(animation.translateY, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation.opacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start();
        });
    }, [achievements]);

    // Modal animations
    useEffect(() => {
        if (modalVisible) {
            Animated.parallel([
                Animated.spring(modalScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            modalScale.setValue(0.8);
            modalOpacity.setValue(0);
        }
    }, [modalVisible]);

    const truncateText = (text) => {
        if (text?.length > 100) {
            return `${text.substring(0, 100)}...`;
        }
        return text || 'No description provided';
    };

    const handleViewMore = (achievement) => {
        setSelectedAchievement(achievement);
        setModalVisible(true);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const headerColors = headerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            [THEME_COLOR, '#5E7CE2'],
            ['#3A56E8', '#7579FF']
        ]
    });

    const renderAchievementItem = ({ item, index }) => {
        const isLastItem = index === achievements.length - 1;
        const isSingleLastItem = achievements.length % 2 !== 0 && isLastItem;

        // Use the pre-created animations for this item
        const itemAnimation = itemAnimations[index] || {
            translateY: new Animated.Value(0),
            opacity: new Animated.Value(1)
        };

        return (
            <Animated.View style={[
                styles.achievementContainer,
                isSingleLastItem ? styles.centerSingleCard : {},
                {
                    opacity: itemAnimation.opacity,
                    transform: [{ translateY: itemAnimation.translateY }]
                }
            ]}>
                <View style={styles.cardWrapper}>
                    <LinearGradient
                        colors={['#ffffff', '#f8f9ff']}
                        style={styles.cardGradient}
                    >
                        <View style={styles.imageContainer}>
                            {item?.image?.name ? (
                                <Image
                                    source={{ uri: `${baseURL}/uploads/${item.image.name}` }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <LinearGradient
                                        colors={[THEME_COLOR, SECONDARY_COLOR]}
                                        style={styles.placeholderGradient}
                                    >
                                        <FontAwesome5 name="trophy" size={30} color="#fff" />
                                    </LinearGradient>
                                </View>
                            )}
                            <View style={styles.badgeContainer}>
                                <LinearGradient
                                    colors={[THEME_COLOR, SECONDARY_COLOR]}
                                    style={styles.badgeGradient}
                                >
                                    <FontAwesome5 name="medal" size={12} color="#ffffff" />
                                </LinearGradient>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {item?.title || 'Achievement'}
                            </Text>
                            <Text style={styles.cardText} numberOfLines={3}>
                                {truncateText(item?.description)}
                            </Text>
                            <TouchableOpacity
                                style={styles.viewMoreButton}
                                onPress={() => handleViewMore(item)}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={[THEME_COLOR, SECONDARY_COLOR]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.viewMoreGradient}
                                >
                                    <Text style={styles.viewMoreText}>View Details</Text>
                                    <MaterialIcons name="arrow-forward-ios" size={14} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Animated Header */}
            <Animated.View style={[
                styles.header,
                { transform: [{ translateY: headerTranslateY }] },
            ]}>
                <LinearGradient
                    colors={[THEME_COLOR, SECONDARY_COLOR]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBackground}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleGoBack}
                    >
                        <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerText}>School Achievements</Text>
                        <View style={styles.headerDivider} />
                        <Text style={styles.headerSubtext}>Excellence & Recognition</Text>
                    </View>

                    <View style={styles.headerIconContainer}>
                        <FontAwesome5 name="trophy" size={22} color="#FFD700" />
                    </View>
                </LinearGradient>

                <View style={styles.headerDecoration}></View>
            </Animated.View>

            {/* Loading Indicator */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={THEME_COLOR} />
                    <Text style={styles.loadingText}>Loading Achievements...</Text>
                </View>
            )}

            {/* Empty State */}
            {!isLoading && achievements.length === 0 && (
                <View style={styles.noAchievementsContainer}>
                    <View style={styles.emptyStateIconContainer}>
                        <LinearGradient
                            colors={[THEME_COLOR, SECONDARY_COLOR]}
                            style={styles.emptyStateIconGradient}
                        >
                            <FontAwesome5 name="medal" size={40} color="#fff" />
                        </LinearGradient>
                    </View>
                    <Text style={styles.noAchievementsText}>No achievements found</Text>
                    <Text style={styles.noAchievementsSubtext}>
                        Check back later for updates on school achievements
                    </Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => setIsLoading(true)}
                    >
                        <LinearGradient
                            colors={[THEME_COLOR, SECONDARY_COLOR]}
                            style={styles.refreshButtonGradient}
                        >
                            <Text style={styles.refreshButtonText}>Refresh</Text>
                            <Ionicons name="refresh" size={16} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            {/* Achievements List */}
            {!isLoading && achievements.length > 0 && (
                <Animated.View
                    style={[
                        styles.contentContainer,
                        {
                            opacity: contentOpacity,
                            transform: [{ scale: contentScale }],
                        },
                    ]}
                >
                    <FlatList
                        data={achievements}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.flatListContent}
                        renderItem={renderAchievementItem}
                        showsVerticalScrollIndicator={false}
                    />
                </Animated.View>
            )}

            {/* Modal for Detailed View */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                opacity: modalOpacity,
                                transform: [{ scale: modalScale }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#f8f9ff']}
                            style={styles.modalGradient}
                        >
                            <TouchableOpacity
                                style={styles.closeIconContainer}
                                onPress={() => setModalVisible(false)}
                            >
                                <LinearGradient
                                    colors={[THEME_COLOR, SECONDARY_COLOR]}
                                    style={styles.closeIconGradient}
                                >
                                    <MaterialIcons name="close" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalScrollContent}
                            >
                                <View style={styles.modalImageContainer}>
                                    {selectedAchievement?.image?.name ? (
                                        <Image
                                            source={{ uri: `${baseURL}/uploads/${selectedAchievement.image.name}` }}
                                            style={styles.modalImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.modalPlaceholderImage}>
                                            <LinearGradient
                                                colors={[THEME_COLOR, SECONDARY_COLOR]}
                                                style={styles.modalPlaceholderGradient}
                                            >
                                                <FontAwesome5 name="trophy" size={60} color="#fff" />
                                            </LinearGradient>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.modalTextContainer}>
                                    <Text style={styles.modalTitle}>
                                        {selectedAchievement?.title || 'Achievement Details'}
                                    </Text>

                                    {selectedAchievement?.date && (
                                        <View style={styles.dateContainer}>
                                            <MaterialIcons name="event" size={16} color={THEME_COLOR} />
                                            <Text style={styles.dateText}>
                                                {new Date(selectedAchievement.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.divider} />

                                    <Text style={styles.modalText}>
                                        {selectedAchievement?.description || 'No description available'}
                                    </Text>
                                </View>
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[THEME_COLOR, SECONDARY_COLOR]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.closeButtonGradient}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2ff',
    },
    header: {
        width: '100%',
        zIndex: 10,
        elevation: 3,
    },
    gradientBackground: {
        width: '100%',
        height: height * 0.11,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 5,
    },
    headerDecoration: {
        height: 15,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginTop: -20,
        backgroundColor: SECONDARY_COLOR,
        zIndex: -1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtext: {
        fontSize: 12,
        color: '#f0f2ff',
        textAlign: 'center',
        marginTop: 2,
    },
    headerDivider: {
        width: 50,
        height: 2,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 1,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
    },
    loadingOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(240, 242, 255, 0.8)',
    },
    loadingText: {
        marginTop: 15,
        color: THEME_COLOR,
        fontSize: 16,
        fontWeight: '600',
    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    achievementContainer: {
        width: '50%',
        padding: 8,
    },
    centerSingleCard: {
        width: '100%',
        maxWidth: width * 0.65,
        alignSelf: 'center',
    },
    cardWrapper: {
        borderRadius: 16,
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    cardGradient: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        height: width * 0.28,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 5,
    },
    badgeGradient: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#404b69',
        marginBottom: 6,
    },
    cardText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 19,
        marginBottom: 12,
    },
    viewMoreButton: {
        alignSelf: 'center',
        marginTop: 5,
        overflow: 'hidden',
        borderRadius: 20,
    },
    viewMoreGradient: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewMoreText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
        marginRight: 5,
    },
    noAchievementsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyStateIconGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noAchievementsText: {
        fontSize: 20,
        color: '#404b69',
        fontWeight: 'bold',
        marginTop: 5,
    },
    noAchievementsSubtext: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    refreshButton: {
        overflow: 'hidden',
        borderRadius: 25,
        marginTop: 15,
    },
    refreshButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    refreshButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        marginRight: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
    },
    modalContent: {
        width: '92%',
        maxHeight: '70%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 12,
    },
    modalGradient: {
        width: '100%',
        height: '100%',
        padding: 20,
        position: 'relative',
        borderRadius: 20,
    },
    closeIconContainer: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 10,
        borderRadius: 20,
        overflow: 'hidden',
    },
    closeIconGradient: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollContent: {
        paddingTop: 10,
        paddingBottom: 50,
    },
    modalImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalPlaceholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPlaceholderGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTextContainer: {
        width: '100%',
        padding: 5,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#404b69',
        marginBottom: 10,
        textAlign: 'center',
    },
    divider: {
        height: 2,
        backgroundColor: THEME_COLOR,
        width: 60,
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 1,
        opacity: 0.5,
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        textAlign: 'justify',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    dateText: {
        marginLeft: 6,
        color: '#666',
        fontSize: 14,
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 25,
    },
    closeButtonGradient: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default GurdianViewAllAcheivement;