import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');

const CandidateDetails = forwardRef((props, ref) => {

    const { email, token } = useSelector((state) => state.auth);

    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surName, setSurName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [nationality, setNationality] = useState('');
    const [stateOfDomicile, setStateOfDomicile] = useState('');
    const [gender, setGender] = useState('male');
    // Academic section
    const [session, setSession] = useState('');
    const [classAppliedFor, setClassAppliedFor] = useState('');
    const [currentClass, setCurrentClass] = useState('');
    const [previousSchoolName, setPreviousSchoolName] = useState('');
    const [previousSchoolCity, setPreviousSchoolCity] = useState('');
    const [previousPercentage, setPreviousPercentage] = useState('');
    const [previousBoard, setPreviousBoard] = useState('');
    const [previousStream, setPreviousStream] = useState('');
    const [reasonForLeaving, setReasonForLeaving] = useState('');
    // Address section
    const [firstLine, setFirstLine] = useState('');
    const [postOffice, setPostOffice] = useState('');
    const [policeStation, setPoliceStation] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pin, setPin] = useState('');

    const [errors, setErrors] = useState({});
    const [enquiryDetailsId, setEnquiryDetailsId] = useState();

    const nationalities = [{ label: 'Indian', value: 'indian' }, { label: 'Other', value: 'other' }];
    const states = [
        { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
        { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
        { label: 'Assam', value: 'Assam' },
        { label: 'Bihar', value: 'Bihar' },
        { label: 'Chhattisgarh', value: 'Chhattisgarh' },
        { label: 'Goa', value: 'Goa' },
        { label: 'Gujarat', value: 'Gujarat' },
        { label: 'Haryana', value: 'Haryana' },
        { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
        { label: 'Jharkhand', value: 'Jharkhand' },
        { label: 'Karnataka', value: 'Karnataka' },
        { label: 'Kerala', value: 'Kerala' },
        { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Manipur', value: 'Manipur' },
        { label: 'Meghalaya', value: 'Meghalaya' },
        { label: 'Mizoram', value: 'Mizoram' },
        { label: 'Nagaland', value: 'Nagaland' },
        { label: 'Odisha', value: 'Odisha' },
        { label: 'Punjab', value: 'Punjab' },
        { label: 'Rajasthan', value: 'Rajasthan' },
        { label: 'Sikkim', value: 'Sikkim' },
        { label: 'Tamil Nadu', value: 'Tamil Nadu' },
        { label: 'Telangana', value: 'Telangana' },
        { label: 'Tripura', value: 'Tripura' },
        { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
        { label: 'Uttarakhand', value: 'Uttarakhand' },
        { label: 'West Bengal', value: 'West Bengal' },
        { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands' },
        { label: 'Chandigarh', value: 'Chandigarh' },
        { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu' },
        { label: 'Lakshadweep', value: 'Lakshadweep' },
        { label: 'Delhi', value: 'Delhi' },
        { label: 'Puducherry', value: 'Puducherry' },
        { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir' },
        { label: 'Ladakh', value: 'Ladakh' }
    ];
    const sessions = [{ label: '2023-2024', value: '2023-2024' }, { label: '2024-2025', value: '2024-2025' }];
    const classes = [
        { label: 'Class 1', value: 'class1' },
        { label: 'Class 2', value: 'class2' },
        { label: 'Class 3', value: 'class3' },
        { label: 'Class 4', value: 'class4' },
        { label: 'Class 5', value: 'class5' },
        { label: 'Class 6', value: 'class6' },
        { label: 'Class 7', value: 'class7' },
        { label: 'Class 8', value: 'class8' },
        { label: 'Class 9', value: 'class9' },
        { label: 'Class 10', value: 'class10' },
        { label: 'Class 11', value: 'class11' },
        { label: 'Class 12', value: 'class12' }
    ];

    const onDateChange = (event, selectedDate) => {

        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };
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
            case 'placeOfBirth':
                newErrors.placeOfBirth = value.trim() ? null : 'Place of Birth is required.';
                break;
            case 'address':
                newErrors.address = value.trim() ? null : 'Address is required.';
                break;
            case 'pp':
                newErrors.pp = value.trim() ? null : 'P.O. is required.';
                break;
            case 'ps':
                newErrors.ps = value.trim() ? null : 'P.S. is required.';
                break;
            case 'pin':
                newErrors.pin = value.trim() && /^\d{6}$/.test(value) ? null : '6 digit PIN code is required.';
                break;
            case 'city':
                newErrors.city = value.trim() ? null : 'City is required.';
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateAllFields = () => {
        const newErrors = {};

        if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
        if (!middleName.trim()) newErrors.middleName = 'Middle Name is required.';
        if (!surName.trim()) newErrors.surName = 'Last Name is required.';
        if (!placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of Birth is required.';
        if (!firstLine.trim()) newErrors.firstLine = 'Address is required.';
        if (!postOffice.trim()) newErrors.postOffice = 'P.O. is required.';
        if (!policeStation.trim()) newErrors.policeStation = 'P.S. is required.';
        if (!pin.trim() || !/^\d{6}$/.test(pin)) newErrors.pin = 'Valid PIN code is required.';
        if (!city.trim()) newErrors.city = 'City is required.';
        if (!nationality) newErrors.nationality = 'Nationality is required.';
        if (!stateOfDomicile) newErrors.stateOfDomicile = 'State of Domicile is required.';
        if (!gender) newErrors.gender = 'Gender is required.';
        if (!session) newErrors.session = 'Session is required.';
        if (!classAppliedFor) newErrors.classAppliedFor = 'Class Applied For is required.';
        if (!currentClass) newErrors.currentClass = 'Current Class is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEnquiryFormSubmit = async () => {
        try {
            const academicDetails = {
                previousSchoolName, previousSchoolCity, previousPercentage, previousBoard, previousStream, reasonForLeaving
            };
            const payload = {
                guardianLoginEmail: email,
                school_id: "SCH12345",
                candidateDetails: {
                    firstName, middleName, surName, dateOfBirth, placeOfBirth, nationality, stateOfDomicile, gender,
                    session, classAppliedFor, currentClass, academicDetails
                },
                address: {
                    firstLine, postOffice, policeStation, city, state, pin
                },
            };
            if (enquiryDetailsId) {
                const response = await axiosConfiguration.put(`/user/update-enquiry/${enquiryDetailsId}`, payload);

                return response?.data?.success || false;  // Ensure a boolean response
            }
            const response = await axiosConfiguration.post('/user/enquiry-form', payload);

            return response?.data?.success || false;  // Ensure a boolean response

        } catch (error) {
            console.error("Error submitting enquiry form:", error);
            return false;
        }
    };
    useImperativeHandle(ref, () => ({
        validate: validateAllFields,
        handleEnquiryFormSubmit: handleEnquiryFormSubmit,
    }));

    // pin fetching api
    const fetchAddressByPinCode = useCallback(async (pin) => {
        try {
            const response = await axiosConfiguration.post('/user/address-by-pin', { pincode: pin });
            if (response?.data?.success) {
                const data = response.data.filteredAddresses;
                if (data && data.length > 0) {
                    const address = data[0];
                    setCity(address.District || 'No city found');
                    setState(address.StateName || 'No state found');
                } else {
                    setCity('No city found');
                    setState('No state found');
                }
            } else {
                setCity('No city found');
                setState('No state found');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setCity('No city found');
            setState('No state found');
        }
    }, []);

    useEffect(() => {
        const getEnquiryDetailsIfAlreadyRegistered = async (email, school_id) => {
            try {
                const responseOne = await axiosConfiguration.post('user/enquiry-details-for-this-school', {
                    guardianLoginEmail: email,
                    school_id: school_id
                });
                setEnquiryDetailsId(responseOne?.data?.enquiryDetails?._id);

                const responseTwo = await axiosConfiguration.get('user/default-enquiry-details', {
                    params: {
                        guardianLoginEmail: email,
                    }
                });

                setFirstName(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.firstName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.firstName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.firstName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.firstName;
                    }
                    return "";
                })
                setMiddleName(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.middleName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.middleName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.middleName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.middleName;
                    }
                    return "";
                })
                setSurName(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.surName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.surName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.surName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.surName;
                    }
                    return "";
                })
                setDateOfBirth(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.dateOfBirth) {
                        return new Date(responseOne?.data?.enquiryDetails?.candidateDetails?.dateOfBirth);
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.dateOfBirth) {
                        return new Date(responseOne?.data?.enquiryDetails?.candidateDetails?.dateOfBirth);
                    }
                    const initialDate = new Date()
                    return initialDate;
                })
                setPlaceOfBirth(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.placeOfBirth) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.placeOfBirth;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.placeOfBirth) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.placeOfBirth;
                    }
                    return "";
                });
                setNationality(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.nationality) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.nationality;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.nationality) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.nationality;
                    }
                    return "";
                });
                setStateOfDomicile(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.stateOfDomicile) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.stateOfDomicile;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.stateOfDomicile) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.stateOfDomicile;
                    }
                    return "";
                });
                setGender(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.gender) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.gender;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.gender) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.gender;
                    }
                    return "";
                });
                setSession(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.session) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.session;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.session) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.session;
                    }
                    return "";
                });
                setClassAppliedFor(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.classAppliedFor) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.classAppliedFor;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.classAppliedFor) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.classAppliedFor;
                    }
                    return "";
                });
                setCurrentClass(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.currentClass) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.currentClass;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.currentClass) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.currentClass;
                    }
                    return "";
                });

                setPreviousSchoolName(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolName;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolName) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolName;
                    }
                    return "";
                });
                setPreviousSchoolCity(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolCity) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolCity;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolCity) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousSchoolCity;
                    }
                    return "";
                });

                setPreviousPercentage(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousPercentage) {
                        return String(responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousPercentage);
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousPercentage) {
                        return String(responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousPercentage);
                    }
                    return "";
                });

                setPreviousBoard(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousBoard) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousBoard;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousBoard) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousBoard;
                    }
                    return "";
                });

                setPreviousStream(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousStream) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousStream;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousStream) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.previousStream;
                    }
                    return "";
                });
                setReasonForLeaving(() => {
                    if (responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.reasonForLeaving) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.reasonForLeaving;
                    }
                    if (responseTwo?.data?.enquiryDetails?.candidateDetails?.academicDetails?.reasonForLeaving) {
                        return responseOne?.data?.enquiryDetails?.candidateDetails?.academicDetails?.reasonForLeaving;
                    }
                    return "";
                });


                setFirstLine(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.firstLine) {
                        return responseOne?.data?.enquiryDetails?.address?.firstLine;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.firstLine) {
                        return responseOne?.data?.enquiryDetails?.address?.firstLine;
                    }
                    return "";
                });
                setPostOffice(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.postOffice) {
                        return responseOne?.data?.enquiryDetails?.address?.postOffice;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.postOffice) {
                        return responseOne?.data?.enquiryDetails?.address?.postOffice;
                    }
                    return "";
                });

                setPoliceStation(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.policeStation) {
                        return responseOne?.data?.enquiryDetails?.address?.policeStation;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.policeStation) {
                        return responseOne?.data?.enquiryDetails?.address?.policeStation;
                    }
                    return "";
                });

                setCity(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.city) {
                        return responseOne?.data?.enquiryDetails?.address?.city;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.city) {
                        return responseOne?.data?.enquiryDetails?.address?.city;
                    }
                    return "";
                });

                setState(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.state) {
                        return responseOne?.data?.enquiryDetails?.address?.state;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.state) {
                        return responseOne?.data?.enquiryDetails?.address?.state;
                    }
                    return "";
                });

                setPin(() => {
                    if (responseOne?.data?.enquiryDetails?.address?.pin) {
                        return responseOne?.data?.enquiryDetails?.address?.pin;
                    }
                    if (responseTwo?.data?.enquiryDetails?.address?.pin) {
                        return responseOne?.data?.enquiryDetails?.address?.pin;
                    }
                    return "";
                });





            } catch (error) {
                console.error("Error fetching enquiry form IDs:", error.response?.data || error.message);
            }
        }
        getEnquiryDetailsIfAlreadyRegistered(email, 'SCH12345')
    }, [])


    const renderDropdown = (icon, placeholder, value, setValue, data) => (
        <View style={styles.inputWrapperRow}>
            <MaterialCommunityIcons name={icon} size={22} color="#6b52ae" style={styles.iconInline} />
            <Dropdown

                style={styles.dropdownInline}
                placeholder={placeholder}
                value={value}
                onChange={item => setValue(item.value)}
                data={data}
                labelField="label"
                valueField="value"
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}

            />
        </View>
    );


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Personal Information</Text>
                <View style={styles.row}>
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="First Name"
                        placeholder="Enter First Name"
                        placeholderTextColor={'#a6a6a6'}
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateField('firstName', text)
                        }}
                        mode='outlined'
                        error={!!errors.firstName}
                        style={[styles.input, errors.firstName ? styles.errorInput : null]}

                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                    <TextInput
                        // label="Middle Name"
                        placeholder='Enter Middle Name'
                        placeholderTextColor={'#a6a6a6'}
                        outlineStyle={{ borderWidth: 0.4 }}
                        value={middleName}
                        onChangeText={(text) => {
                            setMiddleName(text);
                            validateField('middleName', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.middleName ? styles.errorInput : null]}
                    />
                    {errors.middleName && <Text style={styles.errorText}>{errors.middleName}</Text>}
                </View>
                <TextInput
                    outlineStyle={{ borderWidth: 0.4 }}
                    // label="Last Name"
                    placeholder="Enter Last Name"
                    placeholderTextColor={'#a6a6a6'}
                    value={surName}
                    onChangeText={(text) => {
                        setSurName(text);
                        validateField('surName', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.surName ? styles.errorInput : null]}
                />
                {errors.surName && <Text style={styles.errorText}>{errors.surName}</Text>}
                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePicker}
                >
                    <MaterialCommunityIcons name="calendar" size={22} color="#6b52ae" />
                    <Text style={styles.dateText}>
                        {dateOfBirth.toDateString() === new Date().toDateString()
                            ? 'Select Date of Birth'
                            : dateOfBirth.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dateOfBirth}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={onDateChange}
                    />
                )}
                <TextInput
                    outlineStyle={{ borderWidth: 0.4 }}
                    label="Place of Birth"
                    value={placeOfBirth}
                    onChangeText={(text) => {
                        setPlaceOfBirth(text);
                        validateField('placeOfBirth', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.placeOfBirth ? styles.errorInput : null]}
                />
                {errors.placeOfBirth && <Text style={styles.errorText}>{errors.placeOfBirth}</Text>}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Additional Information</Text>
                {renderDropdown("flag", "Select Nationality", nationality, setNationality, nationalities)}
                {renderDropdown("map", "State of Domicile", stateOfDomicile, setStateOfDomicile, states)}

                <Text style={styles.sectionHeader}>Gender</Text>
                <View style={styles.radioGroup}>
                    {['Male', 'Female', 'Other'].map(value => (
                        <View key={value} style={styles.radioItem}>
                            <RadioButton
                                value={value}
                                status={gender === value ? 'checked' : 'unchecked'}
                                onPress={() => setGender(value)}
                            />
                            <Text>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Academic Details</Text>
                {renderDropdown("calendar", "Select Session", session, setSession, sessions)}
                <View style={styles.row}>
                    {renderDropdown("school", "Class Applied For", classAppliedFor, setClassAppliedFor, classes)}
                    {renderDropdown("school-outline", "Current Class", currentClass, setCurrentClass, classes)}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder="Name of Previous School"
                        placeholderTextColor={'#a6a6a6'}
                        value={previousSchoolName}
                        onChangeText={(text) => {
                            setPreviousSchoolName(text);
                            validateField('previousSchoolName', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.previousSchoolName ? styles.errorInput : null]}

                    />
                    {errors.previousSchoolName && <Text style={styles.errorText}>{errors.previousSchoolName}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder="City of Previous School"
                        placeholderTextColor={'#a6a6a6'}
                        value={previousSchoolCity}
                        onChangeText={(text) => {
                            setPreviousSchoolCity(text);
                            validateField('previousSchoolCity', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.previousSchoolCity ? styles.errorInput : null]}
                    />
                    {errors.previousSchoolCity && <Text style={styles.errorText}>{errors.previousSchoolCity}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder="Previous Percentage(%)"
                        placeholderTextColor={'#a6a6a6'}
                        value={previousPercentage}
                        onChangeText={(text) => {
                            setPreviousPercentage(text);
                            validateField('previousPercentage', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.previousPercentage ? styles.errorInput : null]}
                    />
                    {errors.previousPercentage && <Text style={styles.errorText}>{errors.previousPercentage}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder="Previous Board"
                        placeholderTextColor={'#a6a6a6'}
                        value={previousBoard}
                        onChangeText={(text) => {
                            setPreviousBoard(text);
                            validateField('previousBoard', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.previousBoard ? styles.errorInput : null]}
                    />
                    {errors.previousBoard && <Text style={styles.errorText}>{errors.previousBoard}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder='Previous Stream'
                        placeholderTextColor={'#a6a6a6'}
                        value={previousStream}
                        onChangeText={(text) => {
                            setPreviousStream(text);
                            validateField('previousStream', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.previousStream ? styles.errorInput : null]}
                    />
                    {errors.previousStream && <Text style={styles.errorText}>{errors.previousStream}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        placeholder="Reason for Leaving Previous School"
                        placeholderTextColor={'#a6a6a6'}
                        value={reasonForLeaving}
                        onChangeText={(text) => {
                            setReasonForLeaving(text);
                            validateField('reasonForLeaving', text);
                        }}
                        mode="outlined"
                        style={[styles.input, errors.reasonForLeaving ? styles.errorInput : null]}
                    />
                    {errors.reasonForLeaving && <Text style={styles.errorText}>{errors.reasonForLeaving}</Text>}
                </View>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Address Details</Text>
                <TextInput
                    // label="Address"
                    placeholder='Enter Address'
                    placeholderTextColor={'#a6a6a6'}
                    outlineStyle={{ borderWidth: 0.4 }}
                    value={firstLine}
                    onChangeText={(text) => {
                        setFirstLine(text);
                        validateField('firstLine', text);

                    }}
                    mode="outlined"
                    style={[styles.input, errors.firstLine ? styles.errorInput : null]}
                />
                {errors.firstLine && <Text style={styles.errorText}>{errors.firstLine}</Text>}
                <View style={styles.row1}>
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="P.O."
                        placeholder='Enter P.O.'
                        placeholderTextColor={'#a6a6a6'}
                        value={postOffice}
                        onChangeText={(text) => {
                            setPostOffice(text);
                            validateField('postOffice', text);
                        }}
                        mode="outlined"
                        style={[styles.input, styles.halfInput]}
                    />

                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="P.S."
                        placeholder='Enter P.S.'
                        placeholderTextColor={'#a6a6a6'}
                        value={policeStation}
                        onChangeText={(text) => {
                            setPoliceStation(text);
                            validateField('policeStation', text);
                        }}
                        mode="outlined"
                        style={[styles.input, styles.halfInput]}
                    />

                </View>
                <View style={styles.row}>
                    {/* {renderDropdown("city", "City", city, setCity, cities)}

                    {renderDropdown("map", "State", stateOfDomicile, setStateOfDomicile, states)} */}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="PIN"
                        placeholder='City'
                        placeholderTextColor={'#a6a6a6'}
                        value={city}
                        onChangeText={setCity}
                        mode="outlined"
                        style={styles.input}

                        editable={false}
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="PIN"
                        placeholder='State'
                        placeholderTextColor={'#a6a6a6'}
                        value={state}
                        onChangeText={setState}
                        mode="outlined"
                        style={styles.input}

                        editable={false}
                    />
                    {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
                </View>
                <TextInput
                    outlineStyle={{ borderWidth: 0.4 }}
                    // label="PIN"
                    placeholder='Enter PIN *'
                    placeholderTextColor={'#a6a6a6'}
                    value={pin}
                    onChangeText={(text) => {
                        setPin(text);
                        if (text.length === 6) {
                            fetchAddressByPinCode(text);
                        } else {
                            setCity('');
                            setState('');
                        }

                        validateField('pin', text);
                    }}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={6}
                />
                {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}
            </View>


        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: height * 0.02,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: width * 0.05,
        marginHorizontal: width * 0.01,
        marginBottom: height * 0.02,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionHeader: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#4d4d4d',
        marginBottom: height * 0.01,
    },
    input: {

        backgroundColor: '#f2f2f2',
        height: 43,
        flex: 1,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: width * 0.035,
        marginBottom: height * 0.01,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    dateText: {
        marginLeft: 10,
        color: '#6b52ae',
    },
    radioGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        height: height * 0.07,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: height * 0.03,
        marginHorizontal: width * 0.2,
    },
    buttonText: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#fff',
    },
    inputWrapperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,

        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    iconInline: {
        marginRight: 10,
    },
    dropdownInline: {
        flex: 1,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    halfInput: {
        flex: 0.48,
    },
});

export default CandidateDetails;
