import { StyleSheet, Text, View, TouchableOpacity, Linking, Animated, Easing, StatusBar, SafeAreaView, Alert, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
const ContactDetails = ({ route }) => {
    const { SchoolContactInfo = [] } = route.params || {};
    const [whatsapp, setWhatsapp] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [xLink, setXLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [contactInfo, setContactInfo] = useState({
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    // Animated values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const lineWidth = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    // Process SchoolContactInfo data
    useEffect(() => {
        if (SchoolContactInfo && SchoolContactInfo.length > 0) {
            setLoading(true);

            try {
                const contactData = SchoolContactInfo[0];

                if (contactData.phone) {
                    setContactInfo(prev => ({
                        ...prev,
                        phone: contactData.phone || ''
                    }));
                }
                setWhatsapp(contactData.whatsapp || '');
                setFacebookLink(contactData.facebook || '');
                setXLink(contactData.x || '');
                setInstagramLink(contactData.instagram || '');
                setLinkedinLink(contactData.linkedin || '');
                setYoutubeLink(contactData.youtube || '');

            } catch (error) {
                console.error("Error processing contact info:", error);
                Alert.alert("Error", "Failed to load contact information");
            } finally {
                setLoading(false);
            }
        }
    }, [SchoolContactInfo]);

    // Run animations when component mounts
    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 700,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(lineWidth, {
                    toValue: 1,
                    duration: 1000,
                    delay: 400,
                    useNativeDriver: false,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.elastic(1),
                    useNativeDriver: true,
                }),
            ]).start();
        }, 200);

        return () => clearTimeout(animationTimeout);
    }, [fadeAnim, translateY, lineWidth, scaleAnim]);

    const handlePhonePress = () => {
        Linking.openURL(`tel:${contactInfo.phone}`);
    };

    const handleWhatsAppPress = () => {
        Linking.openURL(`https://wa.me/${whatsapp}`);
    };

    const handleSocialLinkPress = (url) => {
        if (!url) {
            Alert.alert("Information", "Link not available");
            return;
        }
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        Linking.openURL(formattedUrl).catch(() => {
            Alert.alert("Error", "Couldn't open the link");
        });
    };

    const getAnimatedStyle = (delay = 0) => {
        return {
            opacity: fadeAnim,
            transform: [
                { translateY: Animated.multiply(translateY, new Animated.Value(1 + delay * 0.3)) },
                { scale: Animated.add(0.95, Animated.multiply(scaleAnim, new Animated.Value(0.05))) }
            ]
        };
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <LinearGradient
                    colors={['#F9FAFF', '#F0F4FF']}
                    style={[styles.container, styles.loadingContainer]}
                >
                    <View style={styles.loadingIndicator}>
                        <Text style={styles.loadingText}>Loading contact information...</Text>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />
            <LinearGradient
                colors={['#F9FAFF', '#F0F4FF']}
                style={styles.container}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View style={[styles.headerContainer, getAnimatedStyle()]}>
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
                        <Text style={styles.subHeading}>Get in touch with us</Text>
                    </Animated.View>

                    {/* Phone Section */}
                    {contactInfo.phone && (
                        <Animated.View style={[styles.card, getAnimatedStyle(0.2)]}>
                            <LinearGradient
                                colors={['#FFFFFF', '#F9FAFF']}
                                style={styles.gradientCard}
                            >
                                <View style={styles.cardContent}>
                                    <View style={styles.iconContainer}>
                                        <Icon name="call" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.cardLabel}>Phone</Text>
                                        <Text style={styles.contactText}>{contactInfo.phone}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handlePhonePress}
                                        style={styles.circleButton}
                                        activeOpacity={0.7}
                                    >
                                        <Icon name="arrow-forward" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    )}

                    {/* WhatsApp Section */}
                    {whatsapp && (
                        <Animated.View style={[styles.card, getAnimatedStyle(0.4)]}>
                            <LinearGradient
                                colors={['#FFFFFF', '#F9FAFF']}
                                style={styles.gradientCard}
                            >
                                <View style={styles.cardContent}>
                                    <View style={[styles.iconContainer, styles.whatsappIcon]}>
                                        <Icon name="logo-whatsapp" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.cardLabel}>WhatsApp</Text>
                                        <Text style={styles.contactText}>{whatsapp}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleWhatsAppPress}
                                        style={[styles.circleButton, styles.whatsappButton]}
                                        activeOpacity={0.7}
                                    >
                                        <Icon name="arrow-forward" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    )}

                    {/* Social Media Section */}
                    {(facebookLink || xLink || instagramLink || linkedinLink || youtubeLink) && (
                        <Animated.View style={[styles.socialCard, getAnimatedStyle(0.6)]}>
                            <Text style={styles.socialHeading}>Follow Us</Text>

                            <View style={styles.socialLinksContainer}>
                                {/* Facebook */}
                                {facebookLink && (
                                    <View style={styles.socialLinkItem}>
                                        <LinearGradient
                                            colors={['#1877F2', '#0A5DD8']}
                                            style={[styles.socialIconWrapper]}
                                        >
                                            <Icon name="logo-facebook" size={22} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.socialTextContainer}>
                                            <Text style={styles.socialLabel}>Facebook</Text>
                                            <Text style={styles.socialText} numberOfLines={1}>{facebookLink}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleSocialLinkPress(facebookLink)}
                                            style={[styles.socialLinkButton, styles.facebookButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Icon name="arrow-forward" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* X (formerly Twitter) */}
                                {xLink && (
                                    <View style={styles.socialLinkItem}>
                                        <LinearGradient
                                            colors={['#333333', '#000000']}
                                            style={[styles.socialIconWrapper]}
                                        >
                                            <Icon name="logo-twitter" size={22} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.socialTextContainer}>
                                            <Text style={styles.socialLabel}>X</Text>
                                            <Text style={styles.socialText} numberOfLines={1}>{xLink}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleSocialLinkPress(xLink)}
                                            style={[styles.socialLinkButton, styles.xButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Icon name="arrow-forward" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Instagram */}
                                {instagramLink && (
                                    <View style={styles.socialLinkItem}>
                                        <LinearGradient
                                            colors={['#E4405F', '#D93651']}
                                            style={[styles.socialIconWrapper]}
                                        >
                                            <Icon name="logo-instagram" size={22} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.socialTextContainer}>
                                            <Text style={styles.socialLabel}>Instagram</Text>
                                            <Text style={styles.socialText} numberOfLines={1}>{instagramLink}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleSocialLinkPress(instagramLink)}
                                            style={[styles.socialLinkButton, styles.instagramButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Icon name="arrow-forward" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* LinkedIn */}
                                {linkedinLink && (
                                    <View style={styles.socialLinkItem}>
                                        <LinearGradient
                                            colors={['#0A66C2', '#0854A0']}
                                            style={[styles.socialIconWrapper]}
                                        >
                                            <Icon name="logo-linkedin" size={22} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.socialTextContainer}>
                                            <Text style={styles.socialLabel}>LinkedIn</Text>
                                            <Text style={styles.socialText} numberOfLines={1}>{linkedinLink}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleSocialLinkPress(linkedinLink)}
                                            style={[styles.socialLinkButton, styles.linkedinButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Icon name="arrow-forward" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* YouTube */}
                                {youtubeLink && (
                                    <View style={styles.socialLinkItem}>
                                        <LinearGradient
                                            colors={['#FF0000', '#CC0000']}
                                            style={[styles.socialIconWrapper]}
                                        >
                                            <Icon name="logo-youtube" size={22} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.socialTextContainer}>
                                            <Text style={styles.socialLabel}>YouTube</Text>
                                            <Text style={styles.socialText} numberOfLines={1}>{youtubeLink}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleSocialLinkPress(youtubeLink)}
                                            style={[styles.socialLinkButton, styles.youtubeButton]}
                                            activeOpacity={0.7}
                                        >
                                            <Icon name="arrow-forward" size={18} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </Animated.View>
                    )}

                    {/* Quick Connect Section */}
                    {(facebookLink || xLink || instagramLink || whatsapp || linkedinLink || youtubeLink) && (
                        <Animated.View style={[styles.quickConnectCard, getAnimatedStyle(0.8)]}>
                            <Text style={styles.quickConnectHeading}>Quick Connect</Text>
                            <View style={styles.quickConnectIcons}>
                                {facebookLink && (
                                    <TouchableOpacity
                                        onPress={() => handleSocialLinkPress(facebookLink)}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1877F2', '#0A5DD8']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-facebook" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {xLink && (
                                    <TouchableOpacity
                                        onPress={() => handleSocialLinkPress(xLink)}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#333333', '#000000']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-twitter" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {instagramLink && (
                                    <TouchableOpacity
                                        onPress={() => handleSocialLinkPress(instagramLink)}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#E4405F', '#D93651']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-instagram" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {whatsapp && (
                                    <TouchableOpacity
                                        onPress={handleWhatsAppPress}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#25D366', '#128C7E']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-whatsapp" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {linkedinLink && (
                                    <TouchableOpacity
                                        onPress={() => handleSocialLinkPress(linkedinLink)}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#0A66C2', '#0854A0']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-linkedin" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                                {youtubeLink && (
                                    <TouchableOpacity
                                        onPress={() => handleSocialLinkPress(youtubeLink)}
                                        style={styles.quickIconOuterWrapper}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#FF0000', '#CC0000']}
                                            style={styles.quickIconWrapper}
                                        >
                                            <Icon name="logo-youtube" size={28} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>
                    )}

                    {/* No data message */}
                    {!contactInfo.phone && !whatsapp && !facebookLink && !xLink && !instagramLink && !linkedinLink && !youtubeLink && (
                        <View style={styles.noDataContainer}>
                            <Icon name="information-circle-outline" size={60} color="#A0AEC0" />
                            <Text style={styles.noDataText}>No contact information available.</Text>
                            <Text style={styles.noDataSubText}>Please check back later.</Text>
                        </View>
                    )}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Connect with us today</Text>
                    </View>
                </ScrollView>
                <View style={{ height: 70 }} />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default ContactDetails;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIndicator: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#4A5568',
        fontWeight: '600',
    },
    headerContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subHeading: {
        fontSize: 16,
        color: '#718096',
        marginTop: 6,
        fontWeight: '500',
    },
    line: {
        height: 4,
        backgroundColor: '#6366F1', // Indigo shade
        marginVertical: 5,
        alignSelf: 'center',
        borderRadius: 2,
    },
    card: {
        marginBottom: 18,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    gradientCard: {
        borderRadius: 16,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#6366F1', // Indigo shade
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    whatsappIcon: {
        backgroundColor: '#25D366',
        shadowColor: '#25D366',
    },
    inputContainer: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#718096',
        marginBottom: 2,
    },
    contactText: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '600',
    },
    circleButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#6366F1', // Indigo shade
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
        shadowColor: '#25D366',
    },
    socialCard: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 18,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    socialHeading: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    socialLinksContainer: {
        gap: 12,
    },
    socialLinkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#F7FAFC',
        padding: 10,
        borderRadius: 14,
    },
    socialIconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    socialTextContainer: {
        flex: 1,
    },
    socialLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#718096',
        marginBottom: 2,
    },
    socialText: {
        fontSize: 15,
        color: '#2D3748',
        fontWeight: '500',
    },
    socialLinkButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    xButton: {
        backgroundColor: '#000000',
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
    quickConnectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
    },
    quickConnectHeading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 15,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    quickConnectIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    quickIconOuterWrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 28,
    },
    quickIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataContainer: {
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    noDataText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A5568',
        textAlign: 'center',
        marginTop: 15,
    },
    noDataSubText: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginTop: 5,
    },
    footer: {
        marginTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
});