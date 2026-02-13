import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, Animated, Easing } from 'react-native';
import { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const GurdianGalleryScreen = ({ route }) => {
    const { imageGallery } = route.params;

    // Animation for each item
    const animationValues = React.useRef(imageGallery.map(() => new Animated.Value(0))).current;

    const animateItem = (index) => {
        Animated.timing(animationValues[index], {
            toValue: 1,
            duration: 1000, // Longer duration for more visibility
            easing: Easing.out(Easing.ease), // Smooth easing
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
            outputRange: [100, 0], // Start much further down
        });

        const scale = animationValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1], // Start smaller and grow larger
        });

        return (
            <Animated.View
                style={[
                    styles.imageContainer,
                    { opacity, transform: [{ translateY }, { scale }] },
                ]}
            >
                <Image source={{ uri: `${baseURL}/uploads/${item.image}` }} style={styles.image} />
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>School Gallery</Text>
            </View>
            <FlatList
                data={imageGallery}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(props) => {
                    animateItem(props.index); // Trigger animation for each item
                    return renderItem(props);
                }}
                numColumns={2}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>School Uploaded Images</Text>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No images uploaded yet.</Text>
                }
                contentContainerStyle={styles.gallery}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 15,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        color: '#4d4d4d',
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: '#4d4d4d',
        marginVertical: 10,
        marginLeft: 10,
        fontWeight: '700',
        fontSize: 17,
    },
    gallery: {
        padding: 10,
    },
    imageContainer: {
        flex: 1,
        margin: 5,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#999',
    },
});

export default GurdianGalleryScreen;
