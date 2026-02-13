import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, Dimensions, Image, Animated, Pressable, TouchableOpacity
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const BoardHSDisplayComponent = ({ title, boardType }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const navigation = useNavigation();

    // Combined board data for both educational levels
    const boardsData = {
        secondary: [
            {
                id: 1,
                name: 'CBSE',
                image: require('../../../Images/DemoBanner/cbse.png'),
                navigate: 'AllSecondarySchools',
                color: '#4776E6',
                description: 'Central Board of Secondary Education'
            },
            {
                id: 2,
                name: 'ICSE',
                image: require('../../../Images/DemoBanner/icsc.png'),
                navigate: 'AllSecondarySchools',
                color: '#8E54E9',
                description: 'Indian Certificate of Secondary Education'
            },
            {
                id: 3,
                name: 'WBSE',
                image: require('../../../Images/DemoBanner/wbse.png'),
                navigate: 'AllSecondarySchools',
                color: '#FF8C42',
                description: 'West Bengal Board of Secondary Education'
            },
        ],
        higherSecondary: [
            {
                id: 1,
                name: 'CBSE',
                image: require('../../../Images/DemoBanner/cbse.png'),
                navigate: 'AllHigherSecondarySchools',
                color: '#0088cc',
                description: 'Central Board of Secondary Education'
            },
            {
                id: 2,
                name: 'ICSE',
                image: require('../../../Images/DemoBanner/icsc.png'),
                navigate: 'AllHigherSecondarySchools',
                color: '#0088cc',
                description: 'Indian Certificate of Secondary Education'
            },
            {
                id: 3,
                name: 'WBSES',
                image: require('../../../Images/DemoBanner/stateBoard.png'),
                navigate: 'AllHigherSecondarySchools',
                color: '#0088cc',
                description: 'West Bengal Senior Education Board'
            },
        ]
    };

    // Select the appropriate data based on boardType prop
    const boards = boardType === 'higherSecondary' ? boardsData.higherSecondary : boardsData.secondary;

    const [pressedId, setPressedId] = useState(null);
    const [scaleValue] = useState(new Animated.Value(1));
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            friction: 4,
            tension: 100,
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

    // Card renderer for Higher Secondary Board
    const renderHigherSecondaryBoardItem = (item) => {
        return (
            <Pressable
                key={item.id}
                onPressIn={() => {
                    setPressedId(item.id);
                    handlePressIn();
                }}
                onPressOut={() => {
                    setPressedId(null);
                    handlePressOut();
                }}
                onPress={() => navigation.navigate(item.navigate, { boardName: item.name })}
                style={styles.hsCardWrapper}
            >
                <Animated.View
                    style={[
                        styles.hsCard,
                        {
                            transform: [{ scale: pressedId === item.id ? scaleValue : 1 }],
                            borderWidth: pressedId === item.id ? 0.5 : 0,
                            borderColor: pressedId === item.id ? item.color : 'transparent',
                            shadowColor: pressedId === item.id ? item.color : '#000',
                            shadowOpacity: pressedId === item.id ? 0.4 : 0.2,
                            elevation: pressedId === item.id ? 8 : 5,
                        }
                    ]}
                >
                    <View style={styles.hsImageContainer}>
                        <Image
                            source={item.image}
                            style={styles.hsBoardImage}
                        />
                    </View>
                    <Text style={styles.hsBoardName}>{item.name}</Text>
                </Animated.View>
            </Pressable>
        );
    };

    // Card renderer for Secondary Board
    const renderSecondaryBoardItem = (item) => {
        return (
            <Pressable
                key={item.id}
                onPressIn={() => {
                    setPressedId(item.id);
                    handlePressIn();
                }}
                onPressOut={() => {
                    setPressedId(null);
                    handlePressOut();
                }}
                onPress={() => navigation.navigate(item.navigate, { boardName: item.name })}
                style={styles.cardWrapper}
            >
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ scale: pressedId === item.id ? scaleValue : 1 }],
                            shadowColor: item.color,
                            borderColor: pressedId === item.id ? item.color : 'transparent',
                        }]}>

                    <View style={[styles.imageContainer, { backgroundColor: `${item.color}20` }]}>
                        <Image
                            source={item.image}
                            style={styles.boardImage}
                        />
                        <View style={[styles.badge, { backgroundColor: item.color }]}>
                            <Text style={styles.badgeText}>{item.name}</Text>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.boardTitle}>{item.name}</Text>
                        <Text style={styles.boardDescription} numberOfLines={2}>
                            {item.description}
                        </Text>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.exploreText, { color: item.color }]}>
                                Explore
                            </Text>
                            <MaterialIcons name="arrow-forward" size={16} color={item.color} />
                        </View>
                    </View>
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.headerContainer}>
                <View style={styles.titleWrapper}>
                    <MaterialIcons name="school" size={24} color="#3366ff" />
                    <Text style={styles.sectionTitle}>
                        {title || (boardType === 'higherSecondary' ? 'Boards For Higher Secondary Education' : 'Educational Boards')}
                    </Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View all</Text>
                    <MaterialIcons name="chevron-right" size={18} color="#3366ff" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                decelerationRate="fast"
                snapToInterval={boardType === 'higherSecondary' ? windowWidth * 0.30 + 12 : windowWidth * 0.35 + 12}
                snapToAlignment="start"
            >
                {boards.map((item) => {
                    return boardType === 'higherSecondary'
                        ? renderHigherSecondaryBoardItem(item)
                        : renderSecondaryBoardItem(item);
                })}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
        paddingHorizontal: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 17,
        color: '#2d2d2d',
        fontWeight: '700',
        marginLeft: 6,
    },
    viewAllButton: {
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#e6ecff',
    },
    viewAllText: {
        color: '#3366ff',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    scrollViewContent: {
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    cardWrapper: {
        marginHorizontal: 6,
    },
    hsCardWrapper: {
        marginHorizontal: 6,
    },
    card: {
        width: Dimensions.get('window').width * 0.35,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        overflow: 'hidden',
    },
    hsCard: {
        width: Dimensions.get('window').width * 0.30,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 10,
        alignItems: 'center',
    },
    imageContainer: {
        height: Dimensions.get('window').width * 0.22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 10,
    },
    hsImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    boardImage: {
        width: Dimensions.get('window').width * 0.17,
        height: Dimensions.get('window').width * 0.17,
        resizeMode: 'contain',
    },
    hsBoardImage: {
        width: Dimensions.get('window').width * 0.15,
        height: Dimensions.get('window').width * 0.15,
        resizeMode: 'contain',
    },
    hsBoardName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 8,
    },
    boardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    boardDescription: {
        fontSize: 12,
        color: '#6b6b6b',
        marginBottom: 8,
        height: 30,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 4,
    },
    exploreText: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 4,
    }
});

export default BoardHSDisplayComponent;