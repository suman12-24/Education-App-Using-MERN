import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');

const AdBanner = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Create sequence of animations
            Animated.sequence([
                // First shrink and fade out
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0.6,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.95,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: 10,
                        duration: 400,
                        useNativeDriver: true,
                    })
                ]),
                // Then update the index
                Animated.timing(fadeAnim, {
                    toValue: 0.6,
                    duration: 0,
                    useNativeDriver: true,
                    onComplete: () => {
                        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
                    }
                }),
                // Finally grow and fade in
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.elastic(1),
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ]),
            ]).start();
        }, 5000); // Increased time between transitions

        return () => clearInterval(interval);
    }, [banners]);

    const handleBannerPress = () => {
        // Pulse animation on press
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();

        alert(`Clicked on banner: ${banners[currentIndex].title}`);
    };

    // Pagination indicators
    const renderDots = () => {
        return (
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === currentIndex && styles.paginationDotActive
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleBannerPress}
                style={styles.touchableArea}
            >
                <Animated.View
                    style={[
                        styles.bannerContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { scale: scaleAnim },
                                { translateY: translateYAnim }
                            ]
                        }
                    ]}
                >
                    <Image
                        source={{ uri: banners[currentIndex].image }}
                        style={styles.bannerImage}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.overlay}
                    >
                        <Text style={styles.bannerTitle}>{banners[currentIndex].title}</Text>
                        {banners[currentIndex].subtitle && (
                            <Text style={styles.bannerSubtitle}>{banners[currentIndex].subtitle}</Text>
                        )}

                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>NEW</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
            {renderDots()}
        </View>
    );
};

export default AdBanner;

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    touchableArea: {
        alignItems: 'center',
    },
    bannerContainer: {
        width: width * 0.92,
        height: 180, // Increased height
        borderRadius: 20, // More rounded corners
        overflow: 'hidden',
        alignSelf: 'center',
        elevation: 5, // Increased shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Changed to cover
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        paddingHorizontal: 12,
        paddingVertical: 15,
        justifyContent: 'flex-end',
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    bannerSubtitle: {
        color: '#f0f0f0',
        fontSize: 14,
        marginTop: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#007AFF',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    badgeContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    badge: {
        backgroundColor: '#FF3B30',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});