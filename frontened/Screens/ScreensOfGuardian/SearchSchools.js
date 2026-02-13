import React, { useState, useEffect, useCallback } from 'react';
import { TouchableWithoutFeedback, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image, Linking, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from './ComponentForGuardian/CustomButton ';
import GradientButton from './ComponentForGuardian/GradientButton';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import MasterLoginRegistrationModal from '../MasterLoginRegistrationModal';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// Filter options
const FILTERS = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'cbse', label: 'CBSE', icon: 'school' },
    { id: 'icse', label: 'ICSE', icon: 'school' },
    { id: 'pin', label: 'By PIN', icon: 'location' },
];

const SearchSchools = ({ navigation }) => {
    const { token } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [hasMoreData, setHasMoreData] = useState(true);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            // Reset page when query changes
            resetSearch();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch schools when filter or query changes
    useEffect(() => {
        if (activeFilter === 'all' && debouncedQuery.trim() === '') {
            fetchAllSchools();
        } else if (debouncedQuery.trim() !== '' || activeFilter !== 'all') {
            searchSchools();
        } else {
            setSchools([]);
            setHasMoreData(true);
        }
    }, [debouncedQuery, page, activeFilter]);

    // Reset search state
    const resetSearch = useCallback(() => {
        setPage(1);
        setSchools([]);
        setHasMoreData(true);
    }, []);

    // Fetch all schools when "All" filter is selected
    const fetchAllSchools = async () => {
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            const response = await axiosConfiguration.post(
                "/school/all-Schools-Search",
                { page, limit: 10 }
            );

            processSchoolsResponse(response.data);
        } catch (err) {
            handleSearchError(err);
        } finally {
            setLoading(false);
        }
    };

    // Search schools based on filters and query
    const searchSchools = async () => {
        // Don't send duplicate requests when loading more and there's no more data
        if (page > 1 && !hasMoreData) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            let queryParams = { page, limit: 10 };
            const query = debouncedQuery.trim().toLowerCase();

            // Apply search logic based on filters and queries
            if (activeFilter === 'cbse') {
                queryParams.affiliatedTo = 'CBSE';
                if (query) {
                    queryParams.name = query;
                }
            } else if (activeFilter === 'icse') {
                queryParams.affiliatedTo = 'ICSE';
                if (query) {
                    queryParams.name = query;
                }
            } else if (activeFilter === 'pin') {
                if (query && !isNaN(query)) {
                    queryParams.pin = query;
                } else if (query) {
                    setError('Please enter a valid PIN code');
                    setLoading(false);
                    return;
                } else {
                    setError('Please enter a PIN code');
                    setLoading(false);
                    return;
                }
            } else {
                // Default search behavior when no specific filter is active
                if (!isNaN(query)) {
                    queryParams.pin = query;
                } else if (query === 'cbse' || query === 'icse') {
                    queryParams.affiliatedTo = query.toUpperCase();
                } else if (query.includes("district") || query.length > 20) {
                    queryParams.district = query;
                } else if (query) {
                    queryParams.name = query;
                }
            }

            const response = await axiosConfiguration.post(
                "/school/all-Schools-Search",
                queryParams
            );

            processSchoolsResponse(response.data);
        } catch (err) {
            handleSearchError(err);
        } finally {
            setLoading(false);
        }
    };

    // Process API response
    const processSchoolsResponse = useCallback((data) => {
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

            // For pagination: append or replace based on page number
            if (page === 1) {
                setSchools(mappedSchools);
            } else {
                setSchools(prevSchools => [...prevSchools, ...mappedSchools]);
            }

            // Check if we have more data to load
            setHasMoreData(data.schools.length === 10 && page < Math.ceil(data.pagination.total / 10));
        } else {
            if (page === 1) {
                setSchools([]);
                setError('No schools found.');
                setHasMoreData(false);
            } else {
                // If we're loading more pages and no results, we've reached the end
                setHasMoreData(false);
            }
        }
    }, [page]);

    // Handle search errors
    const handleSearchError = useCallback((err) => {
        console.error('Error searching schools:', err);

        if (err.response && err.response.status === 404) {
            if (page === 1) {
                setSchools([]);
                setError('No schools found.');
            }
            setHasMoreData(false);
        } else {
            setError('Failed to search schools. Please try again later.');
        }
    }, [page]);

    // Load more schools when reaching end of list
    const loadMoreSchools = useCallback(() => {
        if (hasMoreData && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    }, [hasMoreData, loading]);

    // Navigation functions
    const navigateToSchoolDetails = useCallback((schoolId) => {
        if (token) {
            navigation.navigate('HomeStackNavigatior', {
                screen: 'SchoolDetailsScreen',
                params: { SchoolId: schoolId, source: "SearchSchool" }
            });
        } else {
            setIsModalVisible(true);
        }
    }, [token, navigation]);

    const navigateToCall = useCallback((phone) => {
        if (token) {
            Linking.openURL(`tel:${phone}`);
        } else {
            setIsModalVisible(true);
        }
    }, [token]);

    const navigateToWhatsApp = useCallback((phone) => {
        if (token) {
            Linking.openURL(`https://wa.me/${phone}`);
        } else {
            setIsModalVisible(true);
        }
    }, [token]);

    const toggleModal = useCallback(() => {
        setIsModalVisible(!isModalVisible);
    }, [isModalVisible]);

    // Handle filter selection
    const handleFilterPress = useCallback((filterId) => {
        setActiveFilter(filterId);
        resetSearch();
        // If PIN filter is selected, clear the search to let user enter PIN
        if (filterId === 'pin' && searchQuery !== '') {
            setSearchQuery('');
        }
    }, [resetSearch, searchQuery]);

    // Reset search
    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
        setSchools([]);
        setShowPlaceholder(true);
        resetSearch();
    }, [resetSearch]);

    // UI Components
    const EmptySearchState = useCallback(() => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="school-outline" size={80} color="#d3d3d3" />
            <Text style={styles.emptyStateTitle}>Find Your Dream School</Text>
            <Text style={styles.emptyStateDescription}>
                Search by name, district, pin code or affiliation (CBSE/ICSE)
            </Text>
        </View>
    ), []);

    const ListFooterComponent = useCallback(() => {
        if (loading && page > 1 && hasMoreData) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#6a5acd" />
                    <Text style={styles.footerText}>Loading more schools...</Text>
                </View>
            );
        } else if (!hasMoreData && schools.length > 0) {
            return <Text style={styles.endOfResultsText}>End of results</Text>;
        }
        return null;
    }, [loading, page, hasMoreData, schools.length]);

    const renderSchoolItem = useCallback(({ item }) => (
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

                        <View style={styles.addressContainer}>
                            <Ionicons name="location" size={16} color="#6a5acd" />
                            <Text style={styles.address} numberOfLines={2}>
                                {item.address}
                            </Text>
                        </View>

                        <View style={styles.buttonGroupContainer}>
                            <CustomButton
                                icon="whatsapp"
                                label="What's App"
                                color="#00b359"
                                onPress={() => navigateToWhatsApp(item.phone)}
                            />
                            <CustomButton
                                icon="phone"
                                label="Call"
                                color="#003399"
                                style={{ marginLeft: 4, borderColor: '#666666' }}
                                textStyle={{ fontSize: 14 }}
                                iconStyle={{ marginRight: 3 }}
                                onPress={() => navigateToCall(item.phone)}
                            />
                            <GradientButton
                                onPress={() => navigateToSchoolDetails(item.id)}
                                label="Details"
                                buttonStyle={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 6,
                                    borderRadius: 5,
                                    marginLeft: 5,
                                }}
                                textStyle={{ fontSize: 14, fontWeight: '700' }}
                            />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback>
    ), [navigateToSchoolDetails, navigateToWhatsApp, navigateToCall]);

    const renderFilterItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                activeFilter === item.id && styles.activeFilterChip
            ]}
            onPress={() => handleFilterPress(item.id)}
        >
            <Ionicons
                name={item.icon}
                size={14}
                color={activeFilter === item.id ? "#fff" : "#6a5acd"}
                style={styles.chipIcon}
            />
            <Text
                style={[
                    styles.filterChipText,
                    activeFilter === item.id && styles.activeFilterChipText
                ]}
            >
                {item.label}
            </Text>
        </TouchableOpacity>
    ), [activeFilter, handleFilterPress]);

    // Main component render
    return (
        <ImageBackground
            source={require('./Images/cardBKG2.png')}
            style={styles.backgroundImage}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(240,240,255,0.85)']}
                style={styles.container}
            >
                {/* Search bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={22} color="#6a5acd" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={activeFilter === 'pin'
                            ? "Enter PIN code..."
                            : "Search by School Name, District, or Affiliation..."}
                        placeholderTextColor={'#6a5acd'}
                        value={searchQuery}
                        keyboardType={activeFilter === 'pin' ? 'numeric' : 'default'}
                        onFocus={() => setShowPlaceholder(false)}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setShowPlaceholder(false);
                        }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={handleClearSearch}
                        >
                            <Ionicons name="close-circle" size={22} color="#6a5acd" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter chips */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Filter by:</Text>
                    <FlatList
                        horizontal
                        data={FILTERS}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipsScrollContainer}
                        renderItem={renderFilterItem}
                    />
                </View>

                {/* Loading indicator */}
                {loading && page === 1 && (
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
                {showPlaceholder && searchQuery === '' && !loading && schools.length === 0 && activeFilter !== 'pin' && (
                    <EmptySearchState />
                )}

                {/* School list */}
                <FlatList
                    data={schools}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderSchoolItem}
                    onEndReached={loadMoreSchools}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={ListFooterComponent}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                />

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
        marginBottom: 80
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
        marginBottom: 10,
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
        height: 60,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    clearButton: {
        padding: 5
    },
    // Filter styles
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginRight: 8,
    },
    chipsScrollContainer: {
        paddingRight: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6a5acd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    activeFilterChip: {
        backgroundColor: '#6a5acd',
    },
    chipIcon: {
        marginRight: 4,
    },
    filterChipText: {
        color: '#6a5acd',
        fontWeight: '600',
        fontSize: 13,
    },
    activeFilterChipText: {
        color: '#fff',
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
    buttonGroupContainer: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
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
    },
    endOfResultsText: {
        textAlign: 'center',
        color: '#888',
        padding: 10,
        fontSize: 14,
    }
});

export default SearchSchools;

