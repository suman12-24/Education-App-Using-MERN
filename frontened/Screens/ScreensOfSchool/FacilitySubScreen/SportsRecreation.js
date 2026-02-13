import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import Feather from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
const facilities = [
  {
    id: '1',
    title: 'Basketball Court',
    description: "State-of-the-art basketball courts for competitive and casual games.",
    image: require('../../../FacilitiesImage/BasketBall.png'),
    disabled: false
  },
  {
    id: '2',
    title: 'Swimming Pool',
    description: 'Olympic-sized swimming pool with modern amenities.',
    image: require('../../../FacilitiesImage/swimmingpool.jpg'),
    disabled: false
  },
  {
    id: '3',
    title: 'Tennis Court',
    description: 'Top-quality tennis courts with proper lighting for night matches.',
    image: require('../../../FacilitiesImage/tenniscourt.jpeg'),
    disabled: false
  },
  {
    id: '4',
    title: 'Fitness Center',
    description: 'A fully equipped fitness center with various workout options.',
    image: require('../../../FacilitiesImage/fitnesscenter.jpeg'),
    disabled: false
  },
];

const SportsRecreation = () => {
  const [facilityData, setFacilityData] = useState(facilities);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [introductionText, setIntroductionText] = useState();
  const [editIntroductionText, setEditIntroductionText] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [animations] = useState(facilities.map(() => new Animated.Value(Dimensions.get('window').height)));
  const { email } = useSelector((state) => state.auth);
  const [rerender, setRerender] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 1600,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  }, [animations]);

  const toggleExpandCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = (facility) => {
    setEditIntroductionText(false);
    setSelectedFacility(facility);
    setNewDescription(facility.description);
    setModalVisible(true);
  };

  const editIntroduction = () => {
    setEditIntroductionText(true);
    setModalVisible(true);
  }

  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closeMenu = () => {
    setMenuVisible({});
  };

  const handleIntroductionText = async () => {
    try {
      const payLoad = {
        loginEmail: email,
        facilityName: 'SportsAndRecreation',
        introduction: introductionText
      }
      const response = await axiosConfiguration.post('/school/update-facility-introduction', payLoad);
      if (response.status == 200) {
        //console.log('Facility data updated successfully on the server.');
        Alert.alert('Success', 'Facility data updated successfully on the server.');
      }
      else {
        console.error('Failed to update facility data on the server.');
      }
    } catch (error) {
      console.error('Error saving facility data to the server:', error);
    } finally {
      setModalVisible(false);
      setEditIntroductionText(false);
      setRerender(!rerender);
    }
  }

  const saveDescription = async () => {
    try {
      const updatedData = facilityData.map((item) =>
        item.id === selectedFacility.id ? { ...item, description: newDescription } : item
      );
      setFacilityData(updatedData);
      const payLoad = {
        loginEmail: email,
        facilityName: 'SportsAndRecreation',
        fields: updatedData
      }
      const response = await axiosConfiguration.post('/school/add-Fields-to-facility', payLoad);

      if (response.status === 200) {
        //    console.log('Facility data updated successfully on the server.');
        Alert.alert('Success', 'Facility data updated successfully on the server.');
      } else {
        console.error('Failed to update facility data on the server.');
      }
    } catch (error) {
      console.error('Error saving facility data to the server:', error);
    } finally {
      setModalVisible(false);
      setRerender(!rerender);
    }
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const payLoad = {
          loginEmail: email,
          facilityName: 'SportsAndRecreation',
        };
        const response = await axiosConfiguration.post('/school/fetch-facility-by-email-and-name', payLoad);
        setIntroductionText(response?.data?.facility[0]?.introduction);
        if (response?.data?.facility[0].fields.length != 0) {
          setFacilityData(response?.data?.facility[0]?.fields);
        }
        else {
          setFacilityData(facilities);
        }
      }
      catch (err) {
        setError('Failed to fetch facilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const disableFacility = async (facilityId) => {
    const updatedData = facilityData.map((item) =>
      item.id === facilityId ? { ...item, disabled: true } : item
    );
    const payLoad = {
      loginEmail: email,
      facilityName: 'SportsAndRecreation',
      fields: updatedData
    }
    const response = await axiosConfiguration.post('/school/add-Fields-to-facility', payLoad);
    setTimeout(() => setFacilityData(updatedData), 100);
  };

  const enableFacility = async (facilityId) => {
    const updatedData = facilityData.map((item) =>
      item.id === facilityId ? { ...item, disabled: false } : item
    );

    const payLoad = {
      loginEmail: email,
      facilityName: 'SportsAndRecreation',
      fields: updatedData
    }

    try {
      const response = await axiosConfiguration.post('/school/add-Fields-to-facility', payLoad);
      if (response.status === 200) {
        setFacilityData(updatedData);
      }
    } catch (error) {
      console.error('Error enabling facility:', error);
    }
  };

  const renderFacility = ({ item, index }) => {
    const isExpanded = expandedCards[item.id];
    const isMenuVisible = menuVisible[item.id];
    const isDisabled = item.disabled;

    return (
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ translateY: animations[index] }] }]}
      >
        <View
          style={[
            styles.card,

          ]}
        >
          <View style={styles.imageContainer}>
            <Image source={item.image} style={[styles.image, isDisabled && styles.disabledCard,
            { opacity: isDisabled ? 0.2 : 1 }]} />
          </View>
          <LinearGradient
            colors={['#ffffff', '#f7f7f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContent}
          >
            {isDisabled && (
              <View style={styles.enableButtonOverlay}>
                <TouchableOpacity
                  style={styles.enableButton}
                  onPress={() => enableFacility(item.id)}
                >
                  <Text style={styles.enableButtonText}>Enable</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignSelf: 'stretch'
            }}>
              <Text
                style={[
                  styles.cardTitle,
                  isDisabled && styles.disabledText,
                ]}
              >
                {item.title}
              </Text>
              <View>
                <TouchableOpacity onPress={() => toggleMenu(item.id)} style={styles.menuButton}>
                  <Feather name="more-vertical" size={15} color="#15161a" />
                </TouchableOpacity>
                {isMenuVisible && (
                  <View style={styles.menu}>
                    {!isDisabled ? (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            openModal(item);
                            setMenuVisible({});
                          }}
                          style={styles.menuOptionRow}
                        >
                          <Feather name="edit-2" size={16} color="#333" style={styles.menuIcon} />
                          <Text style={styles.menuOptionText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            disableFacility(item.id);
                            setMenuVisible({});
                          }}
                          style={styles.menuOptionRow}
                        >
                          <Feather name="slash" size={16} color="#333" style={styles.menuIcon} />
                          <Text style={styles.menuOptionText}>Disable</Text>
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </View>
                )}
              </View>
            </View>

            <Text
              style={[
                styles.cardDescription,
                isDisabled && styles.disabledText,
              ]}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {item.description}
            </Text>
            <TouchableOpacity onPress={() => toggleExpandCard(item.id)}>
              <Text style={[styles.cardFooterText, isDisabled && styles.disabledCard,
              { opacity: isDisabled ? 0.2 : 1 }]}>
                {isExpanded ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => closeMenu()}>
        <View style={styles.container}>
          <LinearGradient colors={['#fff', '#fff']} style={styles.heroSection}>
            <Text style={styles.heroTitle}>Explore Our Sports and Recreation</Text>
            <Text style={styles.heroSubtitle}>
              {introductionText}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => editIntroduction()}
              >
                <Feather name="edit" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <FlatList
            data={facilityData}
            renderItem={renderFacility}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />

          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {
                  editIntroduction ? 'Edit Explore Our Sports and Recreation' : `Edit ${selectedFacility?.title}`
                }
              </Text>
              <TextInput
                style={styles.input}
                value={editIntroductionText ? introductionText : newDescription}
                onChangeText={(text) => {
                  if (editIntroductionText) {
                    setIntroductionText(text.slice(0, 175));
                  } else {
                    setNewDescription(text);
                  }
                }}
                multiline
              />
              <LinearGradient
                colors={['#f2f2f2', '#d9d9d9', '#bfbfbf']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ borderRadius: 10 }}
              >
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editIntroductionText ? handleIntroductionText : saveDescription}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  heroSection: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#404040',
    textAlign: 'center'
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginTop: 10
  },
  list: { padding: 20 },
  cardWrapper: { marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: { height: 150, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  cardContent: {
    padding: 15,
    borderRadius: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333'
  },
  cardDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#737373',
    textAlign: 'justify'
  },
  cardFooterText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500'
  },
  editButton: { color: '#FF6347' },
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  modalTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 100
  },
  saveButton: {
    padding: 12,
    borderRadius: 10
  },
  saveButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  menuButton: {
    backgroundColor: '#e2e6e9',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  menu: {
    position: 'absolute',
    width: 100,
    backgroundColor: '#f9f9f9',
    padding: 5,
    right: 32,
    top: 0,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  menuOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 5,
  },
  menuIcon: {
    marginRight: 8,
  },
  menuOptionText: {
    fontSize: 15,
    color: '#333',
  },
  disabledCard: {
    opacity: 0.7,
  },
  disabledText: {
    color: '#999',
  },
  menuOptionText2: {
    fontSize: 15,
    color: 'red',
  },
  enableButtonOverlay: {
    position: 'absolute',
    top: '-150%',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  enableButton: {
    backgroundColor: '#0088cc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  enableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SportsRecreation;

