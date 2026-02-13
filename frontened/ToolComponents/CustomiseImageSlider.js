import { StyleSheet, View, FlatList, Image, Dimensions, TouchableOpacity, Animated, Text } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
const CustomiseImageSlider = ({ 
  imageArray, 
  autoPlay = true, 
  autoPlayInterval = 4000,
  showOverlayText = true,
}) => {
  const flatlistRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  
  // Enhanced data structure
  const carouselData = imageArray.map(item => ({
    ...item,
    title: item.title || "Beautiful Image",
    description: item.description || "Explore this amazing content"
  }));

  // Handle automatic scrolling
  useFocusEffect(
    React.useCallback(() => {
      let intervalId;
      if (autoPlay) {
        intervalId = setInterval(() => {
          if (activeIndex === carouselData.length - 1) {
            flatlistRef.current.scrollToIndex({
              index: 0,
              animated: true
            });
          } else {
            flatlistRef.current.scrollToIndex({
              index: activeIndex + 1,
              animated: true,
            });
          }
        }, autoPlayInterval);
      }
      
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [activeIndex, autoPlay, autoPlayInterval, carouselData.length])
  );

  // Handle Scroll
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  // Get Item layout for better performance
  const getItemLayout = (_, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  // Render individual slide
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slideContainer}>
        <Image 
          source={item?.imagePath} 
          style={styles.image}
        />
        
        {/* Gradient overlay for better text readability */}
        {showOverlayText && (
          <>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            <View style={styles.textContainer}>
              <Text style={styles.imageTitle}>{item.title}</Text>
              <Text style={styles.imageDescription}>{item.description}</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  // Animated dot indicators
  const renderDotIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {carouselData.map((_, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth
          ];
          
          // Animated width for active indicator
          const width = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });
          
          // Animated opacity for indicators
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                flatlistRef.current.scrollToIndex({
                  index: index,
                  animated: true
                });
              }}
            >
              <Animated.View 
                style={[
                  styles.dot,
                  { 
                    width, 
                    opacity,
                    backgroundColor: activeIndex === index ? '#ffffff' : 'rgba(255,255,255,0.5)' 
                  }
                ]} 
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Navigation buttons
  const renderNavButtons = () => {
    return (
      <>
        {activeIndex > 0 && (
          <TouchableOpacity 
            style={[styles.navButton, styles.leftButton]}
            onPress={() => {
              flatlistRef.current.scrollToIndex({
                index: activeIndex - 1,
                animated: true
              });
            }}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
        )}
        
        {activeIndex < carouselData.length - 1 && (
          <TouchableOpacity 
            style={[styles.navButton, styles.rightButton]}
            onPress={() => {
              flatlistRef.current.scrollToIndex({
                index: activeIndex + 1,
                animated: true
              });
            }}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={carouselData}
        renderItem={renderItem}
        ref={flatlistRef}
        keyExtractor={(item, index) => `slide-${index}`}
        getItemLayout={getItemLayout}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { 
            useNativeDriver: false,
            listener: handleScroll
          }
        )}
        decelerationRate="fast"
      />
      
      {renderDotIndicators()}
      {renderNavButtons()}
      
      {/* Current slide indicator */}
      <View style={styles.counterContainer}>
        <Text style={styles.counter}>
          {activeIndex + 1}/{carouselData.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    height: 220, // Increased height for better visibility
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  imageTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  imageDescription: {
    color: 'white',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  navButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  counterContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  counter: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default CustomiseImageSlider;