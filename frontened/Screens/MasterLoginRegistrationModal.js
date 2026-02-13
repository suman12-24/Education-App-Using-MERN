import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, View, Text, Animated, Easing, TouchableOpacity, ScrollView, Alert, Dimensions, StyleSheet, ActivityIndicator, Image, TextInput } from 'react-native';
import { RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { setAuth } from '../Redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TypeWriter from 'react-native-typewriter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message'

const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;

const OtpModal = ({ visible, onClose, onVerify, email, selectedRole, navigationRoute, SchoolId,
    bottomNavigationRoute, otpValidationType, handleRegistrationOtp, handleGetOtpForLogin, handleReset }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const logoScale = useRef(new Animated.Value(0.1)).current;
    const buttonScaleOtp = useRef(new Animated.Value(1)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;
    const modalTranslateY = useRef(new Animated.Value(100)).current;
    const [otp, setOtp] = useState(['', '', '', '']);
    const [maskedEmail, setMaskedEmail] = useState('');
    const inputRefs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef()]);
    const [successMessage, setSuccessMessage] = useState('');
    const [messageAnim] = useState(new Animated.ValueXY({ x: 0, y: 0 })); // Animation for success message
    const [errorAnim] = useState(new Animated.ValueXY({ x: 0, y: 0 })); // Animation for error message
    const [errorMessage, setErrorMessage] = useState('');

    // Loading state for the spinner
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const maskEmail = (email) => {
            if (email) {
                const [localPart, domain] = email.split('@');
                const lastThreeChars = localPart.slice(-3); // Get the last 3 characters
                const maskedLocalPart = localPart.length > 3
                    ? '*'.repeat(localPart.length - 3) + lastThreeChars  // Mask all except the last 3 characters
                    : '*'.repeat(localPart.length); // If the length is <= 3, mask all characters
                return `${maskedLocalPart}@${domain}`;
            }
            return '';
        };
        setMaskedEmail(maskEmail(email));
    }, [email]);


    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(modalTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 1.4,
                    duration: 2300,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(modalTranslateY, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 0.05,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleResendOTP = () => {
        if (otpValidationType === 'login') {
            handleGetOtpForLogin();
        }
        if (otpValidationType === 'registration') {
            handleRegistrationOtp();
        }
    };

    const handlePressInOtp = useCallback(() => {
        Animated.timing(buttonScaleOtp, {
            toValue: 0.9,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressOutOtp = useCallback(() => {
        Animated.timing(buttonScaleOtp, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, []);


    // Fixed OTP verification function
    const handleVerifyOtp = useCallback(async () => {
        try {
            const enteredOtp = otp.join('');

            if (enteredOtp.length !== 4) {
                setErrorMessage('Please Enter 4 digit Valid OTP');
                errorAnim.setValue({ x: width, y: 0 });
                Animated.timing(errorAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
                return;
            }

            // Consistent role endpoints
            const roleEndpoints = otpValidationType === 'login'
                ? {
                    Guardian: '/user/verify-login-otp',
                    School: '/school/verify-login-otp',
                }
                : {
                    Guardian: '/user/verify-registration-otp',
                    School: '/school/verify-registration-otp',
                };

            const endpoint = roleEndpoints[selectedRole];

            if (!endpoint) {
                setErrorMessage('Invalid role selected. Please try again.');
                errorAnim.setValue({ x: width, y: 0 });
                Animated.timing(errorAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
                return;
            }

            // Set loading state to true before making the API request
            setIsLoading(true);

            const response = await axiosConfiguration.post(endpoint, { enteredOtp, email });

            if (response?.data?.success) {
                const { token } = response.data;
                if (selectedRole === "Guardian") {
                    dispatch(setAuth({ email, token, role: selectedRole, favouriteSchools: response?.data?.userData?.favouriteSchools ?? [] }));
                } else if (selectedRole === "School") {
                    dispatch(setAuth({ email, token, role: selectedRole }));
                }

                handleReset();
                setOtp(['', '', '', '']);
                setSuccessMessage(response?.data?.message || 'OTP Verified Successfully');
                messageAnim.setValue({ x: width, y: 0 });
                Animated.timing(messageAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 100,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setSuccessMessage('');
                }, 500);

                setTimeout(() => {
                    // Navigate to the next screen
                    navigationRoute && navigation.navigate(navigationRoute, { SchoolId });
                    bottomNavigationRoute && navigation.navigate(bottomNavigationRoute, { SchoolId });
                    onClose();
                }, 1000);
            } else {
                setErrorMessage(response?.data?.message || 'Invalid OTP. Please try again.');
                errorAnim.setValue({ x: width, y: 0 });
                Animated.timing(errorAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || 'An Error occurred while Verifying OTP');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        } finally {
            // Set loading state to false after the request is completed
            setIsLoading(false);
        }
    }, [otp, selectedRole, email, dispatch, navigation, onClose, navigationRoute]);

    const handleOtpChange = useCallback((text, index) => {
        if (/^\d{0,1}$/.test(text)) {
            setOtp((prevOtp) => {
                const newOtp = [...prevOtp];
                newOtp[index] = text;
                return newOtp;
            });
            if (text && index < 3) {
                inputRefs.current[index + 1].current.focus();
            }
        }
    }, []);

    const handleOtpBackspace = useCallback((index) => {
        setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = '';
            return newOtp;
        });
        if (index > 0) {
            inputRefs.current[index - 1].current.focus();
        }
    }, []);

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', opacity: modalOpacity }}>
                {successMessage && (
                    <Animated.View style={[styles.successMessage, { transform: [{ translateX: messageAnim.x }] }]}>
                        <Text style={styles.successText}>{successMessage}</Text>
                    </Animated.View>
                )}
                {errorMessage && (
                    <Animated.View style={[styles.errorMessage, { transform: [{ translateX: errorAnim.x }] }]}>
                        <MaterialIcons name="error-outline" size={24} color="#fff" />
                        <Text style={styles.errorText1}>{errorMessage}</Text>
                    </Animated.View>
                )}
                <Animated.View
                    style={{
                        transform: [{ translateY: modalTranslateY }],
                        width: '90%',
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        padding: 25,
                        alignItems: 'center',
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                    }}
                >
                    <Animated.Image
                        source={require('../assets/Images/splash/applogo.png')}
                        style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 20, transform: [{ scale: logoScale }] }}
                    />
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#444' }}>Enter OTP</Text>
                    <Text style={{ fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' }}>
                        OTP has been sent to your email ending with <Text style={{ fontWeight: 'bold', color: '#00cca3' }}>{maskedEmail}</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '85%', marginBottom: 20 }}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs.current[index]}
                                value={digit}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && otp[index] === '') {
                                        handleOtpBackspace(index);
                                    }
                                }}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={{ width: 50, height: 50, textAlign: 'center', borderWidth: 1, borderColor: '#00cca3', borderRadius: 12, fontSize: 24, color: '#333', backgroundColor: '#f4f4f4', marginHorizontal: 8 }}
                            />
                        ))}
                    </View>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#4a56e2" style={{ marginVertical: 20 }} />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 25 }}>
                            <TouchableOpacity onPress={() => handleReset()}>
                                <Text style={{ color: '#006699', fontWeight: '600', fontSize: 14 }}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleResendOTP} style={{ marginLeft: 20 }}>
                                <Text style={{ color: '#ff4444', fontWeight: '600', fontSize: 14 }}>Resend OTP?</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <Animated.View style={{ transform: [{ scale: buttonScaleOtp }], width: '100%' }}>
                        <Button
                            mode="contained"
                            onPress={handleVerifyOtp}
                            onPressIn={handlePressInOtp}
                            onPressOut={handlePressOutOtp}
                            buttonColor="#4a56e2"
                            textColor="#fff"
                            style={{ paddingVertical: 8, borderRadius: 30, width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                        >
                            Verify OTP
                        </Button>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const MasterLoginRegistrationModal = ({ visible, onClose, title, navigationRoute, bottomNavigationRoute, SchoolId }) => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pin, setPin] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [selectedRole, setSelectedRole] = useState('Guardian');
    const logoScale = useRef(new Animated.Value(0.1)).current;
    const buttonScaleOtp = new Animated.Value(1); // Scale for "Get OTP" button
    const buttonScaleClose = new Animated.Value(1); // Scale for "Close" button
    const [otpValidationType, setOtpValidationType] = useState();
    const [isRegistrationFormShow, setIsRegistrationFormShow] = useState(false);
    const [loading, setLoading] = useState(false);  // State to manage loading
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

    const [messageAnim] = useState(new Animated.ValueXY({ x: width, y: 0 })); // Animation for success message
    const [warningAnim] = useState(new Animated.ValueXY({ x: width, y: 0 }));
    const [errorAnim] = useState(new Animated.ValueXY({ x: width, y: 0 })); // Start off-screen to the right
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const { token } = useSelector((state) => state.auth);

    const [errors, setErrors] = useState({

        name: '',
        email: '',
        mobileNumber: '',
        pin: '',

    });

    const validateInput = useCallback(() => {
        let isValid = true;
        const newErrors = {};

        // Validate name
        if (!name.trim()) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        // Validate email
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Valid email is required.';
            isValid = false;
        }

        // Validate phone
        if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Valid phone number is required.';
            isValid = false;
        }

        // Validate pin code
        if (!pin.trim() || pin.length !== 6) {
            newErrors.pin = 'Valid 6-digit pin code is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [name, email, mobileNumber, pin]);

    // Animate logo size when modal opens
    useEffect(() => {
        if (visible) {
            Animated.timing(logoScale, {
                toValue: 1.4, // Full size
                duration: 2300,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        } else {
            logoScale.setValue(0); // Reset to initial size when modal is closed
        }
    }, [visible]);

    const handlePressInOtp = () => {
        Animated.timing(buttonScaleOtp, {
            toValue: 0.9,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOutOtp = () => {
        Animated.timing(buttonScaleOtp, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const handlePressInClose = () => {
        Animated.timing(buttonScaleClose, {
            toValue: 0.9,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOutClose = () => {
        Animated.timing(buttonScaleClose, {
            toValue: 1,
            duration: 200,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    // Fixed roleEndpoints in handleGetOtpForLogin
    const handleGetOtpForLogin = async () => {
        const role = selectedRole;
        if (!role || role.trim() === "") {
            setErrorMessage('Please select a valid role.');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }
        if (!email || email.trim() === "") {
            setErrorMessage('Please enter a valid email');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }

        // Fixed role endpoints to match the role selection options (Guardian/School)
        const roleEndpoints = {
            Guardian: '/user/send-login-otp',  // Using '/user/' endpoint for Guardian role
            School: '/school/send-login-otp',
        };

        const endpoint = roleEndpoints[role];
        const payLoad = { email: email, role: role };

        if (!endpoint) {
            setErrorMessage('Invalid role selected. Please try again.');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }

        setLoading(true); // Start loading

        try {
            const response = await axiosConfiguration.post(endpoint, payLoad);
            if (response?.data?.success) {
                console.log(response?.data?.Otp);
                setSuccessMessage(response?.data?.message || 'OTP Sent Successfully');

                messageAnim.setValue({ x: width, y: 0 });

                Animated.timing(messageAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setSuccessMessage('');
                    setIsRegistrationFormShow(false);
                    setIsOtpModalVisible(true);
                    setOtpValidationType('login');
                    onClose();
                }, 500);
            } else {
                setWarningMessage(response?.data?.message || 'Login Error! Redirecting to Registration Page');

                warningAnim.setValue({ x: width, y: 0 });

                Animated.timing(warningAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setWarningMessage('');
                    setIsRegistrationFormShow(true);
                    setOtpValidationType('registration');
                }, 500);
            }
        } catch (error) {
            setErrorMessage(error?.response?.data?.message || 'An Error occurred while sending OTP');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        } finally {
            setLoading(false); // Stop loading, regardless of success or failure
        }
    };

    const handleNameChange = (text) => {
        setName(text);
        if (!text.trim()) {
            setErrors((prev) => ({ ...prev, name: 'Valid name is required.' }));
        } else {
            setErrors((prev) => ({ ...prev, name: '' }));
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text);
        if (!text.trim()) {
            setErrors((prev) => ({ ...prev, email: 'Valid email is required.' }));
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }
    };

    const handlePhoneChange = (text) => {
        setMobileNumber(text);
        if (!text.trim()) {
            setErrors((prev) => ({ ...prev, mobileNumber: 'Valid phone number is required.' }));
        } else {
            setErrors((prev) => ({ ...prev, mobileNumber: '' })); // Clear error when user starts typing
        }
    };

    const handlePinCodeChange = (text) => {
        setPin(text);
        if (!text.trim()) {
            setErrors((prev) => ({ ...prev, pin: 'Valid 6-digit pin code is required.' }));
        } else {
            setErrors((prev) => ({ ...prev, pin: '' }));
        }
    };

    // Fetch address by pin code
    const fetchAddressByPinCode = useCallback(async (pin) => {
        setLoading(true); // Set loading to true when API call starts
        try {
            const response = await axiosConfiguration.post('/user/address-by-pin', { pincode: pin });
            if (response?.data?.success) {
                const data = response.data.filteredAddresses;
                if (data && data.length > 0) {
                    const address = data[0]; // Use the first object in the array
                    setRegion(address.RegionName || 'Unknown Region');
                    setDistrict(address.District || 'Unknown District');
                    setState(address.StateName || 'Unknown State');
                } else {
                    console.error('No address data found for the provided pin code.');
                }
            } else {
                console.error('Failed to fetch address details:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        } finally {
            setLoading(false); // Set loading to false once the API call finishes
        }
    }, []);

    useEffect(() => {
        if (pin.length === 6) {
            fetchAddressByPinCode(pin);
        } else {
            // If pin code is cleared, reset address fields
            setRegion('');
            setDistrict('');
            setState('');
        }
    }, [pin, fetchAddressByPinCode]);


    // Fixed role endpoints in handleRegistrationOtp
    const handleRegistrationOtp = async () => {
        const role = selectedRole;
        if (!role || role.trim() === "") {
            setErrorMessage('Role is required.');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }

        const isValid = validateInput(); // Validate input fields
        if (!isValid) {
            setErrorMessage('Please fill in all required fields.');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            return;
        }

        setLoading(true); // Show loader during API request

        const payload = {
            role: role,
            email: email.trim(),
            phone: mobileNumber.trim(),
            userName: name.trim(),
            location: {
                RegionName: region || 'Unknown Region',
                Pincode: pin.trim(),
                District: district || 'Unknown District',
                StateName: state || 'Unknown State',
            },
        };

        // Fixed role endpoints to be consistent with role selection options
        const roleEndpoints = {
            Guardian: '/user/send-registration-otp',  // Using '/user/' endpoint for Guardian role
            School: '/school/send-registration-otp',
        };

        const endpoint = roleEndpoints[role];

        if (!endpoint) {
            setErrorMessage('Invalid role selected. Please try again.');
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            setLoading(false);
            return;
        }

        try {
            const response = await axiosConfiguration.post(
                endpoint,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200 && response.data.success) {
                console.log('Registration OTP sent successfully.', response?.data?.Otp);
                setSuccessMessage(response?.data?.message || 'OTP Sent Successfully');

                messageAnim.setValue({ x: width, y: 0 });
                Animated.timing(messageAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setSuccessMessage('');
                    setIsRegistrationFormShow(false);
                    setIsOtpModalVisible(true); // Open OTP modal
                    onClose();
                }, 1500);
            } else {
                setErrorMessage(response?.data?.message || 'Error occurred while sending OTP');
                errorAnim.setValue({ x: width, y: 0 });
                Animated.timing(errorAnim, {
                    toValue: { x: 0, y: 0 },
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        } catch (error) {
            console.error('API call error:', error);
            let errorMsg = 'An unexpected error occurred. Please try again.';

            if (error.response) {
                errorMsg = error.response.data.message || error.response.data.error || 'Server returned an error. Please try again.';
            } else if (error.request) {
                errorMsg = 'Unable to connect to the server. Please check your connection and try again.';
            }

            setErrorMessage(errorMsg);
            errorAnim.setValue({ x: width, y: 0 });
            Animated.timing(errorAnim, {
                toValue: { x: 0, y: 0 },
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const handleReset = () => {
        setName('');
        setEmail('');
        setMobileNumber('');
        setPin('');
        setRegion('');
        setDistrict('');
        setState('');
        setSelectedRole('Guardian');
        setIsOtpModalVisible(false);
    }

    return (
        <>
            <Modal
                transparent={true}
                visible={visible}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                >
                    {successMessage && (
                        <Animated.View style={[styles.successMessage, { transform: [{ translateX: messageAnim.x }] }]}>
                            <Text style={styles.successText}>{successMessage}</Text>
                        </Animated.View>
                    )}

                    {errorMessage && (
                        <Animated.View style={[styles.errorMessage, { transform: [{ translateX: errorAnim.x }] }]}>
                            <MaterialIcons name="error-outline" size={24} color="#fff" />
                            <Text style={styles.errorText1}>{errorMessage}</Text>
                        </Animated.View>
                    )}
                    {warningMessage && (
                        <Animated.View style={[styles.warningMessage, { transform: [{ translateX: warningAnim.x }] }]}>
                            <MaterialIcons name="warning" size={24} color="#fff" />
                            <Text style={styles.warningText}>{warningMessage}</Text>
                        </Animated.View>
                    )}
                    <Toast ref={(ref) => Toast.setRef(ref)} />

                    <View
                        style={{
                            width: '90%',
                            height: '65%',
                            backgroundColor: 'white',
                            borderRadius: 15,
                            padding: 30,
                            alignItems: 'center',
                            elevation: 10,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                        }}
                    >
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                alignItems: 'center',
                            }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Animated Logo */}
                            <Animated.Image
                                source={require('../assets/Images/splash/applogo.png')}
                                style={{
                                    width: 150,
                                    height: 150,
                                    marginBottom: 20,
                                    transform: [{ scale: logoScale }],
                                }}
                            />

                            <TypeWriter
                                style={{
                                    fontSize: 26,
                                    fontWeight: 'bold',
                                    color: '#2C3E50',
                                    marginBottom: 25,
                                }}
                                typing={1} // Controls the typewriting effect (1 for forward, 0 for pause, -1 for reverse)
                            >
                                Guidance
                            </TypeWriter>

                            {isRegistrationFormShow ? (
                                <ScrollView>


                                    <View style={styles.inputWrapper}>
                                        <Icon name="account" size={scale(24)} color='#737373' style={styles.icon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter name"
                                            value={name}
                                            onChangeText={handleNameChange} // Updated to handle input change
                                        />
                                    </View>
                                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


                                    <View style={styles.inputWrapper}>
                                        <Icon name="email" size={scale(25)} color='#737373' style={{ marginLeft: scale(12), }} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter email"
                                            keyboardType="email-address"
                                            value={email}
                                            onChangeText={handleEmailChange} // Updated to handle input change
                                        />
                                    </View>
                                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                                    <View style={styles.inputWrapper}>
                                        <Icon name="phone" size={scale(24)} color='#737373' style={styles.icon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter phone number"
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            value={mobileNumber}
                                            onChangeText={handlePhoneChange} // Updated to handle input change
                                        />
                                    </View>
                                    {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}


                                    <View style={styles.inputWrapper}>
                                        <Icon name="map-marker" size={scale(24)} color='#737373' style={styles.icon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter pin code"
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={pin}
                                            onChangeText={handlePinCodeChange} // Updated to handle input change
                                        />
                                    </View>
                                    {errors.pin && (
                                        <Text style={styles.errorText}>{errors.pin}</Text>
                                    )}

                                    {loading && (
                                        <ActivityIndicator
                                            size="large"
                                            color="#4a56e2"
                                            style={styles.loader}
                                        />
                                    )}

                                    {/* Address Display */}
                                    {region || district || state ? (
                                        <View style={styles.addressContainer}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.addressText}>Region:</Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale(15),
                                                        marginTop: 2,
                                                        color: '#000',
                                                        marginLeft: 5,
                                                    }}
                                                >
                                                    {region}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.addressText}>District:</Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale(14),
                                                        marginTop: 2,
                                                        color: '#000',
                                                        marginLeft: 5,
                                                    }}
                                                >
                                                    {district}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.addressText}>State:</Text>
                                                <Text
                                                    style={{
                                                        fontSize: scale(14),
                                                        marginTop: 2,
                                                        color: '#000',
                                                        marginLeft: 5,
                                                    }}
                                                >
                                                    {state}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : pin.length === 6 ? (
                                        <Text style={styles.errorText}>No address data found.</Text>
                                    ) : null}

                                    <RadioButton.Group
                                        onValueChange={(value) => setSelectedRole(value)}
                                        value={selectedRole}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                marginBottom: 20,
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton value="Guardian" color="#4a56e2" uncheckedColor='#8c8c8c' />
                                                <Text style={{ fontSize: 16, marginLeft: 5 }}>Guardian</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton value="School" color="#4a56e2" uncheckedColor='#8c8c8c' />
                                                <Text style={{ fontSize: 16, marginLeft: 5 }}>School</Text>
                                            </View>
                                        </View>
                                    </RadioButton.Group>

                                    <Animated.View
                                        style={{
                                            transform: [{ scale: buttonScaleOtp }],
                                            width: '100%',
                                            marginBottom: 20,
                                        }}
                                    >
                                        <Button
                                            mode="contained"
                                            onPress={handleRegistrationOtp}
                                            onPressIn={handlePressInOtp}
                                            onPressOut={handlePressOutOtp}
                                            buttonColor="#4a56e2"
                                            textColor="#fff"
                                            style={{
                                                paddingVertical: 5,
                                                borderRadius: 12,
                                                marginTop: 5,
                                            }}
                                            labelStyle={{
                                                fontSize: 17, // Adjust this value as needed for larger text
                                                fontWeight: '700',
                                            }}
                                        >
                                            Get OTP
                                        </Button>
                                    </Animated.View>
                                </ScrollView>
                            ) : (
                                <>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderWidth: 0.3,
                                            borderColor: '#737373',
                                            borderRadius: scale(8),
                                            marginBottom: scale(16),
                                            backgroundColor: '#f2f2f2',
                                        }}
                                    >
                                        <Icon name="email" size={scale(25)} color='#737373' style={{ marginLeft: scale(12), }} />
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                fontSize: 16,
                                                height: scale(50),
                                                paddingHorizontal: scale(12),
                                            }}
                                            placeholder="Enter Email"
                                            placeholderTextColor="#808080"
                                            keyboardType="email-address"
                                            value={email}
                                            onChangeText={handleEmailChange} // Updated to handle input change
                                        />
                                    </View>
                                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                                    <RadioButton.Group
                                        onValueChange={(value) => setSelectedRole(value)}
                                        value={selectedRole}>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                marginBottom: 20,
                                            }}>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton value="Guardian" color="#4a56e2" uncheckedColor='#8c8c8c' />
                                                <Text style={{ fontSize: 16, marginLeft: 5 }}>Guardian</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton value="School" color="#4a56e2" uncheckedColor='#8c8c8c' />
                                                <Text style={{ fontSize: 16, marginLeft: 5 }}>School</Text>
                                            </View>
                                        </View>
                                    </RadioButton.Group>

                                    <Animated.View
                                        style={{
                                            transform: [{ scale: buttonScaleOtp }],
                                            width: '100%',
                                            marginBottom: 20,
                                        }}
                                    >
                                        <Button
                                            mode="contained"
                                            onPress={handleGetOtpForLogin}
                                            onPressIn={handlePressInOtp}
                                            onPressOut={handlePressOutOtp}
                                            buttonColor="#4a56e2"
                                            textColor="#fff"
                                            style={{
                                                paddingVertical: 5,
                                                borderRadius: 12,
                                                marginTop: 5,
                                            }}
                                            labelStyle={{
                                                fontSize: 17, // Adjust this value as needed for larger text
                                                fontWeight: '700',
                                            }}
                                            disabled={loading} // Disable button when loading
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                'Get OTP'
                                            )}
                                        </Button>
                                    </Animated.View>

                                </>
                            )}

                            {/* Close Button */}
                            <Animated.View
                                style={{
                                    transform: [{ scale: buttonScaleClose }],
                                    width: '100%',
                                }}
                            >
                                <Button
                                    mode="contained"
                                    onPress={() => {
                                        onClose();
                                        if (navigationRoute && token) {
                                            navigation.navigate(navigationRoute);
                                        }
                                        else {
                                            navigation.navigate('BottomTabNavigator', {
                                                screen: 'HomeStackNavigator',
                                                params: {
                                                    screen: 'HomeScreenOfGuardian',
                                                },
                                            });

                                        }
                                    }}
                                    onPressIn={handlePressInClose}
                                    onPressOut={handlePressOutClose}
                                    buttonColor="#f2f2f2"
                                    textColor="red"
                                    style={{
                                        paddingVertical: 5,
                                        borderRadius: 12,
                                    }}
                                    labelStyle={{
                                        fontSize: 17, // Adjust this value as needed for larger text
                                        fontWeight: '700',
                                    }}
                                >
                                    Close
                                </Button>
                            </Animated.View>

                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <OtpModal
                visible={isOtpModalVisible}
                onClose={() => setIsOtpModalVisible(false)}
                onVerify={() => {
                    Alert.alert('OTP verified successfully!');
                }}
                email={email}
                selectedRole={selectedRole}
                navigationRoute={navigationRoute}
                bottomNavigationRoute={bottomNavigationRoute}
                otpValidationType={otpValidationType}
                handleRegistrationOtp={handleRegistrationOtp}
                handleGetOtpForLogin={handleGetOtpForLogin}
                handleReset={handleReset}
                SchoolId={SchoolId}
            />
        </>
    );
};

export default MasterLoginRegistrationModal;

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.3,
        borderColor: '#737373',
        borderRadius: scale(8),
        marginBottom: scale(16),
        backgroundColor: '#f2f2f2',
    },
    icon: {
        marginLeft: scale(12),
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: scale(50),
        paddingHorizontal: scale(12),
    },
    loader: {
        marginTop: scale(5),
    },
    addressContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: scale(8),
        padding: scale(10),
        marginTop: scale(5),
        marginBottom: scale(5),
    },
    addressText: {
        fontSize: 17,
        color: '#404040',
        fontWeight: '600',
    },
    errorText: {
        fontSize: scale(14),
        color: '#FF0000',
        marginTop: -scale(10),
        marginBottom: scale(15),
    },
    successMessage: {
        position: 'absolute',
        top: scale(20),
        left: scale(20),
        backgroundColor: '#28A745',
        paddingVertical: scale(10),
        paddingHorizontal: scale(20),
        borderRadius: scale(8),
        elevation: 6,
    },
    successText: {
        color: '#FFFFFF',
        fontSize: scale(14),
        fontWeight: '500',
    },
    errorMessage: {
        flexDirection: 'row',
        position: 'absolute',
        top: scale(5),
        left: scale(10),
        backgroundColor: '#ff3333',
        paddingVertical: scale(8),
        paddingHorizontal: scale(20),
        borderRadius: scale(8),
        elevation: 2,
    },
    errorText1:
    {
        marginLeft: scale(10),
        fontSize: scale(13),
        color: '#FFF',
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: '500'
    },
    warningMessage: {
        flexDirection: 'row',
        position: 'absolute',
        top: scale(5),
        left: scale(10),
        backgroundColor: '#E4A11B',
        paddingVertical: scale(8),
        paddingHorizontal: scale(20),
        borderRadius: scale(8),
        elevation: 2,
    },
    warningText: {
        marginLeft: scale(10),
        fontSize: scale(13),
        color: '#FFF',
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: '500'

    }
});

