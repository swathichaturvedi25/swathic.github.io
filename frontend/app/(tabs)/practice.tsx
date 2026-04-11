import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function PracticeScreen() {
  const router = useRouter();

  const practiceOptions = [
    {
      id: 'video-record',
      title: 'Record Practice',
      description: 'Record yourself practicing and review later',
      icon: 'videocam',
      color: '#FF6B6B',
      route: '/practice/record',
    },
    {
      id: 'watch-videos',
      title: 'Teacher Videos',
      description: 'Watch and learn at different speeds (0.5x-2x)',
      icon: 'play-circle',
      color: '#4ECDC4',
      route: '/practice/videos',
    },
    {
      id: 'timer',
      title: 'Practice Timer',
      description: 'Time your practice sessions',
      icon: 'timer',
      color: '#FFD93D',
      route: '/practice/timer',
    },
    {
      id: 'music',
      title: 'Music Player',
      description: 'Practice with traditional Odissi music',
      icon: 'musical-notes',
      color: '#95E1D3',
      route: '/practice/music',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Practice</Text>
          <Text style={styles.headerSubtitle}>Choose your practice mode</Text>
        </View>

        <View style={styles.optionsContainer}>
          {practiceOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                { borderColor: option.color },
              ]}
              onPress={() => {
                if (option.id === 'watch-videos') {
                  router.push(option.route as any);
                } else {
                  console.log(`Navigate to ${option.route}`);
                  // Other features coming soon
                }
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                <Ionicons name={option.icon as any} size={40} color={option.color} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Session Logger */}
        <View style={styles.quickLogSection}>
          <Text style={styles.sectionTitle}>Quick Log Session</Text>
          <View style={styles.quickLogCard}>
            <Text style={styles.quickLogText}>
              Log a practice session without recording
            </Text>
            <TouchableOpacity style={styles.quickLogButton}>
              <Ionicons name="add-circle" size={24} color="#FFD700" />
              <Text style={styles.quickLogButtonText}>Log Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a001a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  optionsContainer: {
    paddingHorizontal: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0033',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
  },
  quickLogSection: {
    padding: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  quickLogCard: {
    backgroundColor: '#1a0033',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  quickLogText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a001a',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  quickLogButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
  },
});