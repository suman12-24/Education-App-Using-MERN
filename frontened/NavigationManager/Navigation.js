// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import AnimatedSplashScreen from '../Screens/AnimatedSplashScreen';
import SchoolAuthorityNavigation from './SchoolAuthorityNavigation';
import GuardianNavigation from './GuardianNavigation';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const { token, role } = useSelector((state) => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="AnimatedSplashScreen"
                    component={AnimatedSplashScreen}
                />

                {/* Show main navigation based on role */}
                {role === 'School' && (
                    <Stack.Screen
                        name="SchoolAuthorityNavigation"
                        component={SchoolAuthorityNavigation}
                    />
                )}

                {role === 'Guardian' && (
                    <Stack.Screen
                        name="GuardianNavigation"
                        component={GuardianNavigation}
                    />
                )}

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
