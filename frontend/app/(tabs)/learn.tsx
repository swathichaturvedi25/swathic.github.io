import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../utils/api';

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [theoryContent, setTheoryContent] = useState<any[]>([]);
  const [shlokas, setShlokas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'terminology', label: 'Terms', icon: 'book' },
    { id: 'music_theory', label: 'Music', icon: 'musical-notes' },
    { id: 'history', label: 'History', icon: 'time' },
    { id: 'cultural', label: 'Culture', icon: 'globe' },
    { id: 'technique', label: 'Technique', icon: 'fitness' },
    { id: 'shlokas', label: 'Shlokas', icon: 'sparkles' },
  ];

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    setLoading(true);
    try {
      if (selectedCategory === 'shlokas') {
        const data = await api.getShlokas();
        setShlokas(data);
      } else {
        const category = selectedCategory === 'all' ? undefined : selectedCategory;
        const data = await api.getTheoryContent(category);
        setTheoryContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    setQuizLoading(true);
    try {
      const topics = [
        'Odissi dance terminology',
        'Odissi music theory and talas',
        'History of Odissi dance',
        'Odissi technique and postures',
        'Cultural significance of Odissi',
      ];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      const result = await api.generateQuiz(randomTopic, 5);
      
      if (result.questions && result.questions.length > 0) {
        Alert.alert(
          'Quiz Ready!',
          `Your surprise quiz on "${randomTopic}" is ready with ${result.questions.length} questions!`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Start Quiz', 
              onPress: () => {
                // Navigate to quiz screen with questions
                console.log('Start quiz:', result.questions);
                Alert.alert('Quiz Feature', 'Quiz screen will be implemented in the next phase!');
              }
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      Alert.alert('Error', 'Failed to generate quiz. Please try again.');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSubtitle}>Odissi Theory & Knowledge</Text>
        </View>

        {/* Surprise Test Button */}
        <View style={styles.quizSection}>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={startQuiz}
            disabled={quizLoading}
          >
            {quizLoading ? (
              <ActivityIndicator size="small" color="#ffd21f" />
            ) : (
              <>
                <Ionicons name="flash" size={24} color="#ffd21f" />
                <Text style={styles.quizButtonText}>Surprise Test</Text>
                <Text style={styles.quizButtonSubtext}>Test your knowledge!</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={18}
                color={selectedCategory === cat.id ? '#0d0015' : '#ffd21f'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content List */}
        <View style={styles.contentSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#ffd21f" style={{ marginTop: 40 }} />
          ) : selectedCategory === 'shlokas' ? (
            shlokas.length > 0 ? (
              shlokas.map((shloka) => (
                <TouchableOpacity key={shloka.id} style={styles.shlokaCard}>
                  <View style={styles.shlokaHeader}>
                    <Ionicons name="sparkles" size={24} color="#ffd21f" />
                    <Text style={styles.shlokaTitle}>{shloka.title}</Text>
                  </View>
                  <Text style={styles.shlokaSanskrit}>{shloka.sanskrit_text}</Text>
                  <Text style={styles.shlokaTranslit}>{shloka.transliteration}</Text>
                  <Text style={styles.shlokaMeaning}>{shloka.meaning}</Text>
                  {shloka.viniyoga && (
                    <View style={styles.viniyogaSection}>
                      <Text style={styles.viniyogaLabel}>Viniyoga:</Text>
                      <Text style={styles.viniyogaText}>{shloka.viniyoga}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#333" />
                <Text style={styles.emptyText}>No shlokas available</Text>
                <Text style={styles.emptySubtext}>Check back later for content</Text>
              </View>
            )
          ) : (
            theoryContent.length > 0 ? (
              theoryContent.map((content) => (
                <TouchableOpacity key={content.id} style={styles.contentCard}>
                  <View style={styles.contentHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {content.category.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.contentTitle}>{content.title}</Text>
                  <Text style={styles.contentText} numberOfLines={3}>
                    {content.content}
                  </Text>
                  <View style={styles.contentFooter}>
                    <Text style={styles.readMore}>Read more →</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#333" />
                <Text style={styles.emptyText}>No content available</Text>
                <Text style={styles.emptySubtext}>Check back later for theory content</Text>
              </View>
            )
          )}
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
    color: '#ffd21f',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  quizSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  quizButton: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd21f',
  },
  quizButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd21f',
    marginTop: 8,
  },
  quizButtonSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  categoryScroll: {
    marginBottom: 24,
  },
  categoryContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0d0015',
    borderWidth: 1,
    borderColor: '#ffd21f',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#ffd21f',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffd21f',
  },
  categoryTextActive: {
    color: '#0d0015',
  },
  contentSection: {
    paddingHorizontal: 24,
  },
  contentCard: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  contentHeader: {
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#ffd21f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  contentFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  readMore: {
    fontSize: 14,
    color: '#ffd21f',
    fontWeight: '600',
  },
  shlokaCard: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffd21f',
  },
  shlokaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  shlokaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd21f',
    flex: 1,
  },
  shlokaSanskrit: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 26,
  },
  shlokaTranslit: {
    fontSize: 15,
    color: '#CCCCCC',
    marginBottom: 12,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  shlokaMeaning: {
    fontSize: 15,
    color: '#999',
    lineHeight: 22,
  },
  viniyogaSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  viniyogaLabel: {
    fontSize: 13,
    color: '#ffd21f',
    fontWeight: '600',
    marginBottom: 4,
  },
  viniyogaText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    marginTop: 4,
  },
});