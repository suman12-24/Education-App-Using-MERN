import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Dimensions, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient background
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EvilIcons from 'react-native-vector-icons/EvilIcons'; // Icon library
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosConfiguration, { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const Gallery = ({ GurdianGalleryImageDisplay }) => {

    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const dividerWidth = useRef(new Animated.Value(0)).current;

    const imageGallery = GurdianGalleryImageDisplay;


    // Update the animation on focus
    useFocusEffect(
        React.useCallback(() => {
            Animated.timing(dividerWidth, {
                toValue: width * 0.9,
                duration: 1000,
                useNativeDriver: false,
            }).start();
            // Return a cleanup function if needed
            return () => {
                dividerWidth.setValue(0); // Reset the animation when the screen loses focus
            };
        }, [])
    );

    useEffect(() => {
        const animateScroll = () => {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % imageGallery.length;
                if (flatListRef.current) {
                    flatListRef.current.scrollToOffset({
                        offset: index * (width * 0.45 + 15),
                        animated: true,
                    });
                }
            }, 2500);
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

    return (
        <View style={styles.galleryContainer}>
            <View style={styles.headerGradient}>
                <View style={styles.galleryHeaderContainer}>
                    <Text style={styles.galleryHeader}>School Gallery</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleViewAllPress}>
                        <LinearGradient
                            colors={['#e6e6e6', '#e6e6e6', '#e6e6e6']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.gradientButtonBackground}
                        >
                            <Text style={styles.uploadText}>View All</Text>

                            <EvilIcons name="arrow-right" size={20} color="#3D5AFE" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.dividerContainer}>
                <Animated.View style={[styles.divider, { width: dividerWidth }]} />
            </View>

            {imageGallery.length > 0 ? (
                <Animated.FlatList
                    ref={flatListRef}
                    data={imageGallery}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => handleImagePress(index)}>
                            <Animated.View style={styles.galleryItem}>
                                <ImageBackground
                                    defaultSource={{ uri: 'https://craftypixels.com/placeholder-image/300' }}
                                    source={{ uri: `${baseURL}/uploads/${item.image}` }}
                                    style={styles.galleryImage}
                                    imageStyle={styles.imageBorder}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: width * 0.45 + 15,
                        offset: (width * 0.45 + 15) * index,
                        index,
                    })}
                />
            ) : (
                <Pressable
                    style={styles.addGalleryContainer}>
                    <View style={styles.addGalleryButton}>
                        <AntDesign name="exclamation" size={35} color="#fff" />
                    </View>
                    <Text style={styles.addGalleryText}>No Gallery Images</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    galleryContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        marginTop: 10,
    },
    headerGradient: {
        padding: 10,
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 2,
    },
    galleryHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    galleryHeader: {
        fontSize: 18,
        color: '#3e3e3e',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradientButtonBackground: {
        flexDirection: 'row',
        width: width * 0.24,
        height: height * 0.036,
        justifyContent: 'space-evenly',
        borderRadius: 10,
        alignContent: 'center',
        padding: 5
    },
    uploadText: {
        fontSize: 14,
        color: '#3D5AFE',
        fontWeight: '600',
    },
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    divider: {
        height: 2,
        backgroundColor: '#6be1a6',
    },
    galleryItem: {
        marginLeft: 8,
        marginRight: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    galleryImage: {
        width: width * 0.45,
        height: 150,
        borderRadius: 15,
    },
    imageBorder: {
        borderRadius: 15,
    },
    addGalleryContainer: {
        width: width * 0.45,
        height: 150,
        borderRadius: 15,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGalleryButton: {
        height: 90,
        width: 90,
        borderRadius: 45,
        backgroundColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addGalleryText: {
        color: '#808080',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default Gallery;

