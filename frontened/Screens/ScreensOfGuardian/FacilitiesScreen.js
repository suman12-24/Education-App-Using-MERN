import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, StatusBar, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const FacilitiesScreen = ({ route }) => {
    // Properly destructure the route params with default value for SchoolFaculityInfo
    const { SchoolFaculityInfo = [] } = route.params || {};

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnims = {
        classes: useRef(new Animated.Value(0)).current,
        staff: useRef(new Animated.Value(0)).current,
        students: useRef(new Animated.Value(0)).current
    };

    // State for facilities data
    const [facilitiesData, setFacilitiesData] = useState({
        totalClasses: '0',
        totalStaff: '0',
        totalStudents: '0'
    });

    // Loading state
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

    // Process SchoolFaculityInfo data when component mounts or when prop changes
    useEffect(() => {
        const processSchoolFacilityData = () => {
            if (SchoolFaculityInfo && SchoolFaculityInfo.length > 0) {
                try {
                    // Extract the first item from the array
                    const facilityInfo = SchoolFaculityInfo[0];

                    // Perform null/undefined checks and handle both "student" and "students" possibilities
                    const totalStudents =
                        facilityInfo.students !== undefined ? facilityInfo.students :
                            facilityInfo.student !== undefined ? facilityInfo.student : '0';

                    // Extract the relevant data with proper validation
                    const formattedData = {
                        totalClasses: String(facilityInfo.classes || '0'),
                        totalStaff: String(facilityInfo.staff || '0'),
                        totalStudents: String(totalStudents)
                    };

                    // Update state with the formatted data
                    setFacilitiesData(formattedData);
                    setIsDataLoading(false);
                } catch (error) {
                    console.error("Error processing school facility data:", error);
                    setIsDataLoading(false);
                    // Set default values in case of error
                    setFacilitiesData({
                        totalClasses: '0',
                        totalStaff: '0',
                        totalStudents: '0'
                    });
                }
            } else {
                // Set loading to false but keep default values if no data is provided
                setIsDataLoading(false);
            }
        };

        // Short timeout to allow for animation to be visible even if data loads instantly
        const timeoutId = setTimeout(processSchoolFacilityData, 1000);  // Increased to 1000ms for better visibility

        // Clean up the timeout if component unmounts
        return () => clearTimeout(timeoutId);
    }, [SchoolFaculityInfo]);

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

    // Safely parse integer values with fallback
    const safeParseInt = (value, fallback = 0) => {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? fallback : parsed;
    };

    const updateThresholds = (data) => {
        const classes = safeParseInt(data.totalClasses, 0);
        const staff = safeParseInt(data.totalStaff, 0);
        const students = safeParseInt(data.totalStudents, 0);

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
        updateThresholds(facilitiesData);

        // Calculate percentages with safe parsing
        setAnalytics({
            classesPercent: Math.min(100, (safeParseInt(facilitiesData.totalClasses) / thresholds.classesMax) * 100),
            staffPercent: Math.min(100, (safeParseInt(facilitiesData.totalStaff) / thresholds.staffMax) * 100),
            studentsPercent: Math.min(100, (safeParseInt(facilitiesData.totalStudents) / thresholds.studentsMax) * 100)
        });
    }, [facilitiesData, thresholds.classesMax, thresholds.staffMax, thresholds.studentsMax]);

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

    // Determine gradient colors based on the percentage
    const getGradientColors = (percent) => {
        if (percent < 30) return ['#4ECDC4', '#1CB5E0']; // Blue/Teal for low values
        if (percent < 70) return ['#FFD166', '#FF9F1C']; // Yellow/Orange for medium values
        return ['#FF6B6B', '#FF4081']; // Red/Pink for high values
    };

    // If data is loading, show only the loading indicator
    if (isDataLoading) {
        return (
            <SafeAreaView style={styles.loadingScreenContainer}>
                <LinearGradient
                    colors={['#fff', '#f2f2f2', '#e6e6e6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loadingGradient}
                >
                    <View style={styles.centerLoadingContainer}>
                        <Animated.View style={[
                            styles.loadingCircle,
                            { transform: [{ scale: pulseAnim }] }
                        ]}>
                            <Ionicons name="school" size={40} color="#3D5AFE" />
                        </Animated.View>
                        <Text style={styles.loadingText}>Loading school data...</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

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
                            <Text style={styles.headerTitle}>School Facilities</Text>
                            <Text style={styles.headerSubtitle}>Facilities overview and capacity statistics</Text>
                        </View>
                        <View style={styles.headerDecoration}>
                            <View style={[styles.headerCircle, styles.headerCircle1]} />
                            <View style={[styles.headerCircle, styles.headerCircle2]} />
                        </View>
                    </View>

                    {/* Main Content Card */}
                    <View style={styles.mainCard}>
                        <Animated.View style={[
                            styles.mainCardContent,
                            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                        ]}>
                            {/* Summary Cards */}
                            <Text style={styles.sectionHeading}>
                                <Ionicons name="analytics-outline" size={20} color="#3D5AFE" /> Facilities Dashboard
                            </Text>

                            <View style={styles.summaryContainer}>
                                <SummaryCard
                                    icon="school"
                                    title="Classes"
                                    value={facilitiesData.totalClasses}
                                    color="#4E54FF"
                                    percentFill={analytics.classesPercent}
                                    threshold={thresholds.classesMax}
                                    animatedValue={progressAnims.classes}
                                    gradientColors={getGradientColors(analytics.classesPercent)}
                                />
                                <SummaryCard
                                    icon="people"
                                    title="Staff Members"
                                    value={facilitiesData.totalStaff}
                                    color="#FF6B6B"
                                    percentFill={analytics.staffPercent}
                                    threshold={thresholds.staffMax}
                                    animatedValue={progressAnims.staff}
                                    gradientColors={getGradientColors(analytics.staffPercent)}
                                />
                                <SummaryCard
                                    icon="person"
                                    title="Students Enrolled"
                                    value={facilitiesData.totalStudents}
                                    color="#4ECDC4"
                                    percentFill={analytics.studentsPercent}
                                    threshold={thresholds.studentsMax}
                                    animatedValue={progressAnims.students}
                                    gradientColors={getGradientColors(analytics.studentsPercent)}
                                />
                            </View>

                            {/* Detailed Information */}
                            <Text style={styles.sectionHeading}>
                                <Ionicons name="information-circle-outline" size={20} color="#3D5AFE" /> Detailed Statistics
                            </Text>
                            <View style={styles.detailsContainer}>
                                <InfoCard
                                    title="Class Information"
                                    icon="school-outline"
                                    color="#4E54FF"
                                    value={facilitiesData.totalClasses}
                                    label="Total Classes"
                                />
                                <InfoCard
                                    title="Staff Information"
                                    icon="people-circle-outline"
                                    color="#FF6B6B"
                                    value={facilitiesData.totalStaff}
                                    label="Total Staff"
                                />
                                <InfoCard
                                    title="Student Distribution"
                                    icon="people-outline"
                                    color="#4ECDC4"
                                    value={facilitiesData.totalStudents}
                                    label="Total Students"
                                />
                            </View>
                        </Animated.View>
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

// Info Card Component for Detailed View
const InfoCard = ({ title, icon, color, value, label }) => (
    <View style={styles.infoCardContainer}>
        <View style={styles.infoCardHeader}>
            <Ionicons name={icon} size={18} color={color} />
            <Text style={[styles.infoCardTitle, { color }]}>{title}</Text>
        </View>
        <View style={styles.infoCardContent}>
            <Text style={styles.infoCardLabel}>{label}</Text>
            <Text style={styles.infoCardValue}>{value || '0'}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    // New loading screen specific styles
    loadingScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerLoadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#3D5AFE',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
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
        elevation: 3,
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
    summaryContainer: {
        marginBottom: 10,
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
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
        marginBottom: 5,
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
        marginBottom: 5,
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
    detailsContainer: {
        marginBottom: 10,
    },
    infoCardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    infoCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoCardLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    infoCardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    }
});

export default FacilitiesScreen;