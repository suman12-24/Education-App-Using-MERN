import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useReducer,
} from 'react';
import {Pressable, StyleSheet, View, Text, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {
  Path,
  Circle,
  Rect,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RNLinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  withSpring,
  interpolateColor,
  Easing,
  useSharedValue,
  withDelay,
  withSequence,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import MasterLoginRegistrationModal from '../Screens/MasterLoginRegistrationModal';
// Import screens (unchanged)
import EditScreenofGuardian from '../Screens/ScreensOfGuardian/EditScreenofGuardian';
import HomeScreenforSchool from '../Screens/ScreensOfSchool/HomeScreenforSchool';
import AdmissionProcedurePage from '../Screens/ScreensOfSchool/AdmissionProcedure';
import SchoolGalleryScreen from '../Screens/ScreensOfSchool/SchoolGalleryScreen';
import ContactDetailsScreen from '../Screens/ScreensOfSchool/ContactDetailsScreen';
import ArtsCreativity from '../Screens/ScreensOfSchool/FacilitySubScreen/ArtsCreativity';
import AcademicFacilities from '../Screens/ScreensOfSchool/FacilitySubScreen/AcademicFacilities';
import ConvenienceFacilities from '../Screens/ScreensOfSchool/FacilitySubScreen/ConvenienceFacilities';
import MentalSupport from '../Screens/ScreensOfSchool/FacilitySubScreen/MentalSupport';
import OutdoorLearning from '../Screens/ScreensOfSchool/FacilitySubScreen/OutdoorLearning';
import SafetyHygiene from '../Screens/ScreensOfSchool/FacilitySubScreen/SafetyHygiene';
import ScienceAndInnovation from '../Screens/ScreensOfSchool/FacilitySubScreen/ScienceInnovation';
import SportsRecreation from '../Screens/ScreensOfSchool/FacilitySubScreen/SportsRecreation';
import EditSchoolContactInfo from '../Screens/ScreensOfSchool/ComponentForSchool/EditSchoolContactInfo';
import EditForSchoolAchievement from '../Screens/ScreensOfSchool/EditForSchoolAcheivement';
import ImageViewerForSchool from '../Screens/ScreensOfSchool/ImageViewerForSchool';
import ViewAllSchoolAchievement from '../Screens/ScreensOfSchool/ViewAllSchoolAcheivement';
import AccountScreenForSchool from '../Screens/ScreensOfSchool/AccountScreenForSchool';
import Membership from '../Screens/ScreensOfSchool/Membership';
import SchoolFeesStructureForGuardian from '../Screens/ScreensOfSchool/SchoolFeesStructureForGurdian';
import FacilitiesScreen from '../Screens/ScreensOfSchool/FacilitiesScreen';
import SchoolView from '../Screens/ScreensOfSchool/SchoolView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Enhanced theme with deeper colors and stronger contrasts
const THEME = {
  primary: '#4240E5', // Deeper royal blue
  primaryDark: '#2929A3',
  primaryLight: '#8091F2',
  secondary: '#FF3080', // More vibrant pink
  accent: '#00E5E5', // Brighter teal
  neutral: '#F2F3FC',
  background: '#FFFFFF',
  surface: '#F8F9FF',
  shadow: 'rgba(74, 86, 226, 0.25)', // Stronger shadow
  glass: 'rgba(255, 255, 255, 0.92)',
  tab: {
    active: '#4240E5',
    activeBackground: 'rgba(66, 64, 229, 0.15)', // Slightly more opaque
    inactive: '#464f6d',
    background: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

// Memoized stack navigators for better performance
const HomeStackNavigator = memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreenforSchool"
        component={HomeScreenforSchool}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AdmissionProcedurePage"
        component={AdmissionProcedurePage}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
                name="SchoolGalleryScreen"
                component={SchoolGalleryScreen}
                options={{ headerShown: false }}
            /> */}
      {/* <Stack.Screen
                name="ContactDetailsScreen"
                component={ContactDetailsScreen}
                options={{ headerShown: false }}
            /> */}
      {/* <Stack.Screen
                name="ArtsCreativity"
                component={ArtsCreativity}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AcademicFacilities"
                component={AcademicFacilities}
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
            /> */}
      {/* <Stack.Screen
                name="EditSchoolContactInfo"
                component={EditSchoolContactInfo}
                options={{ headerShown: false }}
            /> */}
      <Stack.Screen
        name="EditForSchoolAchievement"
        component={EditForSchoolAchievement}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
                name="ImageViewerForSchool"
                component={ImageViewerForSchool}
                options={{ headerShown: false }}
            /> */}
      {/* <Stack.Screen
                name="ViewAllSchoolAchievement"
                component={ViewAllSchoolAchievement}
                options={{ headerShown: false }}
            /> */}
      {/* <Stack.Screen
                name="SchoolFeesStructureForGuardian"
                component={SchoolFeesStructureForGuardian}
                options={{ headerShown: false }}
            /> */}
    </Stack.Navigator>
  );
});

const AccountStackNavigator = memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountScreenForSchool"
        component={AccountScreenForSchool}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditScreenofGuardian"
        component={EditScreenofGuardian}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
});

const SchoolViewStackNavigator = memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SchoolView"
        component={SchoolView}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
});

const MembershipStackNavigator = memo(() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Membership"
        component={Membership}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
});

// Optimized TabBar with improved layout engine
const LuxuryTabBar = memo(
  ({state: {index: activeIndex, routes}, navigation, descriptors}) => {
    const {bottom} = useSafeAreaInsets();
    const reducer = (state, action) => {
      return [
        ...state,
        {x: action.x, width: action.width, index: action.index},
      ];
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
      const {x, width} = [...layout].find(
        ({index}) => index === activeIndex,
      ) || {x: 0, width: 0};
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
      <View style={[styles.tabBar, {paddingBottom: bottom + 10}]}>
        <RNLinearGradient
          colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.92)']}
          style={styles.glassBackground}>
          <AnimatedView style={[styles.blurOverlay]} />
          <View style={styles.tabBarContainer}>
            {/* Enhanced floating pill indicator */}
            <AnimatedView
              style={[styles.floatingPill, animatedIndicatorStyles]}
            />

            {routes.map((route, index) => {
              const active = index === activeIndex;
              const {options} = descriptors[route.key];

              return (
                <LuxuryTabItem
                  key={route.key}
                  active={active}
                  options={options}
                  onLayout={e => handleLayout(e, index)}
                  onPress={() => navigation.navigate(route.name)}
                  tabBarName={route.name}
                  navigation={navigation}
                  // badgeCount={route.name === 'NotificationStackNavigatior' ? 3 : 0} // Example for notification badge
                />
              );
            })}
          </View>
        </RNLinearGradient>
      </View>
    );
  },
);

// Optimized TabBar item component with memoization
const LuxuryTabItem = memo(
  ({
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
    const {token} = useSelector(state => state.auth);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const animatedValue = useSharedValue(0);

    const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
    };

    useEffect(() => {
      if (active) {
        // Create a pop effect when tab becomes active
        animatedValue.value = withSequence(
          withTiming(1.15, {duration: 150}),
          withTiming(1, {duration: 150}),
        );

        if (ref?.current) {
          ref.current.play?.();
        }
      } else {
        animatedValue.value = withTiming(0, {duration: 200});
      }
    }, [active]);

    const animatedIconStyle = useAnimatedStyle(() => {
      const scale = interpolate(animatedValue.value, [0, 1], [1, 1.2]);

      return {
        transform: [{scale}],
        opacity: withTiming(active ? 1 : 0.85, {duration: 200}),
      };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(active ? 1 : 0.75, {duration: 200}),
        transform: [
          {
            translateY: withTiming(active ? 0 : 2, {duration: 200}),
          },
        ],
        fontWeight: active ? '600' : '400',
      };
    });

    const handlePress = useCallback(() => {
      if (tabBarName === 'AccountStackNavigatior' && !token) {
        setIsModalVisible(true);
        return;
      }

      if (onPress) {
        onPress();
      }

      if (tabBarName === 'HomeStackNavigatior') {
        navigation.navigate('HomeStackNavigatior', {
          screen: 'HomeScreenforSchool',
        });
      } else if (tabBarName === 'AccountStackNavigatior') {
        navigation.navigate('AccountStackNavigatior', {
          screen: 'AccountScreenForSchool',
        });
      } else if (tabBarName === 'NotificationStackNavigatior') {
        navigation.navigate('NotificationStackNavigatior', {
          screen: 'Notifications',
        });
      } else if (tabBarName === 'MemberShipStackNavigatior') {
        navigation.navigate('MemberShipStackNavigatior', {
          screen: 'Membership',
        });
      }
    }, [tabBarName, token, navigation, onPress]);

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
            options.tabBarIcon({ref, focused: active})
          ) : (
            <Text>?</Text>
          )}
        </Animated.View>

        <AnimatedText
          style={[
            styles.tabText,
            animatedTextStyle,
            {color: active ? THEME.tab.active : THEME.tab.inactive},
          ]}>
          {options.tabBarLabel}
        </AnimatedText>

        <MasterLoginRegistrationModal
          visible={isModalVisible}
          onClose={toggleModal}
          title="Custom Modal"
          bottomNavigationRoute={`${
            ('AccountStackNavigatior',
            {
              screen: 'AccountScreenofGuardian',
            })
          }`}
        />
      </Pressable>
    );
  },
);
// Enhanced Bottom Tab Navigator with improved UI
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => (
        <LuxuryTabBar
          {...props}
          navigation={props.navigation}
          screenNavigations={{
            HomeStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'HomeScreenforSchool',
            },
            AccountStackNavigator: {
              stackNavigation: props.navigation,
              initialRouteName: 'AccountScreenForSchool',
            },
            NotificationStackNavigatior: {
              stackNavigation: props.navigation,
              initialRouteName: 'Notifications',
            },
            MembershipStackNavigator: {
              stackNavigation: props.navigation,
              initialRouteName: 'Membership',
            },
          }}
        />
      )}>
      <Tab.Screen
        name="HomeStackNavigatior"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ref, focused}) =>
            focused ? (
              <MaterialCommunityIcons
                name="home-variant"
                size={26}
                color={THEME.tab.active}
              />
            ) : (
              <MaterialCommunityIcons
                name="home-variant-outline"
                size={24}
                color={THEME.tab.inactive}
              />
            ),
        }}
      />
      <Tab.Screen
        name="AccountStackNavigatior"
        component={AccountStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ref, focused}) =>
            focused ? (
              <Feather name="user" size={26} color={THEME.tab.active} />
            ) : (
              <Feather name="user" size={24} color={THEME.tab.inactive} />
            ),
        }}
      />
      <Tab.Screen
        name="SchoolViewStackNavigator"
        component={SchoolViewStackNavigator}
        options={{
          tabBarLabel: 'School View',

          tabBarIcon: ({ref, focused}) =>
            focused ? (
              <Ionicons name="eye" size={28} color={THEME.tab.active} />
            ) : (
              <Ionicons
                name="eye-outline"
                size={26}
                color={THEME.tab.inactive}
              />
            ),
        }}
      />
      <Tab.Screen
        name="MemberShipStackNavigatior"
        component={MembershipStackNavigator}
        options={{
          tabBarLabel: 'Subscriptions',
          tabBarIcon: ({ref, focused}) =>
            focused ? (
              <View style={{alignItems: 'center'}}>
                <MaterialCommunityIcons
                  name="credit-card-check"
                  size={26}
                  color={THEME.tab.active}
                />
              </View>
            ) : (
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={26}
                color={THEME.tab.inactive}
              /> // Changed inactive icon
            ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root navigation component
const SchoolAuthorityNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SchoolFeesStructureForGuardian"
        component={SchoolFeesStructureForGuardian}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ImageViewerForSchool"
        component={ImageViewerForSchool}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SchoolGalleryScreen"
        component={SchoolGalleryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ViewAllSchoolAchievement"
        component={ViewAllSchoolAchievement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ContactDetailsScreen"
        component={ContactDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArtsCreativity"
        component={ArtsCreativity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AcademicFacilities"
        component={AcademicFacilities}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ConvenienceFacilities"
        component={ConvenienceFacilities}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MentalSupport"
        component={MentalSupport}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OutdoorLearning"
        component={OutdoorLearning}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SafetyHygiene"
        component={SafetyHygiene}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ScienceInnovation"
        component={ScienceAndInnovation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SportsRecreation"
        component={SportsRecreation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditSchoolContactInfo"
        component={EditSchoolContactInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FacilitiesScreen"
        component={FacilitiesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default SchoolAuthorityNavigation;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 8,
    zIndex: 1000,
  },
  glassBackground: {
    borderRadius: 24, // More rounded corners
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10, // Enhanced elevation
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(12px)', // Enhanced blur
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 76, // Taller for more prominence
    paddingHorizontal: 12,
    position: 'relative',
    paddingTop: 7,
  },
  tabItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 12,
    borderRadius: 18, // More rounded corners
    marginHorizontal: 5,
    paddingBottom: 10,
    height: 68,
  },
  activeTabItem: {
    backgroundColor: THEME.tab.activeBackground,
    // Add subtle inner shadow
    shadowColor: THEME.primary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    // Add subtle glow effect
    shadowColor: THEME.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  floatingPill: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 5, // Slightly taller
    backgroundColor: THEME.primary,
    borderRadius: 3,
    shadowColor: THEME.primaryDark,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 11, // Slightly larger
    fontWeight: '800',
    marginTop: 3,
  },
  badgeContainer: {
    position: 'absolute',
    right: '28%',
    top: 6,
    backgroundColor: THEME.secondary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
