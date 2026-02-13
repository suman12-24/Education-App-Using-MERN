import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    Image,
    ScrollView,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator, Pressable, StatusBar,
} from 'react-native';
import { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const SchoolAchievement = ({ GurdianAchievementsDisplayImageAndDescription }) => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

    const [achievements, setAchievements] = useState([]);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const modalAnimation = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (GurdianAchievementsDisplayImageAndDescription?.length > 0) {
            setAchievements(GurdianAchievementsDisplayImageAndDescription);
        }
    }, [GurdianAchievementsDisplayImageAndDescription]);

    useEffect(() => {
        if (isModalVisible) {
            Animated.parallel([
                Animated.spring(modalAnimation, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(cardScale, {
                    toValue: 0.95,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(modalAnimation, {
                    toValue: 0,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(cardScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isModalVisible]);

    const dismissMenu = () => {
        setSelectedAchievement(null);
    };

    const openModal = (achievement) => {
        setSelectedAchievement(achievement);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedAchievement(null);
    };

    const handleViewAll = () => {
        navigation.navigate('GurdianViewAllAcheivement', {
            achievementsData: GurdianAchievementsDisplayImageAndDescription,
        });
    };

    return (
        <TouchableWithoutFeedback onPress={dismissMenu} accessible={false}>
            <Animated.View
                style={[
                    styles.container,
                    { transform: [{ scale: cardScale }] }
                ]}
            >
                <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />

                <LinearGradient
                    colors={['#f5f5f5', '#f9f9f9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.galleryHeaderContainer}>
                        <View style={styles.headerTitleContainer}>
                            <FontAwesome name="trophy" size={23} color="#3D5AFE" style={styles.headerIcon} />
                            <Text style={styles.galleryHeader}>Our Success Stories</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleViewAll}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={['#3D5AFE', '#536DFE']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButtonBackground}
                            >
                                <Text style={styles.uploadText}>View All</Text>
                                <EvilIcons name="arrow-right" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <Animated.View style={styles.animatedContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                        ref={scrollViewRef}
                        decelerationRate="fast"
                        snapToInterval={width * 0.55}
                        snapToAlignment="center"
                    >
                        {achievements.length === 0 ? (
                            <View style={styles.emptyStateContainer}>
                                <FontAwesome name="trophy" size={40} color="#ccc" />
                                <Text style={styles.noAchievementsText}>
                                    No achievements uploaded by the school
                                </Text>
                            </View>
                        ) : (
                            achievements.map((achievement, index) => {
                                const shouldShowViewMore = achievement?.description?.length > 120;
                                const displayText = shouldShowViewMore
                                    ? achievement?.description?.slice(0, 120) + '...'
                                    : achievement?.description;

                                return (
                                    <Pressable
                                        key={index}
                                        style={styles.achievementContainer}
                                        android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
                                    >
                                        <View style={styles.imageOuterContainer}>
                                            <View style={styles.circularContainer}>
                                                {achievement?.image?.name ? (
                                                    <>
                                                        {isLoading && (
                                                            <ActivityIndicator
                                                                size="large"
                                                                color="#3D5AFE"
                                                                style={styles.loader}
                                                            />
                                                        )}
                                                        <Image
                                                            source={{
                                                                uri: `${baseURL}/uploads/${achievement.image.name}`,
                                                            }}
                                                            style={styles.image}
                                                            onLoadStart={() => setIsLoading(true)}
                                                            onLoadEnd={() => setIsLoading(false)}
                                                            onError={() =>
                                                                console.error(
                                                                    `Failed to load image: ${achievement.image.name}`
                                                                )
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <View style={styles.placeholderImage}>
                                                        <FontAwesome name="picture-o" size={30} color="#aaa" />
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        <LinearGradient
                                            colors={['#FFFFFF', '#F8F9FF']}
                                            style={styles.dynamicCard}
                                        >
                                            <View style={styles.cardContent}>
                                                <Text style={styles.buttonText}>
                                                    {displayText}
                                                </Text>
                                                {shouldShowViewMore && (
                                                    <TouchableOpacity
                                                        style={styles.viewMoreButton}
                                                        onPress={() => openModal(achievement)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <LinearGradient
                                                            colors={['#3D5AFE', '#536DFE']}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 0 }}
                                                            style={styles.viewMoreGradient}
                                                        >
                                                            <Text style={styles.viewMoreText}>View More</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </LinearGradient>
                                    </Pressable>
                                );
                            })
                        )}
                    </ScrollView>
                </Animated.View>

                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="none"
                    onRequestClose={closeModal}
                    statusBarTranslucent
                >
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                opacity: modalAnimation,
                                transform: [
                                    {
                                        translateY: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [height * 0.2, 0],
                                        }),
                                    },
                                    {
                                        scale: modalAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.9, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <View style={styles.modalBackdrop} />
                        </TouchableWithoutFeedback>

                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [
                                        {
                                            scale: modalAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1],
                                            }),
                                        },
                                    ],
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={['#3D5AFE', '#536DFE']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.modalHeader}
                            >
                                <Text style={styles.modalHeaderText}>Achievement Details</Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <FontAwesome name="times-circle" size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </LinearGradient>

                            {selectedAchievement?.image?.name && (
                                <View style={styles.modalImageContainer}>
                                    <Image
                                        source={{
                                            uri: `${baseURL}/uploads/${selectedAchievement.image.name}`,
                                        }}
                                        style={styles.modalImage}
                                        resizeMode="cover"
                                    />
                                </View>
                            )}

                            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                                <Text style={styles.modalText}>
                                    {selectedAchievement?.description}
                                </Text>
                            </ScrollView>

                            <TouchableOpacity
                                style={styles.dismissButton}
                                onPress={closeModal}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={['#536DFE', '#3D5AFE']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.dismissGradient}
                                >
                                    <Text style={styles.dismissText}>Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </Modal>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 0,
    },
    scrollView: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingTop: 5,
    },
    emptyStateContainer: {
        width: width - 40,
        height: height * 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    achievementContainer: {
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 10,
        width: width * 0.52,
    },
    imageOuterContainer: {
        position: 'relative',
        zIndex: 2,
        shadowColor: '#3D5AFE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    circularContainer: {
        width: width * 0.22,
        height: width * 0.22,
        borderRadius: (width * 0.22) / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    headerGradient: {

        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 5,
    },
    galleryHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginRight: 5,
    },
    galleryHeader: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#3D5AFE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    gradientButtonBackground: {

        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    uploadText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        marginRight: 5,
    },
    dynamicCard: {
        height: height * 0.2,
        width: width * 0.52,
        backgroundColor: '#fff',
        marginTop: -width * 0.11,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        zIndex: 1,
        padding: 10,
    },
    cardContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: width * 0.12,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    buttonText: {
        fontSize: width * 0.032,
        color: '#333',
        textAlign: 'left',
        lineHeight: width * 0.045,
    },
    viewMoreButton: {
        alignSelf: 'center',
        marginTop: 8,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#3D5AFE',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    viewMoreGradient: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    viewMoreText: {
        color: '#FFFFFF',
        fontSize: width * 0.031,
        fontWeight: '500',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: (width * 0.22) / 2,
    },
    animatedContainer: {
        marginTop: 5,
        marginBottom: 5,
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: height * 0.8,
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    modalHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    closeButton: {
        borderRadius: 20,
        padding: 5,
    },
    modalImageContainer: {
        width: '100%',
        height: height * 0.3,
        backgroundColor: '#f0f0f0',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalScroll: {
        padding: 20,
        maxHeight: height * 0.3,
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        textAlign: 'justify',
    },
    dismissButton: {
        margin: 20,
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#3D5AFE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    dismissGradient: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 25,
    },
    dismissText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    noAchievementsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 15,
        fontFamily: 'Roboto',
    },
});

export default SchoolAchievement;

