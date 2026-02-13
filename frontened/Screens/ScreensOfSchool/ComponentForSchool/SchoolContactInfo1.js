import { StyleSheet, Text, View, Image, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const SchoolContactInfo = ({ loginEmail }) => {
    const email = loginEmail;
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        address: '',
        pin: '',
        website: '',
        phone: '',
        email: '',
    });

    const fetchSchoolDetails = async () => {
        try {
            setLoading(true);

            const response = await axiosConfiguration.post('/school/get-school-details', { email });
            const data = response.data;

            setContactInfo({
                address: data.schoolDetails.location.RegionName + " " + data.schoolDetails.location.District || 'N/A',
                pin: data.schoolDetails.location.Pincode || 'N/A',
                website: data.website || 'N/A',
                phone: data.schoolDetails.contactPersonPhone || 'N/A',
                email: data.schoolDetails.loginEmail || 'N/A',
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
    };

    useEffect(() => {
        fetchSchoolDetails();
    }, []);

    const handleInputChange = (key, value) => {
        setContactInfo((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <View style={{ marginLeft: 10, marginRight: 11 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#006699" style={{ marginTop: 50 }} />
            ) : (
                <>
                    {/* Header with Reach Us */}
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
                        {/* Pencil Icon */}
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{
                                position: 'absolute', top: -15, right: 15, height: 32, width: 32, backgroundColor: '#ff9999',
                                borderRadius: 16, justifyContent: 'center', alignItems: 'center'
                            }}
                        >
                            <MaterialIcons name="edit" size={23} color="#006699" />
                        </TouchableOpacity>

                        {/* Address */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="location-on" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', width: 70 }}>Address:</Text>
                            <Text style={{ fontSize: 16 }}>{contactInfo.address}</Text>
                        </View>

                        {/* PIN */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="pin-drop" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', width: 70 }}>PIN:</Text>
                            <Text style={{ fontSize: 16 }}>{contactInfo.pin}</Text>
                        </View>

                        {/* Website */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="language" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', width: 70 }}>Website:</Text>
                            <Text style={{ fontSize: 16 }}>{contactInfo.website}</Text>
                        </View>

                        {/* Phone */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="phone" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', width: 70 }}>Phone:</Text>
                            <Text style={{ fontSize: 16 }}>{contactInfo.phone}</Text>
                        </View>

                        {/* Email */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <MaterialIcons name="email" size={20} color="#666" style={{ width: 30 }} />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', width: 70 }}>Email:</Text>
                            <Text style={{ fontSize: 16 }}>{contactInfo.email}</Text>
                        </View>
                    </View>
                </>
            )}


            <Image
                source={require('../Images/DemoBanner/mailbox.png')}
                style={{
                    zIndex: 0,
                    position: 'relative', right: '-75%', top: '-28%',
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                    resizeMode: 'contain',
                    opacity: 1,
                }}
            />

            {/* Modal for Editing */}
            {/* <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            > */}
            {/* <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Contact Info</Text> */}

            {/* Input Fields with Icons */}
            {/* {Object.keys(contactInfo).map((key) => {
                            let iconName = '';
                            switch (key) {
                                case 'address':
                                    iconName = 'location-on';
                                    break;
                                case 'pin':
                                    iconName = 'pin-drop';
                                    break;
                                case 'website':
                                    iconName = 'language';
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
                                <View key={key} style={styles.inputContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name={iconName} size={20} color="#666" style={{ marginRight: 5 }} />
                                        <Text style={styles.inputLabel}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                                        </Text>
                                    </View>
                                    <TextInput
                                        style={styles.textInput}
                                        value={contactInfo[key]}
                                        onChangeText={(value) => handleInputChange(key, value)}
                                        placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    />
                                </View>
                            );
                        })} */}


            {/* Buttons */}
            {/* <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View> */}
            {/* </View> */}
            {/* </View> */}
            {/* </Modal> */}
        </View>
    );
};

export default SchoolContactInfo;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
        letterSpacing: 0.3,
    },
    textInput: {
        backgroundColor: '#f8f8f8',
        borderWidth: 0.5,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    cancelButton: {
        backgroundColor: '#FF5252',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});

