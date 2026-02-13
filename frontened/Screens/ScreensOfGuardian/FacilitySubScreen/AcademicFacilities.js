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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';


const AcademicFacilities = ({ route }) => {
  const { facility, facilityName } = route?.params;
  const facilities = facility?.fields;
  const introduction = facility?.introduction;
  const [facilityData, setFacilityData] = useState(facilities);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [introductionText, setIntroductionText] = useState();
  const [editIntroductionText, setEditIntroductionText] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [animations] = useState(facilities.map(() => new Animated.Value(Dimensions.get('window').height)));
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 1500,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, [animations]);

  const toggleExpandCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const editIntroduction = () => {
    setEditIntroductionText(true);
    setModalVisible(true);
  }

  const closeMenu = () => {
    setMenuVisible({});
  };

  const renderFacility = ({ item, index }) => {
    const isExpanded = expandedCards[item.id];
    const isMenuVisible = menuVisible[item.id];
    const isDisabled = item.disabled;

    return (
      <>
        {
          !isDisabled &&
          <Animated.View
            style={[styles.cardWrapper, { transform: [{ translateY: animations[index] }] }]}
          >
            <View
              style={[
                styles.card,

              ]}
            >
              <View style={styles.imageContainer}>
                <Image source={item.image} style={[styles.image
                ]} />
              </View>
              <LinearGradient
                colors={['#ffffff', '#f7f7f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardContent}
              >

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
        }
      </>
    );
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => closeMenu()}>
        <View style={styles.container}>
          <LinearGradient colors={['#fff', '#fff']} style={styles.heroSection}>
            <Text style={styles.heroTitle}>Explore Our Academic Facilities</Text>
            <Text style={styles.heroSubtitle}>
              {introduction}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
            style={styles.modalContainer}>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {
                  editIntroduction ? 'Edit Explore Our Academic Facilities' : `Edit ${selectedFacility?.title}`
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
  cardWrapper:
  {
    marginBottom: 20
  },
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
  imageContainer:
  {
    height: 150,
    overflow: 'hidden'
  },
  image:
  {
    width: '100%',
    height: '100%'

  },
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

  disabledCard: {
    opacity: 0.7,
  },
  disabledText: {
    color: '#999',
  },

});

export default AcademicFacilities;


