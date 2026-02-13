import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Pressable, StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useDerivedValue,
} from "react-native-reanimated";
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
import SchoolFeesStructure from '../Screens/ScreensOfSchool/SchoolFeesStructureForGurdian';
import AccountScreenForSchool from '../Screens/ScreensOfSchool/AccountScreenForSchool';
import Notifications from '../Screens/ScreensOfSchool/SchoolView';
import Membership from '../Screens/ScreensOfSchool/Membership';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AnimatedSvg = Animated.createAnimatedComponent(Svg);


const HomeStackNavigatior = () => {
    return (
        <Stack.Navigator>
            {/* Guardian Home pages */}
            <Stack.Screen
                name="HomeScreenforSchool"
                component={HomeScreenforSchool}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='AdmissionProcedurePage'
                component={AdmissionProcedurePage}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SchoolGalleryScreen"
                component={SchoolGalleryScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ContactDetailsScreen"
                component={ContactDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
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
            />
            <Stack.Screen
                name="EditSchoolContactInfo"
                component={EditSchoolContactInfo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditForSchoolAchievement"
                component={EditForSchoolAchievement}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ImageViewerForSchool"
                component={ImageViewerForSchool}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ViewAllSchoolAchievement"
                component={ViewAllSchoolAchievement}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SchoolFeesStructure"
                component={SchoolFeesStructure}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    )
}

const AccountStackNavigatior = () => {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name="AccountScreenForSchool"
                component={AccountScreenForSchool}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditScreenofGuardian"
                component={EditScreenofGuardian}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    )
}

const NotificationStackNavigatior = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const MemberShipStackNavigatior = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Membership"
                component={Membership}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>)
}


const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}
            // tabBar={(props) => <AnimatedTabBar {...props} />}
            tabBar={(props) => (
                <AnimatedTabBar
                    {...props}
                    navigation={props.navigation}
                    screenNavigations={{
                        HomeStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "HomeScreenforSchool" },
                        AccountStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "AccountScreenofGuardian" },
                        MenuStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "DemoMenu" },
                    }}
                />
            )}
        >
            <Tab.Screen
                name="HomeStackNavigatior"
                component={HomeStackNavigatior}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <Ionicons name="home" size={27} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/home.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <Ionicons name="home-outline" size={27} color="#666666" />
                        ),
                }}
            />
            <Tab.Screen
                name="AccountStackNavigatior"
                component={AccountStackNavigatior}
                options={{
                    tabBarLabel: "Account",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <Ionicons name="person-circle" size={29} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/account.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <Ionicons name="person-circle-outline" size={29} color="#666" />
                        ),
                }}
            />

            <Tab.Screen
                name="NotificationStackNavigatior"
                component={NotificationStackNavigatior}
                options={{
                    tabBarLabel: "Notifications",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <Ionicons name="notifications-sharp" size={27} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/account.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <Ionicons name="notifications-outline" size={27} color="#666" />
                        ),
                }}
            />

            <Tab.Screen
                name="MemberShipStackNavigatior"
                component={MemberShipStackNavigatior}
                options={{
                    tabBarLabel: "Membership",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <Ionicons name="diamond" size={27} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/account.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <Ionicons name="diamond-outline" size={27} color="#666666" />
                        ),
                }}
            />

        </Tab.Navigator>
    );
};

const AnimatedTabBar = ({
    state: { index: activeIndex, routes },
    navigation,
    descriptors,
}) => {
    const { bottom } = useSafeAreaInsets();
    const reducer = (state, action) => {
        return [...state, { x: action.x, index: action.index }];
    };

    const [layout, dispatch] = useReducer(reducer, []);
    const handleLayout = (event, index) => {
        dispatch({ x: event.nativeEvent.layout.x, index });
    };
    const xOffset = useDerivedValue(() => {
        if (layout.length !== routes.length) return 0;
        return [...layout].find(({ index }) => index === activeIndex).x - 25;
    }, [activeIndex, layout]);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withTiming(xOffset.value, { duration: 250 }) }],
        };
    });

    return (
        <View style={[styles.tabBar, { paddingBottom: bottom }]}>
            <LinearGradient
                colors={['#fff', '#fff']} // Two-shade gradient colors
                style={styles.gradient}
            >
                <AnimatedSvg
                    width={110}
                    height={60}
                    viewBox="0 0 110 60"
                    style={[styles.activeBackground, animatedStyles]}
                >
                    <Path
                        fill="#f2f2f2"
                        d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
                    />
                </AnimatedSvg>

                <View style={styles.tabBarContainer}>
                    {routes.map((route, index) => {
                        const active = index === activeIndex;
                        const { options } = descriptors[route.key];

                        return (
                            <TabBarComponent
                                key={route.key}
                                active={active}
                                options={options}
                                onLayout={(e) => handleLayout(e, index)}
                                onPress={() => { navigation.navigate(route.name) }}
                                tabBarName={route.name}
                                navigation={navigation}
                            />
                        );
                    })}
                </View>
            </LinearGradient>
        </View>
    );
};

const TabBarComponent = ({ active, options, onLayout, onPress, tabBarName, navigation }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (active && ref?.current) {
            ref.current.play();
        }
    }, [active]);

    const animatedComponentCircleStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withTiming(active ? 1 : 0, { duration: 250 }),
                },
            ],
        };
    });

    const animatedIconContainerStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active ? 1 : 0.5, { duration: 250 }),
        };
    });



    const handlePress = () => {
        if (onPress) {
            onPress(); // Standard tab navigation
        }

        if (tabBarName == 'HomeStackNavigatior') {
            navigation.navigate("HomeStackNavigatior", {
                screen: "HomeScreenforSchool",
            });

        }

        if (tabBarName == 'AccountStackNavigatior') {
            navigation.navigate("AccountStackNavigatior", {
                screen: "AccountScreenofGuardian",
            });
        }

        if (tabBarName == 'MenuStackNavigatior') {
            navigation.navigate("MenuStackNavigatior", {
                screen: "DemoMenu",
            });
        }

    };


    return (
        <Pressable onPress={handlePress} onLayout={onLayout} style={styles.component}>
            <Animated.View
                style={[styles.componentCircle, animatedComponentCircleStyles]}
            />
            <Animated.View
                style={[styles.iconContainer, animatedIconContainerStyles]}
            >
                {options.tabBarIcon ? options.tabBarIcon({ ref, focused: active }) : <Text>?</Text>}
            </Animated.View>
            {!active && (
                <Text style={styles.label}>{options.tabBarLabel}</Text>
            )}
        </Pressable>
    );
};

const SchoolAuthorityNavigation = () => {


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BottomTabNavigator"

                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default SchoolAuthorityNavigation;

const styles = StyleSheet.create({
    tabBar: {
        paddingTop: 10,
        backgroundColor: "#f2f2f2",
    },
    activeBackground: {
        position: "absolute",
    },
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 5,
    },
    component: {
        height: 61,
        width: 60,
        marginTop: -5,
    },
    componentCircle: {
        flex: 1,
        borderRadius: 40,
        backgroundColor: "#ff5c33",
    },
    iconContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 10,
        color: "#666666",
        marginTop: 5,
        fontWeight: '500',
        textAlign: "center",
    },
});
