import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ImageBackground, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Install this package
import { TypingAnimation } from 'react-native-typing-effect'; // Install this package
import { useNavigation } from '@react-navigation/native';

const AllImagesScreen = ({ route }) => {
    const { gallery } = route.params; // Get gallery images from route params
    const navigation = useNavigation();
    const [title, setTitle] = useState('');

    useEffect(() => {
        // Simulating a typing effect for the header
        const fullText = 'Gallery';
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                setTitle((prev) => prev + fullText[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 150);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <>
            <StatusBar backgroundColor={'#4c669f'} />
            <View style={styles.container}>
                {/* Gradient Header */}
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                    <Text style={styles.headerText}>{title}</Text>
                </LinearGradient>
                <View style={{ padding: 10 }}>
                    {/* Image Gallery */}
                    <FlatList
                        data={gallery}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('ImageViewer', { imageUri: item })}>
                                <ImageBackground source={item} style={styles.image} />
                            </TouchableOpacity>
                        )}
                    />
                </View>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    headerText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 250,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default AllImagesScreen;
