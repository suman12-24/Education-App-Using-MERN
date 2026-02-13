import { Animated, ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, } from 'react-native';
import React, { useState, useEffect } from 'react';
import SchoolMenuList from '../ComponentForGuardian/SchoolMenuList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');

const GurdianSchoolAndBoardDisplay = ({ GurdianSchoolNameShowAndAffiliatedTo, GurdainFeesDisplay, SchoolFaculityInfo, SchoolContactInfo }) => {

    const [isSchoolMenuListVisible, setIsSchoolMenuListVisible] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [affiliationBoard, setAffiliationBoard] = useState('');

    const FeesDisplay = GurdainFeesDisplay;
    const FaculityInfo = SchoolFaculityInfo;
    const ContactInfo = SchoolContactInfo;

    useEffect(() => {
        if (GurdianSchoolNameShowAndAffiliatedTo) {
            setSchoolName(GurdianSchoolNameShowAndAffiliatedTo.schoolName || "No School Name");
            setAffiliationBoard(GurdianSchoolNameShowAndAffiliatedTo.affiliatedTo || "No Affiliation Board");
        }
    }, [GurdianSchoolNameShowAndAffiliatedTo]);

    const handleOpenMenu = () => setIsSchoolMenuListVisible(!isSchoolMenuListVisible);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.TitleTextContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>{schoolName}</Text>
                </View>
                <View style={styles.menuRow}>
                    <View style={styles.affiliationContainer}>
                        <Image
                            source={require('../Images/DemoBanner/boardAffi.png')}
                            style={styles.affiliationImage}
                        />
                        <View style={styles.affiliationTextContainer}>
                            <Text style={styles.affiliationText}>Affiliated to :</Text>
                            <Text style={styles.affiliationBoard}>{affiliationBoard}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleOpenMenu}
                        style={[styles.menuButton, isSchoolMenuListVisible && styles.menuButtonActive]}
                    >
                        <MaterialIcons name="menu" size={28} color="#15161a" />
                    </TouchableOpacity>
                </View>
            </View>
            {isSchoolMenuListVisible && <SchoolMenuList
                GurdainFeesDisplayPdf={FeesDisplay}
                SchoolFaculityInfo={FaculityInfo}
                SchoolContactInfo={ContactInfo}
            />}
        </View>
    );
};

export default GurdianSchoolAndBoardDisplay;

const styles = StyleSheet.create({
    TitleTextContainer: {
        marginTop: height * 0.01,
        marginLeft: width * 0.02,
        marginRight: width * 0.02,
        paddingHorizontal: width * 0.04,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black',
        flexShrink: 1,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    affiliationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    affiliationImage: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },
    affiliationTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    affiliationText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#3D5AFE',
    },
    affiliationBoard: {
        paddingLeft: 5,
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
        backgroundColor: '#e2e5ea',
    },
});
