import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, RefreshControl, StatusBar } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Gallery from './ComponentForGuardian/Gallery';
import ContactButtons from './ComponentForGuardian/ContactUs';
import AboutTextBubble from './ComponentForGuardian/AboutTextBubble';
import SchoolFacilities from './ComponentForGuardian/SchoolFacilities';
import SchoolContactInfo from './ComponentForGuardian/SchoolContactInfo';
import SchoolAchievements from './ComponentForGuardian/SchoolAchievements';
import GurdianProfileAndCoverPicture from './GurdianProfileComponent/GurdianProfileAndCoverPicture';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useSelector } from 'react-redux';
import GurdianSchoolAndBoardDisplay from './GurdianProfileComponent/GurdianSchoolAndBoardDisplay';

const SchoolDetailsScreen = ({ route }) => {
    // const SchoolId = route?.params;
    const { SchoolId, source } = route?.params || {};

    const { email, token } = useSelector((state) => state.auth);
    const { width, height } = Dimensions.get('window');
    const scale = useSharedValue(0);
    const [refreshing, setRefreshing] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const messagePosition = useSharedValue(width);

    const [isSchoolMenuListVisible, setIsSchoolMenuListVisible] = useState(false);
    const handleOpenMenu = () => setIsSchoolMenuListVisible(!isSchoolMenuListVisible);

    const [GurdianProfileAndCoverPicturePlayload, setGurdianProfileAndCoverPicturePlayload] = useState({});
    const [GurdianSchoolNameShowAndAffiliatedTo, setGurdianSchoolNameShowAndAffiliatedTo] = useState([]);
    const [GurdianGalleryImageDisplay, setGurdianGalleryImageDisplay] = useState([]);
    const [GurdianAchievementsDisplayImageAndDescription, setGurdianAchievementsDisplayImageAndDescription] = useState([]);
    const [GurdianAboutSchoolDisplay, setGurdianAboutSchoolDisplay] = useState([]);
    const [GurdianContactDetails, setGurdianContactDetails] = useState([]);
    const [GurdainFeesDisplay, setGurdainFeesDisplay] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [schoolFaculityInfo, setSchoolFacilityInfo] = useState([]);
    const [schoolContactInfo, setSchoolContactInfo] = useState([]);
    
    const fetchSchoolData = async () => {
        try {
            const response = await axiosConfiguration.post('/school/school-by-id', {
                schoolId: SchoolId, source
            });

            const schoolDetails = response?.data?.schoolDetails;
            if (schoolDetails) {
                setGurdianProfileAndCoverPicturePlayload({
                    coverPicture: schoolDetails?.coverPicture?.image || null,
                    profilePicture: schoolDetails?.profilePicture?.image || null,
                });
                setGurdianSchoolNameShowAndAffiliatedTo({
                    schoolName: schoolDetails?.name,
                    affiliatedTo: schoolDetails?.affiliatedTo, // Note: this is 'affiliatedTo'
                });

                setGurdainFeesDisplay(schoolDetails?.feeStructure || []);
                setGurdianGalleryImageDisplay(schoolDetails?.imageGallery || []);
                setGurdianAchievementsDisplayImageAndDescription(schoolDetails?.successStories || []);

                setGurdianAboutSchoolDisplay([
                    {
                        aboutSchool: schoolDetails?.aboutSchool
                    }
                ]);
                setFacilities(schoolDetails?.facilities || []);
                setGurdianContactDetails(schoolDetails?.reachUs || []);
                setSchoolFacilityInfo(schoolDetails?.facilitiesInfo || {})
                setSchoolContactInfo(schoolDetails?.socialLinks || {})
            } else {
                console.warn('No school details found.');
            }
        } catch (error) {
            console.error('Failed to fetch school data:', error?.message || error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSchoolData().finally(() => {
            setRefreshing(false);
            setShowSuccessMessage(true);
            messagePosition.value = withTiming(0, { duration: 1000 });

            setTimeout(() => {
                setShowSuccessMessage(false);
                messagePosition.value = withTiming(width, { duration: 1000 });
            }, 1000);
        });
    };

    useEffect(() => {
        fetchSchoolData();
    }, [SchoolId]);

    useEffect(() => {
        scale.value = withTiming(1, { duration: 800 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const messageAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: messagePosition.value }],
    }));

    return (
        <>
          <StatusBar barStyle={'light-content'} backgroundColor='#0f0c29' />
        <View style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <GurdianProfileAndCoverPicture
                    GurdianProfileAndCoverPicturePlayload={GurdianProfileAndCoverPicturePlayload}
                />
                <View style={styles.body}>

                    <GurdianSchoolAndBoardDisplay
                        GurdianSchoolNameShowAndAffiliatedTo={GurdianSchoolNameShowAndAffiliatedTo}
                        GurdainFeesDisplay={GurdainFeesDisplay}
                        SchoolFaculityInfo={schoolFaculityInfo}
                        SchoolContactInfo={schoolContactInfo}
                    />

                    <Gallery
                        GurdianGalleryImageDisplay={GurdianGalleryImageDisplay} />

                    <SchoolAchievements
                        GurdianAchievementsDisplayImageAndDescription={GurdianAchievementsDisplayImageAndDescription} />

                    <AboutTextBubble
                        GurdianAboutSchoolDisplay={GurdianAboutSchoolDisplay} />
                    <View
                        style={{ height: height * 0.47, alignItems: 'flex-start', left: 8 }}>
                        <SchoolFacilities
                            facilities={facilities} />
                    </View>
                    <View>
                        <SchoolContactInfo
                            GurdianContactDetails={GurdianContactDetails} />
                    </View>
                </View>
            </ScrollView>
            {showSuccessMessage
                && (
                    <Animated.View style={[styles.successMessageContainer, messageAnimatedStyle]}>
                        <Text style={styles.successMessage}>Data fetched successfully!</Text>
                    </Animated.View>
                )}
            {/* Floating Contact Buttons */}
            {/* <View style={styles.floatingButtonContainer}>
                <ContactButtons
                    GurdianContactDetails={GurdianContactDetails}
                />
            </View> */}

            <View style={{ height: 20 }} />
        </View>
        </>
    );
};

export default SchoolDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        marginTop: 45,
        paddingHorizontal: '1%',
    },
    facilitiesContainer: {
        marginTop: 20,
    },
    divider: {
        height: 2,
        backgroundColor: '#0099cc',
        marginVertical: 2,
        width: '65%',
    },
    successMessageContainer: {
        position: 'absolute',
        top: 5,
        right: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#009900',
        borderRadius: 5,
        zIndex: 10,
    },
    successMessage: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        right: 20,
        zIndex: 10,
        borderRadius: 50,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

});

