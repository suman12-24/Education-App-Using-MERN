import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Pressable, StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue, } from "react-native-reanimated";
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
//import ImageViewer from '../Screens/ScreensOfGuardian/ComponentForGuardian/ImageViewer';
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const HomeStackNavigatior = () => {
    return (
        <Stack.Navigator>
            {/* Guardian Home pages */}
            <Stack.Screen
                name="HomeScreenOfGuardian"
                component={HomeScreenOfGuardian}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SchoolDetailsScreen"
                component={SchoolDetailsScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ImageViewerForGurdian"
                component={ImageViewerForGurdian}
                options={{ headerShown: false }}
            />

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
                name='AllImageScreen'
                component={AllImagesScreen}
                options={{ headerShown: false }}
            />

            {/* Admission Related Pages */}
            <Stack.Screen
                name='AdmissionEnquery'
                component={AdmissionEnquery}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='AdmissionProcedurePage'
                component={AdmissionProcedurePage}
                options={{ headerShown: false }}
            />

            {/* Facility Pages */}
            <Stack.Screen
                name='AcademicFacilities'
                component={AcademicFacilities}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='ArtsCreativity'
                component={ArtsCreativity}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='ConvenienceFacilities'
                component={ConvenienceFacilities}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='MentalSupport'
                component={MentalSupport}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='OutdoorLearning'
                component={OutdoorLearning}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='SafetyHygiene'
                component={SafetyHygiene}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='ScienceInnovation'
                component={ScienceAndInnovation}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='SportsRecreation'
                component={SportsRecreation}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='AllSecondarySchools'
                component={AllSecondarySchools}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='SchoolFeesStructureScreen'
                component={SchoolFeesStructureScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

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
    )
}

const SearchStackNavigatior = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SearchSchools"
                component={SearchSchools}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    )
}

const WhislistStackNavigatior = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FavoriteScreen"
                component={FavoriteScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}

const BottomTabNavigator = () => {
    const { token, favouriteSchools } = useSelector((state) => state.auth);
    // Get wishlist/favorites count directly from auth slice
    const favoriteCount = favouriteSchools?.length || 0;
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}
            // tabBar={(props) => <AnimatedTabBar {...props} />}
            tabBar={(props) => (
                <AnimatedTabBar
                    {...props}
                    navigation={props.navigation}
                    favoriteCount={favoriteCount}
                    screenNavigations={{
                        HomeStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "HomeScreenOfGuardian" },
                        AccountStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "AccountScreenofGuardian" },
                        SearchStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "SearchSchools" },
                        WhislistStackNavigatior: { stackNavigation: props.navigation, initialRouteName: "FavoriteScreen" },
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
                component={token ? AccountStackNavigatior : () => { }}
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
                name="SearchStackNavigatior"
                component={SearchStackNavigatior}
                options={{
                    tabBarLabel: "Search",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <Ionicons name="search" size={29} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/account.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <Ionicons name="search-outline" size={29} color="#666" />
                        ),
                }}
            />

            <Tab.Screen
                name="WhislistStackNavigatior"
                component={WhislistStackNavigatior}
                options={{
                    tabBarLabel: "Favorites",
                    tabBarIcon: ({ ref, focused }) =>
                        focused ? (
                            <AntDesign name="heart" size={28} color="#fff" />
                            // <Lottie
                            //     ref={ref}
                            //     loop={true}
                            //     source={require("../assets/LottieAnimation/account.json")}
                            //     style={{ height: 48, width: 48 }}
                            // />
                        ) : (
                            <AntDesign name="hearto" size={28} color="#666666" />
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
    favoriteCount
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
                        const isWhislistTab = route.name === "WhislistStackNavigatior";
                        const showBadge = isWhislistTab && favoriteCount > 0;
                        return (
                            <TabBarComponent
                                key={route.key}
                                active={active}
                                options={options}
                                onLayout={(e) => handleLayout(e, index)}
                                onPress={() => {

                                    navigation.navigate(route.name)
                                }}
                                tabBarName={route.name}
                                navigation={navigation}
                                showBadge={showBadge}
                                badgeCount={favoriteCount}
                            />
                        );
                    })}
                </View>
            </LinearGradient>
        </View>
    );
};

const TabBarComponent = ({ active, options, onLayout, onPress, tabBarName, navigation, showBadge = false,
    badgeCount = 0 }) => {
    const ref = useRef(null);
    const { token } = useSelector((state) => state.auth);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
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
                screen: "HomeScreenOfGuardian",
            });

        }

        if (tabBarName == 'AccountStackNavigatior') {
            if (token) {
                navigation.navigate("AccountStackNavigatior", {
                    screen: "AccountScreenofGuardian",
                });
            } else {
                setIsModalVisible(true);
            }
        }

        if (tabBarName == 'WhislistStackNavigatior') {
            navigation.navigate("WhislistStackNavigatior", {
                screen: "FavoriteScreen",
            });
        }

        if (tabBarName == 'SearchStackNavigatior') {
            navigation.navigate("SearchStackNavigatior", {
                screen: "SearchSchools",
            });
        }

    };

    return (
        <Pressable onPress={handlePress} onLayout={onLayout} style={styles.component}>
            {
                showBadge && (
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}> {badgeCount > 99 ? '99+' : badgeCount
                        } </Text>
                    </View>
                )}
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

            <MasterLoginRegistrationModal
                visible={isModalVisible}
                onClose={toggleModal}
                title="Custom Modal"
                bottomNavigationRoute={`${"AccountStackNavigatior", {
                    screen: "AccountScreenofGuardian",
                }}`}
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
        </Stack.Navigator>
    );
};

export default GuardianNavigation;

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
        fontSize: 13,
        color: "#666666",
        marginTop: 5,
        fontWeight: '600',
        textAlign: "center",
    },
    badgeContainer: {
        position: "absolute",
        left: 45,
        top: 8,
        backgroundColor: "#ff3838", // Red color similar to Flipkart
        borderRadius: 11,
        width: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99,
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },

});

