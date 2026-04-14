import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getInfoAsync, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { api } from '../../utils/api';

export default function TeacherVideosScreen() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
  });
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your media library to upload videos.');
    }
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getTeacherVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
      Alert.alert('Error', 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false, // Changed to false - editing can cause issues
        quality: 0.5,
        videoMaxDuration: 300,
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        
        // Try to check file size, but continue even if it fails
        try {
          const fileInfo = await getInfoAsync(videoUri, { size: true });
          
          if (fileInfo.exists && 'size' in fileInfo && fileInfo.size) {
            const fileSizeMB = fileInfo.size / (1024 * 1024);
            
            if (fileSizeMB > 50) {
              Alert.alert(
                'File Too Large',
                `Video size: ${fileSizeMB.toFixed(1)}MB\n\n` +
                `Maximum size: 50MB\n\n` +
                `Tips to reduce size:\n` +
                `• Keep videos under 30 seconds\n` +
                `• Use lower quality recording\n` +
                `• Trim the video before uploading\n` +
                `• Use a video compressor app`,
                [{ text: 'OK' }]
              );
              return;
            }
            
            if (fileSizeMB > 30) {
              Alert.alert(
                'Large File',
                `Video size: ${fileSizeMB.toFixed(1)}MB\n\n` +
                `This may take a while to upload. Continue?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Continue', 
                    onPress: () => {
                      setSelectedVideoUri(videoUri);
                      setModalVisible(true);
                    }
                  },
                ]
              );
              return;
            }
          }
        } catch (sizeError) {
          console.log('Could not check file size, continuing anyway:', sizeError);
          // Continue with upload even if we can't check size
        }
        
        // If size check passed or couldn't be performed, open upload modal
        setSelectedVideoUri(videoUri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert(
        'Error',
        'Failed to select video. Please try again or choose a different video.',
        [{ text: 'OK' }]
      );
    }
  };

  const uploadVideo = async () => {
    if (!newVideo.title || !selectedVideoUri) {
      Alert.alert('Error', 'Please fill in title and select a video');
      return;
    }

    setUploading(true);
    try {
      // Get file info for size display
      const fileInfo = await getInfoAsync(selectedVideoUri);
      const fileSizeMB = fileInfo.exists && fileInfo.size 
        ? (fileInfo.size / (1024 * 1024)).toFixed(1) 
        : '?';
      
      console.log(`Uploading video: ${fileSizeMB}MB`);
      
      // Convert video to base64
      const base64 = await readAsStringAsync(selectedVideoUri, {
        encoding: EncodingType.Base64,
      });

      const videoData = {
        title: newVideo.title,
        description: newVideo.description,
        video_base64: `data:video/mp4;base64,${base64}`,
        difficulty_level: newVideo.difficulty_level,
      };

      await api.createTeacherVideo(videoData);
      
      Alert.alert('Success', 'Video uploaded successfully!');
      setModalVisible(false);
      setNewVideo({ title: '', description: '', difficulty_level: 'beginner' });
      setSelectedVideoUri(null);
      loadVideos();
    } catch (error: any) {
      console.error('Error uploading video:', error);
      
      let errorMessage = 'Failed to upload video.';
      if (error.message?.includes('413') || error.message?.includes('too large')) {
        errorMessage = 'Video file is too large. Please use a video under 10MB or compress it first.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Upload timed out. Please try with a smaller video or better internet connection.';
      }
      
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const playVideo = (video: any) => {
    // Convert video_url to full URL
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';
    const videoUrl = video.video_url.startsWith('http') 
      ? video.video_url 
      : `${backendUrl}${video.video_url}`;
    
    console.log('Backend URL:', backendUrl);
    console.log('Video URL from DB:', video.video_url);
    console.log('Full Video URL:', videoUrl);
    
    const videoWithFullUrl = {
      ...video,
      video_base64: videoUrl
    };
    
    router.push({
      pathname: '/practice/video-player',
      params: { videoData: JSON.stringify(videoWithFullUrl) },
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ff1fa9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher Videos</Text>
        <TouchableOpacity onPress={pickVideo} style={styles.uploadButton}>
          <Ionicons name="add-circle" size={28} color="#ff1fa9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.description}>
          <Ionicons name="information-circle" size={20} color="#ff1fa9" />
          <View style={{ flex: 1 }}>
            <Text style={styles.descriptionText}>
              Upload your teacher's videos and watch them at slower speeds to learn step-by-step
            </Text>
            <Text style={styles.sizeHint}>
              💡 Maximum: 50MB & 30 seconds • Best for learning specific moves
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ff1fa9" style={{ marginTop: 40 }} />
        ) : videos.length > 0 ? (
          <View style={styles.videosContainer}>
            {videos.map((video) => (
              <View key={video.id} style={styles.videoCardWrapper}>
                <TouchableOpacity
                  style={styles.videoCard}
                  onPress={() => playVideo(video)}
                >
                  <View style={styles.videoThumbnail}>
                    <Ionicons name="play-circle" size={48} color="#ff1fa9" />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>{video.title}</Text>
                    {video.description && (
                      <Text style={styles.videoDescription} numberOfLines={2}>
                        {video.description}
                      </Text>
                    )}
                    <View style={styles.videoMeta}>
                      <View
                        style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(video.difficulty_level) + '30' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.difficultyText,
                            { color: getDifficultyColor(video.difficulty_level) },
                          ]}
                        >
                          {video.difficulty_level.toUpperCase()}
                        </Text>
                      </View>
                      {video.file_size_mb && (
                        <Text style={styles.fileSizeText}>
                          {video.file_size_mb}MB
                        </Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteVideo(video.id, video.title)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="videocam-outline" size={64} color="#333" />
            <Text style={styles.emptyText}>No videos uploaded yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to upload your first video</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !uploading && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Video</Text>
              {!uploading && (
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {selectedVideoUri && (
              <View style={styles.videoPreview}>
                <Ionicons name="videocam" size={40} color="#ff1fa9" />
                <Text style={styles.videoSelectedText}>Video selected</Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Video Title *"
              placeholderTextColor="#666"
              value={newVideo.title}
              onChangeText={(text) => setNewVideo({ ...newVideo, title: text })}
              editable={!uploading}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              value={newVideo.description}
              onChangeText={(text) => setNewVideo({ ...newVideo, description: text })}
              multiline
              numberOfLines={3}
              editable={!uploading}
            />

            <Text style={styles.inputLabel}>Difficulty Level:</Text>
            <View style={styles.difficultyContainer}>
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyChip,
                    newVideo.difficulty_level === level && styles.difficultyChipActive,
                    { borderColor: getDifficultyColor(level) },
                  ]}
                  onPress={() => setNewVideo({ ...newVideo, difficulty_level: level })}
                  disabled={uploading}
                >
                  <Text
                    style={[
                      styles.difficultyChipText,
                      newVideo.difficulty_level === level && { color: getDifficultyColor(level) },
                    ]}
                  >
                    {level.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.uploadButtonLarge, uploading && styles.uploadButtonDisabled]}
              onPress={uploadVideo}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#0d0015" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="#0d0015" />
                  <Text style={styles.uploadButtonText}>Upload Video</Text>
                </>
              )}
            </TouchableOpacity>
            {uploading && (
              <Text style={styles.uploadingText}>Uploading... Please wait</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050010',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  uploadButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0015',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 6,
  },
  sizeHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  videosContainer: {
    paddingHorizontal: 16,
  },
  videoCardWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#0d0015',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    zIndex: 10,
  },
  videoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  videoDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileSizeText: {
    fontSize: 11,
    color: '#999',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0d0015',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  videoPreview: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#050010',
    borderRadius: 12,
    marginBottom: 16,
  },
  videoSelectedText: {
    fontSize: 14,
    color: '#ff1fa9',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#050010',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  difficultyChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#050010',
    borderWidth: 2,
    alignItems: 'center',
  },
  difficultyChipActive: {
    backgroundColor: '#0d0015',
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  uploadButtonLarge: {
    flexDirection: 'row',
    backgroundColor: '#ff1fa9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  uploadingText: {
    fontSize: 14,
    color: '#ff1fa9',
    textAlign: 'center',
    marginTop: 12,
  },
});