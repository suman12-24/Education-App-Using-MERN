import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import CandidateDetails from './ComponentForGuardian/CandidateDetails';
import FatherDetails from './ComponentForGuardian/FatherDetails';
import MotherDetails from './ComponentForGuardian/MotherDetails';
import LinearGradient from 'react-native-linear-gradient';

const AdmissionEnquery = () => {
    const [currentStep, setCurrentStep] = useState(1); // Current step in the progress
    const totalSteps = 3; // Total steps in the form
    const CandidateDetailsRef = useRef(false);
    const FatherDetailsRef = useRef(false);
    const MotherDetailsRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for tracking submission
    const borderColor = useSharedValue('#ddd');
    const scale = useSharedValue(1);

    useEffect(() => {
        borderColor.value = withTiming(currentStep === 1 ? '#006699' : '#cccccc', {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
        });

        scale.value = withTiming(currentStep === totalSteps ? 1.2 : 1, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        });
    }, [currentStep]);

    const animatedBorderStyle = useAnimatedStyle(() => ({
        borderColor: borderColor.value,
        transform: [{ scale: scale.value }],
    }));

    const goToNextStep = () => {
        if (currentStep === 1) {
            const isValid = CandidateDetailsRef.current.validate();
            if (!isValid) return;
            const isEnquirySubmitted = CandidateDetailsRef.current.handleEnquiryFormSubmit();
            if (!isEnquirySubmitted) return;
        }
        if (currentStep === 2) {
            const isValid = FatherDetailsRef.current.validate();
            if (!isValid) return; // Prevent moving to the next step if validation fails
            const isFatherUpdateSuccess = FatherDetailsRef.current.handleSubmitFatherUpdate();
            if (!isFatherUpdateSuccess) return;
        }

        if (currentStep === 3) {
            // const isValid = MotherDetailsRef.current.validate();
            // if (!isValid) return; // Prevent moving to the next step if validation fails
            // const isMotherUpdateSuccess = MotherDetailsRef.current.handleSubmitMotherUpdate();
            // if (!isMotherUpdateSuccess) return;

            if (currentStep === 3) {
                Alert.alert(
                    "Final Step",
                    "This is the final step. If you submit, you cannot undo it again.",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "Submit",
                            onPress: () => {
                                const isValid = MotherDetailsRef.current.validate();
                                if (!isValid) return; // Prevent submission if validation fails

                                const isMotherUpdateSuccess = MotherDetailsRef.current.handleSubmitMotherUpdate();
                                if (!isMotherUpdateSuccess) return;

                                // If everything is valid, proceed with submission
                                setCurrentStep(currentStep + 1);
                            }
                        }
                    ]
                );
                return;
            }
        }

        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const goToPreviousStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderProgressBar = () => {
        const steps = ['Candidate\nDetails', 'Father\nDetails', 'Mother\nDetails'];

        return (
            <View style={styles.progressBarContainer}>
                <View style={styles.circularStepsContainer}>
                    {steps.map((step, index) => {
                        const isActive = currentStep - 1 === index;
                        const isCompleted = currentStep - 1 > index;

                        return (
                            <View key={index} style={styles.stepWrapper}>
                                <Animated.View
                                    style={[
                                        styles.stepCircle,
                                        animatedBorderStyle,
                                        isCompleted && styles.completedStepCircle,
                                        isActive && styles.activeStepCircle,
                                    ]}
                                >
                                    {isCompleted ? (
                                        <MaterialCommunityIcons name="check" size={20} color="#fff" />
                                    ) : (
                                        <Text style={[styles.stepText, isActive && styles.activeStepText]}>
                                            {index + 1}
                                        </Text>
                                    )}
                                </Animated.View>
                                <Text style={[styles.stepLabel, isActive && styles.activeStepLabel]}>{step}</Text>
                                {index < steps.length - 1 && (
                                    <Animated.View style={[styles.stepLine, isActive && styles.activeStepLine]} />
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={{ paddingLeft: 6, marginRight: 7, paddingTop: 5 }}>
                    {renderProgressBar()}

                    <View style={styles.form}>
                        {/* Render sections based on current step */}
                        {currentStep === 1 && <CandidateDetails ref={CandidateDetailsRef} />}
                        {currentStep === 2 && <FatherDetails ref={FatherDetailsRef} />}
                        {currentStep === 3 && <MotherDetails ref={MotherDetailsRef} />}

                        {/* Navigation Buttons */}
                        <View style={[styles.navigationButtons, currentStep === 1 && { flexDirection: 'row-reverse' }]}>
                            {currentStep > 1 && (
                                <LinearGradient
                                    colors={['#fff', '#f2f2f2', '#e6e6e6']}
                                    style={styles.button}
                                >
                                    <TouchableOpacity onPress={goToPreviousStep} >
                                        <Text style={[styles.buttonText, { color: '#404040' }]}>Previous</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            )}
                            {currentStep < totalSteps ? (
                                <LinearGradient
                                    colors={['#fff', '#f2f2f2', '#e6e6e6']}
                                    style={styles.button}
                                >
                                    <TouchableOpacity onPress={goToNextStep}>
                                        <Text style={[styles.buttonText, { color: '#006699' }]}>Next</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            ) : (
                                <TouchableOpacity onPress={goToNextStep} style={styles.button}>
                                    <Text style={[styles.buttonText, { color: '#ff6f61' }]}>Submit</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ height: 10 }}></View>
            </ScrollView>
        </>
    );
};

export default AdmissionEnquery;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', // Soft blue gradient for a school-like feel

    },
    progressBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingBottom: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 3,
    },
    circularStepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    stepWrapper: {
        alignItems: 'center',
        position: 'relative',
        flex: 1,
    },
    stepCircle: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    completedStepCircle: {
        backgroundColor: 'teal',
        borderColor: '#2a82db',
    },
    activeStepCircle: {
        backgroundColor: '#f2f2f2',
        borderColor: '#ff6f61',
    },
    stepText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    activeStepText: {
        color: '#006699',
    },
    stepLabel: {
        marginTop: 5,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        fontWeight: '500',
    },
    activeStepLabel: {
        color: '#2a82db',
        fontWeight: 'bold',
    },
    stepLine: {
        position: 'absolute',
        height: 2,
        width: '100%',
        backgroundColor: '#ddd',
        top: 25,
        zIndex: -1,
        left: 35,
        right: 25,
    },
    activeStepLine: {
        backgroundColor: '#006699',
        opacity: 0.7,
    },
    form: {
        paddingHorizontal: 5,

    },
    navigationButtons: {

        flexDirection: 'row', // default to row
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10
    },
    button: {
        marginRight: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18, // increase text size 
        color: '#fff', // default text color
        fontWeight: 'bold', // optional for emphasis
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a82db',
        padding: 10,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,

    },
    headerText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});

