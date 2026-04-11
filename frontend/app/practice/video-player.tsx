import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { api } from '../../utils/api';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { videoData } = useLocalSearchParams();
  const video = videoData ? JSON.parse(String(videoData)) : null;
  
  const videoRef = useRef<Video>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [status, setStatus] = useState<any>({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  const videoUrl = video?.video_base64 || video?.video_url || '';

  const speedOptions = [
    { label: '0.25x', value: 0.25 },
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x (Normal)', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2.0 },
  ];

  useEffect(() => {
    // Unlock all orientations
    ScreenOrientation.unlockAsync();
    
    // Listen for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      const orient = evt.orientationInfo.orientation;
      if (orient === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
          orient === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    });

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      subscription.remove();
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showControls) {
      resetHideControlsTimer();
    }
  }, [showControls]);

  const resetHideControlsTimer = () => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (status.isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      resetHideControlsTimer();
    }
  };

  const handlePlaybackSpeedChange = async (speed: number) => {
    setPlaybackSpeed(speed);
    setShowSpeedPicker(false);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(speed, true);
    }
    resetHideControlsTimer();
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
    resetHideControlsTimer();
  };

  const handleRewind = async () => {
    if (videoRef.current && status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 5000);
      await videoRef.current.setPositionAsync(newPosition);
    }
    resetHideControlsTimer();
  };

  const handleForward = async () => {
    if (videoRef.current && status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(status.durationMillis, status.positionMillis + 5000);
      await videoRef.current.setPositionAsync(newPosition);
    }
    resetHideControlsTimer();
  };

  const handleSeek = async (value: number) => {
    if (videoRef.current && status.durationMillis) {
      await videoRef.current.setPositionAsync(value * status.durationMillis);
    }
    resetHideControlsTimer();
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
      <View style={styles.container}>
        <Text style={styles.errorText}>Video not found</Text>
      </View>
    );
  }

  const { width, height } = Dimensions.get('window');
  const isLandscape = orientation === 'landscape';

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Loading...</Text>
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
              console.error('Video error:', error);
              setIsLoading(false);
            }}
          />

          {/* Top Controls */}
          {showControls && (
            <View style={[styles.topControls, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
              <TouchableOpacity onPress={() => router.back()} style={styles.controlIcon}>
                <Ionicons name="arrow-back" size={28} color="#FFF" />
              </TouchableOpacity>
              
              <Text style={styles.videoTitle} numberOfLines={1}>{video.title}</Text>
              
              <View style={styles.topRightControls}>
                <TouchableOpacity
                  onPress={() => setIsMirrored(!isMirrored)}
                  style={styles.controlIcon}
                >
                  <Ionicons
                    name="sync"
                    size={24}
                    color={isMirrored ? "#FFD700" : "#FFF"}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleDelete} style={styles.controlIcon}>
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Center Play/Pause Button */}
          {showControls && !status.isPlaying && (
            <TouchableOpacity
              style={styles.centerPlayButton}
              onPress={handlePlayPause}
            >
              <Ionicons name="play-circle" size={80} color="rgba(255, 215, 0, 0.9)" />
            </TouchableOpacity>
          )}

          {/* Bottom Controls */}
          {showControls && (
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
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
                    onSlidingStart={() => {
                      if (hideControlsTimeout.current) {
                        clearTimeout(hideControlsTimeout.current);
                      }
                    }}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                    thumbTintColor="#FFD700"
                  />
                  <Text style={styles.timeText}>
                    {formatTime(status.durationMillis || 0)}
                  </Text>
                </View>
              )}

              {/* Playback Controls */}
              <View style={styles.playbackControls}>
                <TouchableOpacity onPress={handleRewind} style={styles.playbackButton}>
                  <Ionicons name="play-back" size={32} color="#FFF" />
                  <Text style={styles.rewindText}>5s</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePlayPause} style={styles.mainPlayButton}>
                  <Ionicons
                    name={status.isPlaying ? 'pause' : 'play'}
                    size={36}
                    color="#FFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForward} style={styles.playbackButton}>
                  <Ionicons name="play-forward" size={32} color="#FFF" />
                  <Text style={styles.rewindText}>5s</Text>
                </TouchableOpacity>

                <View style={styles.spacer} />

                <TouchableOpacity
                  onPress={() => setShowSpeedPicker(true)}
                  style={styles.speedButton}
                >
                  <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
                  <Ionicons name="caret-down" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Speed Picker Modal */}
      <Modal
        visible={showSpeedPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSpeedPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.speedPickerContainer}>
              <Text style={styles.speedPickerTitle}>Playback Speed</Text>
              {speedOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.speedOption,
                    playbackSpeed === option.value && styles.speedOptionActive,
                  ]}
                  onPress={() => handlePlaybackSpeedChange(option.value)}
                >
                  <Text
                    style={[
                      styles.speedOptionText,
                      playbackSpeed === option.value && styles.speedOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {playbackSpeed === option.value && (
                    <Ionicons name="checkmark" size={20} color="#FFD700" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  },
  controlIcon: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  videoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginHorizontal: 12,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 8,
  },
  centerPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
    height: 40,
  },
  timeText: {
    fontSize: 13,
    color: '#FFF',
    width: 45,
    textAlign: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  playbackButton: {
    alignItems: 'center',
    position: 'relative',
  },
  rewindText: {
    fontSize: 10,
    color: '#FFD700',
    position: 'absolute',
    bottom: -2,
    fontWeight: 'bold',
  },
  mainPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  spacer: {
    flex: 1,
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 4,
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedPickerContainer: {
    backgroundColor: '#1a0033',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  speedPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  speedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  speedOptionActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  speedOptionText: {
    fontSize: 16,
    color: '#CCC',
  },
  speedOptionTextActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 40,
  },
});
