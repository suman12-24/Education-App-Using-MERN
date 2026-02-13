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
        phone: [
        ],
        email: [],
    });

    useEffect(() => {
        if (GurdianContactDetails) {
            const { address, emails, phones, website } = GurdianContactDetails;
            setContactInfo({
                address: `${address?.street || ''}, ${address?.district || ''}, ${address?.state || ''}`,
                pin: address?.pin || 'N/A',
                website: website || 'N/A',
                phone: Array.isArray(phones) ? phones : ['N/A'],
                email: Array.isArray(emails) ? emails : ['N/A'],
            });
            setLoading(false);
        }
    }, [GurdianContactDetails]);

    // Function to handle link navigation
    const handleLinkPress = (key, value) => {
        if (!value || value === 'N/A') return;

        switch (key) {
            case 'phone':
                Linking.openURL(`tel:${value}`).catch(err => console.error('Error opening dialer', err));
                break;
            case 'email':
                Linking.openURL(`mailto:${value}`).catch(err => console.error('Error opening email', err));
                break;
            case 'website':
                Linking.openURL(value.startsWith('http') ? value : `https://${value}`).catch(err => console.error('Error opening browser', err));
                break;
            case 'pin':
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${value}`).catch(err =>
                    console.error('Error opening Google Maps', err)
                );
                break;
            default:
                break;
        }
    };

    return (
        <View style={{ marginLeft: 10, marginRight: 10 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#006699" style={{ marginTop: 50 }} />
            ) : (
                <>
                    {/* Header */}
                    <View
                        style={{
                            zIndex: 1,
                            position: 'relative',
                            left: 10,
                            top: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2',
                            width: '38%',
                        }}
                    >
                        <Image
                            source={require('../Images/DemoBanner/locationIcon.png')}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                resizeMode: 'cover',
                                backgroundColor: '#fff',
                            }}
                        />
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#006699' }}>Reach us</Text>
                    </View>

                    {/* Contact Info Card */}
                    <View
                        style={{
                            borderWidth: 0.5,
                            borderRadius: 10,
                            padding: 15,
                            borderColor: '#666666',
                            backgroundColor: '#f2f2f2',
                            elevation: 2,
                            paddingTop: 30,
                            position: 'relative',
                        }}
                    >
                        {/* Details */}
                        {Object.entries(contactInfo).map(([key, value]) => {
                            let iconName;

                            // Assigning appropriate icons
                            switch (key) {
                                case 'address':
                                    iconName = 'location-city'; // Better icon for address
                                    break;
                                case 'pin':
                                    iconName = 'map'; // Changed to indicate maps or location
                                    break;
                                case 'website':
                                    iconName = 'public';
                                    break;
                                case 'phone':
                                    iconName = 'phone';
                                    break;
                                case 'email':
                                    iconName = 'email';
                                    break;
                                default:
                                    iconName = 'info';
                            }

                            return (
                                <View
                                    key={key}
                                    style={{
                                        flexDirection: 'row',
                                        marginBottom: 10,
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', width: '28%' }}>
                                        {/* Icon */}
                                        <MaterialIcons name={iconName} size={22} color={key === 'pin' ? '#666' : '#666'} />
                                        {/* Label */}
                                        <View style={{ marginLeft: 5 }}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                                {key.toUpperCase()} :
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={{ width: '70%', paddingLeft: 8 }}>
                                        {/* Conditional Rendering for Array Values */}
                                        {Array.isArray(value) ? (
                                            value.map((item, index) => (
                                                <TouchableOpacity key={index} onPress={() => handleLinkPress(key, item)} activeOpacity={0.7}>
                                                    <Text
                                                        style={{
                                                            fontSize: key === 'pin' ? 18 : 15, // Larger for PIN
                                                            fontWeight: key === 'pin' ? 'bold' : 'normal',
                                                            color: ['phone', 'email', 'website', 'pin'].includes(key) ? '#007BFF' : '#000',
                                                            textDecorationLine: ['phone', 'email', 'website', 'pin'].includes(key) ? 'underline' : 'none',
                                                            textAlign: key === 'pin' ? 'center' : 'left',
                                                            paddingVertical: key === 'pin' ? 5 : 0,
                                                        }}
                                                    >
                                                        {key === 'pin' ? `📍 ${item}` : item} {/* Pin icon for emphasis */}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <TouchableOpacity onPress={() => handleLinkPress(key, value)} activeOpacity={0.7}>
                                                <Text
                                                    style={{
                                                        fontSize: key === 'pin' ? 17 : 15, // Larger for PIN
                                                        fontWeight: key === 'pin' ? 'bold' : 'normal',
                                                        color: ['phone', 'email', 'website', 'pin'].includes(key) ? '#007BFF' : '#000',
                                                        // textDecorationLine: ['phone', 'email', 'website', 'pin'].includes(key) ? 'underline' : 'none',
                                                        textAlign: key === 'pin' ? 'auto' : 'left',
                                                        paddingVertical: key === 'pin' ? 5 : 0,
                                                    }}
                                                >
                                                    {key === 'pin' ? `📍${value}` : value}
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
                style={{
                    zIndex: 0,
                    position: 'relative',
                    right: '-79%',
                    top: '-25%',
                    width: 75,
                    height: 75,
                    borderRadius: 75 / 2,
                    resizeMode: 'contain',
                    opacity: 1,
                }}
            />
        </View>
    );
};

export default SchoolContactInfo;
