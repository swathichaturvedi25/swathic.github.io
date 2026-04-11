import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕉️ Abhyasa:</Text>
      <Text style={styles.subtitle}>Odissi Dance</Text>
      <Text style={styles.tagline}>Classical Indian Dance Excellence</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
});