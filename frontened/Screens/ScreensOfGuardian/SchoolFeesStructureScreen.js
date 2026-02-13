import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Animated, Easing, StatusBar, } from 'react-native';
import RNFS from 'react-native-fs';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ProgressBar } from 'react-native-paper';

const SchoolFeesStructureScreen = ({ route, navigation }) => {
  const { GurdainFeesDisplayPdf = [] } = route?.params || {};
  const [downloadingFileName, setDownloadingFileName] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const loadingAnimation = useRef(null);

  const baseUrl = `${baseURL}/uploads/`;

  // Animated values for list items
  const listItemAnimations = useRef(
    GurdainFeesDisplayPdf.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start();

    // Sequential animation for list items
    GurdainFeesDisplayPdf.forEach((_, index) => {
      Animated.timing(listItemAnimations[index], {
        toValue: 1,
        duration: 400,
        delay: 100 + index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    });
  }, []);

  // Memoize the enhanced data to avoid unnecessary recalculations
  const enhancedData = useMemo(
    () =>
      GurdainFeesDisplayPdf.map((item) => ({
        ...item,
        fileUrl: `${baseUrl}${item.fileName}`,
        fileType: getFileType(item.fileName),
      })),
    [GurdainFeesDisplayPdf, baseUrl]
  );

  // Determine file type from file name
  function getFileType(fileName) {
    if (!fileName) return 'unknown';
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'word';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'ppt':
      case 'pptx':
        return 'powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'document';
    }
  }

  // Get icon for file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FontAwesome5 name="file-pdf" size={24} color="#FF5252" />;
      case 'word':
        return <FontAwesome5 name="file-word" size={24} color="#4285F4" />;
      case 'excel':
        return <FontAwesome5 name="file-excel" size={24} color="#0F9D58" />;
      case 'powerpoint':
        return <FontAwesome5 name="file-powerpoint" size={24} color="#FF9800" />;
      case 'image':
        return <FontAwesome5 name="file-image" size={24} color="#9C27B0" />;
      default:
        return <FontAwesome5 name="file-alt" size={24} color="#607D8B" />;
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);

    // Reset animations for items
    listItemAnimations.forEach((anim, index) => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 100 + index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    });

    // Simulate a network request
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  // Handle file download
  const handleDownloadFile = async (fileUrl, fileName) => {
    if (!fileUrl || !fileUrl.startsWith('http')) {
      Alert.alert('Invalid File URL', 'The file URL is not valid.');
      return;
    }

    setDownloadingFileName(fileName);
    setDownloadProgress(0);

    if (loadingAnimation.current) {
      loadingAnimation.current.play();
    }

    try {
      const downloadDestination = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      const downloadOptions = {
        fromUrl: fileUrl,
        toFile: downloadDestination,
        background: true,
        begin: () => console.log('Download started:', fileUrl),
        progress: (res) => {
          const progressPercent = res.bytesWritten / res.contentLength;
          setDownloadProgress(progressPercent);
        },
      };

      const result = await RNFS.downloadFile(downloadOptions).promise;

      if (result.statusCode === 200) {
        // Success animation
        if (loadingAnimation.current) {
          loadingAnimation.current.play(66, 120);
        }

        setTimeout(() => {
          Alert.alert(
            'Download Complete',
            `File saved to: ${downloadDestination}`,
            [{ text: 'OK', onPress: () => setDownloadingFileName(null) }]
          );
        }, 1000);
      } else {
        Alert.alert('Download Failed', 'Something went wrong while downloading the file.');
        setDownloadingFileName(null);
        setDownloadProgress(0);
      }
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'Unable to download the file.');
      setDownloadingFileName(null);
      setDownloadProgress(0);
    }
  };

  // Toggle expanded item
  const toggleExpandItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Render each list item
  const renderListItem = ({ item, index }) => {
    const isExpanded = expandedItem === item._id;

    // Animations for the list item
    const animatedStyle = {
      opacity: listItemAnimations[index],
      transform: [
        {
          translateY: listItemAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[styles.listItemContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.listItemContent}
          onPress={() => toggleExpandItem(item._id)}
          activeOpacity={0.8}
        >
          <View style={styles.fileIconContainer}>
            {getFileIcon(item.fileType)}
          </View>
          <View style={styles.fileDetails}>
            <Text style={styles.listItem} numberOfLines={isExpanded ? undefined : 1}>
              {item.fileName}
            </Text>
            {isExpanded && (
              <Animated.View style={styles.expandedContent}>
                <Text style={styles.fileInfo}>
                  <Text style={styles.fileInfoLabel}>Type: </Text>
                  {item.fileType.toUpperCase()}
                </Text>
                <Text style={styles.fileInfo}>
                  <Text style={styles.fileInfoLabel}>Added: </Text>
                  {new Date().toLocaleDateString()}
                </Text>
              </Animated.View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.downloadButton,
                { opacity: downloadingFileName === item.fileName ? 0.7 : 1 }
              ]}
              onPress={() => handleDownloadFile(item.fileUrl, item.fileName)}
              disabled={downloadingFileName === item.fileName}
            >
              {downloadingFileName === item.fileName ?
                (
                  <ActivityIndicator color="#fff" size={18} />
                )
                :
                (
                  <Ionicons name="cloud-download-outline" size={22} color="#fff" />
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.expandButton}>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#555"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {downloadingFileName === item.fileName && (
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={downloadProgress}
              color="#4A56E2"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(downloadProgress * 100)}%
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="file-document-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No PDF files available</Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.headerContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="school" size={32} color="#4A56E2" />
        </View>
        <Text style={styles.title}>School Fees Structure</Text>
        <Text style={styles.subtitle}>View and download fee documents</Text>
      </Animated.View>

      {downloadingFileName && (
        <View style={styles.downloadingContainer}>
          {/* <LottieView
            ref={loadingAnimation}
            source={require('../../assets/animations/downloading.json')} // You'll need to add this animation file
            style={styles.downloadingAnimation}
            autoPlay
            loop
          /> */}
          <Text style={styles.downloadingText}>Downloading: {downloadingFileName}</Text>
        </View>
      )}

      {enhancedData.length > 0 ? (
        <FlatList
          data={enhancedData}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#4A56E2']}
            />
          }
          renderItem={renderListItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyComponent />
      )}
    </View>
  );
};

export default SchoolFeesStructureScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 5,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    marginBottom: 5,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#f0e6ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContainer: {
    padding: 10,
    paddingTop: 5,
  },
  listItemContainer: {
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  fileIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  fileDetails: {
    flex: 1,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 8,
  },
  fileInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  fileInfoLabel: {
    fontWeight: '600',
    color: '#444',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#595959',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  expandButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#4A56E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1F5FE',
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  downloadingAnimation: {
    width: 40,
    height: 40,
  },
  downloadingText: {
    fontSize: 14,
    color: '#0277BD',
    marginLeft: 8,
    flex: 1,
  },
});