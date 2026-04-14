import React from 'react';
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

export default function MusicScreen() {
  const router = useRouter();

  const musicItems = [
    {
      id: 'tala',
      title: 'Tala',
      description: 'Rhythmic cycles, Laya & Mardala patterns',
      icon: 'metronome-outline' as const,
      fallbackIcon: 'pulse' as const,
      color: '#ffd21f',
      route: '/practice/tala',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffd21f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Music</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Odissi Music</Text>
          <Text style={styles.introText}>
            Explore the rhythmic foundations of Odissi dance through Tala, Laya, and traditional Mardala patterns.
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {musicItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemCard, { borderColor: item.color }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.fallbackIcon} size={40} color={item.color} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.comingSoon}>
          <Ionicons name="musical-notes" size={24} color="#666" />
          <Text style={styles.comingSoonText}>More music features coming soon</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
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
    color: '#ffd21f',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  introSection: {
    padding: 24,
    paddingBottom: 16,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd21f',
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  itemsContainer: {
    paddingHorizontal: 24,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0015',
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
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#999',
  },
  comingSoon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    marginTop: 16,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
