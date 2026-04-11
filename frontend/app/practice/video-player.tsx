import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { videoData } = useLocalSearchParams();
  const video = videoData ? JSON.parse(videoData as string) : null;
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);

  // Construct the video URL properly
  const videoUrl = video?.video_base64 || video?.video_url || '';
  
  console.log('Video URL:', videoUrl);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.playbackRate = playbackSpeed;
  });

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2x', value: 2.0 },
  ];

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    player.playbackRate = speed;
  };

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleReplay = () => {
    player.currentTime = 0;
    player.play();
  };

  const handleSeek = (value: number) => {
    if (player) {
      player.currentTime = value * (duration || 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update time periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setCurrentTime(player.currentTime);
        if (player.duration && player.duration > 0) {
          setDuration(player.duration);
          if (isLoading) setIsLoading(false);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, isLoading]);

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
        <TouchableOpacity
          onPress={() => setIsMirrored(!isMirrored)}
          style={styles.mirrorButton}
        >
          <Ionicons
            name={isMirrored ? "sync" : "sync-outline"}
            size={24}
            color={isMirrored ? "#FFD700" : "#999"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        <VideoView
          style={[
            styles.video,
            isMirrored && { transform: [{ scaleX: -1 }] }
          ]}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      </View>

      {/* Video Info */}
      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        {video.description && (
          <Text style={styles.videoDescription}>{video.description}</Text>
        )}
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsContainer}>
        {/* Progress Bar */}
        {duration > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={duration > 0 ? currentTime / duration : 0}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#FFD700"
              maximumTrackTintColor="#333"
              thumbTintColor="#FFD700"
            />
            <Text style={styles.timeText}>
              {formatTime(duration)}
            </Text>
          </View>
        )}

        {/* Play/Pause Button */}
        <View style={styles.playbackButtons}>
          <TouchableOpacity onPress={handleReplay} style={styles.controlButton}>
            <Ionicons name="refresh" size={28} color="#FFD700" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons
              name={player.playing ? 'pause' : 'play'}
              size={40}
              color="#1a0033"
            />
          </TouchableOpacity>
          
          <View style={{ width: 56 }} />
        </View>

        {/* Speed Controls */}
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
            💡 Use slower speeds (0.5x - 0.75x) to learn steps in detail
          </Text>
          <Text style={styles.mirrorHint}>
            🔄 Tap the mirror icon at top to flip the video horizontally
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
  mirrorButton: {
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
  mirrorHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 40,
  },
});
