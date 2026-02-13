import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
    Platform,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');

const AboutTextBubble = ({ GurdianAboutSchoolDisplay }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [text, setText] = useState(
        GurdianAboutSchoolDisplay?.[0]?.aboutSchool || 'Welcome to our school! We are committed to providing quality education and fostering an environment of growth and learning.'
    );
    const [loading, setLoading] = useState(false);
    const [bounceAnim] = useState(new Animated.Value(0));

    // Start the bouncing animation when component mounts
    useEffect(() => {
        startBounceAnimation();
    }, []);

    // Animation for the bubble to make it more engaging
    const startBounceAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    // Calculate rotation and scale based on animation value
    const bubbleTransform = {
        transform: [
            {
                rotate: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '0deg']
                })
            },
            {
                scale: bounceAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.02, 1]
                })
            }
        ]
    };

    useEffect(() => {
        if (GurdianAboutSchoolDisplay && GurdianAboutSchoolDisplay.length > 0) {
            const aboutSchoolText = GurdianAboutSchoolDisplay[0]?.aboutSchool || 'Welcome to our school! We are committed to providing quality education and fostering an environment of growth and learning.';
            setText(aboutSchoolText);
        }
    }, [GurdianAboutSchoolDisplay]);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const renderText = () => {
        if (text && text.length > 50) {
            return (
                <Text style={styles.text}>
                    {text.slice(0, 100)}...{' '}
                    <Text
                        style={styles.viewMoreText}
                        onPress={toggleModal}
                    >
                        View More
                    </Text>
                </Text>
            );
        }
        return <Text style={styles.text}>{text}</Text>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../Images/DemoBanner/Director.png')} // Ensure this path is correct
                    style={styles.image}
                />
            </View>
            <View style={styles.speechBubbleContainer}>
                <View style={styles.triangle}></View>
                <Animated.View style={[styles.speechBubble, bubbleTransform]}>
                    {renderText()}
                </Animated.View>
            </View>

            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType={Platform.OS === 'ios' ? 'light' : 'thinMaterial'}
                        blurAmount={10}
                        reducedTransparencyFallbackColor="rgba(0,0,0,0.7)"
                    />
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <View style={styles.modalTouchableArea} />
                    </TouchableWithoutFeedback>
                    <LinearGradient
                        colors={['#ffffff', '#f8f9fa']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalContainer}
                    >
                        {/* Decorative Elements */}
                        <View style={styles.decorationTop}></View>
                        <View style={styles.decorationBottom}></View>

                        {/* Close Icon */}
                        <TouchableOpacity
                            style={styles.closeIconContainer}
                            onPress={toggleModal}
                        >
                            <LinearGradient
                                colors={['#f6f6f6', '#e9e9e9']}
                                style={styles.closeIconGradient}
                            >
                                <Icon name="close" size={23} color="#333" />
                            </LinearGradient>
                        </TouchableOpacity>

                        {loading ? (
                            <ActivityIndicator size="large" color="#6a11cb" />
                        ) : (
                            <>
                                <Text style={styles.modalTitle}>About the School</Text>
                                <View style={styles.divider}></View>
                                <Text style={styles.modalText}>{text}</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={toggleModal}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#4361EE', '#2575fc']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.gradientButton}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        )}
                    </LinearGradient>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: height * 0.05,
        marginLeft: width * 0.06,
        flexDirection: 'row',
    },
    imageContainer: {
        width: width * 0.2,
        marginTop: -height * 0.05,
    },
    image: {
        width: width * 0.2,
        height: height * 0.2,
        borderRadius: width * 0.05,
        resizeMode: 'cover',
        backgroundColor: '#fff',
    },
    speechBubbleContainer: {
        marginLeft: -5,
        flexDirection: 'row',
        width: '75%',
        marginTop: height * 0.02,
    },
    triangle: {
        width: 0,
        height: 0,
        borderTopWidth: height * 0.012,
        borderBottomWidth: height * 0.02,
        borderRightWidth: width * 0.12,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#ffde59',
        marginTop: -height * 0.015,
        marginRight: -width * 0.04,
        transform: [{ rotate: '35deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,

    },
    speechBubble: {
        backgroundColor: '#ffde59',
        padding: height * 0.018,
        borderRadius: width * 0.04,
        maxWidth: '93%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: height * 0.005 },
        shadowOpacity: 0.2,
        shadowRadius: width * 0.03,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    text: {
        color: '#333',
        fontSize: 16,
        lineHeight: height * 0.03,
        fontWeight: '500',
    },
    viewMoreText: {
        color: '#6a11cb',
        fontSize: height * 0.022,
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTouchableArea: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: width * 0.85,
        borderRadius: width * 0.05,
        padding: height * 0.035,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
        overflow: 'hidden',
    },
    decorationTop: {
        position: 'absolute',
        top: -width * 0.1,
        right: -width * 0.1,
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width * 0.15,
        backgroundColor: 'rgba(106, 17, 203, 0.1)',
    },
    decorationBottom: {
        position: 'absolute',
        bottom: -width * 0.15,
        left: -width * 0.15,
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: width * 0.2,
        backgroundColor: 'rgba(37, 117, 252, 0.1)',
    },
    modalTitle: {
        fontSize: height * 0.032,
        fontWeight: 'bold',
        marginBottom: height * 0.015,
        textAlign: 'center',
        color: '#333',
        marginTop: height * 0.01,
        letterSpacing: 0.5,
    },
    divider: {
        height: 2,
        width: '40%',
        backgroundColor: '#6a11cb',
        marginBottom: height * 0.025,
        borderRadius: 1,
    },
    modalText: {
        fontSize: height * 0.022,
        lineHeight: height * 0.033,
        color: '#444',
        marginBottom: height * 0.03,
        textAlign: 'justify',
    },
    closeButton: {
        borderRadius: height * 0.03,
        width: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    gradientButton: {
        paddingVertical: height * 0.015,
        borderRadius: height * 0.03,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: height * 0.022,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    closeIconContainer: {
        position: 'absolute',
        top: height * 0.02,
        right: height * 0.02,
        zIndex: 10,
    },
    closeIconGradient: {
        width: width * 0.1,
        height: height * 0.035,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
});

export default AboutTextBubble;