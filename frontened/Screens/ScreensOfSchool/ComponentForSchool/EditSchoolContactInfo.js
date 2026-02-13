import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Animated, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';

const EditSchoolContactInfo = ({ route, navigation }) => {
    const { email } = useSelector((state) => state.auth);
    const [fetchSchoolDetails, setFetchSchoolDetails] = useState();
    const [street, setStreet] = useState();
    const [region, setRegion] = useState();
    const [district, setDistrict] = useState();
    const [state, setState] = useState();
    const [phoneTwo, setPhoneTwo] = useState();
    const [altEmail, setAltEmail] = useState();
    const [website, setWebsite] = useState([]);
    const [pincode, setPincode] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Animate the form appearance
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    useEffect(() => {
        const fetchPincodeData = async () => {
            if (!pincode) return;

            try {
                const response = await axiosConfiguration.post('/user/address-by-pin', { pincode: pincode });
                if (response?.data?.success) {
                    const filteredAddresses = response?.data?.filteredAddresses;
                    if (filteredAddresses && filteredAddresses.length > 0) {
                        const address = filteredAddresses[0];

                        setRegion(address.RegionName || 'Unknown Region');
                        setDistrict(address.District || 'Unknown District');
                        setState(address.StateName || 'Unknown State');
                    }
                } else {
                    setRegion('Unknown Region');
                    setDistrict('Unknown District');
                    setState('Unknown State');
                }
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        }

        fetchPincodeData();
    }, [pincode]);

    useEffect(() => {
        const fetchSchoolData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosConfiguration.post('/school/get-school-details', { email });
                const schoolDetails = response?.data?.schoolDetails;
                setFetchSchoolDetails(schoolDetails);
                setPincode(schoolDetails?.reachUs?.address?.pin);
                setStreet(schoolDetails?.reachUs?.address?.street);
                setRegion(schoolDetails?.reachUs?.address?.region);
                setDistrict(schoolDetails?.reachUs?.address?.district);
                setState(schoolDetails?.reachUs?.address?.state);
                setAltEmail(schoolDetails?.reachUs?.emails[1]);
                setPhoneTwo(schoolDetails?.reachUs?.phones[1]);
                setWebsite(schoolDetails?.reachUs?.website);
            } catch (error) {
                console.error('Failed to fetch school data:', error);
                Alert.alert('Error', 'Failed to load school data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (email) {
            fetchSchoolData();
        }
    }, [email]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const payLoad = {
                loginEmail: email,
                address: {
                    street: street,
                    district: district,
                    state: state,
                    region: region,
                    pin: pincode,
                },
                website: website,
                phones: [fetchSchoolDetails?.contactPersonPhone, phoneTwo],
                emails: [email, altEmail],
            };

            const response = await axiosConfiguration.post('/school/update-reach-us', payLoad);

            if (response?.data?.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    navigation.goBack();
                }, 2000);
            } else {
                Alert.alert(
                    'Update Failed',
                    'Failed to save details. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error saving details:', error);
            Alert.alert(
                'Error',
                'An error occurred while saving the details. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Loading school information...</Text>
            </View>
        );
    }

    if (showSuccess) {
        return (
            <View style={styles.successContainer}>
                <Animatable.View animation="bounceIn" duration={1000}>
                    <Icon name="check-circle" size={80} color="#4CAF50" />
                </Animatable.View>
                <Animatable.Text animation="fadeIn" style={styles.successText}>
                    Details Updated Successfully!
                </Animatable.Text>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Animated.View
                style={[
                    styles.formContainer,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <Animatable.View animation="fadeIn" duration={800} delay={200}>
                    <Text style={styles.title}>Edit Contact Information</Text>
                    <View style={styles.divider} />
                </Animatable.View>

                {/* Address Section */}
                <Animatable.View animation="fadeIn" duration={800} delay={400}>
                    <View style={styles.sectionHeader}>
                        <Icon name="map-marker-radius" size={24} color="#4285F4" />
                        <Text style={styles.sectionLabel}>Address Information</Text>
                    </View>

                    <Text style={styles.fieldLabel}>Street</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="road-variant" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={street}
                            onChangeText={setStreet}
                            placeholder='Enter Street'
                        />
                    </View>

                    <Text style={styles.fieldLabel}>PIN Code</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="numeric" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={pincode}
                            onChangeText={setPincode}
                            placeholder='Enter PIN Code'
                            keyboardType="numeric"
                            maxLength={6}
                        />
                    </View>

                    <Text style={styles.fieldLabel}>Region</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="map" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.disabledInput]}
                            value={region}
                            editable={false}
                            placeholder='Region (Auto-filled from PIN)'
                        />
                    </View>

                    <Text style={styles.fieldLabel}>District</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="city" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.disabledInput]}
                            value={district}
                            editable={false}
                            placeholder='District (Auto-filled from PIN)'
                        />
                    </View>

                    <Text style={styles.fieldLabel}>State</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="map-marker" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.disabledInput]}
                            value={state}
                            editable={false}
                            placeholder='State (Auto-filled from PIN)'
                        />
                    </View>
                </Animatable.View>

                {/* Contact Section */}
                <Animatable.View animation="fadeIn" duration={800} delay={600}>
                    <View style={styles.sectionHeader}>
                        <Icon name="phone" size={24} color="#4285F4" />
                        <Text style={styles.sectionLabel}>Contact Information</Text>
                    </View>

                    <Text style={styles.fieldLabel}>Primary Phone</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="phone-classic" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.disabledInput]}
                            value={fetchSchoolDetails?.contactPersonPhone}
                            editable={false}
                            placeholder='Primary Phone Number'
                            keyboardType="phone-pad"
                        />
                    </View>

                    <Text style={styles.fieldLabel}>Secondary Phone</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="phone-plus" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={phoneTwo}
                            onChangeText={setPhoneTwo}
                            placeholder="Enter Secondary Phone"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <Text style={styles.fieldLabel}>Primary Email</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="email" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.textInput, styles.disabledInput]}
                            value={email}
                            editable={false}
                            placeholder="Primary Email"
                            keyboardType="email-address"
                        />
                    </View>

                    <Text style={styles.fieldLabel}>Alternative Email</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="email-plus" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={altEmail}
                            onChangeText={setAltEmail}
                            placeholder="Enter Alternative Email"
                            keyboardType="email-address"
                        />
                    </View>
                </Animatable.View>

                {/* Website Section */}
                <Animatable.View animation="fadeIn" duration={800} delay={800}>
                    <View style={styles.sectionHeader}>
                        <Icon name="web" size={24} color="#4285F4" />
                        <Text style={styles.sectionLabel}>Website Information</Text>
                    </View>

                    <Text style={styles.fieldLabel}>School Website</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="link" size={20} color="#757575" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="Enter School Website URL"
                            keyboardType="url"
                        />
                    </View>
                </Animatable.View>

                {/* Save Button */}
                <Animatable.View animation="fadeIn" duration={800} delay={1000} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                        <LinearGradient
                            colors={['#4285F4', '#34A853', '#FBBC05']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <Icon name="content-save" size={20} color="#FFFFFF" />
                                    <Text style={styles.buttonText}>Save Changes</Text>
                                </View>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={isSaving}
                    >
                        <View style={styles.buttonContent}>
                            <Icon name="close-circle" size={20} color="#757575" />
                            <Text style={styles.cancelText}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
            </Animated.View>
        </KeyboardAwareScrollView>
    );
};

export default EditSchoolContactInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    formContainer: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4285F4',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    successText: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginVertical: 15,
    },
    divider: {
        height: 2,
        backgroundColor: '#4285F4',
        width: '30%',
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        padding: 10,
    },
    textInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#888',
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 50,
    },
    gradientButton: {
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cancelButton: {
        marginTop: 15,
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#757575',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
});

