import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'

const { width } = Dimensions.get('window');

const DeleteConfirmation = ({ isVisible, onClose, onDelete }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 70,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 0,
                    friction: 7,
                    tension: 70,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [isVisible]);

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
                <Animated.View style={{
                    width: '85%',
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 16,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 8,
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                    borderLeftWidth: 5,
                    borderLeftColor: '#3D5AFE',
                }}>
                    <View style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: 'rgba(61, 90, 254, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}>
                        <Feather name="alert-triangle" size={36} color="#3D5AFE" />
                    </View>

                    <Text style={{
                        fontSize: width * 0.055,
                        fontWeight: 'bold',
                        marginBottom: 15,
                        color: '#333',
                        textAlign: 'center',
                    }}>
                        Are you sure you want to delete this achievement?
                    </Text>

                    <Text style={{
                        fontSize: width * 0.04,
                        color: '#666',
                        marginBottom: 20,
                        textAlign: 'center',
                    }}>
                        This action cannot be undone.
                    </Text>

                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: '48%',
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#3D5AFE',
                                padding: 12,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Feather name="x" size={20} color="#3D5AFE" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#3D5AFE', fontWeight: '500', fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={['#ff4757', '#e84118']}

                            style={{
                                width: '48%',
                                borderRadius: 8,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                                elevation: 4,
                            }}
                        >
                            <TouchableOpacity
                                onPress={onDelete}
                                style={{
                                    paddingVertical: 12,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                }}
                            >
                                <Feather name="trash-2" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Delete</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default DeleteConfirmation;

