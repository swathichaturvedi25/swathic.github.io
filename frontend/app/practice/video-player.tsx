import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { api } from '../../utils/api';

const { width } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { videoData } = useLocalSearchParams();
  const video = videoData ? JSON.parse(String(videoData)) : null;
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false);

  const videoUrl = video?.video_base64 || video?.video_url || '';

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2.0 },
  ];

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  const handlePlaybackSpeedChange = async (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(speed, true);
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleReplay = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (videoRef.current && status.durationMillis) {
      await videoRef.current.setPositionAsync(value * status.durationMillis);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      `Delete "${video.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteTeacherVideo(video.id);
              Alert.alert('Success', 'Video deleted!');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Video not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{video.title}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setIsMirrored(!isMirrored)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isMirrored ? "sync" : "sync-outline"}
              size={22}
              color={isMirrored ? "#FFD700" : "#999"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.videoContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={[
            styles.video,
            isMirrored && { transform: [{ scaleX: -1 }] }
          ]}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={(status) => setStatus(status)}
          onLoad={() => setIsLoading(false)}
          onError={(error) => {
            console.error('Video load error:', error);
            setIsLoading(false);
            Alert.alert('Error', 'Failed to load video. Please try again.');
          }}
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        {video.description && (
          <Text style={styles.videoDescription}>{video.description}</Text>
        )}
      </View>

      <View style={styles.controlsContainer}>
        {status.durationMillis > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {formatTime(status.positionMillis || 0)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={(status.positionMillis || 0) / status.durationMillis}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />
            <Text style={styles.timeText}>
              {formatTime(status.durationMillis || 0)}
            </Text>
          </View>
        )}

        <View style={styles.playbackButtons}>
          <TouchableOpacity onPress={handleReplay} style={styles.controlButton}>
            <Ionicons name="refresh" size={28} color="#FFD700" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons
              name={status.isPlaying ? 'pause' : 'play'}
              size={40}
              color="#1a0033"
            />
          </TouchableOpacity>
          
          <View style={{ width: 56 }} />
        </View>

        <View style={styles.speedSection}>
          <Text style={styles.speedLabel}>Playback Speed</Text>
          <View style={styles.speedButtons}>
            {speedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speedButton,
                  playbackSpeed === option.value && styles.speedButtonActive,
                ]}
                onPress={() => handlePlaybackSpeedChange(option.value)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    playbackSpeed === option.value && styles.speedButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.speedHint}>
            💡 Use 0.5x-0.75x to learn steps • Tap 🔄 to mirror video
          </Text>
        </View>
      </View>
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
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  videoContainer: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 12,
    fontSize: 14,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  controlsContainer: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    width: 40,
  },
  playbackButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a0033',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedSection: {
    backgroundColor: '#1a0033',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  speedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#0a001a',
    borderWidth: 2,
    borderColor: '#333',
    minWidth: 70,
    alignItems: 'center',
  },
  speedButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD700',
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  speedButtonTextActive: {
    color: '#1a0033',
  },
  speedHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 40,
  },
});
