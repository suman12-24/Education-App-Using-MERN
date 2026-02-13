import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Image as ImageCompressor } from 'react-native-compressor';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');
const imageSize = (width - 40) / 2;

const SchoolGalleryScreen = ({ route, navigation }) => {
    const { logemail } = route.params;

    const [uploadableImage, setUploadableImage] = useState([]);
    const [images, setImages] = useState([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const response = await axiosConfiguration.post('/school/get-school-details', { email: logemail });

            if (response.status === 200) {
                const result = response.data;
                if (result.schoolDetails && Array.isArray(result.schoolDetails.imageGallery)) {
                    const images = result.schoolDetails.imageGallery.map(item => item.image);
                    setImages(images);
                } else {
                    Alert.alert('Error', 'Image gallery data is invalid or missing.');
                }
            } else {
                Alert.alert('Error', response.data.message || 'Failed to fetch images.');
            }
        } catch (error) {
            console.error("Error fetching images:", error.message || error);
            Alert.alert('Error', 'An error occurred while fetching images.');
        } finally {
            setIsLoading(false);
        }
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const androidVersion = Platform.Version;

            if (androidVersion >= 33) {
                const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
                const galleryPermission = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);

                if (cameraPermission !== RESULTS.GRANTED || galleryPermission !== RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'You need to grant camera and gallery permissions.');
                    return false;
                }
            }
            else {
                const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
                const galleryPermission = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

                if (cameraPermission !== RESULTS.GRANTED || galleryPermission !== RESULTS.GRANTED) {
                    Alert.alert('Permission Denied', 'You need to grant camera and gallery permissions.');
                    return false;
                }
            }
        }

        if (Platform.OS === 'ios') {
            const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
            const galleryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

            if (cameraPermission !== RESULTS.GRANTED || galleryPermission !== RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'You need to grant camera and gallery permissions.');
                return false;
            }
        }

        return true;
    };

    const compressImage = async (uri) => {
        try {
            const compressedUri = await ImageCompressor.compress(uri, {
                compressionMethod: 'auto',
                quality: 0.8,
                maxWidth: 800,
                maxHeight: 800,
            });
            return compressedUri;
        } catch (error) {
            console.error('Image Compression Error:', error);
            Alert.alert('Error', 'Image compression failed.');
            return null;
        }
    };

    const pickImagesFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        if (images.length >= 6) {
            Alert.alert('Limit Reached', 'You can upload up to 6 images only.');
            return;
        }

        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 6,
            },
            async (response) => {
                if (!response.didCancel && !response.errorCode) {
                    const newImages = [];
                    for (const asset of response.assets) {
                        const compressedUri = await compressImage(asset.uri);
                        if (compressedUri) {
                            newImages.push(compressedUri);
                        }
                    }
                    const updatedImages = [...uploadableImage, ...newImages];

                    if (images.length + updatedImages.length > 6) {
                        Alert.alert('Limit Reached', 'You can upload up to 6 images only.');
                    } else {
                        setUploadableImage(updatedImages);
                        setIsUploaded(updatedImages.length > 0);
                    }
                } else if (response.errorCode) {
                    Alert.alert('Error', 'Image selection failed: ' + response.errorMessage);
                }
            }
        );
    };

    const captureImageFromCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        if (images.length >= 6) {
            Alert.alert('Limit Reached', 'You can upload up to 6 images only.');
            return;
        }

        launchCamera(
            {
                mediaType: 'photo',
                quality: 1,
            },
            async (response) => {
                if (!response.didCancel && !response.errorCode) {
                    const compressedUri = await compressImage(response.assets[0].uri);
                    if (compressedUri) {
                        if (images.length + uploadableImage.length < 6) {
                            const updatedImages = [...uploadableImage, compressedUri];
                            setUploadableImage(updatedImages);
                            setIsUploaded(updatedImages.length > 0);
                        } else {
                            Alert.alert('Limit Reached', 'You can upload up to 6 images in gallery.');
                        }
                    }
                } else if (response.errorCode) {
                    Alert.alert('Error', 'Image capture failed: ' + response.errorMessage);
                }
            }
        );
    };

    const handleDeleteImage = (index) => {
        Alert.alert(
            'Delete Image',
            'Are you sure you want to delete this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteImageFromServer(index),
                },
            ]
        );
    };

    const handleDeleteBrowsedImage = (index) => {
        setUploadableImage((prevImages) => prevImages.filter((_, i) => i !== index));
        if (uploadableImage.length <= 1) {
            setIsUploaded(false);
        }
    };

    const deleteImageFromServer = async (index) => {
        const imageName = images[index];
        setIsLoading(true);
        try {
            const response = await axiosConfiguration.post('school/delete-gallery-pictures', {
                loginEmail: logemail,
                imageName,
            });

            if (response.status === 200) {
                const updatedImages = images.filter((_, i) => i !== index);
                setImages(updatedImages);
                setIsUploaded(updatedImages.length > 0);

                // Show success message with animation
                showToast('Image deleted successfully!');
            } else {
                Alert.alert('Error', response.data.message || 'Failed to delete the image.');
            }
        } catch (error) {
            console.error('Delete Error:', error);
            Alert.alert('Error', 'An error occurred while deleting the image.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostImages = async () => {
        if (uploadableImage.length === 0) {
            Alert.alert('No Images', 'Please upload some images before posting.');
            return;
        }

        const formData = new FormData();
        formData.append('loginEmail', logemail);

        uploadableImage.forEach((imageUri, index) => {
            if (imageUri) {
                formData.append('imageGallery', {
                    uri: imageUri,
                    name: `image${index}.jpg`,
                    type: 'image/jpeg',
                });
            }
        });

        setIsLoading(true);

        try {
            const response = await axiosConfiguration.post('/school/update-gallery-pictures', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.data?.success) {
                showToast('Images uploaded successfully!');
                setUploadableImage([]);
                setIsUploaded(false);
                await fetchImages();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to upload images.');
            }
        } catch (error) {
            console.error('Upload Error:', error.message || error);
            Alert.alert('Error', 'An error occurred while uploading images.');
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message) => {
        // In a real implementation, you'd use a toast library
        // For now, just use an alert
        Alert.alert('Success', message);
    };

    const viewImage = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
    };

    const renderImageItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => viewImage(`${baseURL}/uploads/${item}`)}
        >
            <Image source={{ uri: `${baseURL}/uploads/${item}` }} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradientOverlay}
            />
            <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteImage(index)}
            >
                <Ionicons name="trash-outline" size={22} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderUploadableItem = ({ item, index }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.gradientOverlay}
            />
            <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteBrowsedImage(index)}
            >
                <Ionicons name="trash-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.uploadIndicator}>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>


            {/* Header */}
            <LinearGradient
                colors={['#6570e6', '#4A56E2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Text style={styles.headerText}>School Gallery</Text>
                <Text style={styles.headerSubtext}>Showcase your school's best moments</Text>
            </LinearGradient>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A56E2" />
                    <Text style={styles.loadingText}>Loading your gallery...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Uploaded Images Section */}
                    {images.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderContainer}>
                                <Ionicons name="images-outline" size={20} color="#4A56E2" />
                                <Text style={styles.sectionTitle}>Uploaded Images</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{images.length}/6</Text>
                                </View>
                            </View>

                            <FlatList
                                data={images}
                                keyExtractor={(item, index) => `uploaded-${index}`}
                                renderItem={renderImageItem}
                                numColumns={2}
                                scrollEnabled={false}
                                contentContainerStyle={styles.galleryContainer}
                            />
                        </View>
                    )}

                    {/* Empty State */}
                    {images.length === 0 && uploadableImage.length === 0 && (
                        <View style={styles.emptyStateContainer}>
                            <Ionicons name="images-outline" size={80} color="#d1d1d1" />
                            <Text style={styles.emptyStateText}>No images in your gallery yet</Text>
                            <Text style={styles.emptyStateSubtext}>Upload images to showcase your school</Text>
                        </View>
                    )}

                    {/* Browsed Images Section */}
                    {uploadableImage.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderContainer}>
                                <Ionicons name="cloud-upload-outline" size={20} color="#4A56E2" />
                                <Text style={styles.sectionTitle}>Ready to Upload</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{uploadableImage.length}</Text>
                                </View>
                            </View>

                            <FlatList
                                data={uploadableImage}
                                keyExtractor={(item, index) => `upload-${index}`}
                                renderItem={renderUploadableItem}
                                numColumns={2}
                                scrollEnabled={false}
                                contentContainerStyle={styles.galleryContainer}
                            />
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Upload Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    onPress={pickImagesFromGallery}
                    style={styles.actionButton}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#6570e6', '#4A56E2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="images-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Gallery</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={captureImageFromCamera}
                    style={styles.actionButton}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#6570e6', '#4A56E2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Camera</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {isUploaded && (
                    <TouchableOpacity
                        onPress={handlePostImages}
                        style={[styles.actionButton, styles.uploadButton]}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#32CD32', '#2ECC71']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Upload</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>

            {/* Image Viewer Modal */}
            {selectedImage && (
                <TouchableOpacity
                    style={styles.imageViewerContainer}
                    activeOpacity={1}
                    onPress={closeImageViewer}
                >
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeImageViewer}
                    >
                        <Ionicons name="close-circle" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtext: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.8,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    sectionContainer: {
        marginTop: 20,
        marginHorizontal: 15,
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    countBadge: {
        backgroundColor: '#4A56E2',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    countText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    galleryContainer: {
        marginTop: 5,
    },
    imageContainer: {
        width: imageSize,
        height: imageSize,
        margin: 5,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    deleteIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderRadius: 20,
        padding: 8,
    },
    uploadIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        borderRadius: 15,
        padding: 6,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        padding: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginTop: 20,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
        textAlign: 'center',
    },
    actionButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    uploadButton: {
        flex: 1.5,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4A56E2',
        fontWeight: '500',
    },
    imageViewerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    fullImage: {
        width: '90%',
        height: '80%',
        borderRadius: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1001,
    },
});

export default SchoolGalleryScreen;


