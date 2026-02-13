import React, { useState, useImperativeHandle, forwardRef } from 'react';
import {
    View, Text, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { RadioButton } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const CandidateDetails = forwardRef((props, ref) => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [placeOfBirth, setPlaceOfBirth] = useState('');
    const [nationality, setNationality] = useState('');
    const [stateOfDomicile, setStateOfDomicile] = useState('');
    const [gender, setGender] = useState('male');
    const [session, setSession] = useState('');
    const [classAppliedFor, setClassAppliedFor] = useState('');
    const [currentClass, setCurrentClass] = useState('');

    const [address, setAddress] = useState('');
    const [pp, setPp] = useState('');
    const [ps, setPs] = useState('');
    const [city, setCity] = useState('');
    const [pin, setPin] = useState('');

    const [errors, setErrors] = useState({});

    const nationalities = [{ label: 'Indian', value: 'indian' }, { label: 'Other', value: 'other' }];
    const states = [{ label: 'State 1', value: 'state1' }, { label: 'State 2', value: 'state2' }];
    const sessions = [{ label: '2023-2024', value: '2023-2024' }, { label: '2024-2025', value: '2024-2025' }];
    const classes = [
        { label: 'Class 1', value: 'class1' },
        { label: 'Class 2', value: 'class2' },
        { label: 'Class 3', value: 'class3' },
    ];
    const cities = [
        { label: 'City 1', value: 'city1' },
        { label: 'City 2', value: 'city2' },
        { label: 'City 3', value: 'city3' },
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
                newErrors.pin = value.trim() && /^\d{6}$/.test(value) ? null : 'Valid PIN code is required.';
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
        if (!lastName.trim()) newErrors.lastName = 'Last Name is required.';
        if (!placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of Birth is required.';
        if (!address.trim()) newErrors.address = 'Address is required.';
        if (!pp.trim()) newErrors.pp = 'P.O. is required.';
        if (!ps.trim()) newErrors.ps = 'P.S. is required.';
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

    useImperativeHandle(ref, () => ({
        validate: validateAllFields,
    }));

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
                    value={lastName}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateField('lastName', text);
                    }}
                    mode="outlined"
                    style={[styles.input, errors.lastName ? styles.errorInput : null]}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
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
                    {['male', 'female', 'other'].map(value => (
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
                <Text style={styles.sectionHeader}>Educational Details</Text>
                {renderDropdown("calendar", "Select Session", session, setSession, sessions)}
                <View style={styles.row}>
                    {renderDropdown("school", "Class Applied For", classAppliedFor, setClassAppliedFor, classes)}
                    {renderDropdown("school-outline", "Current Class", currentClass, setCurrentClass, classes)}
                </View>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionHeader}>Address Details</Text>
                <TextInput
                    // label="Address"
                    placeholder='Enter Address'
                    placeholderTextColor={'#a6a6a6'}
                    outlineStyle={{ borderWidth: 0.4 }}
                    value={address}
                    onChangeText={(text) => {
                        setAddress(text);
                        validateField('address', text);

                    }}
                    mode="outlined"
                    style={[styles.input, errors.address ? styles.errorInput : null]}
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                <View style={styles.row1}>
                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="P.O."
                        placeholder='Enter P.O.'
                        placeholderTextColor={'#a6a6a6'}
                        value={pp}
                        onChangeText={(text) => {
                            setPp(text);
                            validateField('pp', text);
                        }}
                        mode="outlined"
                        style={[styles.input, styles.halfInput]}
                    />

                    <TextInput
                        outlineStyle={{ borderWidth: 0.4 }}
                        // label="P.S."
                        placeholder='Enter P.S.'
                        placeholderTextColor={'#a6a6a6'}
                        value={ps}
                        onChangeText={setPs}
                        mode="outlined"
                        style={[styles.input, styles.halfInput]}
                    />

                </View>
                <View style={styles.row}>
                    {renderDropdown("city", "City", city, setCity, cities)}

                    {renderDropdown("map", "State", stateOfDomicile, setStateOfDomicile, states)}
                </View>
                <TextInput
                    outlineStyle={{ borderWidth: 0.4 }}
                    // label="PIN"
                    placeholder='Enter PIN'
                    placeholderTextColor={'#a6a6a6'}
                    value={pin}
                    onChangeText={setPin}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="numeric"
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

