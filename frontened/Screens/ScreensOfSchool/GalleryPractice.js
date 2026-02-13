import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient background
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icon library
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
const { width } = Dimensions.get('window');

const Gallery = ({ loginEmail }) => {
    const logemail = loginEmail;

    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const dividerWidth = useRef(new Animated.Value(0)).current;

    // State hooks for images and loading status
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Default images if no images are uploaded or fetched
    const defaultImages = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3UGJgqugRE65s1e7dZYolh0VbSD1AN5lvQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3UGJgqugRE65s1e7dZYolh0VbSD1AN5lvQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3UGJgqugRE65s1e7dZYolh0VbSD1AN5lvQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3UGJgqugRE65s1e7dZYolh0VbSD1AN5lvQ&s',
    ];

    // Fetch images function
    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const response = await axiosConfiguration.post('/school/get-school-details', { email: logemail });

            if (response.status == 200) {
                const result = response.data;
                if (result.schoolDetails && Array.isArray(result.schoolDetails.imageGallery)) {
                    const fetchedImages = result.schoolDetails.imageGallery.map(item => item.image);
                    if (fetchedImages.length > 0) {
                        setImages(fetchedImages); // Update state with fetched images
                    } else {
                        setImages(defaultImages); // Fall back to default images if no images fetched
                    }
                } else {
                    setImages(defaultImages); // Fall back to default images if no valid data
                    Alert.alert('Error', 'Image gallery data is invalid or missing.');
                }
            } else {
                setImages(defaultImages); // Fall back to default images if the response status is not 200
                Alert.alert('Error', response.data.message || 'Failed to fetch images.');
            }
        } catch (error) {
            console.error("Error fetching images:", error.message || error);
            setImages(defaultImages); // Fall back to default images if an error occurs
            Alert.alert('Error', 'An error occurred while fetching images.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages(); // Call fetchImages on component mount

        Animated.timing(dividerWidth, {
            toValue: width * 0.9,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        const animateScroll = () => {
            let index = 0;
            const interval = setInterval(() => {
                index = (index + 1) % images.length;
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
    }, [images.length]);

    const handleImagePress = (imageUri) => {
        navigation.navigate('ImageViewer', { imageUri });
    };

    const handleUploadPress = () => {
    
        navigation.navigate('SchoolGalleryScreen', { logemail });
    };

    return (
        <View style={styles.galleryContainer}>
            <View style={styles.headerGradient}>
                <View style={styles.galleryHeaderContainer}>
                    <Text style={styles.galleryHeader}>School Gallery</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
                        <LinearGradient
                            colors={['#006699', '#0088cc']} // Gradient colors (green shades)
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientButtonBackground}
                        >
                            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                            <Text style={styles.uploadText}>Upload</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.dividerContainer}>
                <Animated.View
                    style={[styles.divider, { width: dividerWidth }]}
                />
            </View>

            {isLoading ? (
                <Text>Loading...</Text> // Display loading text or spinner
            ) : (
                <Animated.FlatList
                    ref={flatListRef}
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImagePress(item)}>
                            <Animated.View style={styles.galleryItem}>
                                <ImageBackground
                                    source={{ uri: `${baseURL}/uploads/${item}`}}
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    galleryContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        marginTop: 10
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
        fontSize: 18, // Adjust font size based on screen width
        color: '#3e3e3e',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden', // Ensures the gradient respects the border radius
    },
    gradientButtonBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    uploadText: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 8,
    },
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 10
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
});

export default Gallery;
