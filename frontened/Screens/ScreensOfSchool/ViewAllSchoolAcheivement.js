import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
    StatusBar,
    Platform,
    SafeAreaView
} from 'react-native';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Shadow } from 'react-native-shadow-2';

const { width, height } = Dimensions.get('window');

const ViewAllSchoolAchievement = () => {
    const { email } = useSelector((state) => state.auth);
    const loginEmail = email;
    const [achievements, setAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);

    // Animation refs
    const headerTranslateY = useRef(new Animated.Value(-100)).current;
    const contentTranslateY = useRef(new Animated.Value(height)).current;
    const modalScaleAnim = useRef(new Animated.Value(0.9)).current;
    const modalOpacityAnim = useRef(new Animated.Value(0)).current;
    const cardScaleAnimations = useRef([]).current;
    const cardOpacityAnimations = useRef([]).current;

    const fetchAchievements = async () => {
        try {
            const response = await axiosConfiguration.get('/school/show-all-achievement', {
                params: { loginEmail },
            });
            if (response.data && Array.isArray(response.data.successStories)) {
                const data = response.data.successStories;
                setAchievements(data);

                // Initialize animations for each card
                cardScaleAnimations.length = data.length;
                cardOpacityAnimations.length = data.length;

                for (let i = 0; i < data.length; i++) {
                    cardScaleAnimations[i] = new Animated.Value(0.8);
                    cardOpacityAnimations[i] = new Animated.Value(0);
                }
            } else {
                console.error('Unexpected response format:', response.data);
                setAchievements([]);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error.message);
            setAchievements([]);
        } finally {
            setIsLoading(false);
            animateCardsEntrance();
        }
    };

    const animateCardsEntrance = () => {
        const animations = [];

        for (let i = 0; i < cardScaleAnimations.length; i++) {
            const scaleAnim = Animated.timing(cardScaleAnimations[i], {
                toValue: 1,
                duration: 600,
                delay: 300 + (i * 100),
                useNativeDriver: true,
            });

            const opacityAnim = Animated.timing(cardOpacityAnimations[i], {
                toValue: 1,
                duration: 600,
                delay: 300 + (i * 100),
                useNativeDriver: true,
            });

            animations.push(scaleAnim);
            animations.push(opacityAnim);
        }

        Animated.parallel(animations).start();
    };

    useFocusEffect(
        useCallback(() => {
            fetchAchievements();
        }, [])
    );

    useEffect(() => {
        Animated.parallel([
            Animated.timing(headerTranslateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(contentTranslateY, {
                toValue: 0,
                duration: 900,
                delay: 100,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const animateModalIn = () => {
        Animated.parallel([
            Animated.timing(modalScaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(modalOpacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const animateModalOut = (callback) => {
        Animated.parallel([
            Animated.timing(modalScaleAnim, {
                toValue: 0.9,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(modalOpacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(callback);
    };

    const truncateText = (text, isSingleCard = false) => {
        if (isSingleCard) {
            return text || 'No description provided';
        }
        if (text?.length > 85) {
            return `${text.substring(0, 85)}...`;
        }
        return text || 'No description provided';
    };

    const handleViewMore = (achievement, index) => {
        setSelectedAchievement(achievement);
        setSelectedCardIndex(index);
        setModalVisible(true);
        modalScaleAnim.setValue(0.9);
        modalOpacityAnim.setValue(0);
        animateModalIn();
    };

    const handleCloseModal = () => {
        animateModalOut(() => {
            setModalVisible(false);
            setSelectedAchievement(null);
        });
    };

    const renderAchievementItem = ({ item, index }) => {
        const isSingleCard = achievements.length % 2 !== 0 && index === achievements.length - 1;

        return (
            <Animated.View
                style={[
                    styles.achievementContainer,
                    isSingleCard ? styles.centerSingleCard : {},
                    {
                        opacity: cardOpacityAnimations[index] || 1,
                        transform: [{ scale: cardScaleAnimations[index] || 1 }]
                    }
                ]}
            >
                <Shadow distance={8} startColor="rgba(0, 0, 0, 0.07)" finalColor="rgba(0, 0, 0, 0.0)" offset={[0, 4]}>
                    <View style={styles.cardWrapper}>
                        <LinearGradient
                            colors={['rgba(74, 86, 226, 0.9)', 'rgba(74, 86, 226, 0.7)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardHeader}
                        >
                            <Text style={styles.cardHeaderText}>{item?.title || "Achievement"}</Text>
                        </LinearGradient>

                        <View style={styles.imageOuterContainer}>
                            {item?.image?.name ? (
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{
                                            uri: `${baseURL}/uploads/${item.image.name}`,
                                        }}
                                        style={styles.image}
                                        onError={() =>
                                            console.error(`Failed to load image: ${baseURL}/uploads/${item.image.name}`)
                                        }
                                    />
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                                        style={styles.imageGradient}
                                    />
                                </View>
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <LinearGradient
                                        colors={['#e0e0e0', '#f5f5f5']}
                                        style={styles.placeholderGradient}
                                    >
                                        <Text style={styles.placeholderText}>{item?.title?.charAt(0) || "A"}</Text>
                                    </LinearGradient>
                                </View>
                            )}
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.cardDescription} numberOfLines={4}>
                                {truncateText(item?.description, isSingleCard)}
                            </Text>

                            <View style={styles.cardFooter}>
                                <Text style={styles.cardDate}>
                                    {item?.date || "Recent"}
                                </Text>
                                <TouchableOpacity
                                    style={styles.viewMoreButton}
                                    onPress={() => handleViewMore(item, index)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.viewMoreText}>Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Shadow>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#4a56e2" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#f8f9ff', '#eef0fd', '#f8f9ff']}
                style={styles.backgroundGradient}
            />

            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    { transform: [{ translateY: headerTranslateY }] },
                ]}
            >
                <LinearGradient
                    colors={['#5c67e3', '#4a56e2', '#3a46b2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBackground}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.headerText}>Success Stories</Text>
                        <View style={styles.headerDivider} />
                        <Text style={styles.headerSubtext}>Celebrating Excellence & Achievement</Text>
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Loading Indicator */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4a56e2" />
                        <Text style={styles.loadingText}>Loading achievements...</Text>
                    </View>
                </View>
            )}

            {/* Empty State */}
            {!isLoading && achievements.length === 0 && (
                <View style={styles.noAchievementsContainer}>
                    <View style={styles.emptyStateIconContainer}>
                        <LinearGradient
                            colors={['#eef0fd', '#d8dcfb']}
                            style={styles.emptyStateIconBackground}
                        >
                            <Text style={styles.emptyStateIcon}>🏆</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.noAchievementsText}>No Achievements Yet</Text>
                    <Text style={styles.noAchievementsSubtext}>
                        Add your first success story to showcase achievements
                    </Text>
                </View>
            )}

            {/* Achievements List */}
            {!isLoading && achievements.length > 0 && (
                <Animated.View
                    style={[
                        styles.contentContainer,
                        { transform: [{ translateY: contentTranslateY }] },
                    ]}
                >
                    <FlatList
                        data={achievements}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        contentContainerStyle={styles.flatListContent}
                        renderItem={renderAchievementItem}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={4}
                        maxToRenderPerBatch={6}
                        windowSize={5}
                    />
                </Animated.View>
            )}

            {/* Modal for detailed view */}
            <Modal
                visible={modalVisible}
                animationType="none"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={handleCloseModal}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    opacity: modalOpacityAnim,
                                    transform: [{ scale: modalScaleAnim }]
                                }
                            ]}
                        >
                            <View style={styles.modalTopBar}>
                                <View style={styles.modalTopBarLine} />
                            </View>

                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {selectedAchievement?.title || "Achievement Details"}
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeIconButton}
                                    onPress={handleCloseModal}
                                >
                                    <Text style={styles.closeIcon}>×</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.modalScrollContent}
                            >
                                {selectedAchievement?.image?.name && (
                                    <View style={styles.modalImageContainer}>
                                        <Image
                                            source={{
                                                uri: `${baseURL}/uploads/${selectedAchievement.image.name}`,
                                            }}
                                            style={styles.modalImage}
                                            resizeMode="cover"
                                        />
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                                            style={styles.modalImageGradient}
                                        />
                                    </View>
                                )}

                                <View style={styles.modalTextContainer}>
                                    <View style={styles.modalMetaContainer}>
                                        <View style={styles.modalDateContainer}>
                                            <Text style={styles.modalDateLabel}>DATE</Text>
                                            <Text style={styles.modalDate}>
                                                {selectedAchievement?.date || "Recent Achievement"}
                                            </Text>
                                        </View>

                                        {selectedAchievement?.category && (
                                            <View style={styles.modalCategoryContainer}>
                                                <Text style={styles.modalCategoryLabel}>CATEGORY</Text>
                                                <Text style={styles.modalCategory}>
                                                    {selectedAchievement.category}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.modalContentDivider} />

                                    <Text style={styles.modalDescriptionTitle}>Achievement Story</Text>
                                    <Text style={styles.modalText}>
                                        {selectedAchievement?.description || 'No description available'}
                                    </Text>
                                </View>
                            </ScrollView>

                            <LinearGradient
                                colors={['rgba(248,249,255,0)', 'rgba(248,249,255,1)']}
                                style={styles.buttonGradientOverlay}
                            />

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleCloseModal}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#5c67e3', '#4a56e2']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.closeButtonGradient}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default ViewAllSchoolAchievement;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    loadingContainer: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
    loadingText: {
        marginTop: 15,
        color: '#333',
        fontWeight: '500',
        fontSize: 16,
    },
    header: {
        zIndex: 10,
    },
    gradientBackground: {
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 0 : 0,
        paddingBottom: 10,
    },
    headerContent: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    headerDivider: {
        width: 50,
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        marginVertical: 5,
        borderRadius: 10,
    },
    headerSubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        fontWeight: '400',
        letterSpacing: 0.5,
    },
    contentContainer: {
        flex: 1,
    },
    flatListContent: {
        paddingHorizontal: 10,
        paddingBottom: 80,
        paddingTop: 10,
    },
    achievementContainer: {
        width: '50%',
        padding: 5,
    },
    centerSingleCard: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    cardWrapper: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    cardHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    imageOuterContainer: {
        width: '100%',
        aspectRatio: 16 / 10,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
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
    placeholderText: {
        fontSize: 40,
        fontWeight: '600',
        color: '#999',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        padding: 10,
    },
    cardDescription: {
        fontSize: 14,
        color: '#333',
        lineHeight: 18,
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    cardDate: {
        fontSize: 12,
        color: '#777',
        fontWeight: '500',
    },
    viewMoreButton: {
        backgroundColor: 'rgba(74, 86, 226, 0.12)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    viewMoreText: {
        color: '#4a56e2',
        fontWeight: '600',
        fontSize: 12,
        textAlign: 'center',
    },
    noAchievementsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    emptyStateIconContainer: {
        marginBottom: 24,
    },
    emptyStateIconBackground: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyStateIcon: {
        fontSize: 40,
    },
    noAchievementsText: {
        fontSize: 22,
        color: '#333',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 12,
    },
    noAchievementsSubtext: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#f8f9ff',
        borderRadius: 24,
        overflow: 'hidden',
        maxHeight: '90%',
        paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    },
    modalTopBar: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    modalTopBarLine: {
        width: 60,
        height: 5,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        flex: 1,
    },
    closeIconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },
    closeIcon: {
        fontSize: 24,
        color: '#555',
        fontWeight: '400',
        lineHeight: 30,
    },
    modalScrollContent: {
        paddingBottom: 10,
    },
    modalImageContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalImageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
    },
    modalTextContainer: {
        padding: 10,
    },
    modalMetaContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    modalDateContainer: {
        marginRight: 24,
    },
    modalDateLabel: {
        fontSize: 11,
        color: '#777',
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 1,
    },
    modalDate: {
        fontSize: 15,
        color: '#4a56e2',
        fontWeight: '600',
    },
    modalCategoryContainer: {
        marginRight: 24,
    },
    modalCategoryLabel: {
        fontSize: 11,
        color: '#777',
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 1,
    },
    modalCategory: {
        fontSize: 15,
        color: '#4a56e2',
        fontWeight: '600',
    },
    modalContentDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
    },
    modalDescriptionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 26,
    },
    buttonGradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        zIndex: 1,
    },
    modalFooter: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        zIndex: 2,
        backgroundColor: 'transparent',
    },
    closeButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#4a56e2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 3,
    },
    closeButtonGradient: {
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});