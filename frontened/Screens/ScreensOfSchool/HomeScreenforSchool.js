import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground, Dimensions, TouchableOpacity, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Gallery from './Gallery';
import SchoolAchievements from './SchoolAcheivement';
import AboutTextBubble from './ComponentForSchool/AboutTextBubble';
import SchoolFacilities from './SchoolFacilities';
import EditModalForSchoolName from './ComponentForSchool/EditModalForSchoolName';
import SchoolContactInfo from './ComponentForSchool/SchoolContactInfo';
import { useSelector } from 'react-redux';
import SchoolProfileAndCoverPicture from './SchoolHomeScreenComponents/SchoolProfileAndCoverPicture';
const HomeScreenforSchool = () => {
  const { width, height } = Dimensions.get('window');
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const { email, token } = useSelector((state) => state.auth);

  React.useEffect(() => {
    scale.value = withTiming(1, { duration: 800 });
    opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <SchoolProfileAndCoverPicture
          loginEmail={email}
        />
        <View style={styles.body}>
          <EditModalForSchoolName
            loginEmail={email}
          />
          <Gallery
            loginEmail={email}
          />

          <SchoolAchievements
            loginEmail={email}
          />
          <AboutTextBubble
            loginEmail={email}
          />
          <View style={{ height: height * .47, alignItems: 'flex-start', left: 8 }}>
            <SchoolFacilities />
          </View>
          <View>
            <SchoolContactInfo
              loginEmail={email}
            />
          </View>
          <BorderlessButton />
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreenforSchool;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
  body: {
    // marginTop: 50,
    marginTop: 40,
    paddingHorizontal: '1%',
  },
  facilitiesContainer: {
    marginTop: 20,
  },
  divider: {
    height: 2,              // Height of the divider
    backgroundColor: '#0099cc',  // Color of the divider
    marginVertical: 2,     // Space around the divider
    width: '65%',          // Full width
  },
});

