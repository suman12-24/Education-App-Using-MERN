import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Image, Animated, TouchableWithoutFeedback, ActivityIndicator, Pressable, TouchableOpacity, ImageBackground, Linking, RefreshControl } from 'react-native';
import CustomButton from './ComponentForGuardian/CustomButton ';
import GradientButton from './ComponentForGuardian/GradientButton';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { useNavigation } from '@react-navigation/native';
const AllSecondarySchools = ({ route }) => {
    const navigation = useNavigation();
    const { boardName } = route.params;
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const animations = useRef([]);
    const bounceValues = useRef([]);


    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await axiosConfiguration.get(`/school/${boardName}`);

            // Ensure response is successful
            if (response.status !== 200) {
                throw new Error('Failed to fetch schools');
            }

            const data = response.data; // Axios stores response data in `.data`

            if (data.message === "Schools fetched successfully" && data.schools) {
                const mappedSchools = data.schools.map(school => {
                    const addressParts = [
                        school.reachUs?.address?.street,
                        school.reachUs?.address?.district,
                        school.reachUs?.address?.state
                    ].filter(part => part && part.trim() !== '');

                    return {
                        id: school._id,
                        name: school.name || 'Unnamed School',
                        address: addressParts.join(', ') || 'Address not available',
                        image: school.profilePicture?.image || school.coverPicture?.image || 'https://example.com/default-school.jpg',
                        phone: school.contactPersonPhone || 'N/A'
                    };
                });

                setSchools(mappedSchools);
            } else {
                setError('No schools found.');
            }
        } catch (err) {
            console.error('Error fetching schools:', err);
            setError('Failed to load schools. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        if (schools.length > 0) {
            animations.current = schools.map(() => new Animated.Value(0));
            bounceValues.current = schools.map(() => new Animated.Value(1));

            Animated.stagger(
                200,
                animations.current.map(anim =>
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    })
                )
            ).start();
        }
    }, [schools]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSchools();
        setRefreshing(false);
    }
    const handlePressIn = (index) => {
        Animated.spring(bounceValues.current[index], {
            toValue: 0.9,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = (index) => {
        Animated.spring(bounceValues.current[index], {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const renderSchoolCard = ({ item, index }) => {
        const translateY = animations.current[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0], // Start from below and move to original position
        });

        const opacity = animations.current[index];
        const scale = bounceValues.current[index];

        return (
            <TouchableWithoutFeedback
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
            >
                <Animated.View
                    style={[
                        styles.card,
                        { opacity, transform: [{ translateY }, { scale }] },
                    ]}
                >
                    {/* ImageBackground for Background and Overlay */}
                    <ImageBackground
                        source={require('./Images/cardBKG2.png')}
                        style={{
                            flex: 1,
                            borderRadius: 10,
                            overflow: 'hidden',
                        }}
                        imageStyle={{ opacity: 0.7 }} // Adjusts background image transparency
                    >
                        {/* Overlay */}
                        <View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent overlay
                            }}
                        />

                        {/* Card Content */}
                        <View style={styles.cardContent}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', width: '32%', }}>
                                <Image source={{ uri: item.image }} style={styles.image}


                                />
                            </View>
                            <View style={{ height: '90%', marginVertical: 10, width: '68%' }}>

                                <Text style={styles.schoolName}>{item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}</Text>

                                <Text style={styles.address}>{item.address}</Text>
                                {/* <Text style={styles.rating}>Rating : ⭐ {item.rating}</Text> */}
                                <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                    <CustomButton
                                        icon="whatsapp"
                                        label="What's App"
                                        color="#00b359"
                                        onPress={() => Linking.openURL(`https://wa.me/${item.phone}`)}
                                    />
                                    <CustomButton
                                        icon="phone"
                                        label="Call"
                                        color="#003399"
                                        style={{ marginLeft: 4, borderColor: '#666666' }}
                                        textStyle={{ fontSize: 14 }}
                                        iconStyle={{ marginRight: 3 }}
                                        onPress={() => Linking.openURL(`tel:${item.phone}`)}

                                    />
                                    <GradientButton
                                        label="Details"
                                        buttonStyle={{
                                            paddingVertical: 7,
                                            paddingHorizontal: 6,
                                            borderRadius: 5,
                                            marginLeft: 5,
                                        }}
                                        textStyle={{ fontSize: 14, fontWeight: 'bold' }}
                                    />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    };

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading schools...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>Secondary Schools</Text>
            <TextInput
                placeholder="Search or filter schools..."
                style={styles.filterInput}
                onPress={() => navigation.navigate('SearchSchools')}
            />
            <FlatList
                data={schools}
                renderItem={renderSchoolCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cardList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007bff']} />}
            />
        </View>
    );
};

export default AllSecondarySchools;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 8,
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#343a40',
    },
    filterInput: {
        height: 40,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    cardList: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 2,
        borderRadius: 12,
        // padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 8,

    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
    },
    cardContent: {
        flex: 1,
        width: '100%',
        flexDirection: 'row'
    },
    schoolName: {

        fontSize: 18,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6c757d',
    },
});

