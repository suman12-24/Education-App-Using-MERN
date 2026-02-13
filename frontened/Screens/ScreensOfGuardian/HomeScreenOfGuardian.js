import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ActivityIndicator, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';
// Components
import CustomiseImageSlider from '../../ToolComponents/CustomiseImageSlider';
import BoardDisplayComponent from './ComponentForGuardian/BoardDisplayComponent';
import BoardHSDisplayComponent from './ComponentForGuardian/BoardHSDisplayComponent';
import CardDemo from './ComponentForGuardian/CardDemo';
import AdBanner from './AddSections/AdBanner';
import ExploreSchoolsHeader from './ComponentForGuardian/ExploreSchoolsHeader';
import VerticalSchoolCard from './ComponentForGuardian/VerticalSchoolCard';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import VerticalSchoolCardForSearch from './ComponentForGuardian/VerticalSchoolCardForSearch';

const { width, height } = Dimensions.get('window');

const HomeScreenOfGuardian = () => {
    // Refs
    const bottomSheetModalRef = useRef(null);

    // Animation values
    const welcomeOpacity = useSharedValue(0);
    const welcomeTranslateY = useSharedValue(20);

    // States
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Snap points for bottom sheet
    const snapPoints = useMemo(() => ['71%', '92%'], []);

    // Scroll state for header animation
    const scrollY = useSharedValue(0);

    // Animated styles
    const welcomeTextStyle = useAnimatedStyle(() => {
        return {
            opacity: welcomeOpacity.value,
            transform: [{ translateY: welcomeTranslateY.value }]
        };
    });

    const handleScrollEvent = useCallback((event) => {
        scrollY.value = event.nativeEvent.contentOffset.y;
    }, []);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 40],
                [1, 0],
                Extrapolate.CLAMP
            ),

        };
    });

    // Effects
    useEffect(() => {
        //    StatusBar.setBarStyle('light-content');
        bottomSheetModalRef.current?.present();
        fetchSchools();

        // Welcome animation
        welcomeOpacity.value = withSpring(1, { damping: 15 });
        welcomeTranslateY.value = withSpring(0, { damping: 10 });

        return () => {
            //  StatusBar.setBarStyle('default');
        };
    }, []);

    // Handlers
    const handleSheetChanges = useCallback((index) => {
        // You can add behavior when sheet changes
        console.log('handleSheetChanges', index);

    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchSchools();
        setRefreshing(false);
    }, []);

    // API call
    const fetchSchools = async () => {
        try {
            const response = await axiosConfiguration.get('/school/all-schools');
            if (response.data && Array.isArray(response.data.schools)) {
                setSchools(response.data.schools);
            } else {
                console.error('Unexpected response format:', response.data);
                setSchools([]);
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
        } finally {
            setLoading(false);
        }
    };

    // Data
    const banners = [
        {
            image: 'https://www.reynolds-pens.com/wp-content/uploads/2023/04/qc-6679-reynolds-blog-banner-R5.jpg',
            title: '50% Off on School Supplies',
        },
        {
            image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivClvFGQ0Pd-JUrOxcKip_eNm4AMrPVoDyPUK07yaSG9VNa_EFY-ONXA50hCVNkWzAoh8Czx5Wpr03lZACTJKf1gcD4ftngHJM-0_9OnFnljw-ZmbMptBwC1UtJoF1iYdsfGU8EgGii2vg/s1600/classmate-header.jpg',
            title: 'Shop Classmate Products',
        },
        {
            image: 'https://www.bigbasket.com/media/uploads/groot/images/372020-34cb20a9-banner_2.jpg',
            title: 'Special Discounts for Students',
        },
        {
            image: 'https://m.media-amazon.com/images/S/aplus-media/vc/d28b2a09-0a50-4f32-b07b-68c1d19ef9e8.__CR0,0,970,600_PT0_SX970_V1___.png',
            title: 'Premium School Accessories',
        },
    ];

    const banners1 = [
        {
            image: 'https://www.accurate.in/img/college/1711628855-1659610371-btech-admission.webp',
            title: 'Engineering Admissions 2025',
        },
        {
            image: 'https://www.bitcollege.in//upload/1642741939-BIT.jpeg',
            title: 'Top Engineering Colleges',
        },
        {
            image: 'https://thecareercounsellor.com/wp-content/uploads/2024/01/Btech-Admission-2024-Thaceer-Counsellor-page.jpeg',
            title: 'Career Counselling Sessions',
        },
        {
            image: 'https://5.imimg.com/data5/GLADMIN/Default/2024/2/389838026/KD/EA/MA/5247658/vit-vellore-b-tech-direct-admission-500x500.jpg',
            title: 'Direct Admission Programs',
        },
    ];

    // Helper components
    const renderSchoolItem = ({ item }) => {
        if (item.isApprovedByAdmin) {
            return (
                <View style={{ marginRight: 10 }}>
                    <VerticalSchoolCard schoolData={item} />
                </View>
            );
        }
        return null;
    };
    const renderSchoolItemForSerch = ({ item }) => {
        if (item.isApprovedByAdmin) {
            return (
                <View style={{ marginRight: 10 }}>
                    <VerticalSchoolCardForSearch schoolData={item} />
                </View>
            );
        }
        return null;
    }

    const renderSectionHeader = (title, count, iconName) => (
        <View style={styles.headerContainer}>
            <View style={styles.titleWrapper}>
                <LinearGradient
                    colors={['#4a56e2', '#3a47df']}
                    style={styles.iconBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Ionicons name={iconName} size={16} color="#fff" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{count} Schools</Text>
            </View>
        </View>
    );

    // Render
    return (
        <View style={styles.container}>
            {/* Hero Section with Background */}
            <ImageBackground
                source={require('./Images/BGIGurdian.png')}
                style={styles.heroBackground}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.1)']}
                    style={styles.heroGradient}
                >
                    <Animated.View style={[styles.welcomeContainer, welcomeTextStyle]}>
                        <Text style={styles.welcomeSubtitle}>Welcome To</Text>
                        <Text style={styles.welcomeTitle}>Guidance</Text>
                        <View style={styles.taglineContainer}>
                            <Text style={styles.taglineText}>Find the perfect school for your child</Text>
                        </View>
                    </Animated.View>
                </LinearGradient>
            </ImageBackground>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={false}
                    backgroundStyle={styles.bottomSheetBackground}
                    handleIndicatorStyle={styles.bottomSheetIndicator}
                >
                    <BottomSheetScrollView
                        style={styles.scrollContentContainer}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={handleScrollEvent}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        {/* Main Feature Slider */}
                        <View style={styles.carouselContainer}>
                            <CustomiseImageSlider
                                imageArray={[
                                    { id: '1', imagePath: require('../../Images/DemoBanner/five.jpeg') },
                                    { id: '2', imagePath: require('../../Images/DemoBanner/six.jpeg') },
                                    { id: '3', imagePath: require('../../Images/DemoBanner/seven.jpeg') },
                                    { id: '4', imagePath: require('../../Images/DemoBanner/eight.jpeg') },
                                ]}
                            />
                        </View>
                        {/* Board Selection Section */}
                        <View style={styles.sectionContainer}>

                            <BoardDisplayComponent />
                        </View>

                        {/* Higher Secondary Board Section */}
                        <View style={styles.sectionContainer}>

                            <BoardHSDisplayComponent />
                        </View>

                        {/* Top Viewed Schools */}
                        <View style={styles.sectionContainer}>
                            {renderSectionHeader('Top Viewed Schools', 10, 'eye')}

                            {loading ? (
                                <ActivityIndicator size="large" color="#4a56e2" style={styles.loader} />
                            ) : (
                                <FlatList
                                    data={schools
                                        .filter(school => school.isApprovedByAdmin)
                                        .sort((a, b) => b.viewCount - a.viewCount)
                                        .slice(0, 10)
                                    }
                                    horizontal
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderSchoolItem}
                                    contentContainerStyle={styles.horizontalListContent}
                                    snapToInterval={width * 0.75 + 12}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
                                />
                            )}
                        </View>
                        {/* Top search Schools */}
                        <View style={styles.sectionContainer}>
                            {renderSectionHeader('Top search Schools', 10, 'search')}

                            {loading ? (
                                <ActivityIndicator size="large" color="#4a56e2" style={styles.loader} />
                            ) : (
                                <FlatList
                                    data={schools
                                        .filter(school => school.isApprovedByAdmin)
                                        .sort((a, b) => b.searchViewCount - a.searchViewCount)
                                        .slice(0, 10)
                                    }
                                    horizontal
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderSchoolItemForSerch}
                                    contentContainerStyle={styles.horizontalListContent}
                                    snapToInterval={width * 0.75 + 12}
                                    decelerationRate="fast"
                                    snapToAlignment="start"
                                />
                            )}
                        </View>
                        {/* Banner Ad Section */}
                        <View style={styles.adBannerContainer}>
                            <AdBanner banners={banners} />
                        </View>

                        {/* Explore Schools */}
                        <View style={styles.sectionContainer}>
                            <ExploreSchoolsHeader />

                            {loading ? (
                                <ActivityIndicator size="large" color="#4a56e2" style={styles.loader} />
                            ) : (
                                <View style={styles.allSchoolsContainer}>
                                    {schools.map((school, index) => {
                                        if (school.isApprovedByAdmin) {
                                            return (
                                                <View key={index} style={styles.schoolCardWrapper}>
                                                    <CardDemo schoolData={school} />
                                                </View>
                                            );
                                        }
                                        return null;
                                    })}
                                </View>
                            )}
                        </View>

                        {/* Second Banner Ad */}
                        <View style={styles.adBannerContainer}>
                            <AdBanner banners={banners1} />
                        </View>

                        {/* Bottom Spacing */}
                        <View style={styles.bottomSpacing} />
                    </BottomSheetScrollView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>
    );
};

// Import at the top
const RefreshControl = ({ refreshing, onRefresh }) => {
    return (
        <View style={styles.refreshContainer}>
            {refreshing && <ActivityIndicator size="small" color="#4a56e2" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    heroBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height * 0.3,
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || 0,
    },
    welcomeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeSubtitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 6,
    },
    welcomeTitle: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    taglineContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 12,
    },
    taglineText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSheetBackground: {
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetIndicator: {
        backgroundColor: '#c0c0c0',
        width: 50,
    },
    scrollContentContainer: {
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        paddingTop: 5,
        paddingBottom: 40,
    },
    carouselContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },

    sectionContainer: {
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBackground: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        elevation: 2,
        shadowColor: '#4a56e2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#303030',
        fontWeight: '700',
    },
    badgeContainer: {
        backgroundColor: '#f0f2ff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e4ff',
    },
    badgeText: {
        color: '#4a56e2',
        fontWeight: '600',
        fontSize: 12,
    },
    horizontalListContent: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    adBannerContainer: {
        marginBottom: 20,
    },
    allSchoolsContainer: {
        marginTop: 2,
    },
    schoolCardWrapper: {
        marginBottom: 2,
    },
    loader: {
        marginVertical: 20,
    },
    bottomSpacing: {
        height: 30,
    },
    refreshContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreenOfGuardian;