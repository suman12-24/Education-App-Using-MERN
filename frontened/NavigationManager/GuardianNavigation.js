import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Pressable, StyleSheet, View, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNLinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSpring,
  useSharedValue,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import HomeScreenOfGuardian from '../Screens/ScreensOfGuardian/HomeScreenOfGuardian';
import SchoolDetailsScreen from '../Screens/ScreensOfGuardian/SchoolDetailsScreen';
import AccountScreenofGuardian from '../Screens/ScreensOfGuardian/AccountScreenofGuardian';
import EditScreenofGuardian from '../Screens/ScreensOfGuardian/EditScreenofGuardian';
import AcademicFacilities from '../Screens/ScreensOfGuardian/FacilitySubScreen/AcademicFacilities';
import ArtsCreativity from '../Screens/ScreensOfGuardian/FacilitySubScreen/ArtsCreativity';
import ConvenienceFacilities from '../Screens/ScreensOfGuardian/FacilitySubScreen/ConvenienceFacilities';
import MentalSupport from '../Screens/ScreensOfGuardian/FacilitySubScreen/MentalSupport';
import OutdoorLearning from '../Screens/ScreensOfGuardian/FacilitySubScreen/OutdoorLearning';
import SafetyHygiene from '../Screens/ScreensOfGuardian/FacilitySubScreen/SafetyHygiene';
import ScienceAndInnovation from '../Screens/ScreensOfGuardian/FacilitySubScreen/ScienceInnovation';
import SportsRecreation from '../Screens/ScreensOfGuardian/FacilitySubScreen/SportsRecreation';
import AllImagesScreen from '../Screens/ScreensOfGuardian/ComponentForGuardian/AllImageScreen';
import AdmissionEnquery from '../Screens/ScreensOfGuardian/AdmissionEnquery';
import AdmissionProcedurePage from '../Screens/ScreensOfGuardian/AdmissionProcedure';
import AllSecondarySchools from '../Screens/ScreensOfGuardian/AllSecondarySchools';
import { useSelector } from 'react-redux';
import MasterLoginRegistrationModal from '../Screens/MasterLoginRegistrationModal';
import ImageViewerForGurdian from '../Screens/ScreensOfGuardian/ImageViewerForGurdian';
import GurdianGalleryScreen from '../Screens/ScreensOfGuardian/GurdianGalleryScreen';
import GurdianViewAllAcheivement from '../Screens/ScreensOfGuardian/ComponentForGuardian/GurdianViewAllAcheivement';
import SearchSchools from '../Screens/ScreensOfGuardian/SearchSchools';
import FavoriteScreen from '../Screens/ScreensOfGuardian/FavoriteScreen';
import SchoolFeesStructureScreen from '../Screens/ScreensOfGuardian/SchoolFeesStructureScreen';
import FacilitiesScreen from '../Screens/ScreensOfGuardian/FacilitiesScreen';
import ContactDetails from '../Screens/ScreensOfGuardian/ContactDetails';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Premium theme colors
const THEME = {
  primary: '#4A56E2', // Modern royal blue
  primaryDark: '#313A94',
  primaryLight: '#8091F2',
  secondary: '#FF4B8A', // Vibrant pink
  accent: '#00DFDF', // Teal accent
  neutral: '#F2F3FC', // Very light purple/blue
  background: '#FFFFFF',
  surface: '#F8F9FF',
  shadow: 'rgba(74, 86, 226, 0.15)',
  glass: 'rgba(255, 255, 255, 0.9)',
  tab: {
    active: '#4A56E2',
    activeBackground: 'rgba(74, 86, 226, 0.12)',
    inactive: '#464f6d',
    background: '#FFFFFF',
  },
};

const HomeStackNavigatior = () => {
  return (
    <Stack.Navigator>
      {/* Guardian Home pages */}
      <Stack.Screen
        name="HomeScreenOfGuardian"
        component={HomeScreenOfGuardian}
        options={{ headerShown: false }}
      />
      {/* Other screens remain the same */}
      <Stack.Screen
        name="SchoolDetailsScreen"
        component={SchoolDetailsScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
                name="ImageViewerForGurdian"
                component={ImageViewerForGurdian}
                options={{ headerShown: false }}
            /> */}
      <Stack.Screen
        name="GurdianGalleryScreen"
        component={GurdianGalleryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GurdianViewAllAcheivement"
        component={GurdianViewAllAcheivement}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllImageScreen"
        component={AllImagesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdmissionEnquery"
        component={AdmissionEnquery}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdmissionProcedurePage"
        component={AdmissionProcedurePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AcademicFacilities"
        component={AcademicFacilities}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtsCreativity"
        component={ArtsCreativity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConvenienceFacilities"
        component={ConvenienceFacilities}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MentalSupport"
        component={MentalSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OutdoorLearning"
        component={OutdoorLearning}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SafetyHygiene"
        component={SafetyHygiene}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScienceInnovation"
        component={ScienceAndInnovation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SportsRecreation"
        component={SportsRecreation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllSecondarySchools"
        component={AllSecondarySchools}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
                name='SchoolFeesStructureScreen'
                component={SchoolFeesStructureScreen}
                options={{ headerShown: false }}
            /> */}
      {/* <Stack.Screen
                name='FacilitiesScreen'
                component={FacilitiesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='ContactDetails'
                component={ContactDetails}
                options={{ headerShown: false }}
            /> */}
    </Stack.Navigator>
  );
};

const AccountStackNavigatior = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountScreenofGuardian"
        component={AccountScreenofGuardian}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditScreenofGuardian"
        component={EditScreenofGuardian}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SearchStackNavigatior = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchSchools"
        component={SearchSchools}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const WhislistStackNavigatior = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const { token, favouriteSchools } = useSelector(state => state.auth);
  const favoriteCount = favouriteSchools?.length || 0;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => (
        <LuxuryTabBar
          {...props}
          navigation={props.navigation}
          favoriteCount={favoriteCount}
          screenNavigations={{
            HomeStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'HomeScreenOfGuardian',
            },
            AccountStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'AccountScreenofGuardian',
            },
            SearchStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'SearchSchools',
            },
            WhislistStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'FavoriteScreen',
            },
          }}
        />
      )}>
      <Tab.Screen
        name="HomeStackNavigatior"
        component={HomeStackNavigatior}
        options={{
          tabBarLabel: 'Home',

          tabBarIcon: ({ ref, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="home-variant"
                size={24}
                color={THEME.tab.active}
              />
            ) : (
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={22}
                color={THEME.tab.inactive}
              />
            ),
        }}
      />
      <Tab.Screen
        name="SearchStackNavigatior"
        component={SearchStackNavigatior}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ ref, focused }) =>
            focused ? (
              <Feather name="search" size={24} color={THEME.tab.active} />
            ) : (
              <Feather name="search" size={22} color={THEME.tab.inactive} />
            ),
        }}
      />
      <Tab.Screen
        name="WhislistStackNavigatior"
        component={WhislistStackNavigatior}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ ref, focused }) =>
            focused ? (
              <AntDesign name="heart" size={24} color={THEME.tab.active} />
            ) : (
              <AntDesign name="hearto" size={22} color={THEME.tab.inactive} />
            ),
        }}
      />
      <Tab.Screen
        name="AccountStackNavigatior"
        component={token ? AccountStackNavigatior : () => { }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ ref, focused }) =>
            focused ? (
              <Feather name="user" size={24} color={THEME.tab.active} />
            ) : (
              <Feather name="user" size={22} color={THEME.tab.inactive} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const LuxuryTabBar = ({
  state: { index: activeIndex, routes },
  navigation,
  descriptors,
  favoriteCount,
}) => {
  const { bottom } = useSafeAreaInsets();
  const reducer = (state, action) => {
    return [...state, { x: action.x, width: action.width, index: action.index }];
  };

  const [layout, dispatch] = useReducer(reducer, []);

  const handleLayout = (event, index) => {
    dispatch({
      x: event.nativeEvent.layout.x,
      width: event.nativeEvent.layout.width,
      index,
    });
  };

  const xOffset = useDerivedValue(() => {
    if (layout.length !== routes.length) return 0;
    const { x, width } = [...layout].find(({ index }) => index === activeIndex) || {
      x: 0,
      width: 0,
    };
    return x + width / 2 - 25; // Center the indicator
  }, [activeIndex, layout]);

  const animatedIndicatorStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(xOffset.value, {
            damping: 18,
            stiffness: 90,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  return (
    <View style={[styles.tabBar, { paddingBottom: bottom + 10 }]}>
      {/* Glass effect background */}
      <RNLinearGradient
        colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.92)']}
        style={styles.glassBackground}>
        <AnimatedView style={[styles.blurOverlay]} />

        <View style={styles.tabBarContainer}>
          {/* Luxury pill indicator */}
          <AnimatedView
            style={[styles.floatingPill, animatedIndicatorStyles]}
          />

          {routes.map((route, index) => {
            const active = index === activeIndex;
            const { options } = descriptors[route.key];
            const isWhislistTab = route.name === 'WhislistStackNavigatior';
            const showBadge = isWhislistTab && favoriteCount > 0;

            return (
              <LuxuryTabItem
                key={route.key}
                active={active}
                options={options}
                onLayout={e => handleLayout(e, index)}
                onPress={() => navigation.navigate(route.name)}
                tabBarName={route.name}
                navigation={navigation}
                showBadge={showBadge}
                badgeCount={favoriteCount}
              />
            );
          })}
        </View>
      </RNLinearGradient>
    </View>
  );
};

const LuxuryTabItem = ({
  active,
  options,
  onLayout,
  onPress,
  tabBarName,
  navigation,
  showBadge = false,
  badgeCount = 0,
}) => {
  const ref = useRef(null);
  const { token } = useSelector(state => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const animatedValue = useSharedValue(0);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (active) {
      // Create a pop effect when tab becomes active
      animatedValue.value = withSequence(
        withTiming(1.15, { duration: 150 }),
        withTiming(1, { duration: 150 }),
      );

      if (ref?.current) {
        ref.current.play?.();
      }
    } else {
      animatedValue.value = withTiming(0, { duration: 200 });
    }
  }, [active]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(animatedValue.value, [0, 1], [1, 1.2]);

    return {
      transform: [{ scale }],
      opacity: withTiming(active ? 1 : 0.85, { duration: 200 }),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.75, { duration: 200 }),
      transform: [
        {
          translateY: withTiming(active ? 0 : 2, { duration: 200 }),
        },
      ],
      fontWeight: active ? '600' : '400',
    };
  });

  const handlePress = () => {
    if (tabBarName === 'AccountStackNavigatior' && !token) {
      setIsModalVisible(true);
      return;
    }

    if (onPress) {
      onPress();
    }

    if (tabBarName === 'HomeStackNavigatior') {
      navigation.navigate('HomeStackNavigatior', {
        screen: 'HomeScreenOfGuardian',
      });
    } else if (tabBarName === 'AccountStackNavigatior') {
      navigation.navigate('AccountStackNavigatior', {
        screen: 'AccountScreenofGuardian',
      });
    } else if (tabBarName === 'WhislistStackNavigatior') {
      navigation.navigate('WhislistStackNavigatior', {
        screen: 'FavoriteScreen',
      });
    } else if (tabBarName === 'SearchStackNavigatior') {
      navigation.navigate('SearchStackNavigatior', {
        screen: 'SearchSchools',
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLayout={onLayout}
      style={[styles.tabItemContainer, active && styles.activeTabItem]}>
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}

      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        {options.tabBarIcon ? (
          options.tabBarIcon({ ref, focused: active })
        ) : (
          <Text>?</Text>
        )}
      </Animated.View>

      <AnimatedText
        style={[
          styles.tabText,
          animatedTextStyle,
          { color: active ? THEME.tab.active : THEME.tab.inactive },
        ]}>
        {options.tabBarLabel}
      </AnimatedText>

      <MasterLoginRegistrationModal
        visible={isModalVisible}
        onClose={toggleModal}
        title="Custom Modal"
        bottomNavigationRoute={`${('AccountStackNavigatior',
          {
            screen: 'AccountScreenofGuardian',
          })
          }`}
      />
    </Pressable>
  );
};

const GuardianNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageViewerForGurdian"
        component={ImageViewerForGurdian}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FacilitiesScreen"
        component={FacilitiesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactDetails"
        component={ContactDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SchoolFeesStructureScreen"
        component={SchoolFeesStructureScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default GuardianNavigation;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 5,
  },
  glassBackground: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderColor: 'rgba(240, 240, 255, 0.8)',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 10,
    position: 'relative',
    paddingTop: 5,
  },
  tabItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 4,
    paddingBottom: 10,
    height: 65,
  },
  activeTabItem: {
    backgroundColor: THEME.tab.activeBackground,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  floatingPill: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 4,
    backgroundColor: THEME.tab.active,
    borderRadius: 2,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    right: '30%',
    top: 8,
    backgroundColor: THEME.secondary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
