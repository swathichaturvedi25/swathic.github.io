import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../utils/api';

export default function ProfileScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsData, quizData] = await Promise.all([
        api.getGoals(),
        api.getQuizResults(),
      ]);
      setGoals(goalsData);
      setQuizResults(quizData.slice(0, 5));
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title || !newGoal.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await api.createGoal({
        title: newGoal.title,
        description: newGoal.description,
        target_date: new Date(newGoal.targetDate).toISOString(),
      });
      
      setModalVisible(false);
      setNewGoal({
        title: '',
        description: '',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      loadData();
      Alert.alert('Success', 'Goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      Alert.alert('Error', 'Failed to create goal');
    }
  };

  const toggleGoal = async (goalId: string, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        await api.completeGoal(goalId);
      }
      loadData();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteGoal(goalId);
              loadData();
            } catch (error) {
              console.error('Error deleting goal:', error);
            }
          },
        },
      ]
    );
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Goals & Progress</Text>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals ({activeGoals.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={24} color="#ff2d1f" />
            </TouchableOpacity>
          </View>

          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleGoal(goal.id, goal.completed)}
                >
                  <Ionicons
                    name={goal.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={28}
                    color={goal.completed ? '#4CAF50' : '#ff2d1f'}
                  />
                </TouchableOpacity>
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  <Text style={styles.goalDate}>
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteIconButton}
                  onPress={() => deleteGoal(goal.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No active goals. Create one to get started!</Text>
          )}
        </View>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Goals ({completedGoals.length})</Text>
            {completedGoals.map((goal) => (
              <View key={goal.id} style={[styles.goalCard, styles.completedGoalCard]}>
                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                <View style={styles.goalContent}>
                  <Text style={[styles.goalTitle, styles.completedGoalTitle]}>
                    {goal.title}
                  </Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteIconButton}
                  onPress={() => deleteGoal(goal.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Quiz History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Quiz Results</Text>
          {quizResults.length > 0 ? (
            quizResults.map((result) => (
              <View key={result.id} style={styles.quizCard}>
                <View style={styles.quizIcon}>
                  <Ionicons name="trophy" size={24} color="#ff2d1f" />
                </View>
                <View style={styles.quizContent}>
                  <Text style={styles.quizType}>{result.quiz_type}</Text>
                  <Text style={styles.quizScore}>
                    Score: {result.score}/{result.total_questions}
                  </Text>
                  <Text style={styles.quizDate}>
                    {new Date(result.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.quizPercentage}>
                  <Text style={styles.quizPercentageText}>
                    {Math.round((result.score / result.total_questions) * 100)}%
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No quiz results yet. Take a quiz to see your scores!</Text>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Goal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Goal Title"
              placeholderTextColor="#666"
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Goal Description"
              placeholderTextColor="#666"
              value={newGoal.description}
              onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Target Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666"
              value={newGoal.targetDate}
              onChangeText={(text) => setNewGoal({ ...newGoal, targetDate: text })}
            />

            <TouchableOpacity style={styles.createButton} onPress={createGoal}>
              <Text style={styles.createButtonText}>Create Goal</Text>
            </TouchableOpacity>
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
    color: '#ff2d1f',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  section: {
    padding: 24,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff2d1f',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  completedGoalCard: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  completedGoalTitle: {
    textDecorationLine: 'line-through',
  },
  goalDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 6,
  },
  goalDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteIconButton: {
    padding: 8,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quizContent: {
    flex: 1,
  },
  quizType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quizScore: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  quizDate: {
    fontSize: 12,
    color: '#999',
  },
  quizPercentage: {
    backgroundColor: '#ff2d1f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  quizPercentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    color: '#ff2d1f',
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
    marginBottom: 8,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#ff2d1f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0015',
  },
});