import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const AnimatedSplashScreen = ({ navigation }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const { role } = useSelector((state) => state.auth); // Get role from Redux

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Navigate based on role after animation
            setTimeout(() => {
                if (role === 'School') {
                    navigation.replace('SchoolAuthorityNavigation');
                } else if (role === 'Guardian') {
                    navigation.replace('GuardianNavigation');
                } else {
                    navigation.replace('MasterLoginScreen');
                }
            }, 500); // Adjusted delay to make it quicker
        });
    }, [scaleAnim, opacityAnim, navigation, role]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/Images/splash/splash.jpeg')}
                style={[styles.backgroundImage, { opacity: opacityAnim }]}
            />
            <Animated.Image
                source={require('../assets/Images/splash/applogo.png')}
                style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
            />
        </View>
    );
};

export default AnimatedSplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    backgroundImage: {
        width: width,
        height: height,
        position: 'absolute',
        resizeMode: 'cover',
    },
    logo: {
        top: 30,
        width: 200,
        height: 200,
        borderRadius: 75,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
});
