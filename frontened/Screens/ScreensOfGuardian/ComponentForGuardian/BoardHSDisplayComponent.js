import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Animated,
    Pressable,
    TouchableOpacity
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BoardHSDisplayComponent = () => {
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const formatBoardName = (apiName) => {
        // Special case for stateBoard
        if (apiName === 'stateBoard') return 'State Board';

        // For other boards, keep the original name (like CBSE, ICSE)
        return apiName;
    };
    // Updated data for higher secondary boards
    const hsBoards = [
        {
            id: 1,
            name: 'CBSE',
            image: require('../../../Images/DemoBanner/cbse.png'),
            navigate: 'AllHigherSecondarySchools',
            color: '#4CAF50',
            description: 'Central Board of Higher Secondary Education'
        },
        {
            id: 2,
            name: 'ISC',
            image: require('../../../Images/DemoBanner/icsc.png'),
            navigate: 'AllHigherSecondarySchools',
            color: '#9C27B0',
            description: 'Indian School Certificate Examination'
        },
        {
            id: 3,
            name: 'stateBoard',
            image: require('../../../Images/DemoBanner/stateBoard.png'),
            navigate: 'AllSecondarySchools',
            color: '#FF8C42',
            description: 'All State Boards',
            width: 95,
            height: 95
        },
    ];

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

    const renderBoardItem = ({ item }) => {
        // Define image style with conditional dimensions for stateBoard
        const imageStyle = [
            styles.boardImage,
            // Apply custom dimensions only to the WBHSE item
            item.name === 'stateBoard' && item.width && item.height ? {
                width: item.width,
                height: item.height
            } : {}
        ];
        const displayName = formatBoardName(item.name);
        return (
            <Pressable
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
                            style={imageStyle}
                        />
                        <View style={[styles.badge, { backgroundColor: item.color }]}>
                            <Text style={styles.badgeText}>{displayName}</Text>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.boardTitle}>{displayName}</Text>
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
        )
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.headerContainer}>
                <View style={styles.titleWrapper}>
                    <MaterialIcons name="school" size={23} color="#4CAF50" />
                    <Text style={styles.sectionTitle}>
                        Higher Secondary Educational Boards
                    </Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View all</Text>
                    <MaterialIcons name="chevron-right" size={18} color="#4CAF50" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={hsBoards}
                renderItem={renderBoardItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
            />
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
        fontSize: 16,
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
        paddingHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#e6f5e6',  // Lighter shade of green
    },
    viewAllText: {
        color: '#4CAF50',  // Green color
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
    flatListContent: {
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    cardWrapper: {
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
    imageContainer: {
        height: Dimensions.get('window').width * 0.22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 10,
    },
    boardImage: {
        width: Dimensions.get('window').width * 0.17,
        height: Dimensions.get('window').width * 0.17,
        resizeMode: 'contain',
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