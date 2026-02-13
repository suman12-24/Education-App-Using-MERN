import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions, TouchableOpacity, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');
const SchoolContactInfo = ({ GurdianContactDetails }) => {
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        address: '',
        pin: '',
        website: '',
        phone: [],
        email: [],
    });

    useEffect(() => {
        if (GurdianContactDetails) {
            const { address, emails, phones, website } = GurdianContactDetails;

            setContactInfo({
                address: `${address?.street || 'Street Not Available'}, ${address?.district || ''}, ${address?.state || ''}`,
                pin: address?.pin || 'N/A',
                website: website || 'N/A',
                phone: Array.isArray(phones) ? phones : ['N/A'],
                email: Array.isArray(emails) ? emails : ['N/A'],
            });
            setLoading(false);
        }
    }, [GurdianContactDetails]);

    const handleLinkPress = (key, value) => {
        if (!value || value === 'N/A') return;

        switch (key) {
            case 'phone':
                Linking.openURL(`tel:${value}`);
                break;
            case 'email':
                Linking.openURL(`mailto:${value}`);
                break;
            case 'website':
                Linking.openURL(value.startsWith('http') ? value : `https://${value}`);
                break;
            case 'pin':
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${value}`);
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#006699" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.header}>
                        <Image
                            source={require('../Images/DemoBanner/locationIcon.png')}
                            style={styles.headerIcon}
                        />
                        <Text style={styles.headerText}>Reach us</Text>
                    </View>

                    <View style={styles.card}>
                        {Object.entries(contactInfo).map(([key, value]) => {
                            const iconMap = {
                                address: 'location-city',
                                pin: 'map',
                                website: 'public',
                                phone: 'phone',
                                email: 'email',
                            };
                            return (
                                <View key={key} style={styles.entryContainer}>
                                    <View style={styles.keyRow}>
                                        <MaterialIcons
                                            name={iconMap[key] || 'info'}
                                            size={22}
                                            color="#666"
                                        />
                                        <Text style={styles.keyText}>
                                            {key.toUpperCase()}:
                                        </Text>
                                    </View>

                                    <View style={styles.valueContainer}>
                                        {Array.isArray(value) ? (
                                            value.map((item, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => handleLinkPress(key, item)}
                                                    disabled={item === 'N/A'}
                                                >
                                                    <Text style={[
                                                        styles.valueText,
                                                        styles[`${key}Text`],
                                                        (key === 'pin' && item !== 'N/A') && styles.pinText
                                                    ]}>
                                                        {key === 'pin' ? `📍 ${item}` : item}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => handleLinkPress(key, value)}
                                                disabled={value === 'N/A'}
                                            >
                                                <Text style={[
                                                    styles.valueText,
                                                    styles[`${key}Text`],
                                                    (key === 'pin' && value !== 'N/A') && styles.pinText
                                                ]}>
                                                    {key === 'pin' ? `📍 ${value}` : value}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </>
            )}

            <Image
                source={require('../Images/DemoBanner/mailbox.png')}
                style={styles.mailboxImage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
    },
    loader: {
        marginTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        width: '38%',
        left: 10,
        top: 15,
        zIndex: 1,
        position: 'relative',
    },
    headerIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        resizeMode: 'cover',
        backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#006699',
        marginLeft: 8,
    },
    card: {
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 15,
        borderColor: '#666666',
        backgroundColor: '#f2f2f2',
        elevation: 2,
        paddingTop: 30,
        position: 'relative',
    },
    entryContainer: {
        marginBottom: 10,
    },
    keyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    keyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginLeft: 8,
    },
    valueContainer: {
        marginLeft: 30, // Icon width + margin
    },
    valueText: {
        fontSize: 15,
        color: '#000',
    },
    phoneText: {
        color: '#3D5AFE',
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    emailText: {
        color: '#3D5AFE',
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    websiteText: {
        color: '#3D5AFE',
        fontWeight: '500',
        textDecorationLine: "underline",

    },
    pinText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#3D5AFE',
    },
    mailboxImage: {
        position: 'relative',
        right: '-79%',
        top: '-25%',
        width: 75,
        height: 75,
        borderRadius: 37.5,
        resizeMode: 'contain',
        opacity: 1,
        zIndex: 0,
    },
});

export default SchoolContactInfo;

