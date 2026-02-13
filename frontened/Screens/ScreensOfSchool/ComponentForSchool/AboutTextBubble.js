import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions, ActivityIndicator, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const AboutTextBubble = ({ loginEmail }) => {
    const email = loginEmail;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Loading state for fetching
    const iconRef = useRef(null);

    useEffect(() => {
        const fetchSchoolDetails = async () => {
            try {
                const response = await axiosConfiguration.post('/school/get-school-details', {
                    email
                });
                if (response.status === 200) {
                    const aboutSchool = response?.data?.schoolDetails?.aboutSchool ||
                        "Welcome to our school! We are committed to providing quality education and fostering an environment of growth and learning.";
                    setText(aboutSchool); // Set the default value if no data is returned
                } else {
                    showErrorMessage('Failed to fetch school details.');
                    setText("Welcome to our school! We are committed to providing quality education and fostering an environment of growth and learning."); // Default value
                }
            }
            catch (error) {
                showErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
                setText("Welcome to our school! We are committed to providing quality education and fostering an environment of growth and learning."); // Default value
            } finally {
                setIsFetching(false);
            }
        };

        fetchSchoolDetails();
    }, [email]);

    const openMenu = () => {
        iconRef.current.measureInWindow((x, y, width, height) => {
            setMenuPosition({ top: y + height, left: x });
            setIsMenuVisible(true);
        });
    };

    const toggleModal = (mode) => {
        setModalMode(mode);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleTextChange = (newText) => {
        setText(newText);
    };

    const renderText = () => {
        if (text.length > 50) {
            return (
                <>
                    <Text style={styles.text}>
                        {text.slice(0, 100)}...{' '}
                        <Text
                            style={styles.viewMoreText}
                            onPress={() => toggleModal('view')}
                        >
                            View More
                        </Text>
                    </Text>
                </>
            );
        }
        return <Text style={styles.text}>{text}</Text>;
    };

    const showErrorMessage = (message) => {
        alert(message);
    };

    const showSuccessMessage = (message) => {
        alert(message);
    };

    const submitText = async () => {
        if (text.trim().length < 50) {
            showErrorMessage('Please enter at least 50 characters.');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosConfiguration.post('/school/about-us', {
                loginEmail: email,
                aboutSchool: text,
            });

            if (response.status === 200) {
                showSuccessMessage('School details updated successfully.');
                setIsModalVisible(false);
            } else {
                showErrorMessage(response.data.message || 'Failed to update text.');
            }
        } catch (error) {
            showErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    if (isFetching) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color='#3D5AFE' />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={{ marginTop: height * 0.05, marginLeft: width * 0.05, flexDirection: 'row' }}>
            <View style={{ width: width * 0.2, marginTop: -height * 0.05 }}>
                <Image
                    source={require('../Images/DemoBanner/Director.png')}
                    style={styles.image}
                />
            </View>
            <View style={styles.speechBubbleContainer}>
                <View style={styles.triangle}></View>
                <View style={styles.speechBubble}>
                    {renderText()}
                </View>
                <TouchableOpacity
                    ref={iconRef}
                    style={styles.iconContainer}
                    onPress={openMenu}
                >
                    <Feather name="more-horizontal" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Menu Modal */}
            <Modal
                visible={isMenuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
                    <View style={styles.menuOverlay}>
                        <View
                            style={[styles.menu, { top: menuPosition.top, left: menuPosition.left }]}
                        >
                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={() => {
                                    setIsMenuVisible(false);
                                    toggleModal('edit');
                                }}
                            >
                                <Icon name="edit" size={20} color="#333" style={styles.menuIcon} />
                                <Text style={styles.menuText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={() => {
                                    setIsMenuVisible(false);
                                    toggleModal('view');
                                }}
                            >
                                <Icon name="visibility" size={20} color="#333" style={styles.menuIcon} />
                                <Text style={styles.menuText}>View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal for Edit/View */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {modalMode === 'edit' ? 'Edit Text' : 'View Text'}
                            </Text>
                            <TouchableOpacity onPress={closeModal}
                                style={{
                                    width: 34, height: 32, borderRadius: 10, borderWidth: 0.5,
                                    borderColor: "#ff0000", alignItems: "center",
                                    justifyContent: "center", backgroundColor: "#ffe6e6"
                                }}
                            >
                                <Icon name="close" size={24} color="#ff0000" />
                            </TouchableOpacity>
                        </View>

                        {modalMode === 'edit' ? (
                            <>
                                <TextInput
                                    style={styles.modalInput}
                                    value={text}
                                    onChangeText={handleTextChange}
                                    multiline
                                    placeholder="Type your text here (at least 50 characters)..."
                                    placeholderTextColor="#aaa"
                                />
                                {text.trim().length < 100 && (
                                    <Text style={styles.validationText}>
                                        Text must be at least 100 characters.
                                    </Text>
                                )}
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={submitText}
                                    disabled={loading}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.modalText}>{text}</Text>
                        )
                        }

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: width * 0.2,
        height: height * 0.2,
        borderRadius: width * 0.05,
        resizeMode: 'cover',
        backgroundColor: '#fff',
    },
    speechBubbleContainer: {
        flexDirection: 'row',
        width: '75%',
        marginTop: height * 0.02,
    },
    triangle: {
        width: 0,
        height: 0,
        borderTopWidth: height * 0.012,
        borderBottomWidth: height * 0.020,
        borderRightWidth: width * 0.12,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#ffe680',
        marginTop: -height * 0.015,
        marginRight: -width * 0.04,
        transform: [{ rotate: '35deg' }],
    },
    speechBubble: {
        backgroundColor: '#ffe680',
        padding: height * 0.012,
        borderRadius: width * 0.03,
        maxWidth: '93%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: height * 0.005 },
        shadowOpacity: 0.3,
        shadowRadius: width * 0.02,
    },
    text: {
        color: '#333',
        fontSize: height * 0.02,
        lineHeight: height * 0.025,
    },
    viewMoreText: {
        color: '#3D5AFE',
        fontSize: height * 0.02,
        textDecorationLine: 'underline',
    },
    iconContainer: {

        position: 'absolute',
        top: -height * 0.035,
        right: 0,
    },
    menuOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    menu: {
        position: 'absolute',
        marginTop: height * 0.07,
        backgroundColor: '#fff',
        borderRadius: width * 0.02,
        padding: height * 0.010,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: height * 0.005 },
        shadowOpacity: 0.3,
        shadowRadius: width * 0.03,
        elevation: 4,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -width * 0.25 }, { translateY: -height * 0.10 }],
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: height * 0.01,
    },
    menuIcon: {
        marginRight: width * 0.02,
    },
    menuText: {
        fontSize: height * 0.02,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: width * 0.9,
        backgroundColor: '#fff',
        padding: height * 0.03,
        borderRadius: width * 0.04,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: height * 0.005 },
        shadowOpacity: 0.5,
        shadowRadius: width * 0.05,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    modalTitle: {
        fontSize: height * 0.026,
        fontWeight: '800',
        color: '#330066',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.02,
        padding: height * 0.02,
        fontSize: height * 0.02,
        textAlignVertical: 'top',
        minHeight: height * 0.15,
        color: '#333',
    },
    modalText: {
        fontSize: height * 0.02,
        color: '#333',
        lineHeight: height * 0.03,
    },
    submitButton: {

        backgroundColor: '#3D5AFE',
        padding: height * 0.018,
        borderRadius: width * 0.04,
        marginTop: height * 0.02,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: height * 0.02,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    validationText: {
        color: '#ff0000',
        fontSize: height * 0.018,
        marginTop: height * 0.01,
    },

});

export default AboutTextBubble;
