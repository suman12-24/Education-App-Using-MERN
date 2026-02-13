import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, Alert, ActivityIndicator } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { schoolDetails } from '../ComponentForSchool/SchoolDetailsModal';
import axiosConfiguration, { baseURL } from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
//import Sound from 'react-native-sound'; // Import Sound


const SchoolProfileAndCoverPicture = ({ loginEmail }) => {
  const { width, height } = Dimensions.get('window');
  const email = loginEmail;
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [backgroundImage, setBackgroundImage] = useState(schoolDetails.backgroundImageUrl);
  const [coverPictureName, setCoverPictureName] = useState();
  const [profilePictureName, setProfilePictureName] = useState();
  const [avatarImage, setAvatarImage] = useState(schoolDetails.imageUrl);
  const [fetchSchoolDetails, setFetchSchoolDetails] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleForAvatar, setIsModalVisibleForAvatar] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [isLoadingforCover, setIsLoadingforCover] = useState(false);
  const [isLoadingforAvatar, setIsLoadingforAvatar] = useState(false);

  const borderWidth = useSharedValue(0);

  useEffect(() => {
    if (isModalVisible) {
      borderWidth.value = withTiming(1, { duration: 1000, easing: Easing.ease });

      // Set a timeout to make the border vanish after 2 seconds
      setTimeout(() => {
        borderWidth.value = withTiming(0, { duration: 1000, easing: Easing.ease });
      }, 1000);  // 2000 ms = 2 seconds delay
    } else {
      borderWidth.value = withTiming(0, { duration: 1000, easing: Easing.ease });
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isModalVisibleForAvatar) {
      borderWidth.value = withTiming(1, { duration: 1000, easing: Easing.ease });

      // Set a timeout to make the border vanish after 2 seconds
      setTimeout(() => {
        borderWidth.value = withTiming(0, { duration: 1000, easing: Easing.ease });
      }, 1000);  // 2000 ms = 2 seconds delay
    } else {
      borderWidth.value = withTiming(0, { duration: 1000, easing: Easing.ease });
    }
  }, [isModalVisibleForAvatar]);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    width: `${borderWidth.value * 70}%`,
    height: 1.5,
    backgroundColor: '#475c3d',
    alignSelf: 'center',
  }));

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await axiosConfiguration.post('/school/get-school-details', { email });
        const schoolDetails = response?.data?.schoolDetails;
        setFetchSchoolDetails(schoolDetails);

        // Set Cover Picture=================
        //if (schoolDetails?.coverPicture?.image && schoolDetails?.coverPicture?.isApproved) 
        if (schoolDetails?.coverPicture?.image) {
          setCoverPictureName(schoolDetails?.coverPicture?.image)
        }
        //====================================

        // Set Profile Picture=================
        //if (schoolDetails?.profilePicture?.image && schoolDetails?.coverPicture?.isApproved) 
        if (schoolDetails?.profilePicture?.image) {
          setProfilePictureName(schoolDetails?.profilePicture?.image)
        }
        //====================================


      } catch (error) {
        console.error('Failed to fetch school data:', error);
      }
    };

    if (email) {
      fetchSchoolData();
    }
   
  }, [email, backgroundImage, rerender]);

  React.useEffect(() => {
    scale.value = withTiming(1, { duration: 800 });
    opacity.value = withTiming(1, { duration: 800, easing: Easing.ease });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: withTiming(isModalVisible || isModalVisibleForAvatar ? 1 : 0, { duration: 300, easing: Easing.ease }) },
      { translateY: withTiming(isModalVisible || isModalVisibleForAvatar ? 0 : 100, { duration: 300, easing: Easing.ease }) },
    ],
  }));

  const checkPermission = async (permission) => {
    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      return true;
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    } else {
      Alert.alert(
        'Permission Denied',
        'Please enable permissions from the app settings to continue.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  const handleImageLibraryPermission = async () => {
    let permission;

    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13 and above
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        // Below Android 13
        permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    } else {
      // iOS permission
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    return checkPermission(permission);
  };

  const handleCameraPermission = async () => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    return checkPermission(permission);
  };

  const cropImage = async (image) => {
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: image,
        width: 1080, // Higher width for better quality
        height: 1080, // Higher height for better quality
        cropping: true,
        compressQuality: 100, // Ensure maximum quality after cropping

      });
      return croppedImage.path;
    } catch (error) {
      console.error('Error during cropping:', error);
      return null;
    }
  };

  const selectImage = async (setImage, uploadFunction) => {
    const hasPermission = await handleImageLibraryPermission();
    if (hasPermission) {
      launchImageLibrary({ mediaType: 'photo' }, async (response) => {
        if (response.assets && response.assets.length > 0) {
          const originalUri = response.assets[0].uri;
          if (!originalUri) {
            console.error("Invalid image URI");
            return;
          }
          const croppedUri = await cropImage(originalUri); // Crop the selected image
          if (croppedUri) {
            setImage(croppedUri); // Update the image locally
            if (uploadFunction) {
              await uploadFunction(croppedUri); // Upload the cropped image
            }
          }
        }
      });

    }
  };

  // Modified method for capturing an image using the camera
  const captureImage = async (setImage, endpoint, fieldName) => {
    const hasPermission = await handleCameraPermission();
    if (hasPermission) {
      launchCamera({ mediaType: 'photo', quality: 1 }, async (response) => {
        if (response.assets && response.assets.length > 0) {
          const originalUri = response.assets[0].uri;
          const croppedUri = await cropImage(originalUri); // Crop the captured image
          if (croppedUri) {
            setImage(croppedUri); // Update the image locally

            // Prepare the form data for upload
            const formData = new FormData();
            formData.append(fieldName, {
              uri: croppedUri,
              name: `image_${Date.now()}.jpg`, // Generate a unique name
              type: 'image/jpeg',
            });
            formData.append('loginEmail', loginEmail);

            try {
              const response = await axiosConfiguration.post(endpoint, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });

              if (response.data.success) {
             
                setRerender(!rerender);
              } else {
                console.error('Upload failed:', response.data);
                Alert.alert('Error', 'Failed to upload image. Please try again.');
              }
            } catch (error) {
              console.error('Error during upload:', error);
              Alert.alert('Error', 'An error occurred while uploading the image.');
            }
          }
        }
      });
    }
  };


  const deleteCoverPicture = async () => {

    try {
      const response = await axiosConfiguration.post('/school/delete-cover-picture', {
        loginEmail,
      });

      if (response.data.success) {
        setRerender(!rerender);
        setCoverPictureName();

        alert('Cover picture deleted successfully!');
        setCoverPictureName();
      } else {
        console.error('Failed to delete cover picture:', response.data);
        alert('Failed to delete cover picture. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting cover picture:', error);
      alert('An error occurred while deleting the cover picture.');
    }
  }

  const deleteProfilePicture = async () => {
    setIsLoadingforAvatar(true);
    try {
      const response = await axiosConfiguration.post('/school/delete-profile-picture', {
        loginEmail,
      });

      if (response.data.success) {
        setRerender(!rerender);
        setProfilePictureName();
       
        alert('Profile picture deleted successfully!');
        setProfilePictureName();
      } else {
        console.error('Failed to delete Profile picture:', response.data);
        alert('Failed to delete Profile picture. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting Profile picture:', error);
      alert('An error occurred while deleting the Profile picture.');
    }
    finally {
      setIsLoadingforAvatar(false);
    }
  }
  const uploadCoverPicture = async (imageUri) => {
    setIsLoadingforCover(true);
    try {
      const formData = new FormData();
      formData.append('loginEmail', loginEmail);
      formData.append('coverPicture', {
        uri: imageUri,
        name: 'coverPicture.jpg', // You can adjust the name or extension based on the file
        type: 'image/jpeg', // Adjust the MIME type as per your file
      });

      const response = await axiosConfiguration.post('/school/update-cover-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Background picture uploaded successfully.');
        setRerender(!rerender);
      } else {
        Alert.alert('Error', 'Failed to upload background picture.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An error occurred while uploading the picture.');
    }
    finally {
      setIsLoadingforCover(false);
    }
  };

  const uploadProfilePicture = async (imageUri) => {
    setIsLoadingforAvatar(true);
    try {
      const formData = new FormData();
      formData.append('loginEmail', loginEmail);
      formData.append('profilePicture', {
        uri: imageUri,
        name: 'profilePicture.jpg', // You can adjust the name or extension based on the file
        type: 'image/jpeg', // Adjust the MIME type as per your file
      });

    

      const response = await axiosConfiguration.post('/school/update-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     

      if (response.data.success) {
        Alert.alert('Success', 'Profile picture uploaded successfully.');
        setRerender(!rerender);
        //  playSound();
      } else {
        Alert.alert('Error', 'Failed to upload profile picture.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'An error occurred while uploading the picture.');
    } finally {
      setIsLoadingforAvatar(false);
    }
  };


  // const playSound = () => {
  //   const sound = new Sound(
  //     Platform.OS === 'android' ? 'sample.mp3' : 'sound',
  //     Sound.MAIN_BUNDLE,
  //     (error) => {
  //       if (error) {
  //         console.error('Failed to load sound', error);
  //         return;
  //       }
  //       // Play the sound once loaded
  //       sound.play((success) => {
  //         if (success) {
  //           console.log('Successfully finished playing');
  //         } else {
  //           console.error('Playback failed due to audio decoding errors');
  //         }
  //       });
  //     }
  //   );
  // };


  return (
    <View>
      <TouchableOpacity activeOpacity={1}>
        {isLoadingforCover ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <>
            <ImageBackground
              source={{ uri: coverPictureName ? `${baseURL}/uploads/${coverPictureName}` : schoolDetails.backgroundImageUrl }}
              style={[{ height: height * 0.25 }]}
            >

              <View style={styles.headerContent}>

                <Animated.View style={[animatedStyle, styles.avatarContainer]}>
                  <View style={styles.avatarWrapper}>

                    <TouchableOpacity activeOpacity={1}>
                      <View
                        style={{
                          borderRadius: (width * 0.38) / 2,
                          borderWidth: 4,
                          borderColor: '#fff',
                          alignItems: 'center',

                          justifyContent: 'center',
                          overflow: 'hidden',

                        }}
                      >

                        {isLoadingforAvatar ? (
                          <ActivityIndicator size="large" color="#000" />
                        ) : (
                          <Avatar.Image
                            size={width * 0.35}
                            source={{ uri: profilePictureName ? `${baseURL}/uploads/${profilePictureName}` : schoolDetails.imageUrl }}
                            style={{ borderRadius: 0 }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.pencilIconContainer}
                      onPress={() => setIsModalVisibleForAvatar(true)}
                    >

                      <MaterialIcons name="photo-camera" size={20} color="#15161a" />

                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
              <TouchableOpacity
                style={[styles.floatingButton, { bottom: height * 0.02, right: width * 0.05 }]}
                onPress={() => setIsModalVisible(true)}
              >
                <MaterialIcons name="photo-camera" size={20} color="#15161a" />
              </TouchableOpacity>
            </ImageBackground>
          </>
        )}
      </TouchableOpacity>

      {/* Background Modal */}

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <Animated.View style={[styles.modalOverlay, modalAnimatedStyle]}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Upload Cover Picture</Text>
              <Animated.View style={animatedBorderStyle} />
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setIsModalVisible(false);
                  captureImage(setBackgroundImage, '/school/update-cover-picture', 'coverPicture');
                }}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="photo-camera" size={25} color="#232429" />
                </View>
                <Text style={styles.modalText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setIsModalVisible(false);
                  selectImage(setBackgroundImage, uploadCoverPicture);
                }}

              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="photo-library" size={25} color="#232429" />
                </View>
                <Text style={styles.modalText}>Gallery</Text>
              </TouchableOpacity>
              {coverPictureName && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setIsModalVisible(false);
                    deleteCoverPicture();
                  }}
                >
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="delete" size={25} color="#232429" />
                  </View>
                  <Text style={styles.modalText}>Delete Picture</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Avatar Modal */}
      <Modal
        transparent={true}
        visible={isModalVisibleForAvatar}
        animationType="fade"
        onRequestClose={() => setIsModalVisibleForAvatar(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisibleForAvatar(false)}>
          <Animated.View style={[styles.modalOverlay, modalAnimatedStyle]}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Upload School Picture</Text>
              <Animated.View style={animatedBorderStyle} />
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setIsModalVisibleForAvatar(false);
                  captureImage(setAvatarImage, '/school/update-profile-picture', 'profilePicture');
                }}
              >
                <View style={styles.iconContainer}>

                  <MaterialIcons name="photo-camera" size={25} color="#232429" />
                </View>
                <Text style={styles.modalText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setIsModalVisibleForAvatar(false);
                  selectImage(setAvatarImage, uploadProfilePicture);
                }}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="photo-library" size={25} color="#232429" />
                </View>
                <Text style={styles.modalText}>Gallery</Text>
              </TouchableOpacity>

              {profilePictureName && (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setIsModalVisibleForAvatar(false);
                    deleteProfilePicture();
                  }}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="delete" size={25} color="232429" />
                  </View>
                  <Text style={styles.modalText}>Delete Picture</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SchoolProfileAndCoverPicture;

const styles = StyleSheet.create({
  headerContent: {
    marginTop: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  avatarContainer: {
    marginTop: '3%',
    marginLeft: '-3%'
  },
  avatarWrapper: {
    position: 'relative',
  },
  pencilIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#e2e6e9',
    borderWidth: 1.6,
    borderColor: '#fcffff',
    borderRadius: 20,
    padding: 7,
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#e2e6e9',
    borderWidth: 1.6,
    borderColor: '#fcffff',
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    backgroundColor: '#e4e5ea',
    borderRadius: 45 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#080808',
    marginBottom: 10,
    letterSpacing: 1,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 7,
    width: '100%',
  },
  modalText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
  },
});

// in this code , implement that when i upload the both profile and cover picture, then a sound will be played to
