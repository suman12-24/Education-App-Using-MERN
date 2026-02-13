import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomButton = ({
    icon,
    label,
    onPress,
    color = '#00b359', // Default icon color
    style = {}, // Allow custom styles
    textStyle = {}, // Allow custom text styles
    iconStyle = {}, // Allow custom icon styles
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }, style]}>
            <Pressable
                style={({ pressed }) => [
                    styles.pressable,
                    { backgroundColor: pressed ? '#e0ffe0' : '#ffffff' }, // Mild color change
                ]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                {icon && <FontAwesome name={icon} size={17} color={color} style={[styles.icon, iconStyle]} />}
                {label && <Text style={[styles.text, textStyle]}>{label}</Text>}
            </Pressable>
        </Animated.View>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.7,
        borderRadius: 5,
        borderColor: '#666666',
        overflow: 'hidden',

    },
    pressable: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 5,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});
