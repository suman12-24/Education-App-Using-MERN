import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const FatherDetails = forwardRef((props, ref) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surName, setSurName] = useState('');
    const [fathersEmail, setFathersEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [occupation, setOccupation] = useState('');
    const [organization, setOrganization] = useState('');
    const [designation, setDesignation] = useState('');
    const [errors, setErrors] = useState({});
    const { email, token } = useSelector((state) => state.auth);
    const [enquiryFormId, setEnquiryFormId] = useState();
    const occupationOptions = [
        'Service',
        'PSU Employee',
        'Business',
        'Self Employed',
        'Govt. Employee',
        'Unemployed',
    ];

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'firstName':
                newErrors.firstName = value.trim() ? null : 'First Name is required.';
                break;
            case 'middleName':
                newErrors.middleName = value.trim() ? null : 'Middle Name is required.';
                break;
            case 'lastName':
                newErrors.lastName = value.trim() ? null : 'Last Name is required.';
                break;
            case 'fathersEmail':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                newErrors.fathersEmail = value.trim()
                    ? emailRegex.test(value)
                        ? null
                        : 'Invalid email format.'
                    : 'Email is required.';
                break;
            case 'mobileNumber':
                const mobileRegex = /^[0-9]{10}$/;
                newErrors.mobileNumber = value.trim()
                    ? mobileRegex.test(value)
                        ? null
                        : 'Enter a valid 10-digit number.'
                    : 'Mobile Number is required.';
                break;
            case 'organization':
                newErrors.organization = value.trim() ? null : 'Organization is required.';
                break;
            case 'designation':
                newErrors.designation = value.trim() ? null : 'Designation is required.';
                break;
        }

        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
        if (!middleName.trim()) newErrors.middleName = 'Middle Name is required.';
        if (!surName.trim()) newErrors.surName = 'Last Name is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fathersEmail.trim()) newErrors.email = 'Email is required.';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format.';
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobile.trim()) newErrors.mobile = 'Mobile Number is required.';
        else if (!mobileRegex.test(mobile)) newErrors.mobile = 'Enter a valid 10-digit number.';
        if (!occupation) newErrors.occupation = 'Please select an occupation.';
        if (!organization.trim()) newErrors.organization = 'Organization is required.';
        if (!designation.trim()) newErrors.designation = 'Designation is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async () => {
        if (validateAllFields()) {
            // Alert.alert('Success', 'Form submitted successfully!');
            // Add submission logic here

            try {
                const payload = {
                    guardianLoginEmail: email,
                    school_id: "SCH12345",
                    fatherDetails: {
                        firstName, middleName, surName, email: fathersEmail, mobile, occupation, organization, designation
                    },

                };


                const response = await axiosConfiguration.put(`/user/update-enquiry/${enquiryFormId}`, payload);


                return response?.data?.success || false;  // Ensure a boolean response
            } catch (error) {
                console.error("Error submitting enquiry form:", error);
                return false;
            }
        } else {
            Alert.alert('Error', 'Please fix the errors before submitting.');
        }
    };

    // useEffect(() => {
    //     const fetchEnquiryFormIds = async (email, school_id) => {
    //         try {
    //             const response = await axiosConfiguration.get('user/enquiry-form-ids', {
    //                 params: {
    //                     email: email,
    //                     school_id: school_id
    //                 }
    //             });

    //             console.log("Enquiry Form IDs:", response.data.enquiryFormIds);
    //             if (response.data.enquiryFormIds && response.data.enquiryFormIds.length > 0) {
    //                 setEnquiryFormId(response.data.enquiryFormIds[0]);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching enquiry form IDs:", error.response?.data || error.message);
    //         }
    //     };

    //     // Call the function with email and school_id
    //     fetchEnquiryFormIds(email, 'SCH12345');
    // }, [])

    useEffect(() => {
        const getEnquiryDetailsIfAlreadyRegistered = async (email, school_id) => {
            try {
                const responseOne = await axiosConfiguration.post('user/enquiry-details-for-this-school', {
                    guardianLoginEmail: email,
                    school_id: school_id
                });
                setEnquiryFormId(responseOne?.data?.enquiryDetails?._id);

                const responseTwo = await axiosConfiguration.get('user/default-enquiry-details', {
                    params: {
                        guardianLoginEmail: email,
                    }
                });

                setFirstName(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.firstName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.firstName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.firstName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.firstName;
                    }
                    return "";
                })
                setMiddleName(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.middleName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.middleName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.middleName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.middleName;
                    }
                    return "";
                })
                setSurName(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.surName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.surName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.surName) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.surName;
                    }
                    return "";
                })

                setFathersEmail(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.email) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.email;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.email) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.email;
                    }
                    return "";
                });
                setMobile(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.mobile) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.mobile;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.mobile) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.mobile;
                    }
                    return "";
                });
                setOccupation(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.occupation) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.occupation;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.occupation) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.occupation;
                    }
                    return "";
                });
                setOrganization(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.organization) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.organization;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.organization) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.organization;
                    }
                    return "";
                });
                setDesignation(() => {
                    if (responseOne?.data?.enquiryDetails?.fatherDetails?.designation) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.designation;
                    }
                    if (responseTwo?.data?.enquiryDetails?.fatherDetails?.designation) {
                        return responseOne?.data?.enquiryDetails?.fatherDetails?.designation;
                    }
                    return "";
                });

            } catch (error) {
                console.error("Error fetching enquiry form IDs:", error.response?.data || error.message);
            }
        }
        getEnquiryDetailsIfAlreadyRegistered(email, 'SCH12345')
    }, [])

    useImperativeHandle(ref, () => ({
        validate: validateAllFields,
        handleSubmitFatherUpdate: handleSubmit
    }));

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Personal Information</Text>
                <View style={styles.row}>
                    <TextInput
                        outlineStyle={{ borderWidth: 0.7 }}
                        label="First Name"
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateField('firstName', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.firstName ? styles.errorInput : null]}
                        error={!!errors.firstName}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                    <TextInput
                        outlineStyle={{ borderWidth: 0.7 }}
                        label="Middle Name"
                        value={middleName}
                        onChangeText={(text) => {
                            setMiddleName(text);
                            validateField('middleName', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.middleName ? styles.errorInput : null]}
                        error={!!errors.middleName}
                    />
                    {errors.middleName && <Text style={styles.errorText}>{errors.middleName}</Text>}
                </View>
                <TextInput
                    outlineStyle={{ borderWidth: 0.7 }}
                    label="Sur Name"
                    value={surName}
                    onChangeText={(text) => {
                        setSurName(text);
                        validateField('lastName', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.lastName ? styles.errorInput : null]}
                    error={!!errors.lastName}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                <TextInput
                    outlineStyle={{ borderWidth: 0.7 }}
                    label="Email ID"
                    value={fathersEmail}
                    onChangeText={(text) => {
                        setFathersEmail(text);
                        validateField('fathersEmail', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.email ? styles.errorInput : null]}
                    error={!!errors.email}
                    keyboardType="email-address"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                <TextInput
                    outlineStyle={{ borderWidth: 0.7 }}
                    label="Mobile Number"
                    value={mobile}
                    onChangeText={(text) => {
                        setMobile(text);
                        validateField('mobile', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.mobile ? styles.errorInput : null]}
                    error={!!errors.mobile}
                    keyboardType="phone-pad"
                />
                {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Occupation</Text>
                <View style={styles.radioGroup}>
                    {occupationOptions.map((option) => (
                        <View key={option} style={styles.radioItem}>
                            <RadioButton

                                value={option}
                                status={occupation === option ? 'checked' : 'unchecked'}
                                onPress={() => setOccupation(option)}
                                color="#6b52ae"
                            />
                            <Text style={styles.radioText}>{option}</Text>
                        </View>
                    ))}
                </View>
                {errors.occupation && <Text style={styles.errorText}>{errors.occupation}</Text>}
                <TextInput
                    outlineStyle={{ borderWidth: 0.7 }}
                    label="Organization"
                    value={organization}
                    onChangeText={(text) => {
                        setOrganization(text);
                        validateField('organization', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.organization ? styles.errorInput : null]}
                    error={!!errors.organization}
                />
                {errors.organization && <Text style={styles.errorText}>{errors.organization}</Text>}
                <TextInput
                    outlineStyle={{ borderWidth: 0.7 }}
                    label="Designation"
                    value={designation}
                    onChangeText={(text) => {
                        setDesignation(text);
                        validateField('designation', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.designation ? styles.errorInput : null]}
                    error={!!errors.designation}
                />
                {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}
            </View>
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f8fa',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: width * 0.04,
        marginHorizontal: width * 0.01,
        marginBottom: height * 0.03,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    sectionHeader: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#6b52ae',
        marginBottom: height * 0.02,
    },
    input: {
        height: 50,
        marginBottom: height * 0.02,
        backgroundColor: '#f9f9f9',
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: width * 0.035,
        marginBottom: height * 0.02,
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: height * 0.02,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.05,
        marginBottom: height * 0.01,
    },
    radioText: {
        fontSize: width * 0.04,
        color: '#333',
    },

});

export default FatherDetails;
