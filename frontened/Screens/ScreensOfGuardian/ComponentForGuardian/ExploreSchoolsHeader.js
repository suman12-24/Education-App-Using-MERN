import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';

const ExploreSchoolsHeader = ({ onViewPress }) => {
    return (
        <LinearGradient
            colors={['#e6ecff', '#e6ecff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <Animatable.View
                animation="fadeIn"
                duration={800}
                delay={300}
                style={styles.headerContainer}
            >
                <View style={styles.titleContainer}>
                    <Animatable.View
                        animation="slideInLeft"
                        duration={800}
                        delay={400}
                        style={styles.decorativeLine}
                    />
                    <Animatable.Text
                        animation="fadeInDown"
                        duration={1000}
                        delay={500}
                        style={styles.titleText}
                    >
                        Explore All Schools
                    </Animatable.Text>
                </View>

                <Animatable.View
                    animation="fadeInRight"
                    duration={800}
                    delay={600}
                >
                    <TouchableOpacity
                        style={styles.viewButton}
                        activeOpacity={0.7}
                        onPress={onViewPress}
                    >
                        <LinearGradient
                            colors={['#505ce2', '#3a47df']}
                            start={{ x: 0.5, y: 0 }} // Vertical gradient start
                            end={{ x: 0.5, y: 1 }}   // Vertical gradient end
                            style={styles.viewGradient}
                        >
                            <Text style={styles.viewText}>View All</Text>
                            <Animatable.View
                                animation="pulse"
                                iterationCount="infinite"
                                duration={1500}
                            >
                                <Feather
                                    name="arrow-right"
                                    size={16}
                                    color="#ffffff"
                                    style={styles.viewIcon}
                                />
                            </Animatable.View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>
            </Animatable.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        marginBottom: 10,
        borderRadius: 16,
        marginHorizontal: 6,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    decorativeLine: {
        width: 5,
        height: 30,
        backgroundColor: '#4a56e2',
        borderRadius: 3,
        marginRight: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#404040',
        letterSpacing: 0.3,
    },
    viewButton: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    viewGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 20,
    },
    viewText: {
        color: '#ffffff',
        fontWeight: '500',
        fontSize: 15,
    },
    viewIcon: {
        marginLeft: 2,
    },
});

export default ExploreSchoolsHeader;