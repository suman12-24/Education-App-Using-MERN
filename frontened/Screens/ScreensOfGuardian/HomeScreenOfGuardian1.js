import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, } from '@gorhom/bottom-sheet';
import CustomiseImageSlider from '../../ToolComponents/CustomiseImageSlider';
import BoardDisplayComponent from './ComponentForGuardian/BoardDisplayComponent';
import BoardHSDisplayComponent from './ComponentForGuardian/BoardHSDisplayComponent';
import CardDemo from './ComponentForGuardian/CardDemo';
import LinearGradient from 'react-native-linear-gradient';
import AdBanner from './AddSections/AdBanner';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import ExploreSchoolsHeader from './ComponentForGuardian/ExploreSchoolsHeader';
import VerticalSchoolCard from './ComponentForGuardian/VerticalSchoolCard';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreenOfGuardian = () => {
    // ref
    const bottomSheetModalRef = useRef(null);

    // snap points
    const snapPoints = useMemo(() => ['70%', '90%'], []);
    const [schools, setSchools] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        bottomSheetModalRef.current?.present();
        fetchSchools();
    }, []);

    const handleSheetChanges = useCallback((index) => {
    }, []);
    const fetchSchools = async () => {
        try {
            const response = await axiosConfiguration.get('/school/all-schools');

            // Ensure data exists and is in the correct format
            if (response.data && Array.isArray(response.data.schools)) {
                setSchools(response.data.schools);
            } else {
                console.error('Unexpected response format:', response.data);
                setSchools([]); // Ensure an empty array is set to prevent errors
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
        } finally {
            setLoading(false);
        }
    };

    const banners = [
        {
            image: 'https://www.reynolds-pens.com/wp-content/uploads/2023/04/qc-6679-reynolds-blog-banner-R5.jpg',
            title: '50% Off on Electronics',
        },
        {
            image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivClvFGQ0Pd-JUrOxcKip_eNm4AMrPVoDyPUK07yaSG9VNa_EFY-ONXA50hCVNkWzAoh8Czx5Wpr03lZACTJKf1gcD4ftngHJM-0_9OnFnljw-ZmbMptBwC1UtJoF1iYdsfGU8EgGii2vg/s1600/classmate-header.jpg',
            title: 'Shop Groceries at Lowest Prices',
        },
        {
            image: 'https://www.bigbasket.com/media/uploads/groot/images/372020-34cb20a9-banner_2.jpg',
            title: 'Travel Deals: Book Now & Save!',
        },
        {
            image: 'https://m.media-amazon.com/images/S/aplus-media/vc/d28b2a09-0a50-4f32-b07b-68c1d19ef9e8.__CR0,0,970,600_PT0_SX970_V1___.png',
            title: 'Travel Deals: Book Now & Save!',
        },

    ];
    const banners1 = [
        {
            image: 'https://www.accurate.in/img/college/1711628855-1659610371-btech-admission.webp',
            title: '50% Off on Electronics',
        },
        {
            image: 'https://www.bitcollege.in//upload/1642741939-BIT.jpeg',
            title: 'Shop Groceries at Lowest Prices',
        },
        {
            image: 'https://thecareercounsellor.com/wp-content/uploads/2024/01/Btech-Admission-2024-Thaceer-Counsellor-page.jpeg',
            title: 'Travel Deals: Book Now & Save!',
        },
        {
            image: 'https://5.imimg.com/data5/GLADMIN/Default/2024/2/389838026/KD/EA/MA/5247658/vit-vellore-b-tech-direct-admission-500x500.jpg',
            title: 'Travel Deals: Book Now & Save!',
        },

    ];

    // renders
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#f2f2f2'
            }}
        >
            {/* Overlay Image and Gradient */}
            <View style={styles.overlayWrapper}>
                {/* Background Image */}
                <Image
                    source={require('./Images/BGIGurdian.png')} // Replace with your image path
                    style={styles.overlayImage}
                    resizeMode="cover"
                />
                {/* Gradient */}
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0)']} // Gradient from dark to transparent
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.overlayContainer}
                >
                    <Text style={styles.overlayText}>Welcome</Text>
                    <Text style={styles.overlayText}>To</Text>
                    <Text style={{
                        color: 'white',
                        fontSize: 35,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Guidance</Text>
                </LinearGradient>
            </View>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    enablePanDownToClose={false}

                >
                    <BottomSheetScrollView style={styles.scrollContentContainer}>
                        <CustomiseImageSlider
                            imageArray={[
                                {
                                    id: '1',
                                    imagePath: require('../../Images/DemoBanner/five.jpeg'),
                                },
                                {
                                    id: '2',
                                    imagePath: require('../../Images/DemoBanner/six.jpeg'),
                                },
                                {
                                    id: '3',
                                    imagePath: require('../../Images/DemoBanner/seven.jpeg'),
                                },
                                {
                                    id: '4',
                                    imagePath: require('../../Images/DemoBanner/eight.jpeg'),
                                },
                            ]}
                        />
                        {/* secondary Board Section */}
                        <View style={{ marginVertical: 5 }}>
                            <BoardDisplayComponent />
                        </View>
                        {/* higher secondary Board Section */}
                        <View style={{ marginVertical: 5 }}>
                            <BoardHSDisplayComponent
                                title={'Higher Secondary Board'}
                            />
                        </View>

                        {/* Top Primary School section .... */}
                        {/* <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
                            <TopPrimaryKGSchools />
                        </View> */}

                        {/* add scetion.... */}
                        <View style={{ marginBottom: 15, marginTop: 15 }}>
                            <View style={styles.headerContainer}>
                                <View style={styles.titleWrapper}>
                                    <LinearGradient
                                        colors={['#505ce2', '#3a47df']}
                                        style={styles.iconBackground}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Ionicons name="eye" size={16} color="#fff" />
                                    </LinearGradient>
                                    <Text style={styles.sectionTitle}>
                                        Top Viewed Schools
                                    </Text>
                                </View>
                                {/* Badge showing number of schools */}
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>10 Schools</Text>
                                </View>
                            </View>
                            {loading ? (
                                <ActivityIndicator size="large" color="#4a56e2" />
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
                                    renderItem={({ item }) => (
                                        <View style={{ marginRight: 10 }}>
                                            <VerticalSchoolCard schoolData={item} />
                                        </View>
                                    )}
                                />
                            )}

                        </View>

                        <AdBanner banners={banners} />
                        <ExploreSchoolsHeader />


                        {loading ? (
                            <ActivityIndicator size="large" color="#4a56e2" />
                        ) : (
                            schools.map((school, index) => {
                                if (school.isApprovedByAdmin) {
                                    // Check if data is being passed
                                    return <CardDemo key={index} schoolData={school} />;
                                }
                            })
                        )}

                        {/* add scetion.... */}

                        <AdBanner banners={banners1} />

                        <View style={{ height: 100 }} />
                    </BottomSheetScrollView>
                </BottomSheetModal>
            </BottomSheetModalProvider>

        </View>
    );
};

const styles = StyleSheet.create({
    overlayWrapper: {

        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250, // Adjust as needed
        zIndex: 0, // Ensures the overlay stays above the background
    },
    overlayImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',

    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: 'white',
        fontSize: 20, // Adjust as needed
        fontWeight: 'bold',
        textAlign: 'center',
    },

    scrollContentContainer: {
        backgroundColor: '#f2f2f2',
        // paddingHorizontal: 5,
        paddingBottom: 10,
    },
    text: {
        fontSize: 15,
        marginVertical: 5,
    },
    viewAllContainer: {
        alignItems: 'flex-end',
        paddingRight: 15,
        marginVertical: 10,
    },
    viewAllButton: {
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    viewAllGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 12,
    },
    viewAllText: {
        color: "#ffffff",
        fontWeight: '600',
        fontSize: 15,
        marginRight: 5,
    },
    viewAllIcon: {
        marginLeft: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBackground: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#303030',
        fontWeight: '700',
    },
    badgeContainer: {
        backgroundColor: '#f0f2ff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e4ff',
    },
    badgeText: {
        color: '#505ce2',
        fontWeight: '600',
        fontSize: 12,
    },
});

export default HomeScreenOfGuardian;
