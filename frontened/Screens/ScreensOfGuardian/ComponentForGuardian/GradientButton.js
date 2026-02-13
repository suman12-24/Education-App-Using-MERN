import React, { useRef } from 'react';
import { Animated, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({
    label,
    onPress,
    gradientColors = ['#505ce2', '#3a47df'],  // Default gradient colors
    textStyle = {}, // Customizable text style
    buttonStyle = {}, // Customizable button style
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95, // Slightly shrink the button
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1, // Return to original size
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={() => {
                handlePressOut();
                onPress && onPress(); // Trigger onPress when released
            }}
        >
            <Animated.View style={[styles.animatedView, { transform: [{ scale: scaleValue }] }]}>
                <LinearGradient
                    colors={gradientColors}
                    style={[styles.gradient, buttonStyle]}
                >
                    <Text style={[styles.text, textStyle]}>{label}</Text>
                </LinearGradient>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default GradientButton;

const styles = StyleSheet.create({
    animatedView: {
        alignSelf: 'center',
    },
    gradient: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3, // Shadow for Android
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
});
