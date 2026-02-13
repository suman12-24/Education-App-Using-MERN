import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Animated, Easing, StatusBar, Dimensions } from 'react-native';
import { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');
const SPACING = 10;
const ITEM_WIDTH = (width - SPACING * 3) / 2;

const GurdianGalleryScreen = ({ route }) => {
    const { imageGallery } = route.params;

    // Animation for fade-in header
    const headerAnimation = React.useRef(new Animated.Value(0)).current;

    // Animation for each item
    const animationValues = React.useRef(imageGallery.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Animate header on component mount
        Animated.timing(headerAnimation, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    const animateItem = (index) => {
        Animated.timing(animationValues[index], {
            toValue: 1,
            duration: 800,
            delay: index * 100, // Staggered animation
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const renderItem = ({ item, index }) => {
        // Interpolating opacity, translateY, and scale for dramatic effect
        const opacity = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const translateY = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
        });

        const scale = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });

        // Random rotation for a more dynamic feel
        const rotate = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [index % 2 === 0. ? '5deg' : '-5deg', '0deg'],
        });

        return (
            <Animated.View
                style={[
                    styles.imageContainer,
                    { opacity, transform: [{ translateY }, { scale }, { rotate }] },
                ]}
            >
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: `${baseURL}/uploads/${item.image}` }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.gradient}
                    >
                        <Text style={styles.imageCaption}>
                            {item.title || `School Memory ${index + 1}`}
                        </Text>
                    </LinearGradient>
                </View>
            </Animated.View>
        );
    };

    const headerTranslateY = headerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, 0],
    });

    const headerOpacity = headerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#4e54c8', '#8f94fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <Animated.View style={[
                    styles.headerContent,
                    { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
                ]}>
                    <Text style={styles.headerText}>School Gallery</Text>
                    <Text style={styles.headerSubText}>Capturing precious moments</Text>
                </Animated.View>
            </LinearGradient>

            <FlatList
                data={imageGallery}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(props) => {
                    animateItem(props.index);
                    return renderItem(props);
                }}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.gallery}
                ListHeaderComponent={
                    <Animated.View
                        style={{
                            opacity: headerAnimation,
                            transform: [{
                                translateY: headerAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                })
                            }]
                        }}
                    >
                        <Text style={styles.sectionTitle}>
                            <Text style={styles.highlightText}>📸</Text> School Memories
                        </Text>
                    </Animated.View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1829/1829207.png' }}
                            style={styles.emptyIcon}
                        />
                        <Text style={styles.emptyText}>No images uploaded yet.</Text>
                        <Text style={styles.emptySubText}>School memories will appear here</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        paddingTop: 20, // Account for status bar
        paddingBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    headerSubText: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    sectionTitle: {
        color: '#333',
        marginVertical: 12,
        marginHorizontal: SPACING,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    highlightText: {
        fontSize: 22,
    },
    gallery: {
        padding: SPACING,
        paddingBottom: 20,
    },
    imageContainer: {
        width: ITEM_WIDTH,
        margin: SPACING / 4,
        marginBottom: SPACING,
    },
    imageWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 180,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'flex-end',
        padding: 10,
    },
    imageCaption: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        opacity: 0.6,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    }
});

export default GurdianGalleryScreen;