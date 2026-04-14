import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [statistics, setStatistics] = useState<any>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, goalsData] = await Promise.all([
        api.getStatistics(),
        api.getGoals(),
      ]);
      setStatistics(statsData);
      setGoals(goalsData.filter((g: any) => !g.completed).slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    setInsightsLoading(true);
    try {
      const data = await api.generateInsights(7);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff1fa9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Odissi Practice</Text>
          <Text style={styles.headerSubtitle}>Your Journey to Excellence</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={32} color="#ff1fa9" />
            <Text style={styles.statNumber}>{statistics?.total_sessions || 0}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color="#ff1fa9" />
            <Text style={styles.statNumber}>{statistics?.total_practice_hours || 0}h</Text>
            <Text style={styles.statLabel}>Practice Time</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#ff1fa9" />
            <Text style={styles.statNumber}>{statistics?.completed_goals || 0}/{statistics?.total_goals || 0}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color="#ff1fa9" />
            <Text style={styles.statNumber}>{statistics?.weekly_sessions || 0}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalIcon}>
                  <Ionicons name="flag" size={20} color="#ff1fa9" />
                </View>
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDate}>
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No active goals. Create one to start!</Text>
          )}
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Practice Insights</Text>
            <TouchableOpacity
              onPress={loadInsights}
              disabled={insightsLoading}
              style={styles.refreshButton}
            >
              {insightsLoading ? (
                <ActivityIndicator size="small" color="#ff1fa9" />
              ) : (
                <Ionicons name="refresh" size={20} color="#ff1fa9" />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.insightsCard}>
            {insights ? (
              <Text style={styles.insightsText}>{insights}</Text>
            ) : (
              <TouchableOpacity onPress={loadInsights} style={styles.insightsButton}>
                <Ionicons name="sparkles" size={24} color="#ff1fa9" />
                <Text style={styles.insightsButtonText}>Get Personalized Insights</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#050010',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#ff1fa9',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff1fa9',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  section: {
    padding: 24,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff1fa9',
    marginBottom: 16,
  },
  refreshButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  goalDate: {
    fontSize: 14,
    color: '#999',
  },
  insightsCard: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ff1fa9',
  },
  insightsText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  insightsButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  insightsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff1fa9',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});