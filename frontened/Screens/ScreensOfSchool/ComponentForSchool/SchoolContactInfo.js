import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SchoolContactInfo = ({ loginEmail }) => {
    const navigation = useNavigation();
    const { email } = useSelector((state) => state.auth);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        address: '',
        pin: '',
        website: '',
        phone: '',
        email: '',
    });

    const fetchSchoolDetails = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axiosConfiguration.post('/school/get-school-details', { email });
            const schoolDetails = response?.data?.schoolDetails;

            setContactInfo({
                address: schoolDetails?.reachUs?.address
                    ? `${schoolDetails.reachUs.address.street || 'Street Not Available'}, ${schoolDetails.reachUs.address.region || ''}, ${schoolDetails.reachUs.address.district || ''}, ${schoolDetails.reachUs.address.state || ''}`.trim()
                    : 'N/A',
                pin: schoolDetails?.reachUs?.address?.pin || 'N/A',
                website: schoolDetails?.reachUs?.website || 'N/A',
                phone: schoolDetails?.reachUs?.phones?.length
                    ? schoolDetails.reachUs.phones.filter(phone => phone).join(', ')
                    : schoolDetails.contactPersonPhone,
                email: schoolDetails?.reachUs?.emails?.length
                    ? schoolDetails.reachUs.emails.filter(email => email).join(', ')
                    : schoolDetails.loginEmail,
            });
        } catch (error) {
            console.error('Error fetching school details:', error);
            setContactInfo({
                address: 'Error fetching address',
                pin: 'Error fetching pin',
                website: 'Error fetching website',
                phone: 'Error fetching phone',
                email: 'Error fetching email',
            });
        } finally {
            setLoading(false);
        }
    }, [email]);

    useFocusEffect(
        useCallback(() => {
            fetchSchoolDetails();
        }, [fetchSchoolDetails])
    );

    // Handle link actions
    const handleEmailPress = (email) => {
        if (email && email !== 'N/A') {
            // Open email app with the email address
            Linking.openURL(`mailto:${email}`);
        }
    };

    const handleMapPress = (pin) => {
        // Combine address and pin for better map search
        const location = `${pin}`.replace('N/A', '').trim();
        if (location !== 'N/A') {
            // Open Google Maps with the specified location
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
            Linking.openURL(mapUrl);
        }
    };

    const handlePhonePress = (phone) => {
        if (phone && phone !== 'N/A') {
            // Extract first valid phone number if multiple are provided
            const firstPhone = phone.split(',')[0].trim();
            // Open phone dialer with the number
            Linking.openURL(`tel:${firstPhone}`);
        }
    };

    const handleWebsitePress = (website) => {
        if (website && website !== 'N/A') {
            // Add https:// if not present
            let url = website;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = `https://${url}`;
            }
            // Open website in browser
            Linking.openURL(url);
        }
    };

    return (
        <View style={{ marginLeft: 10, marginRight: 11 }}>
            {loading ? (
                <ActivityIndicator size="large" color='#3D5AFE' style={{ marginTop: 50 }} />
            ) : (
                <>
                    {/* Header */}
                    <View style={{
                        zIndex: 1, position: 'relative', left: 10, top: 15,
                        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', width: '38%',
                    }}>
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
                        <Text style={{ fontSize: 22, fontWeight: '700', color: '#3D5AFE' }}>Reach us</Text>
                    </View>

                    {/* Contact Info Card */}
                    <View style={{
                        borderWidth: 0.5,
                        borderRadius: 10,
                        padding: 15,
                        borderColor: '#666666',
                        backgroundColor: '#f2f2f2',
                        elevation: 2,
                        paddingTop: 30,
                        position: 'relative',
                    }}>
                        {/* Edit Icon */}
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{
                                position: 'absolute', top: -15, right: 15, height: 32, width: 32, backgroundColor: '#fff', elevation: 2,
                                borderRadius: 16, justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <MaterialIcons name="edit" size={23} color='#3D5AFE' />
                        </TouchableOpacity>

                        {/* Address with Map Link */}
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 10, alignItems: 'center' }}>
                            <MaterialIcons name="location-on" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>ADDRESS :</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleMapPress(contactInfo.pin)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 15, width: '85%', padding: 5 }}>
                                {contactInfo.address}
                            </Text>
                            <MaterialIcons name="map" size={16} color="#3D5AFE" />
                        </TouchableOpacity>

                        {/* PIN with Map Link */}
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 10, alignItems: 'center' }}>
                            <MaterialIcons name="vpn-key" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>PIN :</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleMapPress(contactInfo.pin)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Text style={{ fontSize: 15, width: '85%', padding: 5 }}>
                                {contactInfo.pin}
                            </Text>
                            <MaterialIcons name="map" size={16} color="#3D5AFE" />
                        </TouchableOpacity>

                        {/* Website with Browser Link */}
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 10, alignItems: 'center' }}>
                            <MaterialIcons name="public" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>WEBSITE :</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleWebsitePress(contactInfo.website)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Text style={{
                                fontSize: 15,
                                width: '85%',
                                padding: 5,
                                color: contactInfo.website !== 'N/A' ? '#3D5AFE' : 'black',
                                textDecorationLine: contactInfo.website !== 'N/A' ? 'underline' : 'none'
                            }}>
                                {contactInfo.website}
                            </Text>
                            {contactInfo.website !== 'N/A' && <MaterialIcons name="open-in-browser" size={16} color="#3D5AFE" />}
                        </TouchableOpacity>

                        {/* Phone with Dialer Link */}
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 10, alignItems: 'center' }}>
                            <MaterialIcons name="phone" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>PHONE :</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handlePhonePress(contactInfo.phone)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Text style={{
                                fontSize: 15,
                                width: '85%',
                                padding: 5,
                                color: contactInfo.phone !== 'N/A' ? '#3D5AFE' : 'black',
                                textDecorationLine: contactInfo.phone !== 'N/A' ? 'underline' : 'none'
                            }}>
                                {contactInfo.phone}
                            </Text>
                            {contactInfo.phone !== 'N/A' && <MaterialIcons name="call" size={16} color="#3D5AFE" />}
                        </TouchableOpacity>

                        {/* Email with Email App Link */}
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 10, alignItems: 'center' }}>
                            <MaterialIcons name="email" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>EMAIL :</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleEmailPress(contactInfo.email)}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Text style={{
                                fontSize: 15,
                                width: '85%',
                                padding: 5,
                                color: contactInfo.email !== 'N/A' ? '#3D5AFE' : 'black',
                                textDecorationLine: contactInfo.email !== 'N/A' ? 'underline' : 'none'
                            }}>
                                {contactInfo.email}
                            </Text>
                            {contactInfo.email !== 'N/A' && <MaterialIcons name="mail" size={16} color="#3D5AFE" />}
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <Image
                source={require('../Images/DemoBanner/mailbox.png')}
                style={{
                    zIndex: 0,
                    position: 'relative', right: '-75%', top: '-25%',
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                    resizeMode: 'contain',
                    opacity: 1,
                }}
            />
            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                    <Animatable.View
                        animation="slideInUp"
                        duration={300}
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            padding: 12,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                            Edit Contact Info
                        </Text>
                        <TouchableOpacity
                            style={{
                                position: 'absolute', top: 10, right: 10,
                            }}
                            onPress={() => setModalVisible(false)}
                        >
                            <MaterialIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('EditSchoolContactInfo', { contactInfo });
                            }}
                            style={{
                                marginTop: 20,
                                padding: 10,
                                backgroundColor: '#3D5AFE',
                                borderRadius: 5,
                            }}
                        ><Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Proceed to Edit</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </Modal>
        </View>
    );
};

export default SchoolContactInfo;