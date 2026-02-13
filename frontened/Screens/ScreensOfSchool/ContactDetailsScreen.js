import { StyleSheet, Text, View, TouchableOpacity, Linking, TextInput, Animated, Easing, StatusBar, SafeAreaView, Alert } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';


const ContactDetailsScreen = () => {
    const { email, token } = useSelector((state) => state.auth);
    const loginEmail = email;
    const [whatsapp, setWhatsapp] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [twitterLink, setTwitterLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [contactInfo, setContactInfo] = useState({
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    // Animated values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sequence animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(lineWidth, {
                toValue: 1,
                duration: 1200,
                easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
                useNativeDriver: false,
            })
        ]).start();

        // Fetch social links when component mounts
        fetchSocialLinks();
        fetchSchoolCallDetails();
    }, []);

    // Function to fetch social links from API
    const fetchSocialLinks = async () => {
        try {
            setLoading(true);
            const response = await axiosConfiguration.get('/school/get-social-links', {
                params: { loginEmail }
            });

            if (response.data && response.data.success && response.data.data.length > 0) {
                // Access the first item in the data array
                const links = response.data.data[0];

                setFacebookLink(links.facebook || 'https://facebook.com');
                setTwitterLink(links.x || 'https://x.com/?lang=en');
                setInstagramLink(links.instagram || 'https://instagram.com');
                setLinkedinLink(links.linkedin || 'https://linkedin.com');
                setYoutubeLink(links.youtube || 'https://youtube.com');
            }
        } catch (error) {
            console.error('Error fetching social links:', error);
            Alert.alert('Error', 'Failed to load contact information');
        } finally {
            setLoading(false);
        }
    };

    // Function to update social links via API
    const updateSocialLinks = async () => {
        try {
            setLoading(true);
            const payload = {
                loginEmail,
                facebook: facebookLink,
                x: twitterLink,
                instagram: instagramLink,
                linkedin: linkedinLink,
                youtube: youtubeLink
            };

            const response = await axiosConfiguration.post('/update-social-links', payload);

            if (response.data && response.data.success) {
                Alert.alert('Success', 'Contact information updated successfully');
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update contact information');
            }
        } catch (error) {
            console.error('Error updating social links:', error);
            Alert.alert('Error', 'Failed to update contact information');
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolCallDetails = async () => {
        try {
            setLoading(true);

            const response = await axiosConfiguration.post('/school/get-school-details', { email });
            const schoolDetails = response?.data?.schoolDetails;

            setContactInfo({
                phone: schoolDetails?.reachUs?.phones?.length
                    ? schoolDetails.reachUs.phones.filter(phone => phone).join(', ')
                    : schoolDetails.contactPersonPhone,
            });
        } catch (error) {
            console.error('Error fetching school details:', error);
            setContactInfo({
                phone: 'Error fetching phone',

            });
        } finally {
            setLoading(false);
        }
    };

    const handlePhonePress = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleWhatsAppPress = () => {
        Linking.openURL(`https://wa.me/${whatsapp}`);
    };

    const handleSocialLinkPress = (url) => {
        Linking.openURL(url);
    };

    const getAnimatedStyle = (delay = 0) => {
        return {
            opacity: fadeAnim,
            transform: [{ translateY: Animated.multiply(translateY, new Animated.Value(1 + delay * 0.5)) }]
        };
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Animated.View style={getAnimatedStyle()}>
                    <Text style={styles.heading}>Contact Us</Text>

                    {/* Animated Line */}
                    <Animated.View
                        style={[
                            styles.line,
                            {
                                width: lineWidth.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '40%'],
                                }),
                            },
                        ]}
                    />
                </Animated.View>

                {/* Phone Section */}
                <Animated.View style={[styles.card, getAnimatedStyle(0.2)]}>
                    <View style={styles.cardContent}>
                        <View style={styles.iconContainer}>
                            <Icon name="call" size={24} color="#fff" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.cardLabel}>{contactInfo.phone}</Text>
                        </View>
                        <TouchableOpacity onPress={handlePhonePress} style={styles.circleButton}>
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* WhatsApp Section */}
                <Animated.View style={[styles.card, styles.whatsappCard, getAnimatedStyle(0.4)]}>
                    <View style={styles.cardContent}>
                        <View style={[styles.iconContainer, styles.whatsappIcon]}>
                            <Icon name="logo-whatsapp" size={24} color="#fff" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.cardLabel}>WhatsApp</Text>
                            <TextInput
                                style={styles.contactText}
                                value={whatsapp}
                                onChangeText={setWhatsapp}
                                keyboardType="phone-pad"
                                placeholder="WhatsApp Number"
                                placeholderTextColor="#9E9E9E"
                            />
                        </View>
                        <TouchableOpacity onPress={handleWhatsAppPress} style={[styles.circleButton, styles.whatsappButton]}>
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Social Media Section */}
                <Animated.View style={[styles.socialCard, getAnimatedStyle(0.6)]}>
                    <Text style={styles.socialHeading}>Follow Us</Text>

                    <View style={styles.socialLinksContainer}>
                        {/* Facebook */}
                        <View style={styles.socialLinkItem}>
                            <View style={[styles.socialIconWrapper, styles.facebookIcon]}>
                                <Icon name="logo-facebook" size={22} color="#fff" />
                            </View>
                            <View style={styles.socialTextContainer}>
                                <Text style={styles.socialLabel}>Facebook</Text>
                                <TextInput
                                    style={styles.socialInput}
                                    value={facebookLink}
                                    onChangeText={setFacebookLink}
                                    placeholder="Facebook URL"
                                    placeholderTextColor="#9E9E9E"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(facebookLink)}
                                style={[styles.socialLinkButton, styles.facebookButton]}
                            >
                                <Icon name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Twitter */}
                        <View style={styles.socialLinkItem}>
                            <View style={[styles.socialIconWrapper, styles.twitterIcon]}>
                                <Icon name="logo-twitter" size={22} color="#fff" />
                            </View>
                            <View style={styles.socialTextContainer}>
                                <Text style={styles.socialLabel}>Twitter</Text>

                                <TextInput
                                    style={styles.socialInput}
                                    value={twitterLink}
                                    onChangeText={setTwitterLink}
                                    placeholder="Twitter URL"
                                    placeholderTextColor="#9E9E9E"
                                />

                            </View>
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(twitterLink)}
                                style={[styles.socialLinkButton, styles.twitterButton]}
                            >
                                <Icon name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Instagram */}
                        <View style={styles.socialLinkItem}>
                            <View style={[styles.socialIconWrapper, styles.instagramIcon]}>
                                <Icon name="logo-instagram" size={22} color="#fff" />
                            </View>
                            <View style={styles.socialTextContainer}>
                                <Text style={styles.socialLabel}>Instagram</Text>
                                <TextInput
                                    style={styles.socialInput}
                                    value={instagramLink}
                                    onChangeText={setInstagramLink}
                                    placeholder="Instagram URL"
                                    placeholderTextColor="#9E9E9E"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(instagramLink)}
                                style={[styles.socialLinkButton, styles.instagramButton]}
                            >
                                <Icon name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* LinkedIn */}
                        <View style={styles.socialLinkItem}>
                            <View style={[styles.socialIconWrapper, styles.linkedinIcon]}>
                                <Icon name="logo-linkedin" size={22} color="#fff" />
                            </View>
                            <View style={styles.socialTextContainer}>
                                <Text style={styles.socialLabel}>LinkedIn</Text>
                                <TextInput
                                    style={styles.socialInput}
                                    value={linkedinLink}
                                    onChangeText={setLinkedinLink}
                                    placeholder="LinkedIn URL"
                                    placeholderTextColor="#9E9E9E"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(linkedinLink)}
                                style={[styles.socialLinkButton, styles.linkedinButton]}
                            >
                                <Icon name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* YouTube */}
                        <View style={styles.socialLinkItem}>
                            <View style={[styles.socialIconWrapper, styles.youtubeIcon]}>
                                <Icon name="logo-youtube" size={22} color="#fff" />
                            </View>
                            <View style={styles.socialTextContainer}>
                                <Text style={styles.socialLabel}>YouTube</Text>
                                <TextInput
                                    style={styles.socialInput}
                                    value={youtubeLink}
                                    onChangeText={setYoutubeLink}
                                    placeholder="YouTube URL"
                                    placeholderTextColor="#9E9E9E"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => handleSocialLinkPress(youtubeLink)}
                                style={[styles.socialLinkButton, styles.youtubeButton]}
                            >
                                <Icon name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={updateSocialLinks}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Quick Connect Section */}
                <Animated.View style={[styles.quickConnectCard, getAnimatedStyle(0.8)]}>
                    <Text style={styles.quickConnectHeading}>Quick Connect</Text>
                    <View style={styles.quickConnectIcons}>
                        <TouchableOpacity
                            onPress={() => handleSocialLinkPress(facebookLink)}
                            style={[styles.quickIconWrapper, styles.facebookQuick]}
                        >
                            <Icon name="logo-facebook" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSocialLinkPress(twitterLink)}
                            style={[styles.quickIconWrapper, styles.twitterQuick]}
                        >
                            <Icon name="logo-twitter" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSocialLinkPress(instagramLink)}
                            style={[styles.quickIconWrapper, styles.instagramQuick]}
                        >
                            <Icon name="logo-instagram" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleWhatsAppPress}
                            style={[styles.quickIconWrapper, styles.whatsappQuick]}
                        >
                            <Icon name="logo-whatsapp" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSocialLinkPress(linkedinLink)}
                            style={[styles.quickIconWrapper, styles.linkedinQuick]}
                        >
                            <Icon name="logo-linkedin" size={28} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleSocialLinkPress(youtubeLink)}
                            style={[styles.quickIconWrapper, styles.youtubeQuick]}
                        ><Icon name="logo-youtube" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactDetailsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    contentContainer: {
        paddingHorizontal: 15,

        paddingTop: 10,
        paddingBottom: 10,
    },
    heading: {
        fontSize: 25,
        fontWeight: '800',
        color: '#2E3B55',
        marginBottom: 5,
        textAlign: 'center',
    },
    line: {
        height: 4,
        backgroundColor: '#536DFE',
        marginBottom: 5,
        alignSelf: 'center',
        borderRadius: 2,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        overflow: 'hidden',
    },
    whatsappCard: {
        backgroundColor: '#FFFFFF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#536DFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    whatsappIcon: {
        backgroundColor: '#25D366',
    },
    inputContainer: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#75777A',

    },
    contactText: {
        fontSize: 15,
        color: '#2E3B55',
        fontWeight: '500',

    },
    circleButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#536DFE',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    socialCard: {
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 5,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    socialHeading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2E3B55',
        marginBottom: 10,
    },
    socialLinksContainer: {
        gap: 5,
    },
    socialLinkItem: {

        flexDirection: 'row',
        alignItems: 'center',
    },
    socialIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    facebookIcon: {
        backgroundColor: '#1877F2',
    },
    twitterIcon: {
        backgroundColor: '#1DA1F2',
    },
    instagramIcon: {
        backgroundColor: '#E4405F',
    },
    linkedinIcon: {
        backgroundColor: '#0A66C2',
    },
    youtubeIcon: {
        backgroundColor: '#FF0000',
    },
    socialTextContainer: {
        flex: 1,
    },
    socialLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#75777A',
        marginBottom: 2,
    },
    socialInput: {
        fontSize: 15,
        color: '#2E3B55',
        width: "95%"
    },
    socialLinkButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    twitterButton: {
        backgroundColor: '#1DA1F2',
    },
    instagramButton: {
        backgroundColor: '#E4405F',
    },
    linkedinButton: {
        backgroundColor: '#0A66C2',
    },
    youtubeButton: {
        backgroundColor: '#FF0000',
    },
    saveButton: {
        backgroundColor: '#536DFE',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    quickConnectCard: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    quickConnectHeading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2E3B55',
        marginBottom: 10,
        textAlign: 'center',
    },
    quickConnectIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    quickIconWrapper: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
        margin: 5,
    },
    facebookQuick: {
        backgroundColor: '#1877F2',
    },
    twitterQuick: {
        backgroundColor: '#1DA1F2',
    },
    instagramQuick: {
        backgroundColor: '#E4405F',
    },
    whatsappQuick: {
        backgroundColor: '#25D366',
    },
    linkedinQuick: {
        backgroundColor: '#0A66C2',
    },
    youtubeQuick: {
        backgroundColor: '#FF0000',
    },
});