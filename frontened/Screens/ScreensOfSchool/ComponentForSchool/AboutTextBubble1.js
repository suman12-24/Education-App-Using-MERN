import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have React Native Vector Icons installed

const AboutTextBubble = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(
        'This is an example of an "About Text" section displayed in a speech bubble style. Customize it as needed!'
    );

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../Images/DemoBanner/Director.png')}
                    style={styles.image}
                />
            </View>
            <View style={styles.speechBubbleContainer}>
                <View style={styles.triangle}></View>
                <View style={styles.speechBubble}>
                    {isEditing ? (
                        <TextInput
                            style={styles.textInput}
                            value={text}
                            onChangeText={setText}
                            onSubmitEditing={toggleEditMode}

                        />
                    ) : (
                        <Text style={styles.text}>{text}</Text>
                    )}
                    <TouchableOpacity onPress={toggleEditMode} style={styles.iconContainer}>
                        <Icon name="more-vert" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginLeft: 20,
        flexDirection: 'row',
    },
    imageContainer: {
        width: '20%',
        marginTop: -50,
    },
    image: {
        width: 80,
        height: 150,
        borderRadius: 25,
        marginTop: 5,
        resizeMode: 'cover',
        backgroundColor: '#fff',
    },
    speechBubbleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
    },
    triangle: {
        width: 0,
        height: 0,
        borderTopWidth: 12,
        borderBottomWidth: 12,
        borderRightWidth: 55,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#ffe680',
        marginTop: -14,
        marginRight: -14,
        transform: [{ rotate: '35deg' }],
    },
    speechBubble: {
        backgroundColor: '#ffe680',
        padding: 15,
        borderRadius: 10,
        maxWidth: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        flexDirection: 'row',
        alignItems: 'center', // Aligns text and icon vertically
        justifyContent: 'space-between', // Ensures text and icon are spaced
    },
    text: {
        color: '#333',
        fontSize: 16,
        lineHeight: 22,
        flex: 1, // Ensures text occupies available space
    },
    textInput: {
        color: '#333',
        fontSize: 16,
        lineHeight: 22,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
        flex: 1,
    },
    iconContainer: {
        marginTop: -100,
        marginLeft: 10,
    },
});

export default AboutTextBubble;
