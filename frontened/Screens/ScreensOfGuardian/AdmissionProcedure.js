import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const AdmissionProcedurePage = () => {
    const navigation = useNavigation();
    const [isExpanded, setIsExpanded] = useState(false);
    const buttonWidth = useRef(new Animated.Value(60)).current; // Initial circular size
    const textOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(100)).current;
    const [animationFinished, setAnimationFinished] = useState({});
    const handleAnimationEnd = (cardKey) => {
        setAnimationFinished((prev) => ({ ...prev, [cardKey]: true }));
    };
    const handleEnquiryClick = () => {
        // Open email client for admission enquiry
        Linking.openURL('mailto:admissions@theheritageschool.org');
    };

    const handlePhoneCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const animateButton = () => {
        if (!isExpanded) {
            // Initial expand animation
            Animated.parallel([
                Animated.timing(buttonWidth, {
                    toValue: 260, // Initial expanded width
                    duration: 300,
                    useNativeDriver: false,

                }),
                Animated.timing(textOpacity, {
                    toValue: 1, // Show text
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Start increasing width dynamically
                Animated.timing(buttonWidth, {
                    toValue: 260, // Increased width after expansion
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    // Collapse after 2 seconds
                    setTimeout(() => {
                        handleEnquiryClick();
                        Animated.parallel([
                            Animated.timing(buttonWidth, {
                                toValue: 60, // Collapse to circular size
                                duration: 300,
                                useNativeDriver: false,
                            }),
                            Animated.timing(textOpacity, {
                                toValue: 0, // Hide text
                                duration: 300,
                                useNativeDriver: true,
                            }),
                        ]).start(() => setIsExpanded(false)); // Update state to reflect collapsed button
                    }, 500);
                });
            });
        }
        setIsExpanded(true);
    };


    useEffect(() => {
        // Animate the button's initial appearance
        Animated.timing(buttonTranslateY, {
            toValue: 0, // Move to its final position
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (

        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header Section */}
                <View style={styles.headerContainer}>

                    <Animatable.View animation="fadeInDown" duration={1500}>
                        <Text style={styles.header}>Aatman Scholarship</Text>
                        <Text style={styles.subHeader}>Online registrations for 2025-26 are open</Text>
                    </Animatable.View>
                </View>

                {/* Available Classes Section */}
                <Animatable.View animation="zoomIn" duration={1500} style={styles.cardWrapper}
                    onAnimationEnd={() => handleAnimationEnd('availableClasses')}
                >
                    <Card style={[
                        styles.card,
                        animationFinished['availableClasses'] && styles.cardWithBorder,
                    ]}>
                        <Card.Title
                            title="Available Classes"
                            subtitle="Choose your preferred class"
                            left={() => <Icon name="book" size={30} color="#2980b9" />}
                            titleStyle={styles.cardTitle}
                            subtitleStyle={styles.cardSubtitle}
                        />
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>- Class IX (ICSE)</Text>
                            <Text style={[styles.sectionText, { color: '#16a085' }]}>- Class XI (ISC)</Text>
                            <Text style={[styles.sectionText, { color: '#e74c3c' }]}>- IGCSE - I</Text>
                            <Text style={[styles.sectionText, { color: '#3498db' }]}>- IBDP - I</Text>
                        </Card.Content>
                    </Card>
                </Animatable.View>

                {/* Age Criteria Section */}
                <Animatable.View animation="fadeInUp" duration={1500} style={styles.cardWrapper}
                    onAnimationEnd={() => handleAnimationEnd('Age Criteria for Admission')}>
                    <Card style={[
                        styles.card,
                        animationFinished['Age Criteria for Admission'] && styles.cardWithBorder,
                    ]}>
                        <Card.Title
                            title="Age Criteria for Admission"
                            left={() => <Icon name="calendar" size={30} color="#2980b9" />}
                            titleStyle={styles.cardTitle}
                            subtitleStyle={styles.cardSubtitle}
                        />
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>Pre-Nursery: 1st April 2021 to 31st March 2022</Text>
                            <Text style={[styles.sectionText, { color: '#16a085' }]}>Nursery: 1st April 2020 to 31st March 2021</Text>
                            <Text style={[styles.sectionText, { color: '#e74c3c' }]}>Class I: 1st April 2018 to 31st March 2019</Text>
                        </Card.Content>
                    </Card>
                </Animatable.View>

                {/* Registration Details Section */}
                <Animatable.View animation="slideInUp" duration={2000} style={styles.cardWrapper}
                    onAnimationEnd={() => handleAnimationEnd('Registration Details')}>
                    <Card style={[
                        styles.card,
                        animationFinished['Registration Details'] && styles.cardWithBorder,
                    ]}>
                        <Card.Title
                            title="Registration Details"
                            left={() => <Icon name="credit-card" size={30} color="#2980b9" />}
                            titleStyle={styles.cardTitle}
                            subtitleStyle={styles.cardSubtitle}
                        />
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>
                                The registration fee is non-refundable. Payment can be made online via Net Banking, Debit Card, or Credit Card.
                            </Text>
                            <Text style={[styles.sectionText, { color: '#16a085' }]}>
                                Rs.2000 for IBDP & IGCSE and Rs.1500 for all other classes including SEN.
                            </Text>
                        </Card.Content>
                    </Card>
                </Animatable.View>

                {/* Important Notes Section */}
                <Animatable.View animation="fadeInUp" duration={2500} style={styles.cardWrapper}
                    onAnimationEnd={() => handleAnimationEnd('Important Notes')}>
                    <Card style={[
                        styles.card,
                        animationFinished['Important Notes'] && styles.cardWithBorder,
                    ]}>
                        <Card.Title
                            title="Important Notes"
                            left={() => <Icon name="info-circle" size={30} color="#2980b9" />}
                            titleStyle={styles.cardTitle}
                            subtitleStyle={styles.cardSubtitle}
                        />
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>
                                - Registration does not imply admission. Admission is subject to availability of seats and fulfilling criteria.
                            </Text>
                            <Text style={[styles.sectionText, { color: '#e74c3c' }]}>
                                - Applications are also invited under RTE. Fees and charges are non-refundable once paid.
                            </Text>
                        </Card.Content>
                    </Card>
                </Animatable.View>

                {/* Contact Information Section */}
                <Animatable.View animation="fadeInUp" duration={1500} style={styles.cardWrapper}
                    onAnimationEnd={() => handleAnimationEnd('Contact Information')}>
                    <Card style={[
                        styles.card,
                        animationFinished['Contact Information'] && styles.cardWithBorder,
                    ]}>
                        <Card.Title
                            title="Contact Information"
                            left={() => <Icon name="phone" size={30} color="#2980b9" />}
                            titleStyle={styles.cardTitle}
                            subtitleStyle={styles.cardSubtitle}
                        />
                        <Card.Content style={styles.cardContent}>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>For further admission enquiry, call: </Text>
                            <TouchableOpacity onPress={() => handlePhoneCall('03366270555')}>
                                <Text style={styles.link}>033 66270555 / 9830022250</Text>
                            </TouchableOpacity>
                            <Text style={[styles.sectionText, { color: '#8e44ad' }]}>Or Email us at:</Text>
                            <TouchableOpacity onPress={handleEnquiryClick}>
                                <Text style={styles.link}>admissions@theheritageschool.org</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                </Animatable.View>
            </ScrollView>
            {/* Fixed Button */}
            <Animated.View style={[styles.fixedButtonContainer, {
                transform: [{ translateY: buttonTranslateY }]
            }]}>
                <TouchableOpacity onPress={animateButton} activeOpacity={0.8}>
                    <Animated.View
                        style={[
                            styles.enquiryButton,
                            { width: buttonWidth }, // Dynamically update width
                        ]}
                    >
                        {!isExpanded && (
                            <Icon
                                name="envelope"
                                size={24}
                                color="#fff"
                                style={styles.enquiryIcon}
                            />
                        )}
                        {isExpanded && (
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between', alignItems: 'center',
                                alignSelf: 'center',
                            }}>
                                <Icon
                                    name="envelope"
                                    size={24}
                                    color="#fff"
                                    style={styles.enquiryIcon}
                                />
                                <Animated.Text style={[styles.enquiryButtonText, { opacity: textOpacity, marginLeft: 30 }]}>
                                    Make an Admission Enquiry
                                </Animated.Text>
                            </View>


                        )}
                    </Animated.View>

                </TouchableOpacity>
            </Animated.View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10
    },
    headerContainer: {
        padding: 13,
        backgroundColor: '#248f8f',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,

        alignItems: 'center',
    },

    header: {
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    subHeader: {
        fontSize: 17,
        fontWeight: '500',
        color: '#fff',
    },
    cardWrapper: {
        marginBottom: 20,
        marginHorizontal: 10,
    },
    card: {

        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        elevation: 5,
    },
    cardTitle: {
        color: '#2980b9',
        fontWeight: 'bold',
        fontSize: 19
    },
    cardSubtitle: {
        color: '#2980b9',
    },
    cardContent: {
        paddingHorizontal: 15,
    },
    sectionText: {
        fontSize: 16,
        marginVertical: 5,
        color: '#2c3e50',
    },
    link: {
        fontSize: 16,
        color: '#f39c12',
        textDecorationLine: 'underline',
    },
    fixedButtonContainer: {

        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 15,
        alignItems: 'flex-end'
    },
    enquiryButton: {
        height: 60,
        backgroundColor: '#f39c12',
        borderRadius: 30, // Circular when width is equal to height
        justifyContent: 'center',
        alignItems: 'center',
    },
    enquiryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    enquiryIcon: {
        position: 'absolute',
    },
    cardWithBorder: {
        borderColor: '#2980b9', // Add your desired border color
        borderWidth: 0.5,
    },

});

export default AdmissionProcedurePage;

