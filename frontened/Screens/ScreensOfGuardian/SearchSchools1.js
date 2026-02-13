import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image, Linking, ActivityIndicator, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from './ComponentForGuardian/CustomButton ';
import GradientButton from './ComponentForGuardian/GradientButton';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import MasterLoginRegistrationModal from '../MasterLoginRegistrationModal';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const SearchSchools = ({ navigation }) => {

    const { token } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);


    useEffect(() => {
        if (debouncedQuery.trim() !== '') {
            searchSchools();
        } else {
            setSchools([]);
        }
    }, [debouncedQuery, page]);


    const searchSchools = async () => {
        if (debouncedQuery.trim() === '') {
            setSchools([]);
            return;
        }
        setLoading(true);
        setError('');

        try {
            let queryParams = { page, limit: 10 };
            const query = debouncedQuery.trim().toLowerCase();

            if (!isNaN(query)) {
                queryParams.pin = query;
            } else if (query === 'cbse' || query === 'icse') {
                queryParams.affiliatedTo = query.toUpperCase();
            } else if (query.includes("district") || query.length > 20) {
                queryParams.district = query;
            } else {
                queryParams.name = query;
            }

            const response = await axiosConfiguration.post(
                "/school/all-Schools-Search",
                queryParams
            );

            const data = response.data;

            if (data.schools && data.schools.length > 0) {
                const mappedSchools = data.schools.map((school) => {
                    const addressParts = [
                        school.reachUs?.address?.street,
                        school.reachUs?.address?.district,
                        school.reachUs?.address?.state,
                        school.reachUs?.address?.pin
                    ].filter((part) => part && part.trim() !== '');

                    let address = addressParts.join(', ') || 'Address not available';

                    // Add hyphen before the last six digits (postal code)
                    address = address.replace(/, (\d{6})$/, ' - $1');

                    return {
                        id: school._id,
                        name: school.name || 'Unnamed School',
                        image: `${baseURL}/uploads/${school.profilePicture?.image}`,
                        address,
                        phone: school.contactPersonPhone || 'N/A',
                        affiliatedTo: school.affiliatedTo || 'N/A',
                        rating: Math.floor(Math.random() * 5) + 1 // Simulated rating for UI demo
                    };
                });
                setSchools(mappedSchools);
                setTotalPages(Math.ceil(data.pagination.total / 10));
            } else {
                setSchools([]);
                setError('No schools found.');
            }
        } catch (err) {
            console.error('Error searching schools:', err);

            if (err.response && err.response.status === 404) {
                setSchools([]);
                setError('No schools found.');
            } else {
                setError('Failed to search schools. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadMoreSchools = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const navigateToSchoolDetails = (schoolId) => {
        if (token) {
            navigation.navigate('HomeStackNavigatior', {
                screen: 'SchoolDetailsScreen',
                params: schoolId  // Note: passing directly, not under another 'params' key
            });
        }
        else {
            setIsModalVisible(true);
        }
    };


    const navigateToCall = (phone) => {
        if (token) {
            Linking.openURL(`tel:${phone}`)
        }
        else {
            setIsModalVisible(true)
        }
    }

    const navigateToWhatsApp = (phone) => {
        if (token) {
            Linking.openURL(`https://wa.me/${phone}`)
        }
        else {
            setIsModalVisible(true)
        }
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // Generate stars based on rating
    const renderStars = (rating) => {
        return (
            <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? "star" : "star-outline"}
                        size={16}
                        color="#FFD700"
                        style={{ marginRight: 2 }}
                    />
                ))}
            </View>
        );
    };
    const EmptySearchState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="school-outline" size={80} color="#d3d3d3" />
            <Text style={styles.emptyStateTitle}>Find Your Dream School</Text>
            <Text style={styles.emptyStateDescription}>
                Search by name, district, pin code or affiliation (CBSE/ICSE)
            </Text>
        </View>
    );

    return (
        <ImageBackground
            source={require('./Images/cardBKG2.png')}
            style={styles.backgroundImage}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(240,240,255,0.85)']}
                style={styles.container}
            >
                {/* Search bar with animated effect */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={22} color="#6a5acd" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by School Name, District, Pin, or Affiliation..."
                        placeholderTextColor={'#6a5acd'}
                        value={searchQuery}
                        onFocus={() => setShowPlaceholder(false)}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setShowPlaceholder(false);
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setSearchQuery('');
                                setSchools([]);
                                setShowPlaceholder(true);
                            }}>
                            <Ionicons name="close-circle" size={22} color="#6a5acd" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Loading indicator */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6a5acd" />
                        <Text style={styles.loadingText}>Finding Schools...</Text>
                    </View>
                )}

                {/* Error display */}
                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={24} color="#ff6b6b" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {/* Show placeholder when no search */}
                {showPlaceholder && searchQuery === '' && !loading && schools.length === 0 && (
                    <EmptySearchState />
                )}

                {/* School list */}
                <FlatList
                    data={schools}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => navigateToSchoolDetails(item.id)}>
                            <LinearGradient
                                colors={['#ffffff', '#f0f8ff']}
                                style={styles.schoolCard}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardContent}>
                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.image}
                                            resizeMode='cover'
                                        />
                                        <View style={styles.affiliationBadge}>
                                            <Text style={styles.affiliationText}>
                                                {item.affiliatedTo}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsContainer}>
                                        <Text style={styles.schoolName}>
                                            {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                                        </Text>

                                        {/* {renderStars(item.rating)} */}

                                        <View style={styles.addressContainer}>
                                            <Ionicons name="location" size={16} color="#6a5acd" />
                                            <Text style={styles.address} numberOfLines={2}>
                                                {item.address}
                                            </Text>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row', marginTop: 5, justifyContent: 'center',
                                            alignContent: 'center', alignItems: 'center', alignSelf: 'center'
                                        }}>
                                            <CustomButton
                                                icon="whatsapp"
                                                label="What's App"
                                                color="#00b359"
                                                //onPress={() => Linking.openURL(`https://wa.me/${item.phone}`)}
                                                onPress={() => navigateToWhatsApp(item.phone)}
                                            />
                                            <CustomButton
                                                icon="phone"
                                                label="Call"
                                                color="#003399"
                                                style={{ marginLeft: 4, borderColor: '#666666' }}
                                                textStyle={{ fontSize: 14 }}
                                                iconStyle={{ marginRight: 3 }}
                                                // onPress={() => Linking.openURL(`tel:${item.phone}`)}
                                                onPress={() => navigateToCall(item.phone)}
                                            />
                                            <GradientButton
                                                onPress={() => navigateToSchoolDetails(item.id)}
                                                // onPress={() => navigation.navigate('SchoolDetailsScreen', item.id)}
                                                label="Details"
                                                buttonStyle={{
                                                    paddingVertical: 7,
                                                    paddingHorizontal: 6,
                                                    borderRadius: 5,
                                                    marginLeft: 5,
                                                }}
                                                textStyle={{ fontSize: 14, fontWeight: 'bold' }}
                                            />
                                        </View>
                                    </View>
                                </View>

                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    )}
                    onEndReached={loadMoreSchools}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                    (page < totalPages && !loading && schools.length > 0 ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color="#6a5acd" />
                            <Text style={styles.footerText}>Loading more schools...</Text>
                        </View>
                    ) : null)} />

                <MasterLoginRegistrationModal
                    visible={isModalVisible}
                    onClose={toggleModal}
                    title="Login Required"
                    navigationRoute="SchoolDetailsScreen"

                />
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#6a5acd',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    clearButton: {
        padding: 5
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        marginTop: width * 0.3,
        paddingHorizontal: 30,
    },

    emptyStateTitle: {
        fontSize: 23,
        fontWeight: '700',
        color: '#6a5acd',
        marginTop: 10,
        marginBottom: 10,
    },

    emptyStateDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },

    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6a5acd',
        fontWeight: '500',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff4f4',
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffcccc',
        marginVertical: 8,
    },
    errorText: {
        color: '#ff6b6b',
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
    },
    listContainer: {
        paddingBottom: 10,
    },
    schoolCard: {
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 5,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    affiliationBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(106, 90, 205, 0.85)',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderTopLeftRadius: 8,
    },

    affiliationText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },

    detailsContainer: {
        flex: 1,
        marginLeft: 8,
        justifyContent: 'space-between',
    },
    schoolName: {
        fontSize: 17,
        fontWeight: '800',
        color: '#333',
        marginBottom: 3,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    address: {
        color: '#555',
        fontSize: 14,
        flex: 1,
        marginLeft: 4,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 20,
        flex: 1,
        marginHorizontal: 2,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    callButton: {
        backgroundColor: '#4285F4',
    },
    detailsButton: {
        backgroundColor: '#6a5acd',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    footerLoader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    footerText: {
        marginLeft: 10,
        color: '#6a5acd',
    }
});

export default SearchSchools;

