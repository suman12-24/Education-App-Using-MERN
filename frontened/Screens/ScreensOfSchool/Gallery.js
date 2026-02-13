import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Dimensions, Pressable, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // For gradient background
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Icon library
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width } = Dimensions.get('window');

const Gallery = ({ loginEmail }) => {
    const email = loginEmail;
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const dividerWidth = useRef(new Animated.Value(0)).current;
    const [imageGallery, setImageGallery] = useState([]);


    // useEffect(() => {
    //     const fetchSchoolData = async () => {

    //         try {
    //             const response = await axiosConfiguration.post('/school/get-school-details', { email });
    //             const schoolDetails = response?.data?.schoolDetails;
    //             setImageGallery(schoolDetails?.imageGallery);

    //         } catch (error) {
    //             console.error('Failed to fetch school data:', error);
    //         }
    //     };

    //     if (email) {
    //         fetchSchoolData();
    //     }
    // }, [email]);


    useFocusEffect(
        React.useCallback(() => {
            const fetchSchoolData = async () => {
                try {
                    const response = await axiosConfiguration.post('/school/get-school-details', { email });
                    const schoolDetails = response?.data?.schoolDetails;
                    setImageGallery(schoolDetails?.imageGallery);
                } catch (error) {
                    console.error('Failed to fetch school data:', error);
                }
            };

            if (email) {
                fetchSchoolData();
            }

            // Optionally, return a cleanup function if needed
            return () => {
                // Cleanup logic here if necessary
            };
        }, [email])
    );
    (
        React.useCallback(() => {
            const fetchSchoolData = async () => {
                try {
                    const response = await axiosConfiguration.post('/school/get-school-details', { email });
                    const schoolDetails = response?.data?.schoolDetails;
                    setImageGallery(schoolDetails?.imageGallery);
                } catch (error) {
                    console.error('Failed to fetch school data:', error);
                }
            };

            if (email) {
                fetchSchoolData();
            }

            // Optionally, return a cleanup function if needed
            return () => {
                // Cleanup logic here if necessary
            };
        }, [email])
    );


    useEffect(() => {
        Animated.timing(dividerWidth, {
            toValue: width * 0.9,
            duration: 1000,
            useNativeDriver: false,
        }).start();

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

        navigation.navigate('ImageViewerForSchool', { gallery: imageGallery, initialIndex: index });
    };

    const handleUploadPress = () => {

        navigation.navigate('SchoolGalleryScreen', { logemail: email });
    };

    return (
        <View style={styles.galleryContainer}>
            <View style={styles.headerGradient}>
                <View style={styles.galleryHeaderContainer}>
                    <Text style={styles.galleryHeader}>School Gallery</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
                        <LinearGradient
                            colors={['#e6e6e6', '#e6e6e6', '#e6e6e6']}
                            // colors={['#4c669f', '#3b5998', '#192f6a']} // Replace with your gradient colors
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.gradientButtonBackground}
                        >
                            <Ionicons name="cloud-upload-outline" size={20} color="#3D5AFE" />
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
            {
                imageGallery.length > 0 ? <Animated.FlatList
                    ref={flatListRef}
                    data={imageGallery}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => handleImagePress(index)}>
                            <Animated.View style={styles.galleryItem}>
                                <ImageBackground
                                    source={{ uri: `${baseURL}/uploads/${item.image}` }}
                                    style={styles.galleryImage}
                                    imageStyle={styles.imageBorder}
                                />
                            </Animated.View>
                        </Pressable>
                    )}
                    getItemLayout={(_, index) => ({
                        length: width * 0.45 + 15,
                        offset: (width * 0.45 + 15) * index,
                        index,
                    })}
                /> :
                    <TouchableOpacity
                        onPress={handleUploadPress}
                        style={{
                            width: width * 0.45,
                            height: 150,
                            borderRadius: 15,
                            marginBottom: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <View style={{
                            height: 90, width: 90, borderRadius: 45,
                            backgroundColor: '#cccccc', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <FontAwesome5 name="plus" size={35} color="#fff" />
                        </View>
                        <Text style={{ color: '#808080', fontWeight: '600', fontSize: 16 }}>Add Gallery Images</Text>
                    </TouchableOpacity>
            }

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
        fontSize: 13,
        color: '#3D5AFE',
        marginLeft: 8,
        fontWeight: '600'
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
