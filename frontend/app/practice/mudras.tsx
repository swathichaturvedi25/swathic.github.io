import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Comprehensive Odissi Hasta Mudras
const MUDRAS = [
  // Asamyuta Hastas (Single Hand)
  {
    id: 'pataka',
    name: 'Pataka',
    type: 'Asamyuta',
    description: 'Flag - All fingers extended and joined together, thumb bent',
    formation: 'Keep all four fingers straight and together. Bend the thumb and press it against the palm.',
    meanings: ['Cloud', 'Rain', 'River', 'Night', 'Horse', 'Blessing'],
    usage: 'One of the most common mudras in Odissi, used for depicting natural elements and broad gestures.',
  },
  {
    id: 'tripataka',
    name: 'Tripataka',
    type: 'Asamyuta',
    description: 'Three parts of a flag - Ring finger bent, other fingers extended',
    formation: 'Extend index, middle, and little fingers. Bend the ring finger. Thumb bent at the joint.',
    meanings: ['Crown', 'Tree', 'Flame', 'Vajra (thunderbolt)'],
    usage: 'Used to depict trees, crowns, and flames in Odissi choreography.',
  },
  {
    id: 'ardhapataka',
    name: 'Ardhapataka',
    type: 'Asamyuta',
    description: 'Half flag - Little finger extended, others bent',
    formation: 'From Pataka, lower the little finger.',
    meanings: ['Leaf', 'River bank', 'Knife', 'Spear'],
    usage: 'Represents sharp objects and delicate natural elements.',
  },
  {
    id: 'kartarimukha',
    name: 'Kartarimukha',
    type: 'Asamyuta',
    description: 'Scissors - Index and middle fingers apart, others closed',
    formation: 'Separate index and middle fingers like scissors. Ring and little fingers bent, thumb bent.',
    meanings: ['Separation', 'Disagreement', 'Lightning', 'Creeper'],
    usage: 'Used to show division, conflict, or lightning in dance narratives.',
  },
  {
    id: 'mayura',
    name: 'Mayura',
    type: 'Asamyuta',
    description: 'Peacock - Tips of ring finger and thumb touching',
    formation: 'Touch the tip of the ring finger to the tip of the thumb. Other fingers extended.',
    meanings: ['Peacock', 'Flower', 'Beauty'],
    usage: 'Depicts the peacock, an important symbol in Odissi, and general beauty.',
  },
  {
    id: 'ardhachandra',
    name: 'Ardhachandra',
    type: 'Asamyuta',
    description: 'Half moon - Thumb extended away from other fingers',
    formation: 'Extend thumb away from palm. Keep other four fingers together and curved.',
    meanings: ['Moon', 'Face', 'Prayer', 'Salutation'],
    usage: 'Represents the moon, human face, and gestures of respect.',
  },
  {
    id: 'alapadma',
    name: 'Alapadma',
    type: 'Asamyuta',
    description: 'Blooming lotus - Fingers separated and slightly curved',
    formation: 'Spread all fingers apart and curve them slightly like a blooming flower.',
    meanings: ['Lotus in full bloom', 'Offering', 'Sun'],
    usage: 'Depicts fully bloomed lotus and offering gestures.',
  },
  {
    id: 'mukula',
    name: 'Mukula',
    type: 'Asamyuta',
    description: 'Bud - All fingertips touching',
    formation: 'Bring all five fingertips together to form a bud shape.',
    meanings: ['Flower bud', 'Eating', 'Giving', 'Taking'],
    usage: 'Shows actions of eating, giving, taking, or a closed flower bud.',
  },
  {
    id: 'shikhara',
    name: 'Shikhara',
    type: 'Asamyuta',
    description: 'Peak - Thumb resting on ring and little fingers',
    formation: 'Bend ring and little fingers. Place thumb on them. Index and middle fingers extended.',
    meanings: ['Shiva', 'Temple tower', 'Arrow', 'Question'],
    usage: 'Used to depict Lord Shiva and temple architecture.',
  },
  {
    id: 'kapittha',
    name: 'Kapittha',
    type: 'Asamyuta',
    description: 'Wood apple - Index finger and thumb touching, others separated',
    formation: 'Touch index finger tip to thumb tip. Separate other three fingers.',
    meanings: ['Goddess Lakshmi', 'Saraswati', 'Writing'],
    usage: 'Represents goddesses and the act of writing.',
  },
  
  // Samyuta Hastas (Double Hand)
  {
    id: 'anjali',
    name: 'Anjali',
    type: 'Samyuta',
    description: 'Salutation - Both palms joined together',
    formation: 'Join both palms together in front of chest, fingers pointing upward.',
    meanings: ['Namaste', 'Prayer', 'Respect', 'Devotion'],
    usage: 'The most sacred mudra, used for greeting and showing reverence.',
  },
  {
    id: 'kapota',
    name: 'Kapota',
    type: 'Samyuta',
    description: 'Pigeon - Palms crossed at wrists',
    formation: 'Cross wrists with palms facing down, forming a bird-like shape.',
    meanings: ['Embrace', 'Pigeon', 'Tenderness'],
    usage: 'Depicts birds and gentle embrace.',
  },
  {
    id: 'pushpaputa',
    name: 'Pushpaputa',
    type: 'Samyuta',
    description: 'Handful of flowers - Palms cupped together',
    formation: 'Cup both palms together as if holding flowers.',
    meanings: ['Offering flowers', 'Holding water', 'Cup'],
    usage: 'Shows the act of offering or holding something precious.',
  },
  {
    id: 'swastika',
    name: 'Swastika',
    type: 'Samyuta',
    description: 'Auspicious mark - Wrists crossed with palms facing body',
    formation: 'Cross wrists with palms facing toward you, fingers pointing down.',
    meanings: ['Sacred symbol', 'Meditation', 'Sitting posture'],
    usage: 'Represents meditation and sacred symbols.',
  },
];

export default function HastaMudrasScreen() {
  const router = useRouter();
  const [selectedMudra, setSelectedMudra] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredMudras = filterType === 'all' 
    ? MUDRAS 
    : MUDRAS.filter(m => m.type.toLowerCase() === filterType);

  const openMudraDetails = (mudra: any) => {
    setSelectedMudra(mudra);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasta Mudras</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Master Odissi Hand Gestures</Text>
          <Text style={styles.introText}>
            Hasta Mudras are sacred hand gestures that form the language of Odissi dance. Each mudra carries multiple meanings and is essential for storytelling.
          </Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
              All ({MUDRAS.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'asamyuta' && styles.filterTabActive]}
            onPress={() => setFilterType('asamyuta')}
          >
            <Text style={[styles.filterText, filterType === 'asamyuta' && styles.filterTextActive]}>
              Single Hand ({MUDRAS.filter(m => m.type === 'Asamyuta').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filterType === 'samyuta' && styles.filterTabActive]}
            onPress={() => setFilterType('samyuta')}
          >
            <Text style={[styles.filterText, filterType === 'samyuta' && styles.filterTextActive]}>
              Double Hand ({MUDRAS.filter(m => m.type === 'Samyuta').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mudras List */}
        <View style={styles.mudrasList}>
          {filteredMudras.map((mudra, index) => (
            <TouchableOpacity
              key={mudra.id}
              style={styles.mudraCard}
              onPress={() => openMudraDetails(mudra)}
            >
              <View style={styles.mudraNumber}>
                <Text style={styles.mudraNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.mudraContent}>
                <View style={styles.mudraHeader}>
                  <Text style={styles.mudraName}>{mudra.name}</Text>
                  <View style={styles.mudraTypeBadge}>
                    <Text style={styles.mudraTypeText}>{mudra.type}</Text>
                  </View>
                </View>
                <Text style={styles.mudraDescription}>{mudra.description}</Text>
                <View style={styles.meaningsContainer}>
                  {mudra.meanings.slice(0, 3).map((meaning: string, idx: number) => (
                    <View key={idx} style={styles.meaningChip}>
                      <Text style={styles.meaningText}>{meaning}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Mudra Details Modal */}
      <Modal
        visible={selectedMudra !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedMudra(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedMudra?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedMudra(null)}>
                <Ionicons name="close-circle" size={32} color="#FFD700" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.sectionLabel}>TYPE</Text>
                <Text style={styles.sectionValue}>{selectedMudra?.type} Hasta</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                <Text style={styles.sectionValue}>{selectedMudra?.description}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionLabel}>HOW TO FORM</Text>
                <Text style={styles.formationText}>{selectedMudra?.formation}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionLabel}>MEANINGS & USES</Text>
                {selectedMudra?.meanings.map((meaning: string, idx: number) => (
                  <View key={idx} style={styles.meaningItem}>
                    <Ionicons name="ellipse" size={8} color="#FFD700" />
                    <Text style={styles.meaningItemText}>{meaning}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionLabel}>USAGE IN ODISSI</Text>
                <Text style={styles.usageText}>{selectedMudra?.usage}</Text>
              </View>

              <View style={styles.practiceHint}>
                <Ionicons name="bulb" size={24} color="#FFD700" />
                <Text style={styles.practiceHintText}>
                  Practice this mudra in front of a mirror to perfect the hand position!
                </Text>
              </View>
            </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  introSection: {
    padding: 24,
    paddingBottom: 16,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1a0033',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  filterTextActive: {
    color: '#1a0033',
  },
  mudrasList: {
    paddingHorizontal: 16,
  },
  mudraCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1a0033',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  mudraNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mudraNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a0033',
  },
  mudraContent: {
    flex: 1,
  },
  mudraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mudraName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mudraTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  mudraTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFD700',
  },
  mudraDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
    lineHeight: 20,
  },
  meaningsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  meaningChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  meaningText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '500',
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
    maxHeight: '85%',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#FFD700',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  modalScroll: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  formationText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  meaningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  meaningItemText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  usageText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  practiceHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  practiceHintText: {
    flex: 1,
    fontSize: 14,
    color: '#FFD700',
    lineHeight: 20,
  },
});
