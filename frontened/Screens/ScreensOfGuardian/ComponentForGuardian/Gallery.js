import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import axiosConfiguration, { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const Gallery = ({ GurdianGalleryImageDisplay }) => {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const dividerWidth = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(0.9)).current;

    const imageGallery = GurdianGalleryImageDisplay;

    // Update the animations on focus
    useFocusEffect(
        React.useCallback(() => {
            Animated.parallel([
                Animated.timing(dividerWidth, {
                    toValue: width * 0.9,
                    duration: 800,
                    useNativeDriver: false,
                }),
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.spring(imageScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();

            return () => {
                // Reset animations when screen loses focus
                dividerWidth.setValue(0);
                titleOpacity.setValue(0);
                imageScale.setValue(0.9);
            };
        }, [])
    );

    useEffect(() => {
        if (imageGallery.length <= 1) return;

        const animateScroll = () => {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % imageGallery.length;
                if (flatListRef.current) {
                    flatListRef.current.scrollToOffset({
                        offset: index * (width * 0.7),
                        animated: true,
                    });
                }
            }, 3000);
            return () => clearInterval(interval);
        };

        const timer = animateScroll();
        return timer;
    }, [imageGallery.length]);

    const handleImagePress = (index) => {
        navigation.navigate('ImageViewerForGurdian', { gallery: imageGallery, initialIndex: index });
    };

    const handleViewAllPress = () => {
        navigation.navigate('GurdianGalleryScreen', { imageGallery });
    };

    // Calculate dot position based on scroll
    const getInputRange = () => {
        return imageGallery.map((_, i) => i * (width * 0.7));
    };

    // Render pagination dots
    const renderPagination = () => {
        if (imageGallery.length <= 1) return null;

        return (
            <View style={styles.paginationContainer}>
                {imageGallery.map((_, index) => {
                    const inputRange = getInputRange();
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: imageGallery.map((_, i) => i === index ? 20 : 8),
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: imageGallery.map((_, i) => i === index ? 1 : 0.5),
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index.toString()}
                            style={[styles.dot, { width: dotWidth, opacity }]}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.galleryContainer}>
            <LinearGradient
                colors={['#f8f9fa', '#ffffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <Animated.View
                    style={[
                        styles.galleryHeaderContainer,
                        { opacity: titleOpacity }
                    ]}
                >
                    <View style={styles.headerLeftSection}>
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['#3D5AFE', '#2979FF']}
                                style={styles.iconBackground}
                            >
                                <Feather name="image" size={16} color="#fff" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.galleryHeader}>School Gallery</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={handleViewAllPress}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['#3D5AFE', '#2979FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButtonBackground}
                        >
                            <Text style={styles.viewAllText}>View All</Text>
                            {/* Increased icon size and added right margin for better visibility */}
                            <EvilIcons name="arrow-right" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>

            <View style={styles.dividerContainer}>
                <Animated.View
                    style={[
                        styles.divider,
                        { width: dividerWidth }
                    ]}
                />
            </View>

            {imageGallery.length > 0 ? (
                <Animated.View style={{ transform: [{ scale: imageScale }] }}>
                    <Animated.FlatList
                        ref={flatListRef}
                        data={imageGallery}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        decelerationRate="fast"
                        snapToInterval={width * 0.7}
                        snapToAlignment="start"
                        keyExtractor={(_, index) => index.toString()}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => handleImagePress(index)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.galleryItem}>
                                    <ImageBackground
                                        defaultSource={{ uri: 'https://craftypixels.com/placeholder-image/300' }}
                                        source={{ uri: `${baseURL}/uploads/${item.image}` }}
                                        style={styles.galleryImage}
                                        imageStyle={styles.imageBorder}
                                    >
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                                            style={styles.imageGradient}
                                        >
                                            <Text style={styles.imageCaption}>
                                                {item.title || `Image ${index + 1}`}
                                            </Text>
                                        </LinearGradient>
                                    </ImageBackground>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    {renderPagination()}
                </Animated.View>
            ) : (
                <Animated.View
                    style={[
                        styles.emptyStateContainer,
                        { transform: [{ scale: imageScale }] }
                    ]}
                >
                    <LinearGradient
                        colors={['#f2f2f2', '#e6e6e6']}
                        style={styles.emptyStateGradient}
                    >
                        <View style={styles.emptyIconContainer}>
                            <AntDesign name="picture" size={40} color="#a0a0a0" />
                        </View>
                        <Text style={styles.emptyStateTitle}>No Gallery Images</Text>
                        <Text style={styles.emptyStateSubtitle}>School photos will appear here</Text>
                    </LinearGradient>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    galleryContainer: {
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    headerGradient: {
        padding: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    galleryHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
    },
    iconBackground: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryHeader: {
        fontSize: 18,
        color: '#1a1a1a',
        fontWeight: '700',
        fontFamily: 'Roboto',
        letterSpacing: 0.2,
    },
    viewAllButton: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButtonBackground: {
        flexDirection: 'row',
        paddingHorizontal: 8, // Increased padding for more space
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAllText: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: '500',
        marginRight: 4, // Increased right margin for better spacing between text and icon
    },
    // Added specific style for the icon to ensure proper visibility

    dividerContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    divider: {
        height: 2,
        backgroundColor: '#3D5AFE',
        borderRadius: 1.5,
    },
    galleryItem: {
        width: width * 0.65,
        marginHorizontal: width * 0.025,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    galleryImage: {
        resizeMode: 'contain',
        width: '100%',
        height: height * 0.2,
        justifyContent: 'flex-end',
    },
    imageBorder: {
        borderRadius: 12,
    },
    imageGradient: {
        height: '40%',
        justifyContent: 'flex-end',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        padding: 10,
    },
    imageCaption: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3D5AFE',
        marginHorizontal: 3,
    },
    emptyStateContainer: {
        marginHorizontal: 16,
        height: height * 0.25,
        borderRadius: 16,
        overflow: 'hidden',
    },
    emptyStateGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#707070',
        marginBottom: 4,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: '#909090',
    },
});

export default Gallery;