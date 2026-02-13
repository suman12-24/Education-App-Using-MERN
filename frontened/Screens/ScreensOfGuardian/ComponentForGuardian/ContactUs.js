import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Linking, Animated, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // For email icon

const ContactButtons = ({ GurdianContactDetails }) => {
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        phone: [],
        email: [],
    });

    useEffect(() => {
        if (GurdianContactDetails) {
            const { emails, phones } = GurdianContactDetails;
            setContactInfo({
                phone: Array.isArray(phones) ? phones[0] : ['N/A'],
                email: Array.isArray(emails) ? emails[0] : ['N/A'],
            });
            setLoading(false);
        }
    }, [GurdianContactDetails]);

    // Animation values
    const phoneScale = useRef(new Animated.Value(1)).current;
    const phoneOpacity = useRef(new Animated.Value(0)).current;
    const phoneTranslateY = useRef(new Animated.Value(50)).current;

    const whatsappScale = useRef(new Animated.Value(1)).current;
    const whatsappOpacity = useRef(new Animated.Value(0)).current;
    const whatsappTranslateY = useRef(new Animated.Value(50)).current;

    const emailScale = useRef(new Animated.Value(1)).current;
    const emailOpacity = useRef(new Animated.Value(0)).current;
    const emailTranslateY = useRef(new Animated.Value(50)).current;

    // Button animation function for press
    const animatePress = (scaleValue, opacityValue) => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 0.7,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    const openDialer = () => {
        animatePress(phoneScale, phoneOpacity);
        Linking.openURL(`tel:${contactInfo.phone}`).catch((err) =>
            console.error("Failed to open dialer", err)
        );
    };

    const openWhatsApp = () => {
        animatePress(whatsappScale, whatsappOpacity);
        const whatsappURL = `https://wa.me/${contactInfo.phone.replace('+', '')}`;
        Linking.openURL(whatsappURL).catch((err) =>
            console.error("Failed to open WhatsApp", err)
        );
    };

    const openEmail = () => {
        animatePress(emailScale, emailOpacity);
        const emailURL = `mailto:${contactInfo.email}`;
        Linking.openURL(emailURL).catch((err) =>
            console.error("Failed to open email", err)
        );
    };

    // Run animation on mount (Slide-in effect)
    useEffect(() => {
        Animated.stagger(200, [
            Animated.parallel([
                Animated.timing(phoneOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(phoneTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(whatsappOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(whatsappTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(emailOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(emailTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={styles.buttonContainer}>
            {/* Contact Us Button */}
            <Animated.View
                style={{
                    transform: [{ scale: phoneScale }, { translateY: phoneTranslateY }],
                    opacity: phoneOpacity,
                }}
            >
                <Pressable
                    onPress={openDialer}
                    style={[styles.button, styles.contactButton]}
                >
                    <Ionicons name="call-outline" size={23} color="#fff" />
                </Pressable>
            </Animated.View>

            {/* WhatsApp Button */}


            {/* Email Button */}
            <Animated.View
                style={{
                    transform: [{ scale: emailScale }, { translateY: emailTranslateY }],
                    opacity: emailOpacity,
                }}
            >
                <Pressable
                    onPress={openEmail}
                    style={[styles.button, styles.emailButton]}
                >
                    <MaterialIcons name="email" size={23} color="#fff" />
                </Pressable>
            </Animated.View>
        </View>
    );
};

export default ContactButtons;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'center',
    },
    button: {
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginVertical: 5,
    },
    contactButton: {
        backgroundColor: '#ff5c33',
    },
    whatsappButton: {
        backgroundColor: '#25D366', // WhatsApp green color
    },
    emailButton: {
        backgroundColor: '#007bff', // Blue color for email button
    },
});

