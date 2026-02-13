import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Alert, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useSelector } from 'react-redux';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const FacilitiesScreen = ({ navigation }) => {
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnims = {
        classes: useRef(new Animated.Value(0)).current,
        staff: useRef(new Animated.Value(0)).current,
        students: useRef(new Animated.Value(0)).current
    };

    // Initial state for form data
    const { email } = useSelector((state) => state.auth);
    const loginEmail = email;
    const [formData, setFormData] = useState({
        totalClasses: '',
        totalStaff: '',
        totalStudents: ''
    });

    // Loading state for save button
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Dynamic thresholds for analytics
    const [thresholds, setThresholds] = useState({
        classesMax: 50,    // Default thresholds which will adjust dynamically
        staffMax: 200,
        studentsMax: 2000
    });

    // Total numbers for analytics
    const [analytics, setAnalytics] = useState({
        classesPercent: 0,
        staffPercent: 0,
        studentsPercent: 0
    });

    // Start entrance animations when data is loaded
    useEffect(() => {
        if (!isDataLoading) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isDataLoading]);

    // Pulse animation for loading state
    useEffect(() => {
        if (isDataLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isDataLoading]);

    // Animate progress bars when analytics change
    useEffect(() => {
        Animated.parallel([
            Animated.timing(progressAnims.classes, {
                toValue: analytics.classesPercent / 100,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(progressAnims.staff, {
                toValue: analytics.staffPercent / 100,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(progressAnims.students, {
                toValue: analytics.studentsPercent / 100,
                duration: 800,
                useNativeDriver: false,
            })
        ]).start();
    }, [analytics]);

    // Fetch existing facilities data when component mounts
    useEffect(() => {
        fetchFacilitiesData();
    }, []);

    // Function to fetch existing facilities data
    const fetchFacilitiesData = async () => {
        try {
            setIsDataLoading(true);
            const response = await axiosConfiguration.post("/school/get-school-details", { email: loginEmail });

            if (response.data && response.data.schoolDetails) {
                const facilityArray = response.data.schoolDetails.facilitiesInfo;
                if (Array.isArray(facilityArray) && facilityArray.length > 0) {
                    const facilityData = facilityArray[0]; // taking the first item
                    console.log("facilityData", facilityData);
                    setFormData({
                        totalClasses: facilityData.classes ? facilityData.classes.toString() : '',
                        totalStaff: facilityData.staff ? facilityData.staff.toString() : '',
                        totalStudents: facilityData.student ? facilityData.student.toString() : ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching facilities data:', error);
        } finally {
            setIsDataLoading(false);
        }
    };

    // Dynamically set thresholds based on input values
    const updateThresholds = (data) => {
        const classes = parseInt(data.totalClasses || '0', 10);
        const staff = parseInt(data.totalStaff || '0', 10);
        const students = parseInt(data.totalStudents || '0', 10);

        // Dynamic threshold logic - adjust these multipliers as needed
        setThresholds({
            classesMax: Math.max(50, Math.ceil(classes * 1.5)),  // At least 50 or 150% of current value
            staffMax: Math.max(200, Math.ceil(staff * 1.5)),     // At least 200 or 150% of current value
            studentsMax: Math.max(2000, Math.ceil(students * 1.5))  // At least 2000 or 150% of current value
        });
    };

    // Calculate percentages for visualization
    useEffect(() => {
        // Update thresholds dynamically based on input values
        updateThresholds(formData);

        // Calculate percentages
        setAnalytics({
            classesPercent: Math.min(100, (parseInt(formData.totalClasses || 0, 10) / thresholds.classesMax) * 100),
            staffPercent: Math.min(100, (parseInt(formData.totalStaff || 0, 10) / thresholds.staffMax) * 100),
            studentsPercent: Math.min(100, (parseInt(formData.totalStudents || 0, 10) / thresholds.studentsMax) * 100)
        });
    }, [formData, thresholds.classesMax, thresholds.staffMax, thresholds.studentsMax]);

    // Handle text input changes
    const handleChange = (field, value) => {
        // Only allow numeric values
        if (/^\d*$/.test(value)) {
            setFormData(prevData => {
                const newData = {
                    ...prevData,
                    [field]: value
                };
                return newData;
            });
        }
    };

    // Function to save facilities information
    const saveFacilitiesInfo = async () => {
        try {
            setIsLoading(true);

            // Prepare data for API
            const apiData = {
                loginEmail: loginEmail,
                classes: formData.totalClasses,
                staff: formData.totalStaff,
                student: formData.totalStudents
            };

            // Make API call
            const response = await axiosConfiguration.post('/school/school-facilities-info', apiData);

            // Handle successful response
            if (response.data) {
                Alert.alert(
                    "Success",
                    "School facilities information saved successfully!",
                    [{
                        text: "OK",
                        onPress: () => { navigation.goBack() }
                    }]
                );
            }
        } catch (error) {
            console.error('Error saving facilities info:', error);

            // Display error message
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to save school facilities information. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Determine gradient colors based on the percentage
    const getGradientColors = (percent) => {
        if (percent < 30) return ['#4ECDC4', '#1CB5E0']; // Blue/Teal for low values
        if (percent < 70) return ['#FFD166', '#FF9F1C']; // Yellow/Orange for medium values
        return ['#FF6B6B', '#FF4081']; // Red/Pink for high values
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#3D5AFE', '#536DFE', '#6286FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>School Information</Text>
                            <Text style={styles.headerSubtitle}>Update and manage your school data</Text>
                        </View>
                        <View style={styles.headerDecoration}>
                            <View style={[styles.headerCircle, styles.headerCircle1]} />
                            <View style={[styles.headerCircle, styles.headerCircle2]} />
                        </View>
                    </View>

                    {/* Main Content Card */}
                    <View style={styles.mainCard}>
                        {isDataLoading ? (
                            <View style={styles.fullLoadingContainer}>
                                <LinearGradient
                                    colors={['#fff', '#fff', '#fff']}
                                    style={styles.loadingGradient}
                                >
                                    <View style={styles.loadingContent}>
                                        <View style={styles.pulsingContainer}>
                                            <Animated.View style={[
                                                styles.pulsingCircle,
                                                { transform: [{ scale: pulseAnim }] }
                                            ]}>
                                                <Ionicons name="school" size={32} color="#3D5AFE" />
                                            </Animated.View>
                                        </View>
                                        <Text style={styles.loadingTitle}>School Information</Text>
                                        <Text style={styles.loadingText}>Loading your school data...</Text>
                                    </View>
                                </LinearGradient>
                            </View>
                        ) : (
                            <Animated.View style={[
                                styles.mainCardContent,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}>
                                {/* Summary Cards */}
                                <Text style={styles.sectionHeading}>
                                    <Ionicons name="analytics-outline" size={20} color="#3D5AFE" /> Dashboard Overview
                                </Text>
                                <View style={styles.summaryContainer}>
                                    <SummaryCard
                                        icon="school"
                                        title="Classes"
                                        value={formData.totalClasses}
                                        color="#4E54FF"
                                        percentFill={analytics.classesPercent}
                                        threshold={thresholds.classesMax}
                                        animatedValue={progressAnims.classes}
                                        gradientColors={getGradientColors(analytics.classesPercent)}
                                    />
                                    <SummaryCard
                                        icon="people"
                                        title="Staff Members"
                                        value={formData.totalStaff}
                                        color="#FF6B6B"
                                        percentFill={analytics.staffPercent}
                                        threshold={thresholds.staffMax}
                                        animatedValue={progressAnims.staff}
                                        gradientColors={getGradientColors(analytics.staffPercent)}
                                    />
                                    <SummaryCard
                                        icon="person"
                                        title="Students Enrolled"
                                        value={formData.totalStudents}
                                        color="#4ECDC4"
                                        percentFill={analytics.studentsPercent}
                                        threshold={thresholds.studentsMax}
                                        animatedValue={progressAnims.students}
                                        gradientColors={getGradientColors(analytics.studentsPercent)}
                                    />
                                </View>

                                {/* Input Sections */}
                                <Text style={styles.sectionHeading}>
                                    <Ionicons name="create-outline" size={20} color="#3D5AFE" /> Update Information
                                </Text>
                                <View style={styles.inputSectionsContainer}>
                                    {/* Class Information */}
                                    <InfoSection
                                        title="Class Information"
                                        icon="school-outline"
                                        color="#4E54FF"
                                    >
                                        <FormField
                                            label="Total Classes"
                                            value={formData.totalClasses}
                                            onChangeText={(value) => handleChange('totalClasses', value)}
                                            icon="school-outline"
                                            placeholder="Enter number of classes"
                                            accentColor="#4E54FF"
                                        />
                                    </InfoSection>
                                    {/* Staff Distribution */}
                                    <InfoSection
                                        title="Staff Information"
                                        icon="people-circle-outline"
                                        color="#FF6B6B"
                                    >
                                        <FormField
                                            label="Total Staff"
                                            value={formData.totalStaff}
                                            onChangeText={(value) => handleChange('totalStaff', value)}
                                            icon="people-outline"
                                            placeholder="Enter total number of staff"
                                            accentColor="#FF6B6B"
                                        />
                                    </InfoSection>
                                    {/* Student Distribution */}
                                    <InfoSection
                                        title="Student Distribution"
                                        icon="people-outline"
                                        color="#4ECDC4"
                                    >
                                        <FormField
                                            label="Total Students"
                                            value={formData.totalStudents}
                                            onChangeText={(value) => handleChange('totalStudents', value)}
                                            icon="people-outline"
                                            placeholder="Enter total number of students"
                                            accentColor="#4ECDC4"
                                        />
                                    </InfoSection>


                                </View>

                                {/* Save Button */}
                                <TouchableOpacity
                                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                                    onPress={saveFacilitiesInfo}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#3D5AFE', '#536DFE']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.saveButtonGradient}
                                    >
                                        {isLoading ? (
                                            <>
                                                <View style={styles.savingSpinner} />
                                                <Text style={styles.saveButtonText}>Saving...</Text>
                                            </>
                                        ) : (
                                            <>
                                                <Ionicons name="save" size={20} color="white" style={{ marginRight: 8 }} />
                                                <Text style={styles.saveButtonText}>Save Information</Text>
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, color, percentFill, threshold, animatedValue, gradientColors }) => {
    // Format the value and threshold for display
    const displayValue = value || '0';
    const percentWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={[styles.summaryCard, { borderLeftColor: color }]}>
            <View style={styles.summaryHeader}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={24} color="#fff" />
                </View>
                <View style={styles.summaryTextContainer}>
                    <Text style={styles.summaryTitle}>{title}</Text>
                    <Text style={styles.summaryValue}>{displayValue}</Text>
                </View>
            </View>

            <View style={styles.progressMetrics}>
                <Text style={styles.progressLabel}>Capacity Usage</Text>
                <Text style={styles.thresholdText}>Max Capacity: {threshold}</Text>
            </View>

            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progressBackground, { width: percentWidth }]}>
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.progressGradient}
                    />
                </Animated.View>
            </View>

            <View style={styles.percentageContainer}>
                <Text style={[styles.percentText, { color }]}>{Math.round(percentFill)}%</Text>
                <Text style={styles.capacityLabel}>
                    {percentFill < 70 ? 'Available' : percentFill < 90 ? 'Getting Full' : 'Near Capacity'}
                </Text>
            </View>
        </View>
    );
};

// Info Section Component
const InfoSection = ({ title, icon, color, children }) => (
    <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        </View>
        {children}
    </View>
);

// Form Field Component
const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    accentColor = "#3D5AFE",
    halfWidth = false,
    rightMargin = false,
    leftMargin = false,
}) => (
    <View style={[
        styles.formGroup,
        halfWidth && { flex: 1 },
        rightMargin && { marginRight: 8 },
        leftMargin && { marginLeft: 8 }
    ]}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputContainer, { borderColor: value ? accentColor : '#e0e0e0' }]}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                placeholder={placeholder}
                placeholderTextColor="#A0A0A0"
            />
            {icon && (
                <View style={[styles.inputIconContainer, { backgroundColor: accentColor }]}>
                    <Ionicons name={icon} size={18} color="#fff" />
                </View>
            )}
        </View>
    </View>
);

export default FacilitiesScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 15,
    },
    header: {
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    headerContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
    },
    headerTitle: {
        fontSize: isSmallDevice ? 25 : 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: isSmallDevice ? 14 : 16,
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 0.5,
    },
    headerDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        opacity: 0.4,
    },
    headerCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 150,
    },
    headerCircle1: {
        width: 200,
        height: 200,
        top: -50,
        right: -50,
    },
    headerCircle2: {
        width: 150,
        height: 150,
        top: 40,
        left: -70,
    },
    mainCard: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    mainCardContent: {
        padding: 16,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
        marginTop: 5,
        paddingHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 50,
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
    },
    loadingText: {
        fontSize: 16,
        color: '#3D5AFE',
        fontWeight: '600',
        marginTop: 10,
    },
    loadingSpinner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#E0E0E0',
        borderTopColor: '#3D5AFE',
        marginBottom: 20,
        alignSelf: 'center',
    },
    fullLoadingContainer: {
        flex: 1,
        height: '100%',
        minHeight: 500,
    },
    loadingGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    loadingContent: {
        alignItems: 'center',
        padding: 30,
    },
    pulsingContainer: {
        marginBottom: 20,
    },
    pulsingCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    loadingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    summaryContainer: {
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 5,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryTextContainer: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    },
    progressMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    progressLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    thresholdText: {
        fontSize: 12,
        color: '#888',
    },
    progressContainer: {
        height: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBackground: {
        height: '100%',
        overflow: 'hidden',
    },
    progressGradient: {
        flex: 1,
        borderRadius: 5,
    },
    percentageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    capacityLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    inputSectionsContainer: {
        marginBottom: 10,
    },
    sectionContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    formGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        overflow: 'hidden',
        height: 56,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    inputIconContainer: {
        height: '100%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#3D5AFE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 2,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    savingSpinner: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderTopColor: 'white',
        marginRight: 8,
    },
});