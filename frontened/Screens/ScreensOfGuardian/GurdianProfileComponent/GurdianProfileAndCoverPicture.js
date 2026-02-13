import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { schoolDetails } from '../ComponentForGuardian/SchoolDetailsModal';
import { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

const GurdianProfileAndCoverPicture = ({ GurdianProfileAndCoverPicturePlayload }) => {
    // State variables
    const [coverPictureName, setCoverPictureName] = useState(null);
    const [profilePictureName, setProfilePictureName] = useState(null);
    const [isLoadingforCover, setIsLoadingforCover] = useState(false);
    const [isLoadingforAvatar, setIsLoadingforAvatar] = useState(false);

    // Dimensions and animation shared values
    const { width, height } = Dimensions.get('window');
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    // Effect for setting profile and cover picture
    useEffect(() => {
        if (GurdianProfileAndCoverPicturePlayload) {
            setCoverPictureName(GurdianProfileAndCoverPicturePlayload.coverPicture);
            setProfilePictureName(GurdianProfileAndCoverPicturePlayload.profilePicture);
        }
    }, [GurdianProfileAndCoverPicturePlayload]);

    // Focus effect for animation when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            scale.value = withTiming(1, { duration: 800 });
            opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });

            return () => {
                scale.value = 0;
                opacity.value = 0;
            };
        }, [])
    );

    // Animated styles for scaling effect
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View>
            <TouchableOpacity activeOpacity={1}>
                {/* Cover Image */}
                {isLoadingforCover ? (
                    <ActivityIndicator size="large" color="red" />
                ) : (
                    <ImageBackground
                        source={{
                            uri: coverPictureName
                                ? `${baseURL}/uploads/${coverPictureName}`
                                : schoolDetails.backgroundImageUrl
                        }}
                        style={{ height: height * 0.25, backgroundColor: '#fff' }}
                    >
                        {/* Avatar and Profile Picture */}
                        <View style={styles.headerContent}>
                            <Animated.View style={[animatedStyle, styles.avatarContainer]}>
                                <View style={styles.avatarWrapper}>
                                    <TouchableOpacity activeOpacity={1}>
                                        <View style={styles.avatarInnerWrapper}>
                                            {isLoadingforAvatar ? (
                                                <ActivityIndicator size="large" color="#000" />
                                            ) : (
                                                <Avatar.Image
                                                    size={width * 0.35}
                                                    source={{
                                                        uri: profilePictureName
                                                            ? `${baseURL}/uploads/${profilePictureName}`
                                                            : schoolDetails.imageUrl
                                                    }}
                                                    style={{ borderRadius: 0, backgroundColor: '#f2f2f2' }}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    </ImageBackground>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default GurdianProfileAndCoverPicture;

const styles = StyleSheet.create({
    headerContent: {
        marginTop: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    avatarContainer: {
        marginTop: '10%',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarInnerWrapper: {
        borderRadius: Dimensions.get('window').width * 0.38 / 2,
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});
