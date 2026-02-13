import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    StatusBar,
    Animated,
    ActivityIndicator
} from 'react-native';
import {
    PinchGestureHandler,
    TapGestureHandler,
    State,
    GestureHandlerRootView
} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const { width, height } = Dimensions.get('window');

const ImageViewerForGurdian = ({ route, navigation }) => {
    const { gallery, initialIndex = 0 } = route.params;

    const flatListRef = useRef(null);
    const [isFlatListReady, setIsFlatListReady] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Zoom related refs and state
    const scale = useRef(new Animated.Value(1)).current;
    const pinchRef = useRef();
    const doubleTapRef = useRef();
    const [lastScale, setLastScale] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const controlsOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isFlatListReady && gallery && gallery.length > 0) {
            try {
                flatListRef.current.scrollToIndex({
                    index: initialIndex,
                    animated: false,
                    viewPosition: 0.5
                });
            } catch (error) {
                console.warn("Scroll to index failed initially:", error);
            }
        }
    }, [isFlatListReady, initialIndex, gallery]);

    useEffect(() => {
        // Show controls initially then fade out after a few seconds
        Animated.sequence([
            Animated.timing(controlsOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(controlsOpacity, {
                toValue: 0.6,
                duration: 3000,
                delay: 2000,
                useNativeDriver: true,
            })
        ]).start();

        // Reset zoom when switching images
        resetZoom();
    }, [currentIndex]);

    const showControls = () => {
        if (!isZoomed) {
            controlsOpacity.setValue(1);
            Animated.timing(controlsOpacity, {
                toValue: 0.6,
                duration: 3000,
                delay: 2000,
                useNativeDriver: true,
            }).start();
        }
    };

    const hideControls = () => {
        Animated.timing(controlsOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const resetZoom = () => {
        setLastScale(1);
        setIsZoomed(false);
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 7,
                tension: 40,
                useNativeDriver: true
            }),
            Animated.spring(translateX, {
                toValue: 0,
                friction: 7,
                tension: 40,
                useNativeDriver: true
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 7,
                tension: 40,
                useNativeDriver: true
            })
        ]).start();
        showControls();
    };

    const onPinchEvent = Animated.event(
        [{ nativeEvent: { scale: scale } }],
        { useNativeDriver: true }
    );

    const onPinchStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const newScale = lastScale * event.nativeEvent.scale;
            setLastScale(newScale);

            // Update isZoomed state based on scale
            setIsZoomed(newScale > 1.1);

            // Show or hide controls based on zoom state
            if (newScale > 1.1) {
                hideControls();
            } else {
                showControls();
            }

            scale.setValue(1);
        }
    };

    const onDoubleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            if (lastScale > 1) {
                // Reset zoom
                resetZoom();
            } else {
                // Zoom to 2.5x
                setLastScale(2.5);
                setIsZoomed(true);
                hideControls();

                Animated.spring(scale, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    useNativeDriver: true
                }).start();
            }
        }
    };

    const handleMomentumScrollEnd = (event) => {
        if (isZoomed) return;

        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(contentOffsetX / width);
        setCurrentIndex(newIndex);
        showControls();
    };

    const navigateToImage = (index) => {
        if (index >= 0 && index < gallery.length) {
            try {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5
                });
                setCurrentIndex(index);
                showControls();
            } catch (error) {
                console.warn("Failed to scroll to index:", index, error);
            }
        }
    };

    const handleScrollToIndexFailed = (info) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5
            });
        });
    };

    // Define getItemLayout to help FlatList know item dimensions beforehand
    const getItemLayout = (_, index) => ({
        length: width,
        offset: width * index,
        index,
    });

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        showControls();
    };

    const renderImageItem = ({ item }) => (
        <GestureHandlerRootView style={styles.imageContainer}>
            <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}
                simultaneousHandlers={doubleTapRef}
            >
                <Animated.View style={styles.imageContainer}>
                    <TapGestureHandler
                        ref={doubleTapRef}
                        onHandlerStateChange={onDoubleTap}
                        numberOfTaps={2}
                        simultaneousHandlers={pinchRef}
                    >
                        <Animated.View style={styles.imageContainer}>
                            <ActivityIndicator
                                style={styles.loadingIndicator}
                                size="large"
                                color="#FFFFFF"
                                animating={isLoading}
                            />
                            <Animated.Image
                                source={{ uri: `${baseURL}/uploads/${item.image}` }}
                                style={[
                                    styles.image,
                                    {
                                        transform: [
                                            { scale: Animated.multiply(scale, lastScale) },
                                            { translateX },
                                            { translateY }
                                        ]
                                    }
                                ]}
                                onLoadStart={() => setIsLoading(true)}
                                onLoadEnd={() => {
                                    setIsLoading(false);
                                    Animated.timing(fadeAnim, {
                                        toValue: 1,
                                        duration: 500,
                                        useNativeDriver: true
                                    }).start();
                                }}
                            />
                            {item.caption && (
                                <View style={styles.captionContainer}>
                                    <Text style={styles.captionText}>{item.caption}</Text>
                                </View>
                            )}

                            {/* Zoom indicator */}
                            {isZoomed && (
                                <View style={styles.zoomIndicator}>
                                    <Ionicons name="scan-outline" size={18} color="white" />
                                    <Text style={styles.zoomText}>
                                        {Math.round(lastScale * 100)}%
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                    </TapGestureHandler>
                </Animated.View>
            </PinchGestureHandler>
        </GestureHandlerRootView>
    );

    return (
        <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
            <StatusBar hidden={isFullscreen} />

            <FlatList
                ref={flatListRef}
                data={gallery}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderImageItem}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                onLayout={() => setIsFlatListReady(true)}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={handleScrollToIndexFailed}
                scrollEnabled={!isZoomed}
            />

            {/* Header with back button and counter */}
            <Animated.View style={[styles.header, { opacity: controlsOpacity }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.indexContainer}>
                    <Text style={styles.indexText}>{currentIndex + 1} / {gallery.length}</Text>
                </View>

                <TouchableOpacity
                    style={styles.fullscreenButton}
                    onPress={toggleFullscreen}>
                    <Ionicons
                        name={isFullscreen ? "contract-outline" : "expand-outline"}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Zoom reset button - only shown when zoomed */}
            {isZoomed && (
                <TouchableOpacity
                    style={styles.resetZoomButton}
                    onPress={resetZoom}>
                    <Ionicons name="refresh-outline" size={22} color="white" />
                </TouchableOpacity>
            )}

            {/* Navigation buttons overlay */}
            <Animated.View style={[styles.navigationControls, { opacity: controlsOpacity }]}>
                {currentIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.navButton, styles.leftNavButton]}
                        onPress={() => navigateToImage(currentIndex - 1)}>
                        <Ionicons name="chevron-back" size={36} color="white" />
                    </TouchableOpacity>
                )}

                {currentIndex < gallery.length - 1 && (
                    <TouchableOpacity
                        style={[styles.navButton, styles.rightNavButton]}
                        onPress={() => navigateToImage(currentIndex + 1)}>
                        <Ionicons name="chevron-forward" size={36} color="white" />
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* Thumbnail navigation */}
            <Animated.View style={[styles.thumbnailContainer, { opacity: controlsOpacity }]}>
                <FlatList
                    horizontal
                    data={gallery}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => navigateToImage(index)}
                            style={[
                                styles.thumbnail,
                                currentIndex === index && styles.activeThumbnail
                            ]}>
                            <Image
                                source={{ uri: `${baseURL}/uploads/${item.image}` }}
                                style={styles.thumbnailImage}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(_, index) => `thumb-${index}`}
                    contentContainerStyle={styles.thumbnailContent}
                />
            </Animated.View>

            {/* Zoom instructions indicator - only shown briefly when new image loaded */}
            <Animated.View style={[styles.zoomInstructions, {
                opacity: Animated.multiply(fadeAnim, Animated.subtract(1, Animated.multiply(scale, lastScale).interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                })))
            }]}>
                <Ionicons name="finger-print-outline" size={20} color="white" style={styles.instructionIcon} />
                <Text style={styles.instructionText}>Pinch to zoom • Double-tap to toggle zoom</Text>
            </Animated.View>
        </View>
    );
};

export default ImageViewerForGurdian;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    imageContainer: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    loadingIndicator: {
        position: 'absolute',
        zIndex: 10,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indexContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 20,
    },
    indexText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fullscreenButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationControls: {
        position: 'absolute',
        top: height / 2 - 25,
        width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    navButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftNavButton: {
        left: 10,
    },
    rightNavButton: {
        right: 10,
    },
    thumbnailContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 10,
    },
    thumbnailContent: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    activeThumbnail: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }],
    },
    captionContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        borderRadius: 8,
    },
    captionText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    zoomIndicator: {
        position: 'absolute',
        top: 50,
        right: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoomText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 5,
    },
    resetZoomButton: {
        position: 'absolute',
        top: 50,
        right: 10,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 110,
    },
    zoomInstructions: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructionText: {
        color: '#fff',
        fontSize: 14,
    },
    instructionIcon: {
        marginRight: 8,
    }
});