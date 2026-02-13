import { StyleSheet, Text, Pressable, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SchoolMenuList = () => {
    const navigation = useNavigation();

    const CustomButton = ({ title, onPress, iconName, style }) => {
        const [isPressed, setIsPressed] = useState(false);

        const handlePressIn = () => {
            setIsPressed(true);
        };

        const handlePressOut = () => {
            setIsPressed(false);
            if (onPress) onPress();
        };

        return (
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                    styles.button,
                    isPressed ? styles.pressed : styles.notPressed,
                    style,
                ]}
            >
                <View style={styles.iconTextWrapper}>
                    <Icon name={iconName} size={20} color="#07080c" style={styles.icon} />
                    <Text style={styles.text}>{title}</Text>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <CustomButton
                    onPress={() => navigation.navigate('SchoolFeesStructureForGuardian')}
                    title="Fees Structure"
                    iconName="account-balance-wallet"
                    style={styles.customButton}
                />
                <View style={styles.spacer} />
                <CustomButton
                    onPress={() => navigation.navigate('AdmissionProcedurePage')}
                    title="Admission Process"
                    iconName="school"
                    style={styles.customButton}
                />
            </View>
            <View style={styles.row}>
                <CustomButton
                    onPress={() => navigation.navigate('ContactDetailsScreen')}
                    title="Contact Details"
                    iconName="phone"
                    style={styles.customButton}
                />
                <View style={styles.spacer} />
                <CustomButton
                    title="Important Dates"
                    iconName="event"
                    style={styles.customButton}
                />
            </View>
            <View style={styles.row}>
                <CustomButton
                    onPress={() => navigation.navigate('FacilitiesScreen')}
                    title="Facilities"
                    iconName="local-library"
                    style={styles.customButton}
                />
                <View style={styles.spacer} />
                <View style={styles.emptySpace} />
            </View>
        </View>
    );
};

export default SchoolMenuList;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        elevation: 2,
        alignItems: 'center',
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    spacer: {
        width: '5%',
    },
    customButton: {
        width: '45%',
    },
    emptySpace: {
        width: '45%',
    },
    button: {
        marginTop: 7,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notPressed: {
        backgroundColor: '#e2e5ea', // Default button color
    },
    pressed: {
        backgroundColor: '#d1d5db', // Color when the button is pressed
    },
    iconTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: '#07080c',
    },
});
