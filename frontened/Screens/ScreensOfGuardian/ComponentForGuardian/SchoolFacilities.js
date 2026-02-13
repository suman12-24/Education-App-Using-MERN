import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Image, PixelRatio } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const CENTER = width / 2;

const SchoolFacilities = ({ facilities }) => {

    const navigation = useNavigation();
    const ratio = PixelRatio.getPixelSizeForLayoutSize();
    const features = [
        { image: require('../Images/DemoBanner/sportsFacility.png'), label: 'Sports and Recreation', angle: 0, height: 40, width: 48, marginBottom: 1 },
        { image: require('../Images/DemoBanner/AcademicFaci.png'), label: 'Academic Facilities', angle: 45, height: 45, width: 45, marginBottom: 2 },
        { image: require('../Images/DemoBanner/artFaci.png'), label: 'Arts and Creativity', angle: 90, height: 45, width: 45, marginBottom: 0 },
        { image: require('../Images/DemoBanner/Technology.png'), label: 'Science Innovation', angle: 135, height: 40, width: 40, marginBottom: 6 },
        { image: require('../Images/DemoBanner/OutdoorLearning.png'), label: 'Outdoor Learning', angle: 180, height: 45, width: 45, marginBottom: 4 },
        { image: require('../Images/DemoBanner/busFacility.png'), label: 'Convenience Facilities', angle: 225, height: 47, width: 47, marginBottom: 0 },
        { image: require('../Images/DemoBanner/supportFaci.png'), label: 'Mental Support', angle: 270, height: 45, width: 45, marginBottom: 4 },
        { image: require('../Images/DemoBanner/CameraFacility.png'), label: 'Safety and Hygiene', angle: 315, height: 45, width: 45, marginBottom: 0 },
    ];

    const radius = width * .36;
    const pulseAnim = new Animated.Value(1);

    // Create an array of animated values for the feature nodes and shadow opacity
    const [scaleValues, setScaleValues] = useState(
        features.map(() => new Animated.Value(1))
    );

    const [shadowOpacityValues, setShadowOpacityValues] = useState(
        features.map(() => new Animated.Value(0.3)) // Initial shadow opacity
    );

    const [shadowColors, setShadowColors] = useState(
        features.map(() => '#3D5AFE') // Initial shadow color for each node
    );

    useEffect(() => {
        // Pulse animation for the central node
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Start blinking light effect for each facility
        features.forEach((_, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shadowOpacityValues[index], {
                        toValue: 0.8,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(shadowOpacityValues[index], {
                        toValue: 0.3,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, []);

    const handlePress = (index) => {

        const screens = [
            'SportsRecreation',
            'AcademicFacilities',
            'ArtsCreativity',
            'ScienceInnovation',
            'OutdoorLearning',
            'ConvenienceFacilities',
            'MentalSupport',
            'SafetyHygiene',
        ];

        // Scale up the clicked feature node's border
        Animated.sequence([
            Animated.timing(scaleValues[index], {
                toValue: 1.2, // Enlarge the feature node's border
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValues[index], {
                toValue: 1, // Return to original size
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
        ]).start(() => {
            navigation.navigate(screens[index], { facility: facilities[screens[index]], facilityName: screens[index] });
        });
    };

    return (
        <View style={styles.container}>
            <Svg height={height * 0.5} width={width} style={StyleSheet.absoluteFill}>
                {features.map((feature, index) => {
                    const x = CENTER + radius * Math.cos((feature.angle * Math.PI) / 180);
                    const y = CENTER - radius * Math.sin((feature.angle * Math.PI) / 180);

                    return (
                        <Line
                            key={index}
                            x1={CENTER}
                            y1={CENTER}
                            x2={x}
                            y2={y}
                            stroke={shadowColors[index]} // Use dynamic shadow color
                            strokeWidth="2"
                            strokeDasharray="4.4"
                            strokeLinecap="round"
                        />
                    );
                })}
            </Svg>

            <Animated.View style={[styles.centralNode]}>
                <Text style={styles.centralText}>Facilities</Text>
            </Animated.View>

            {features.map((feature, index) => {
                const x = CENTER + radius * Math.cos((feature.angle * Math.PI) / 180) - 40;
                const y = CENTER - radius * Math.sin((feature.angle * Math.PI) / 180) - 40;

                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.featureNode, {
                            left: x,
                            top: y,
                            shadowOpacity: shadowOpacityValues[index],
                            shadowColor: shadowColors[index], // Apply dynamic shadow color
                            transform: [{ scale: scaleValues[index] }], // Animate the border's scaling
                        }]}
                        onPress={() => handlePress(index)}
                        activeOpacity={0.7} // Reduces opacity on touch
                    >
                        {/* Circular Border */}
                        <Animated.View style={[styles.borderCircle,
                            // { transform: [{ scale: scaleValues[index] }] }
                        ]} />

                        {/* Image */}
                        <Image source={feature.image}
                            style={{
                                width: feature.width,
                                height: feature.height,
                                marginBottom: feature.marginBottom,
                                borderRadius: 33,
                                resizeMode: 'contain',
                                overflow: 'hidden',
                            }} />

                        {/* Label */}
                        <Text style={{
                            fontWeight: '400',
                            fontSize: 11,
                            marginTop: -10,
                            marginBottom: feature.label == 'Sports and Recreation' ? 9 : 5,
                            textAlign: 'center',
                            color: '#444', // Slightly darker text for better contrast
                        }}>{feature.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {

        flex: 1,
        marginLeft: -15,
        backgroundColor: '#fff',
    },
    centralNode: {
        position: 'absolute',
        top: CENTER - 50,
        left: CENTER - 50,
        width: 92.4,
        height: 92.4,
        borderRadius: 46.2,
        backgroundColor: '#3D5AFE',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 10 },
    },
    centralText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    featureNode: {
        position: 'absolute',
        width: 86,
        height: 86,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 43,
        elevation: 10,
        shadowOpacity: 0.3, // Initial shadow opacity
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10, // Enhance shadow
        borderWidth: 1,
        borderColor: '#ddd', // Add a subtle border
        padding: 5,
    },
    borderCircle: {
        position: 'absolute',
        width: 86,
        height: 86,
        borderRadius: 43,
        borderWidth: 1,

        borderColor: '#ddd', // Apply the border color
    },

});

export default SchoolFacilities;
