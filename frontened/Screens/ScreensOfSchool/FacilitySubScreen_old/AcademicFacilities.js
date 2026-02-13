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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import axiosConfiguration from '../../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import Feather from 'react-native-vector-icons/Feather';
const facilities = [
  {
    id: '1',
    title: 'Library',
    description: "India, officially the Republic of India,[j][20] is a country in South Asia. It is the most populous country in the world and the seventh-largest by area. Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west;[k] China, Nepal, and Bhutan to the north; and Bangladesh and Myanmar to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; its Andaman and Nicobar Islands share a maritime border with Thailand, Myanmar, and Indonesia.",
    image: 'https://t4.ftcdn.net/jpg/00/54/46/75/360_F_54467511_n38t0PC0pLOkTn63fFv6k7EsmwfMRwf4.jpg',
  },
  {
    id: '2',
    title: 'Science Labs',
    description: 'Modern laboratories for physics, chemistry, and biology experiments.',
    image: 'https://thumbs.dreamstime.com/b/girl-scientist-apple-hand-cartoon-illustration-young-female-researcher-lab-coat-glasses-academic-scholar-science-education-cute-343933988.jpg',
  },
  {
    id: '3',
    title: 'Computer Labs',
    description: 'Indoor and outdoor facilities for a variety of sports and fitness activities.',
    image: 'https://img.freepik.com/premium-photo/create-image-schools-computer-lab-featuring-rows-computers-desks-students-worki_1305056-94169.jpg',
  },
  {
    id: '4',
    title: 'Language  Labs',
    description: 'Indoor and outdoor facilities for a variety of sports and fitness activities.',
    image: 'https://static.vecteezy.com/system/resources/previews/013/939/523/non_2x/happy-cute-children-studying-on-computer-at-table-vector.jpg',
  },
  {
    id: '5',
    title: 'Smart Classrooms',
    description: 'Indoor and outdoor facilities for a variety of sports and fitness activities.',
    image: 'https://thumbs.dreamstime.com/b/students-attentively-watching-presentation-smart-board-modern-classroom-showcasing-charts-diagrams-interactive-326649412.jpg',
  },
];

const AcademicFacilities = () => {
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
  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 1600,
        delay: index * 200, // Stagger the animation
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

  const handleIntroductionText = async () => {
    try {
      const payLoad = {
        loginEmail: email,
        facilityName: 'AcademicFacilities',
        introduction: introductionText
      }
      const response = await axiosConfiguration.post('/school/update-facility-introduction', payLoad);

      // Handle API response
      if (response.status === 200) {
        console.log('Facility data updated successfully on the server.');
      } else {
        console.error('Failed to update facility data on the server.');
      }
    } catch (error) {
      console.error('Error saving facility data to the server:', error);
    } finally {
      // Close the modal regardless of the API outcome      
      setModalVisible(false);
      setEditIntroductionText(false);
      setRerender(!rerender);
    }
  }

  const saveDescription = async () => {
    try {
      // Update the local state immediately
      const updatedData = facilityData.map((item) =>
        item.id === selectedFacility.id ? { ...item, description: newDescription } : item
      );
      setFacilityData(updatedData);
      const payLoad = {
        loginEmail: email,
        facilityName: 'AcademicFacilities',
        fields: updatedData
      }
      const response = await axiosConfiguration.post('/school/add-Fields-to-facility', payLoad);

      // Handle API response
      if (response.status === 200) {
        console.log('Facility data updated successfully on the server.');
      } else {
        console.error('Failed to update facility data on the server.');
      }
    } catch (error) {
      console.error('Error saving facility data to the server:', error);
    } finally {
      // Close the modal regardless of the API outcome      
      setModalVisible(false);
      setRerender(!rerender);
    }
  };


  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const payLoad = {
          loginEmail: email,
          facilityName: 'AcademicFacilities',
        };
        const response = await axiosConfiguration.post('/school/fetch-facility-by-email-and-name', payLoad);
        setIntroductionText(response?.data?.facility[0]?.introduction);
        if (response?.data?.facility[0].fields.length != 0) {
          setFacilityData(response?.data?.facility[0]?.fields);
        } else {
          setFacilityData(facilities);
        }
      } catch (err) {
        setError('Failed to fetch facilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);





  const renderFacility = ({ item, index }) => {
    const isExpanded = expandedCards[item.id];

    return (
      <Animated.View
        style={[styles.cardWrapper, { transform: [{ translateY: animations[index] }] }]}
      >
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
          <LinearGradient
            colors={['#ffffff', '#f7f7f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContent}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity
                onPress={() => openModal(item)}
              >
                <Feather name="edit" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <Text
              style={styles.cardDescription}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {item.description}
            </Text>
            <TouchableOpacity
              onPress={() => toggleExpandCard(item.id)}
            >
              <Text style={styles.cardFooterText}>
                {isExpanded ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

        </View >
      </Animated.View >
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#fff', '#fff']} style={styles.heroSection}>
        <Text style={styles.heroTitle}>Explore Our Academic Facilities</Text>
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
          <Text style={styles.modalTitle}>Edit {selectedFacility?.title}</Text>
          <TextInput
            style={styles.input}
            value={editIntroductionText ? introductionText : newDescription}
            // onChangeText={editIntroductionText ? setIntroductionText : setNewDescription}
            onChangeText={(text) => {
              if (editIntroductionText) {
                setIntroductionText(text.slice(0, 175)); // Restrict to 200 characters
              } else {
                setNewDescription(text); // No restriction for newDescription
              }
            }}
            multiline
          />
          <LinearGradient
            colors={['#f2f2f2', '#d9d9d9', '#bfbfbf']}
            // colors={['#4c669f', '#3b5998', '#192f6a']} // Replace with your gradient colors
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ borderRadius: 10 }}
          >
            <TouchableOpacity style={styles.saveButton} onPress={editIntroductionText ? handleIntroductionText : saveDescription}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>


        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  heroSection: {
    padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 25, elevation: 5, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#404040', textAlign: 'center' },
  heroSubtitle: { fontSize: 15, fontWeight: '600', color: '#666666', textAlign: 'center', marginTop: 10 },
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
  cardContent: { padding: 15, borderRadius: 15 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#333' },
  cardDescription: { fontSize: 13, fontWeight: '400', color: '#737373', textAlign: 'justify' },
  cardFooterText: { fontSize: 14, color: '#007BFF', fontWeight: '500' },
  editButton: { color: '#FF6347' },
  modalContainer: { justifyContent: 'flex-end', margin: 0 },
  modalContent: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  modalTitle: { fontSize: 20, color: 'black', fontWeight: 'bold', marginBottom: 15 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 20, textAlignVertical: 'top', minHeight: 100 },
  saveButton: { padding: 12, borderRadius: 10 },
  saveButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default AcademicFacilities;
