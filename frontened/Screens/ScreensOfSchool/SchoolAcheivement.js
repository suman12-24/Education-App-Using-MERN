import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Image, ScrollView, Animated, TouchableWithoutFeedback, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import DeleteConfirmation from './ComponentForSchool/DeleteConfirmation';

const { width, height } = Dimensions.get('window');

const SchoolAchievement = ({ loginEmail }) => {
    const navigation = useNavigation();
    const email = loginEmail;
    const [achievements, setAchievements] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null); // To store the story to delete
    const [newImage, setNewImage] = useState(null);
    const [newText, setNewText] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollViewRef = useRef(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete confirmation modal

    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const [headerMenuVisible, setHeaderMenuVisible] = useState(false); // State for header menu visibility

    const [charCount, setCharCount] = useState(0);

    const [viewMoreModalVisible, setViewMoreModalVisible] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);


    const handleViewMore = (achievement) => {
        setSelectedAchievement(achievement);
        setViewMoreModalVisible(true);
    };


    const handleTextChange = (text) => {
        setNewText(text);
        setCharCount(text.length); // Update character count on each change
    };

    // Function to toggle header menu visibility
    const toggleHeaderMenu = () => {
        setHeaderMenuVisible((prev) => !prev);
    };

    // Function to handle "Add" and "View" menu actions
    const handleMenuOption = (option) => {
        if (option === 'Add') {
            scrollToRight(); // Trigger the scroll-to-right functionality
        } else if (option === 'View') {
            navigation.navigate('ViewAllSchoolAchievement');
        }
        setHeaderMenuVisible(false); // Close the menu
    };

    const fetchAchievements = async () => {
        try {
            const response = await axiosConfiguration.get('/school/show-all-achievement', {
                params: { loginEmail },
            });
            if (response.data && Array.isArray(response.data.successStories)) {
                setAchievements(response.data.successStories);
            } else {
                console.error('Unexpected response format:', response.data);
                setAchievements([]);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error.message);
            setAchievements([]);
        }
    };

    // Use focus effect to fetch achievements when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchAchievements();
        }, [])
    );

    const pickImage = () => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo' },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setNewImage(response.assets[0].uri);
                }
            }
        );
    };

    const scrollToRight = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true }); // Scrolls to the end position
        }
    };


    const truncateText = (text) => {
        if (text?.length > 150) {
            return `${text.substring(0, 150)}...`;
        }
        return text || 'No description provided';
    };

    const saveAchievement = async () => {
        if (!newImage || !newText.trim()) {
            alert('Please add an image and text!');
            return;
        }

        if (newText.length < 150) {
            alert('Description must be at least 130 characters!');
            return;
        }

        const formData = new FormData();
        formData.append('loginEmail', email);
        formData.append('description', newText.trim());
        formData.append('image', {
            uri: newImage,
            type: 'image/jpeg',
            name: newImage.split('/').pop(),
        });

        try {
            const response = await axiosConfiguration.post('school/add-achievement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response?.data?.message === "Success story added successfully") {
                alert('Achievement added successfully!');
                setAchievements(response?.data?.successStories);
                setNewImage(null);
                setNewText('');
                setModalVisible(false);
            } else {
                alert('Failed to add achievement.');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const deleteAchievement = async () => {
        if (!selectedStory) return;

        try {
            const response = await axiosConfiguration.delete('/school/delete-achievement', {
                data: {
                    loginEmail: email,
                    storyId: selectedStory._id, // Use the actual field name for the story ID
                },
            });


            if (response.data?.message === 'Success story deleted successfully') {
                alert('Achievement deleted successfully!');
                // Remove the deleted story from the state
                setAchievements((prevAchievements) =>
                    prevAchievements.filter((item) => item._id !== selectedStory._id)
                );
                setDeleteModalVisible(false); // Close the modal
            } else {
                console.error('Unexpected response:', response.data);
                alert('Failed to delete achievement.');
            }
        } catch (error) {
            console.error('Error deleting achievement:', error);
            alert(`Error: ${error.response?.data?.message || 'Server error occurred'}`);
        }
    };

    const handleFeatherClick = (index) => {
        if (selectedCardIndex === index) {
            setSelectedCardIndex(null); // Deselect if the same card is clicked again
        } else {
            setSelectedCardIndex(index); // Select the clicked card
        }
    };

    const dismissMenu = () => {
        setHeaderMenuVisible(false);
        setSelectedCardIndex(null); // Deselect any selected card
    };

    const handleLongPress = (achievement) => {
        setSelectedStory(achievement);  // Set the selected achievement to be deleted
        setDeleteModalVisible(true);    // Show the delete confirmation modal
        setSelectedCardIndex(null);     // Dismiss the menu immediately when a long press occurs
    };

    const handleEditClick = (achievement) => {
        setModalVisible(false); // Dismiss the modal
        setDeleteModalVisible(false); // Ensure delete modal is dismissed if open
        setSelectedCardIndex(null); // Deselect any selected card
        navigation.navigate('EditForSchoolAcheivement', { achievement });
    };

    return (
        <TouchableWithoutFeedback onPress={dismissMenu} accessible={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.gradientBackground}>
                        <Text style={styles.text}>Our Success Stories</Text>
                        <TouchableOpacity onPress={toggleHeaderMenu}>
                            <Feather name="more-vertical" size={25} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {headerMenuVisible && (
                        <View style={styles.headerMenu}>
                            <TouchableOpacity
                                style={styles.menuOption1}
                                onPress={() => handleMenuOption('Add')}
                            >
                                <Icon name="add" size={20} color="#000" style={styles.icon} />
                                <Text style={styles.menuText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuOption1}
                                onPress={() => handleMenuOption('View')}
                            >
                                <Icon name="visibility" size={20} color="#000" style={styles.icon} />
                                <Text style={styles.menuText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Animated.View style={[styles.animatedContainer]}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollView}
                        ref={scrollViewRef}
                    >
                        {achievements.map((achievement, index) => (
                            <Pressable key={index} style={styles.achievementContainer}>
                                <Pressable style={styles.circularContainer}>
                                    {achievement?.image?.name ? (
                                        <>
                                            {isLoading && (
                                                <ActivityIndicator
                                                    size="large"
                                                    color="#000"
                                                    style={styles.loader}
                                                />
                                            )}
                                            <View style={{
                                                width: width * 0.24,
                                                height: width * 0.24,
                                                borderRadius: (width * 0.24) / 2,
                                                elevation: 2,
                                                shadowColor: '#000',
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                backgroundColor: '#fff',
                                            }}>
                                                <Image
                                                    source={{
                                                        uri: `${baseURL}/uploads/${achievement.image.name}`,
                                                    }}
                                                    style={styles.image}
                                                    onLoadStart={() => setIsLoading(true)}
                                                    onLoadEnd={() => setIsLoading(false)}
                                                    onError={() =>
                                                        console.error(`Failed to load image: ${baseURL}/uploads/${achievement.image.name}`)
                                                    }
                                                />
                                            </View>
                                        </>
                                    ) : (
                                        <Icon name="add" size={50} color="#fff" />
                                    )}
                                </Pressable>

                                <View
                                    style={[
                                        styles.dynamicCard,
                                        selectedCardIndex === index && styles.selectedCard,
                                    ]}>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                position: 'absolute',
                                                top: 5,
                                                right: 5,
                                            },
                                            selectedCardIndex === index && {
                                                borderRadius: 20,
                                                backgroundColor: '#f2f2f2',
                                                padding: 1,
                                            },
                                        ]}
                                        onPress={() => handleFeatherClick(index)}
                                    >
                                        <Feather name="more-vertical" size={20} color="black" />
                                    </TouchableOpacity>

                                    {selectedCardIndex === index && (
                                        <View style={styles.cardMenu}>
                                            <TouchableOpacity style={styles.menuOption} onPress={() => handleEditClick(achievement)}>
                                                <Feather name="edit" size={16} color="#666666" style={{ marginRight: 5 }} />
                                                <Text style={styles.menuText}>Edit</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.menuOption} onPress={() => handleLongPress(achievement)}>
                                                <Feather name="trash-2" size={16} color="#e74c3c" style={{ marginRight: 5 }} />
                                                <Text style={[styles.menuText, { color: '#e74c3c' }]}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    <View style={styles.cardContentContainer}>
                                        <Text style={styles.buttonText} numberOfLines={8}>
                                            {truncateText(achievement?.description)}
                                        </Text>

                                        {achievement?.description?.length > 150 && (
                                            <TouchableOpacity
                                                style={styles.viewMoreButton}
                                                onPress={() => handleViewMore(achievement)}
                                            >
                                                <Text style={styles.viewMoreButtonText}>View More</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                        <View style={styles.achievementContainer}>
                            <TouchableOpacity
                                style={styles.circularContainer}
                                onPress={() => setModalVisible(true)}
                            >
                                <Icon name="add" size={50} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.buttonText1}>Add Achievement</Text>
                        </View>
                    </ScrollView>
                </Animated.View>

                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Achievement</Text>
                            <TouchableOpacity onPress={pickImage}
                                style={{ width: '100%', height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
                                <LinearGradient
                                    style={styles.imagePicker}
                                    colors={['#ffffff', '#f2f2f2', '#e6e6e6']} >

                                    <Text style={styles.imagePickerText}>Pick an Image</Text>

                                </LinearGradient>
                            </TouchableOpacity>

                            {newImage && (
                                <Image source={{ uri: newImage }} style={styles.previewImage} />
                            )}

                            <TextInput
                                style={[styles.input]}
                                placeholder="Enter achievement text"
                                value={newText}
                                onChangeText={handleTextChange}
                                multiline={true}
                                textAlignVertical="top"
                            />

                            <Text style={styles.charCountText}>
                                {charCount}/130 characters
                            </Text>

                            {newText.length < 130 && (
                                <Text style={styles.warningText}>You must enter at least 130 characters.</Text>
                            )}

                            <View style={styles.buttonContainer}>
                                <LinearGradient colors={['#ffffff', '#f2f2f2', '#e6e6e6']} style={styles.gradientButton}>
                                    <TouchableOpacity
                                        style={styles.buttonContent}
                                        onPress={saveAchievement}
                                    >
                                        <Text style={[styles.buttonText2, { color: '#4a56e2', }]}>Save</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <LinearGradient colors={['#ffffff', '#f2f2f2', '#e6e6e6']} style={styles.gradientButton}>
                                    <TouchableOpacity
                                        style={styles.buttonContent}
                                        onPress={() => {
                                            setNewImage(null);
                                            setNewText('');
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={[styles.buttonText2, { color: '#ff0000' }]}>Cancel</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </Modal>

                <DeleteConfirmation
                    isVisible={isDeleteModalVisible}
                    onClose={() => setDeleteModalVisible(false)}
                    onDelete={deleteAchievement}
                />

                <Modal
                    visible={viewMoreModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setViewMoreModalVisible(false)}
                >
                    <View style={styles.modalContainerx}>
                        <View style={styles.modalContentx}>
                            <Text style={styles.modalTitle}>Achievement Details</Text>
                            {selectedAchievement?.image?.name && (
                                <Image
                                    source={{ uri: `${baseURL}/uploads/${selectedAchievement.image.name}` }}
                                    style={styles.fullImagex}
                                />
                            )}
                            <Text style={styles.fullDescriptionx}>{selectedAchievement?.description}</Text>
                            <TouchableOpacity
                                style={styles.closeButtonx}
                                onPress={() => setViewMoreModalVisible(false)}
                            >
                                <Text style={styles.closeButtonTextx}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SchoolAchievement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
    },
    scrollView: {
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    achievementContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    circularContainer: {
        position: 'relative',
        zIndex: 1,
        width: width * 0.24,
        height: width * 0.24,
        borderRadius: (width * 0.24) / 2,
        backgroundColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
    text: {
        fontSize: 20,
        color: '#3e3e3e',
        fontWeight: '700',
    },
    dynamicCard: {
        height: height * 0.24,
        width: width * 0.5,
        backgroundColor: '#fff',
        elevation: 2,
        marginTop: -40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 8,
    },
    cardContentContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: -20,
    },
    buttonText: {
        marginTop: height * 0.03,
        fontSize: width * 0.035,
        color: '#000',
        fontWeight: '400',
        textAlign: 'justify',
        lineHeight: 20,
    },
    buttonText1: {
        marginTop: 5,
        fontSize: width * 0.04,
        color: '#000',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
    },
    viewMoreButton: {
        backgroundColor: '#4a56e2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        alignSelf: 'center',
        position: 'absolute',
        bottom: 3,
    },
    viewMoreButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 3,
    },
    modalTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
    },
    imagePicker: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#404040',
        fontSize: 16,
        fontWeight: '500',
    },
    previewImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4a56e2',
    },
    gradientButton: {
        borderRadius: 8,
        width: '48%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonContent: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText2: {
        fontWeight: '500',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    image: {
        width: width * 0.24,
        height: width * 0.24,
        borderRadius: (width * 0.24) / 2,
    },
    header: {
        height: height * 0.08,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 10,
    },
    gradientBackground: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 6,
    },
    animatedContainer: {
        marginTop: -10,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    selectedCard: {
        borderColor: '#4a56e2',
        borderRadius: 10,
    },
    cardMenu: {
        position: 'absolute',
        top: 35,
        right: 5,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    menuText: {
        fontSize: 15,
        color: '#666666',
    },
    headerMenu: {
        position: 'absolute',
        top: 10,
        right: 30,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 10,
        padding: 5,
        width: width * 0.22,
        height: height * 0.082,
        alignItems: 'flex-start',
    },
    menuOption1: {
        justifyContent: 'space-between',
        alignContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 5
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    charCountText: {
        color: '#666',
        fontSize: 12,
        marginTop: 5,
    },
    warningText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 5,
    },
    modalContainerx: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContentx: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitlex: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fullImagex: {
        width: '85%',
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
        resizeMode: 'cover'
    },
    fullDescriptionx: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
    },
    closeButtonx: {
        backgroundColor: '#4a56e2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    closeButtonTextx: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});