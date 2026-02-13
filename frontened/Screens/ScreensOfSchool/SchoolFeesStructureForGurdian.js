import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Animated, RefreshControl, Modal, Platform, PermissionsAndroid, StatusBar, Dimensions } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosConfiguration, { baseURL } from '../../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import PDF from 'react-native-pdf';
import { PDFDocument } from 'pdf-lib';
import * as FileSystem from 'react-native-fs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const isSmallDevice = width < 375;
const { width } = Dimensions.get('window');
const SchoolFeesStructureForGuardian = () => {
    const insets = useSafeAreaInsets();
    const { email } = useSelector((state) => state.auth);
    const logemail = email;
    const [uploadableFiles, setUploadableFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [fadeIn] = useState(new Animated.Value(0));
    const [slideUp] = useState(new Animated.Value(50));
    const [selectedPdfUri, setSelectedPdfUri] = useState(null);
    const [compressionQuality, setCompressionQuality] = useState('medium');
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionProgress, setCompressionProgress] = useState(0);


    useEffect(() => {
        fetchFiles();
        Animated.parallel([
            Animated.timing(fadeIn, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideUp, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const response = await axiosConfiguration.post('/school/get-school-details', { email: logemail });
            if (response.status == 200) {
                const result = response.data;
                if (result.schoolDetails && Array.isArray(result.schoolDetails.feeStructure)) {
                    const pdfFiles = result.schoolDetails.feeStructure.map(item => item.fileName);
                    setFiles(pdfFiles);
                } else {
                    Alert.alert('Error', 'Fee structure data is invalid or missing.');
                }
            } else {
                Alert.alert('Error', response.data.message || 'Failed to fetch files.');
            }
        } catch (error) {
            console.error("Error fetching files:", error.message || error);
            Alert.alert('Error', 'An error occurred while fetching files.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchFiles();
        setRefreshing(false);
    };

    const pickFiles = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });

            const selectedFiles = results.map((file) => ({
                uri: file.uri,
                name: file.name,
                type: file.type,
                size: file.size,
            }));

            setUploadableFiles([...uploadableFiles, ...selectedFiles]);
            setIsUploaded(true);
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                Alert.alert('Error', 'Failed to select files.');
            }
        }
    };

    // Helper function to read a file as base64
    const readFileAsBase64 = async (fileUri) => {
        try {
            const base64File = await FileSystem.readFile(
                Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
                'base64'
            );
            return base64File;
        } catch (error) {
            console.error('Error reading file as base64:', error);
            throw error;
        }
    };

    // Helper function to save a base64 string as a file
    const saveBase64AsFile = async (base64Data, fileName) => {
        try {
            const directory = `${FileSystem.CachesDirectoryPath}/compressed`;
            const filePath = `${directory}/${fileName}`;

            // Ensure directory exists
            await FileSystem.mkdir(directory).catch(() => { });

            // Write file
            await FileSystem.writeFile(filePath, base64Data, 'base64');
            return `file://${filePath}`;
        } catch (error) {
            console.error('Error saving base64 as file:', error);
            throw error;
        }
    };

    // PDF compression function
    const compressPdf = async (file) => {
        setIsCompressing(true);
        setCompressionProgress(0);

        try {
            // Read the PDF file as base64
            const base64Data = await readFileAsBase64(file.uri);
            setCompressionProgress(20);

            // Load the PDF
            const pdfDoc = await PDFDocument.load(base64Data);
            setCompressionProgress(40);

            // Apply compression settings based on quality level
            let compressOptions = {};
            switch (compressionQuality) {
                case 'low':
                    compressOptions = { quality: 0.3 };
                    break;
                case 'medium':
                    compressOptions = { quality: 0.6 };
                    break;
                case 'high':
                    compressOptions = { quality: 0.8 };
                    break;
                default:
                    compressOptions = { quality: 0.6 };
            }

            // Compress each page
            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                // We don't modify the page directly, as pdf-lib doesn't support direct image compression
                // This is just a placeholder for progress updates
                setCompressionProgress(40 + Math.floor((i / pages.length) * 40));
            }

            // Save the PDF with compression
            const compressedPdfBytes = await pdfDoc.save({
                updateFieldAppearances: false,
                addDefaultPage: false,
                useObjectStreams: true
            });
            setCompressionProgress(90);

            // Convert to base64 and save as a file
            const compressedBase64 = Buffer.from(compressedPdfBytes).toString('base64');
            const compressedFileName = `compressed_${file.name}`;
            const compressedUri = await saveBase64AsFile(compressedBase64, compressedFileName);

            setCompressionProgress(100);

            // Return the compressed file info
            return {
                uri: compressedUri,
                name: compressedFileName,
                type: 'application/pdf',
                originalSize: file.size,
                // Get the size of the compressed file
                size: (compressedPdfBytes.length),
            };
        } catch (error) {
            console.error('Error compressing PDF:', error);
            Alert.alert('Compression Error', 'Failed to compress the PDF file.');
            return file; // Return original file if compression fails
        } finally {
            setIsCompressing(false);
            setCompressionProgress(0);
        }
    };

    // Compress all selected files
    const compressAllFiles = async () => {
        if (uploadableFiles.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            Alert.alert('Compressing', 'Please wait while files are being compressed...');

            const compressedFiles = [];
            for (const file of uploadableFiles) {
                const compressedFile = await compressPdf(file);
                compressedFiles.push(compressedFile);

                // Show progress for large batches
                if (uploadableFiles.length > 1) {
                    const progressPercent = (compressedFiles.length / uploadableFiles.length) * 100;
                }
            }

            // Calculate compression statistics
            const totalOriginalSize = uploadableFiles.reduce((sum, file) => sum + file.size, 0);
            const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0);
            const savingsPercent = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);

            Alert.alert(
                'Compression Complete',
                `Reduced file size by ${savingsPercent}%\nOriginal: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB\nCompressed: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`,
                [{ text: 'OK' }]
            );

            setUploadableFiles(compressedFiles);
        } catch (error) {
            console.error('Error in batch compression:', error);
            Alert.alert('Error', 'Failed to compress some files.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostFiles = async () => {
        if (uploadableFiles.length === 0) {
            Alert.alert('No Files', 'Please upload some files before posting.');
            return;
        }

        const formData = new FormData();
        formData.append('loginEmail', logemail);

        uploadableFiles.forEach((file) => {
            formData.append('files', {
                uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''), // Fix for iOS
                name: file.name,
                type: file.type,
            });
        });

        setIsLoading(true);
        try {
            const response = await axiosConfiguration.post(
                '/school/upload-fee-structure',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 100000
                }
            );

            if (response?.data?.success) {
                Alert.alert('Success', 'Files uploaded successfully!');
                setUploadableFiles([]);
                setIsUploaded(false);
                await fetchFiles();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to upload files.');
            }
        } catch (error) {
            console.error('Upload Error:', error.message || error);
            Alert.alert('Error', 'An error occurred while uploading files.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFile = async (fileName, index) => {
        Alert.alert(
            'Confirm Delete',
            `Are you sure you want to delete "${fileName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            const response = await axiosConfiguration.post(
                                '/school/fees-structure-delete',
                                { loginEmail: logemail, fileName }
                            );

                            if (response?.data?.success) {
                                Alert.alert('Success', 'File deleted successfully!');
                                const updatedFiles = files.filter((_, i) => i !== index);
                                setFiles(updatedFiles);
                            } else {
                                Alert.alert('Error', response.data.message || 'Failed to delete the file.');
                            }
                        } catch (error) {
                            console.error('Delete Error:', error.message || error);
                            Alert.alert('Error', 'An error occurred while deleting the file.');
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleViewFile = (fileName) => {
        const token = axiosConfiguration.defaults.headers.common['Authorization'];
        const fileURL = `${baseURL}/uploads/${fileName}`;
        setSelectedPdfUri({ uri: fileURL, headers: { Authorization: token } });
    };

    const closeModal = () => {
        setSelectedPdfUri(null);
    };

    const handleRemoveUploadableFile = (index) => {
        const newFiles = uploadableFiles.filter((_, i) => i !== index);
        setUploadableFiles(newFiles);
        if (newFiles.length === 0) {
            setIsUploaded(false);
        }
    };

    const renderFileItem = ({ item, index }) => (
        <Animated.View
            style={[
                styles.fileCard,
                {
                    opacity: fadeIn,
                    transform: [{ translateY: Animated.multiply(fadeIn, Animated.add(0, Animated.multiply(-1, slideUp))) }]
                }
            ]}
        >
            <View style={styles.fileIconWrapper}>
                <FontAwesome5 name="file-pdf" size={28} color="#e74c3c" />
            </View>
            <View style={styles.fileDetails}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">{item}</Text>
                <View style={styles.fileActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleViewFile(item)}
                    >
                        <Ionicons name="eye-outline" size={20} color="#3498db" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteFile(item, index)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={['#3D5AFE', '#536DFE', '#6286FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20
                }}
            >
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Fee Structure</Text>
                        <Text style={styles.headerSubtitle}>Manage your institution's fee documents</Text>
                    </View>
                    <View style={styles.headerDecoration}>
                        <View style={[styles.headerCircle, styles.headerCircle1]} />
                        <View style={[styles.headerCircle, styles.headerCircle2]} />
                    </View>
                </View>
            </LinearGradient>
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3D5AFE']}
                    />
                }
            >
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#3D5AFE" />
                        <Text style={styles.loaderText}>Loading documents...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionTitleContainer}>
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color="#3498db" />
                                <Text style={styles.sectionTitle}>Uploaded Documents</Text>
                            </View>
                            {files.length > 0 ? (
                                <FlatList
                                    data={files}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderFileItem}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons name="file-document-outline" size={60} color="#e0e0e0" />
                                    <Text style={styles.emptyText}>No documents uploaded yet</Text>
                                    <Text style={styles.emptySubText}>Upload PDF files to share with parents and students</Text>
                                </View>
                            )}
                        </View>

                        {uploadableFiles.length > 0 && (
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionTitleContainer}>
                                    <MaterialCommunityIcons name="upload-outline" size={24} color="#3D5AFE" />
                                    <Text style={styles.sectionTitle}>Files to Upload</Text>
                                </View>
                                {uploadableFiles.map((item, index) => (
                                    <View key={index} style={styles.uploadableFileCard}>
                                        <View style={styles.uploadableFileIcon}>
                                            <FontAwesome5 name="file-pdf" size={24} color="#e74c3c" />
                                        </View>
                                        <View style={styles.uploadableFileDetails}>
                                            <Text style={styles.uploadableFileName} numberOfLines={1} ellipsizeMode="middle">
                                                {item.name}
                                            </Text>
                                            {item.size && (
                                                <Text style={styles.uploadableFileSize}>
                                                    {(item.size / 1024 / 1024).toFixed(2)} MB
                                                </Text>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            style={styles.uploadableFileAction}
                                            onPress={() => handleRemoveUploadableFile(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#e74c3c" />
                                        </TouchableOpacity>
                                    </View>
                                ))}




                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            <View style={styles.actionButtonContainer}>
                <TouchableOpacity style={styles.circleButton} onPress={pickFiles}>
                    <LinearGradient
                        colors={['#536DFE', '#3D5AFE']}
                        style={styles.circleGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="document-attach" size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.circleButtonText}>Select PDF</Text>
                </TouchableOpacity>

                {uploadableFiles.length > 0 && (
                    <>


                        <TouchableOpacity style={styles.circleButton} onPress={handlePostFiles}>
                            <LinearGradient
                                colors={['#f39c12', '#e67e22']}
                                style={styles.circleGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="cloud-upload" size={24} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.circleButtonText}>Upload</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* PDF Viewer Modal */}
            <Modal
                visible={selectedPdfUri !== null}
                transparent={false}
                animationType="slide"
            >
                <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
                    <LinearGradient
                        colors={['#536DFE', '#3D5AFE']}
                        style={styles.modalHeader}
                    >
                        <Text style={styles.modalTitle}>Document Viewer</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeModal}
                        >
                            <Ionicons name="close-circle" size={28} color="#fff" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {selectedPdfUri && (
                        <PDF
                            source={selectedPdfUri}
                            style={styles.pdf}
                            trustAllCerts={false}
                            onError={(error) => {
                                Alert.alert('Error', 'Unable to load PDF');
                                closeModal();
                            }}
                        />
                    )}
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 10,
        position: 'relative',
        overflow: 'hidden',
    },
    headerContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
    },
    headerTitle: {
        fontSize: isSmallDevice ? 25 : 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: isSmallDevice ? 14 : 16,
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 0.5,
    },
    headerDecoration: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        opacity: 0.4,
    },
    headerCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 150,
    },
    headerCircle1: {
        width: 200,
        height: 200,
        top: -50,
        right: -50,
    },
    headerCircle2: {
        width: 150,
        height: 150,
        top: 40,
        left: -70,
    },
    scrollContainer: {
        flex: 1,
        paddingVertical: 15,
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: 10,
        color: '#3D5AFE',
        fontSize: 16,
    },
    sectionContainer: {
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#333',
        fontWeight: '700',
        fontSize: 18,
        marginLeft: 10,
    },
    fileCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    fileIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginBottom: 4,
    },
    fileActions: {
        flexDirection: 'row',
        marginTop: 5,
    },
    actionButton: {
        marginRight: 15,
        padding: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 5,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 15,
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 5,
    },
    uploadableFileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    uploadableFileIcon: {
        width: 45,
        height: 45,
        borderRadius: 8,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    uploadableFileDetails: {
        flex: 1,
    },
    uploadableFileName: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    uploadableFileSize: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    uploadableFileAction: {
        padding: 5,
    },
    compressionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    compressionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    compressionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    compressionButtons: {
        flexDirection: 'row',
        backgroundColor: '#f1f2f6',
        borderRadius: 25,
        overflow: 'hidden',
    },
    qualityButton: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedQuality: {
        backgroundColor: '#3D5AFE',
    },
    qualityText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    selectedQualityText: {
        color: '#fff',
        fontWeight: '600',
    },
    progressContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        fontWeight: '500',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f1f2f6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3D5AFE',
    },
    actionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f2f6',
    },
    circleButton: {
        alignItems: 'center',
    },
    circleGradient: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    circleButtonText: {
        fontSize: 12,
        color: '#555',
        marginTop: 6,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    modalTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    pdf: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
});

export default SchoolFeesStructureForGuardian;