import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import axiosConfiguration from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

// Create a separate animated card component to properly use hooks
const AnimatedViewerCard = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        delay: index * 120,
        useNativeDriver: true,
      })
    ]).start();
  }, [index]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a consistent color based on user name for avatar
  const getAvatarColor = (name) => {
    if (!name) return '#4240E5';
    const colors = [
      '#3498db', '#9b59b6', '#1abc9c', '#e74c3c',
      '#f39c12', '#2ecc71', '#16a085', '#8e44ad',
      '#2980b9', '#c0392b', '#d35400', '#27ae60'
    ];
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const avatarColor = getAvatarColor(item.userName);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateY }]
      }}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.notificationCard}>
          <View style={styles.leftContent}>
            <LinearGradient
              colors={[avatarColor, shadeColor(avatarColor, -20)]}
              style={styles.avatarContainer}
            >
              <Text style={styles.initials}>{getInitials(item.userName)}</Text>
            </LinearGradient>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={1}>{item.userName}</Text>

            <View style={styles.infoRow}>
              <Icon name="email" size={16} color="#5D5FEF" style={styles.infoIcon} />
              <Text style={styles.infoText} numberOfLines={1}>{item.userEmail}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="phone" size={16} color="#5D5FEF" style={styles.infoIcon} />
              <Text style={styles.infoText}>{item.userPhone}</Text>
            </View>

            <View style={styles.viewsContainer}>
              <View style={styles.viewCountBadge}>
                <Icon name="visibility" size={14} color="#FFFFFF" />
                <Text style={styles.viewCountText}>{item.viewCount}</Text>
              </View>
              <Text style={styles.time}>{formatDate(item.lastViewedAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper function to darken/lighten colors
const shadeColor = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

const SchoolView = () => {
  const { email, token } = useSelector((state) => state.auth);
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchViewers();
  }, []);

  const fetchViewers = async () => {
    try {
      setLoading(true);
      const response = await axiosConfiguration.post('/school/get-school-viewer', { loginEmail: email });
      if (response.data.success) {
        setViewers(response.data.data.viewers);
      } else {
        setError(response.data.message || 'Failed to fetch viewers');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      console.error('Error fetching school viewers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setError(null);
    fetchViewers();
  };

  const renderViewer = ({ item, index }) => {
    return <AnimatedViewerCard item={item} index={index} />;
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#4240E5', '#5D5FEF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerIconContainer}>
          <Icon name="visibility" size={26} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.headerTitle}>School Viewers</Text>
          <Text style={styles.headerSubtitle}>People who viewed your school profile</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{viewers.length}</Text>
          <Text style={styles.statLabel}>Total Viewers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {viewers.reduce((sum, viewer) => sum + viewer.viewCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Views</Text>
        </View>
      </View>
    </LinearGradient>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4240E5" />
        <Text style={styles.loadingText}>Loading viewers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={60} color="#D32F2F" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchViewers}>
          <LinearGradient
            colors={['#4240E5', '#5D5FEF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.retryButtonGradient}
          >
            <Icon name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      {viewers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="person-search" size={56} color="#9E9E9E" />
          </View>
          <Text style={styles.emptyTitle}>No Viewers Yet</Text>
          <Text style={styles.emptyText}>
            When someone views your school profile, they will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={viewers}
          renderItem={renderViewer}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>Recent Viewers</Text>
              <Text style={styles.listHeaderSubtitle}>
                {viewers.length} {viewers.length === 1 ? 'person' : 'people'} viewed your school
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default SchoolView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#4240E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: '90%',
    alignSelf: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listHeader: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  listContent: {
    padding: 10,
    paddingTop: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#5D5FEF',
  },
  leftContent: {
    marginRight: 15,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555555',
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  viewCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D5FEF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  viewCountText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  time: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555555',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#4240E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FD',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '80%',
  },
});

