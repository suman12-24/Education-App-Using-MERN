import React, { useState } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const AnimatedCard = () => {
    // Sample data for cards
    const cards = [
        {
            id: 1,
            title: 'Greenwood Primary School',
            image: 'https://images.adsttc.com/media/images/5017/6518/28ba/0d22/5a00/046a/large_jpg/stringio.jpg?1414586991',
        },
        {
            id: 2,
            title: 'Bright Horizon Elementary School',
            image: 'https://media.istockphoto.com/id/483257790/photo/empty-classroom.jpg?s=612x612&w=0&k=20&c=dvxGhGQEqEnAoeIeJk-_a13IoAmr-snSPHKnjNdTuy8=',
        },
        {
            id: 3,
            title: 'Little Sprouts Academy',
            image: 'https://www.filmhub.co.uk/location_photos/1820/67962f2f-bd09-472a-86f9-1f21bc80ad91.jpg?mode=max&height=800&overlay=fhlogo-white.png&overlay.size=210,41&overlay.opacity=40',
        },
        {
            id: 4,
            title: 'Sunrise Primary School',
            image: 'https://images.adsttc.com/media/images/5016/05b2/28ba/0d15/9800/074f/newsletter/stringio.jpg?1414564201',
        },
    ];

    // Maintain a separate Animated.Value for each card
    const animatedValues = cards.map(() => new Animated.Value(1));

    const onPressIn = (index) => {
        Animated.spring(animatedValues[index], {
            toValue: 0.95, // Scale down slightly
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = (index) => {
        Animated.spring(animatedValues[index], {
            toValue: 1, // Reset to original size
            useNativeDriver: true,
        }).start();
    };

    return (
        <View>
            <Text style={{
                textAlign: 'left', fontSize: 15, marginBottom: 5, color: "#0059b3", fontWeight: '700'
            }}>
                Leading Pre-KG and Primary School
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cards.map((card, index) => (
                    <TouchableWithoutFeedback
                        key={card.id}
                        onPressIn={() => onPressIn(index)}
                        onPressOut={() => onPressOut(index)}
                        style={{ marginBottom: 5 }}
                    >
                        <Animated.View
                            style={[styles.card, { transform: [{ scale: animatedValues[index] }] }]}
                        >
                            <Card style={styles.cardContent}>
                                <Image source={{ uri: card.image }} style={styles.image} />
                                <View style={styles.labelContainer}>
                                    <Text style={styles.labelText}>{card.title}</Text>
                                </View>
                            </Card>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({

    card: {
        marginHorizontal: 10,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardContent: {
        borderRadius: 12,
    },
    image: {
        width: 210,
        height: 110,
    },
    labelContainer: {
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
    },
    labelText: {
        color: '#666666',
        fontWeight: '400',
        fontSize: 12,
    },
});

export default AnimatedCard;
