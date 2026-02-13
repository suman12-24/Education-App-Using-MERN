import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const ImageViewerForSchool = ({ route }) => {
    const { gallery, initialIndex = 0 } = route.params;

    const flatListRef = useRef(null);
    const [isFlatListReady, setIsFlatListReady] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Disable FlatList scrolling when zooming
    const [scrollEnabled, setScrollEnabled] = useState(true);

    useEffect(() => {
        if (isFlatListReady && gallery && gallery.length > 0) {
            flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
        }
    }, [isFlatListReady, initialIndex, gallery]);

    const handleMomentumScrollEnd = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.ceil(contentOffsetX / width);
        setCurrentIndex(newIndex);
    };

    const ZoomableImage = ({ imageUri }) => {
        const scale = useSharedValue(1);
        const focalX = useSharedValue(0);
        const focalY = useSharedValue(0);
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);
        const lastScale = useSharedValue(1);
        const lastTranslateX = useSharedValue(0);
        const lastTranslateY = useSharedValue(0);

        // Shared value for tracking scroll enabled state
        const isScrollEnabled = useSharedValue(true);

        // Safe function to update React state from worklet
        const updateScrollEnabled = (value) => {
            setScrollEnabled(value);
        };

        // Reset zoom when image changes
        useEffect(() => {
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            lastScale.value = 1;
            lastTranslateX.value = 0;
            lastTranslateY.value = 0;
            isScrollEnabled.value = true;
            updateScrollEnabled(true);
        }, [imageUri]);

        const onPinchGestureEvent = useAnimatedGestureHandler({
            onStart: (_, ctx) => {
                ctx.scale = lastScale.value;
            },
            onActive: (event, ctx) => {
                // Calculate new scale
                scale.value = Math.max(0.5, Math.min(ctx.scale * event.scale, 5));

                // Disable scroll while pinching
                if (scale.value > 1 && isScrollEnabled.value) {
                    isScrollEnabled.value = false;
                    runOnJS(updateScrollEnabled)(false);
                }
            },
            onEnd: () => {
                lastScale.value = scale.value;

                // Reset to normal if scale is close to 1
                if (scale.value < 1.1) {
                    scale.value = withTiming(1);
                    translateX.value = withTiming(0);
                    translateY.value = withTiming(0);
                    lastScale.value = 1;
                    lastTranslateX.value = 0;
                    lastTranslateY.value = 0;
                    isScrollEnabled.value = true;
                    runOnJS(updateScrollEnabled)(true);
                }
            },
        });

        const onPanGestureEvent = useAnimatedGestureHandler({
            onStart: (_, ctx) => {
                ctx.translateX = lastTranslateX.value;
                ctx.translateY = lastTranslateY.value;
            },
            onActive: (event, ctx) => {
                // Only allow panning when zoomed in
                if (scale.value > 1) {
                    // Calculate boundaries based on zoom level
                    const maxTransX = (scale.value * width - width) / 2;
                    const maxTransY = (scale.value * height - height) / 2;

                    // Apply translation within bounds
                    translateX.value = Math.min(maxTransX, Math.max(-maxTransX, ctx.translateX + event.translationX));
                    translateY.value = Math.min(maxTransY, Math.max(-maxTransY, ctx.translateY + event.translationY));
                }
            },
            onEnd: () => {
                lastTranslateX.value = translateX.value;
                lastTranslateY.value = translateY.value;
            },
        });

        const animatedImageStyle = useAnimatedStyle(() => {
            return {
                transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                    { scale: scale.value }
                ],
            };
        });

        const resetZoom = () => {
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            lastScale.value = 1;
            lastTranslateX.value = 0;
            lastTranslateY.value = 0;
            isScrollEnabled.value = true;
            updateScrollEnabled(true);
        };

        const zoomIn = () => {
            scale.value = withTiming(2.5);
            lastScale.value = 2.5;
            isScrollEnabled.value = false;
            updateScrollEnabled(false);
        };

        const handleSingleTap = () => {
            // Reset zoom and translation when tapped if already zoomed in
            if (scale.value > 1) {
                resetZoom();
            }
        };

        const handleDoubleTap = () => {
            // Toggle zoom on double tap
            if (scale.value === 1) {
                zoomIn();
            } else {
                resetZoom();
            }
        };

        // Timer for detecting single vs double tap
        const doubleTapRef = useRef(null);

        const handlePress = () => {
            if (doubleTapRef.current) {
                // Double tap detected
                clearTimeout(doubleTapRef.current);
                doubleTapRef.current = null;
                handleDoubleTap();
            } else {
                // Potential single tap - wait to see if double tap occurs
                doubleTapRef.current = setTimeout(() => {
                    doubleTapRef.current = null;
                    handleSingleTap();
                }, 300);
            }
        };

        return (
            <PanGestureHandler
                onGestureEvent={onPanGestureEvent}
                minDist={10}
                enabled={scale.value > 1}
            >
                <Animated.View style={styles.imageContainer}>
                    <PinchGestureHandler
                        onGestureEvent={onPinchGestureEvent}
                    >
                        <Animated.View style={styles.imageContainer}>
                            <Pressable onPress={handlePress}>
                                <Animated.Image
                                    source={{ uri: imageUri }}
                                    style={[styles.image, animatedImageStyle]}
                                    resizeMode="contain"
                                />
                            </Pressable>
                        </Animated.View>
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>
        );
    };

    const renderImageItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <ZoomableImage imageUri={`${baseURL}/uploads/${item.image}`} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Animated.FlatList
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
                scrollEnabled={scrollEnabled}
            />
            <View style={styles.overlay}>
                <Text style={styles.indexText}>{currentIndex + 1} / {gallery.length}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
    overlay: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderRadius: 5,
    },
    indexText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ImageViewerForSchool;