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
import * as FileSystem from 'expo-file-system';
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
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        setSelectedVideoUri(videoUri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const uploadVideo = async () => {
    if (!newVideo.title || !selectedVideoUri) {
      Alert.alert('Error', 'Please fill in title and select a video');
      return;
    }

    setUploading(true);
    try {
      // Convert video to base64
      const base64 = await FileSystem.readAsStringAsync(selectedVideoUri, {
        encoding: FileSystem.EncodingType.Base64,
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
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('Error', 'Failed to upload video. Make sure the video is not too large.');
    } finally {
      setUploading(false);
    }
  };

  const playVideo = (video: any) => {
    router.push({
      pathname: '/practice/video-player',
      params: { videoData: JSON.stringify(video) },
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
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher Videos</Text>
        <TouchableOpacity onPress={pickVideo} style={styles.uploadButton}>
          <Ionicons name="add-circle" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.description}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.descriptionText}>
            Upload your teacher's videos and watch them at slower speeds to learn step-by-step
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 40 }} />
        ) : videos.length > 0 ? (
          <View style={styles.videosContainer}>
            {videos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => playVideo(video)}
              >
                <View style={styles.videoThumbnail}>
                  <Ionicons name="play-circle" size={48} color="#FFD700" />
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
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
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
                <Ionicons name="videocam" size={40} color="#FFD700" />
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
                <ActivityIndicator size="small" color="#1a0033" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="#1a0033" />
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
    backgroundColor: '#0a001a',
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
    color: '#FFD700',
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
    backgroundColor: '#1a0033',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  videosContainer: {
    paddingHorizontal: 16,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  videoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#0a001a',
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
    backgroundColor: '#1a0033',
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
    color: '#FFD700',
  },
  videoPreview: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a001a',
    borderRadius: 12,
    marginBottom: 16,
  },
  videoSelectedText: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0a001a',
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
    backgroundColor: '#0a001a',
    borderWidth: 2,
    alignItems: 'center',
  },
  difficultyChipActive: {
    backgroundColor: '#1a0033',
  },
  difficultyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  uploadButtonLarge: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
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
    color: '#1a0033',
  },
  uploadingText: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 12,
  },
});