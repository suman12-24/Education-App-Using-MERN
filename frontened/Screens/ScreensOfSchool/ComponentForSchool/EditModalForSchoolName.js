import { Animated, ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, Pressable, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import SchoolMenuList from '../SchoolMenuList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosConfiguration, { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
const { width, height } = Dimensions.get('window');

// Theme color
const THEME_COLOR = '#4A56E2';
const THEME_COLOR_LIGHT = '#5D68F0';
const THEME_COLOR_DARK = '#3A45C4';
const THEME_COLOR_TRANSPARENT = 'rgba(74, 86, 226, 0.1)';

const EditModalForSchoolName = ({ loginEmail }) => {
    const email = loginEmail;
    const [isSchoolMenuListVisible, setIsSchoolMenuListVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [affiliationBoard, setAffiliationBoard] = useState('');
    const [affiliationBoardHs, setAffiliationBoardHs] = useState('');

    const [editedSchoolName, setEditedSchoolName] = useState('');
    const [editedAffiliationBoard, setEditedAffiliationBoard] = useState('');
    const [editedAffiliationBoardHs, setEditedAffiliationBoardHs] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Animation refs
    const successTranslateX = useRef(new Animated.Value(width)).current;
    const errorTranslateX = useRef(new Animated.Value(width)).current;

    // Modal animations
    const modalAnimation = useRef(new Animated.Value(0)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const inputAnimations = {
        school: useRef(new Animated.Value(0)).current,
        board: useRef(new Animated.Value(0)).current,
        hsBoard: useRef(new Animated.Value(0)).current
    };

    const handleOpenMenu = () => setIsSchoolMenuListVisible(!isSchoolMenuListVisible);

    const handleOpenEditModal = () => {
        setEditedSchoolName(schoolName);
        setEditedAffiliationBoard(affiliationBoard);
        setEditedAffiliationBoardHs(affiliationBoardHs);
        setIsEditModalVisible(true);

        // Animate backdrop and modal
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.spring(modalAnimation, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
                tension: 40
            })
        ]).start();

        // Stagger input field animations
        Animated.stagger(100, [
            Animated.spring(inputAnimations.school, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
            }),
            Animated.spring(inputAnimations.board, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
            }),
            Animated.spring(inputAnimations.hsBoard, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
            })
        ]).start();
    };

    const handleCloseModal = () => {
        // Animate out
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(modalAnimation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start(() => {
            setIsEditModalVisible(false);
            // Reset input animations for next opening
            Object.values(inputAnimations).forEach(anim => anim.setValue(0));
        });
    };

    const handleUpdateDetails = async () => {
        setLoading(true);

        try {
            const response = await axiosConfiguration.post('/school/update-name-of-school-and-board', {
                loginEmail: email,
                name: editedSchoolName,
                affiliatedTo: editedAffiliationBoard,
                HSAffiliatedTo: editedAffiliationBoardHs
            });

            if (response.status === 200) {
                setSchoolName(editedSchoolName);
                setAffiliationBoard(editedAffiliationBoard);
                setAffiliationBoardHs(editedAffiliationBoardHs);
                handleCloseModal();
                showSuccessMessage('School details updated successfully.');
            } else {
                showErrorMessage(response.data.message || 'Failed to update details.');
            }
        } catch (error) {
            showErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolDetails = async () => {
        setFetching(true);
        try {
            const response = await axiosConfiguration.post('/school/get-school-details', {
                email,
            });
            if (response.status === 200) {
                setSchoolName(response?.data?.schoolDetails?.name || 'Enter School Name');
                setAffiliationBoard(response?.data?.schoolDetails?.affiliatedTo || '');
                setAffiliationBoardHs(response?.data?.schoolDetails?.HSAffiliatedTo || '');
            } else {
                showErrorMessage('Failed to fetch school details.');
            }
        } catch (error) {
            showErrorMessage(error.response?.data?.message || 'Something went wrong while fetching details.');
        } finally {
            setFetching(false);
        }
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        Animated.sequence([
            Animated.spring(successTranslateX, { toValue: 0, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.spring(successTranslateX, { toValue: -width, useNativeDriver: true }),
        ]).start(() => setSuccessMessage(''));
    };

    const showErrorMessage = (message) => {
        setErrorMessage(message);
        Animated.sequence([
            Animated.spring(errorTranslateX, { toValue: 0, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.spring(errorTranslateX, { toValue: -width, useNativeDriver: true }),
        ]).start(() => setErrorMessage(''));
    };

    // Modal animation transforms
    const modalScale = modalAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1]
    });

    const modalOpacity = modalAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    // Input animations
    const getInputTransform = (animation) => {
        return {
            opacity: animation,
            transform: [
                {
                    translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                    })
                }
            ]
        };
    };

    useEffect(() => {
        fetchSchoolDetails();
    }, []);

    // Helper function to render board affiliations based on availability
    const renderAffiliations = () => {
        // Check if both boards are available
        const hasSecondaryBoard = affiliationBoard && affiliationBoard.trim() !== '';
        const hasHSBoard = affiliationBoardHs && affiliationBoardHs.trim() !== '';

        return (
            <View style={{ flexDirection: 'column', width: '80%' }}>
                {/* Always show the main label */}
                <Text style={styles.affiliationText}>Affiliated to:</Text>

                {/* Show secondary board if available */}
                {hasSecondaryBoard && (
                    <View style={styles.boardItem}>
                        <FontAwesome name="certificate" size={16} color={THEME_COLOR} style={{ marginRight: 5 }} />
                        <Text style={styles.affiliationBoard}>Secondary: {affiliationBoard}</Text>
                    </View>
                )}

                {/* Show HS board if available */}
                {hasHSBoard && (
                    <View style={styles.boardItem}>
                        <FontAwesome name="graduation-cap" size={16} color={THEME_COLOR} style={{ marginRight: 5 }} />
                        <Text style={styles.affiliationBoard}>Higher Secondary: {affiliationBoardHs}</Text>
                    </View>
                )}

                {/* Show a placeholder if no board is available */}
                {!hasSecondaryBoard && !hasHSBoard && (
                    <Text style={[styles.affiliationBoard, { fontStyle: 'italic' }]}>No board affiliations</Text>
                )}
            </View>
        );
    };

    if (fetching) {
        return (
            <View style={styles.loadingContainer} >
                <ActivityIndicator size="large" color={THEME_COLOR} />
                <Text style={styles.loadingText}>Loading school details...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {successMessage !== '' && (
                <Animated.View
                    style={
                        [
                            styles.messageBox,
                            { backgroundColor: '#4caf50', transform: [{ translateX: successTranslateX }] },
                        ]
                    }
                >
                    <MaterialIcons name="check-circle" size={24} color="#fff" />
                    <Text style={styles.messageText}> {successMessage} </Text>
                </Animated.View>
            )}

            {/* Error Message */}
            {
                errorMessage !== '' && (
                    <Animated.View
                        style={
                            [
                                styles.messageBox,
                                { backgroundColor: '#ff6b6b', transform: [{ translateX: errorTranslateX }] },
                            ]
                        }
                    >
                        <MaterialIcons name="error" size={24} color="#fff" />
                        <Text style={styles.messageText}> {errorMessage} </Text>
                    </Animated.View>
                )
            }
            <View style={styles.TitleTextContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}> {schoolName} </Text>
                    <TouchableOpacity onPress={handleOpenEditModal} style={styles.editButton} >
                        <AntDesign name="ellipsis1" size={25} color="#15161a" />
                    </TouchableOpacity>
                </View>
                <View style={styles.menuRow} >
                    <View style={styles.affiliationContainer}>
                        <View style={styles.affiliationImageContainer}>
                            <Image
                                source={require('../Images/DemoBanner/boardAffi.png')}
                                style={styles.affiliationImage}
                            />
                        </View>
                        {renderAffiliations()}
                    </View>
                    <TouchableOpacity
                        onPress={handleOpenMenu}
                        style={[styles.menuButton, isSchoolMenuListVisible && styles.menuButtonActive]}
                    >
                        <MaterialIcons
                            name="menu"
                            size={28}
                            color={isSchoolMenuListVisible ? THEME_COLOR : '#15161a'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {isSchoolMenuListVisible && <SchoolMenuList />}
            <Modal
                visible={isEditModalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={handleCloseModal}
            >
                <Animated.View
                    style={[
                        styles.modalBackdrop,
                        { opacity: backdropOpacity }
                    ]}
                >
                    <Pressable style={styles.backdropPressable} onPress={handleCloseModal}>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    opacity: modalOpacity,
                                    transform: [{ scale: modalScale }]
                                }
                            ]}
                        >
                            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()} >
                                <LinearGradient
                                    colors={[THEME_COLOR_LIGHT, THEME_COLOR, THEME_COLOR_DARK]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.modalHeader}
                                >
                                    <View style={styles.headerIconContainer}>
                                        <Ionicons name="school-outline" size={24} color="#fff" />
                                    </View>
                                    <Text style={styles.modalTitle}>Edit School Details</Text>
                                    <TouchableOpacity
                                        onPress={handleCloseModal}
                                        style={styles.closeButton}
                                    >
                                        <AntDesign name="close" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </LinearGradient>

                                <View style={styles.inputContainer}>
                                    <Animated.View style={[styles.inputWrapperContainer, getInputTransform(inputAnimations.school)]}>
                                        <Text style={styles.inputLabel}>School Name</Text>
                                        <View style={styles.inputWrapper}>
                                            <Ionicons name="school" size={22} color={THEME_COLOR} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={editedSchoolName}
                                                onChangeText={setEditedSchoolName}
                                                placeholder="Enter School Name"
                                                placeholderTextColor="#888"
                                                autoCapitalize='words'
                                                autoCorrect={true}
                                            />
                                        </View>
                                    </Animated.View>

                                    <Animated.View style={[styles.inputWrapperContainer, getInputTransform(inputAnimations.board)]}>
                                        <Text style={styles.inputLabel}>Secondary Affiliation Board</Text>
                                        <View style={styles.inputWrapper}>
                                            <FontAwesome name="certificate" size={20} color={THEME_COLOR} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={editedAffiliationBoard}
                                                onChangeText={setEditedAffiliationBoard}
                                                placeholder="Enter Affiliation Board"
                                                placeholderTextColor="#888"
                                                autoCapitalize='words'
                                                autoCorrect={true}
                                            />
                                        </View>
                                    </Animated.View>

                                    <Animated.View style={[styles.inputWrapperContainer, getInputTransform(inputAnimations.hsBoard)]}>
                                        <Text style={styles.inputLabel}>Higher Secondary Board</Text>
                                        <View style={styles.inputWrapper}>
                                            <FontAwesome name="graduation-cap" size={20} color={THEME_COLOR} style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.input}
                                                value={editedAffiliationBoardHs}
                                                onChangeText={setEditedAffiliationBoardHs}
                                                placeholder="Enter HS Board"
                                                placeholderTextColor="#888"
                                                autoCapitalize='words'
                                                autoCorrect={true}
                                            />
                                        </View>
                                    </Animated.View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.modalButtons}>
                                    {/* Cancel Button */}
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={handleCloseModal}
                                    >
                                        <View style={styles.buttonContent}>
                                            <Entypo name="cross" size={22} color="#666" />
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Update Button */}
                                    <TouchableOpacity
                                        style={[styles.button, styles.updateButton]}
                                        onPress={handleUpdateDetails}
                                        disabled={loading}
                                    >
                                        <View style={styles.buttonContent}>
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <MaterialIcons name="update" size={22} color="#fff" />
                                            )}
                                            <Text style={styles.updateButtonText}>
                                                {loading ? 'Updating...' : 'Update'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </Animated.View>
                    </Pressable>
                </Animated.View>
            </Modal>
        </View>
    );
};

export default EditModalForSchoolName;

const styles = StyleSheet.create({
    TitleTextContainer: {
        padding: 5,
        marginLeft: width * 0.007,
        marginRight: width * 0.02,
        marginBottom: 5,
        paddingHorizontal: width * 0.02,
    },
    headerRow: {
        marginRight: -width * 0.04,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#15161a',
        flexShrink: 1,
    },
    editButton: {
        width: width * 0.1,
        height: height * 0.03,
        marginTop: width * 0.02,
        marginRight: width * 0.02,
        borderRadius: 8,
        backgroundColor: THEME_COLOR_TRANSPARENT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    affiliationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    affiliationImageContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        overflow: 'hidden',
        backgroundColor: THEME_COLOR_TRANSPARENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    affiliationImage: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    boardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        paddingLeft: 5,
    },
    affiliationText: {
        fontSize: 17,
        fontWeight: '700',
        color: THEME_COLOR,
    },
    affiliationBoard: {
        fontSize: 15,
        fontWeight: '700',
        color: '#666666',
        flexShrink: 1,
    },
    menuButton: {
        marginRight: -width * 0.02,
        padding: 5,
        borderRadius: 20,
    },
    menuButtonActive: {
        backgroundColor: THEME_COLOR_TRANSPARENT,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    backdropPressable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    inputContainer: {
        padding: 16,
    },
    inputWrapperContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: width * 0.035,
        fontWeight: '600',
        color: THEME_COLOR,
        marginLeft: 4,
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: width * 0.042,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eaeaea',
        marginHorizontal: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    updateButton: {
        backgroundColor: THEME_COLOR,
        marginLeft: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: width * 0.042,
        fontWeight: 'bold',
        color: '#666',
        marginLeft: 8,
    },
    updateButtonText: {
        fontSize: width * 0.042,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: width * 0.04,
        color: THEME_COLOR,
        fontWeight: '500',
    },
    messageBox: {
        position: 'absolute',
        top: 20,
        right: 10,
        padding: 12,
        borderRadius: 12,
        zIndex: 10,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    messageText: {
        color: '#fff',
        fontSize: width * 0.038,
        marginLeft: 10,
        flex: 1,
    },
});