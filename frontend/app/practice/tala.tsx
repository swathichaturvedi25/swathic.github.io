import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Finger names (same as Hasta Bheda)
const FINGER_NAMES = [
  { name: 'ANGUSTHA', meaning: 'Thumb' },
  { name: 'TARJANI', meaning: 'Fore Finger' },
  { name: 'MADHYUMA', meaning: 'Middle Finger' },
  { name: 'ANAMIKA', meaning: 'Ring Finger' },
  { name: 'KANISHTHA', meaning: 'Little Finger' },
];

// Tala terminology
const TALA_TERMS = [
  {
    term: 'Baani (Vaani) / Vadhyakshar',
    definition: 'The one sound coming from Mardala is called Baani or Vadhyakshar.',
    examples: 'dha, dhi, na...',
  },
  {
    term: 'Ukuta',
    definition: 'More than one sound coming from Mardala is Ukuta.',
    examples: 'Dina, kita, naka, Jena...',
  },
  {
    term: 'Kanda Vaadya',
    definition: 'The mixture of Ukuta and Vaani.',
    examples: 'thake dha, dhadine dha, jenam takita...',
  },
  {
    term: 'Khandi',
    definition: 'To play Vaani, Ukuta, Kanda Vaadya in a serial manner. It could either include Tihai or be without it. Tihai comes after Sama and ends on Sama.',
  },
  {
    term: 'Gadi',
    definition: 'Played in Druta or Athidrutha Laya taking 4 or 8 Vaanis.',
    examples: 'Dina kadataka dina kadataka',
  },
  {
    term: 'Arasa',
    definition: 'In one or more complete Avartas from Sam to Sam, ending in a Tihai created using a series of Vani, Ukuta and Khandi. An Arasa can also include a Gadi.',
  },
  {
    term: 'Bhauri Arasa',
    definition: 'Arasa played thrice together. Tihai of Arasa.',
  },
];

const MANA_TYPES = [
  { name: 'Birama', description: 'Slight pause after dha or thei' },
  { name: 'Abhirama', description: 'No pause' },
  { name: 'Lagana', description: 'Dha will not repeat or come after 3rd sequence' },
  { name: 'Bhauri', description: 'Tihai of any type of Mana' },
];

const ADDITIONAL_TERMS = [
  {
    term: 'Jamana',
    definition: 'Rhythmic progression of Laya making use of any combination of Vani, Ukuta, or Kandi etc. Mostly played as a prelude to a performance to set the mood. It finishes with Tihai.',
  },
  {
    term: 'Kala',
    definition: 'Comes after Sama or Guru and has to be a beat. Wave of hand is Laghu or Khali. Only the first Sam is called Guru, rest all called Tali. In between is Kala.',
  },
];

// The four Talas with Shastriya Parichay
type DharanaByLaya = {
  VL: string;
  ML: string;
  DL: string;
};

type TalaItem = {
  name: string;
  jati: string;
  mathra: number;
  bhaga: number;
  chanda?: string;
  dharana: string;
  dharanaByLaya?: DharanaByLaya;
};

const TALAS: TalaItem[] = [
  {
    name: 'Ekatali',
    jati: 'Chaturashra Jathi',
    mathra: 4,
    bhaga: 1,
    dharana: '|| dha gadi naka dini ||',
    dharanaByLaya: {
      VL: '|| dha gadi naka dini ||',
      ML: '|| dha gadi |naka dini|| dha gadi |naka dini ||',
      DL: '|| dha gadi naka dini | dha gadi naka dini | dha gadi naka dini | dha gadi naka dini ||',
    },
  },
  {
    name: 'Roopak Tala',
    jati: 'Chaturashra Jathi',
    mathra: 6,
    bhaga: 2,
    chanda: '2 + 4',
    dharana: '|| dha kadatak dha kadatak thin dha ||',
    dharanaByLaya: {
      VL: '|| dha kadatak dha kadatak thin dha ||',
      ML: '|| dha kadatak | dha kadatak | thin dha | dha kadatak | dha kadatak | thin dha ||',
      DL: '|| dha kadatak dha kadatak | thin dha dha kadatak | dha kadatak thin dha | dha kadatak dha kadatak | thin dha dha kadatak | dha kadatak thin dha ||',
    },
  },
  {
    name: 'Triputa Tala',
    jati: 'Tishra Jathi',
    mathra: 7,
    bhaga: 3,
    chanda: '3 + 2 + 2',
    dharana: '|| dhei thatin dhaka thatin dhaka thatin dhaka ||',
    dharanaByLaya: {
      VL: '|| dhei thatin dhaka thatin dhaka thatin dhaka ||',
      ML: '|| dhei thatin | dhaka thatin | dhaka thatin |\ndhaka dhei | thatin dhaka |\nthatin dhaka | thatin dhaka ||',
      DL: '|| dhei thatin dhaka thatin | dhaka thatin dhaka dhei | thatin dhaka thatin dhaka | thatin dhaka dhei thatin | dhaka thatin dhaka thatin | dhaka dhei thatin dhaka | thatin dhaka thatin dhaka ||',
    },
  },
  {
    name: 'Khemta Tala',
    jati: 'Tishra Jathi',
    mathra: 6,
    bhaga: 2,
    chanda: '3 + 3',
    dharana: '|| dha dina kita na thina kita ||',
    dharanaByLaya: {
      VL: '|| dha dina kita na thina kita ||',
      ML: '|| dha dina | kita na | thina kita | dha dina | kita na | thina kita ||',
      DL: '|| dha dina kita na | thina kita dha dina | kita na thina kita | dha dina kita na | thina kita dha dina | kita na thina kita ||',
    },
  },
];

export default function TalaScreen() {
  const router = useRouter();
  const [showFingerInfo, setShowFingerInfo] = useState(false);
  const [expandedTala, setExpandedTala] = useState<number | null>(0);
  const [showTerms, setShowTerms] = useState(false);
  const [showMana, setShowMana] = useState(false);
  const [selectedLaya, setSelectedLaya] = useState<Record<number, 'VL' | 'ML' | 'DL'>>({});

  const toggleTala = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTala(expandedTala === index ? null : index);
  };

  const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ff1fa9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tala</Text>
        <TouchableOpacity onPress={() => setShowFingerInfo(true)} style={styles.infoButton}>
          <Ionicons name="hand-left" size={24} color="#ff1fa9" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Understanding Tala</Text>
          <View style={styles.definitionBox}>
            <Text style={styles.definitionLabel}>DEFINITION OF TALA</Text>
            <Text style={styles.definitionText}>
              Tala is the unit of measurement of the motion of song, Vadhya and Nrutya (dance). It can otherwise be defined as the measurement of invariable movement or motion of time.
            </Text>
          </View>
          <View style={styles.definitionBox}>
            <Text style={styles.definitionLabel}>DEFINITION OF LAYA</Text>
            <Text style={styles.definitionText}>
              Invariable speed of Tala is called Laya.
            </Text>
            <View style={styles.layaTypes}>
              <View style={styles.layaChip}>
                <Text style={styles.layaChipText}>Vilambita</Text>
                <Text style={styles.layaChipSub}>Slow</Text>
              </View>
              <View style={styles.layaChip}>
                <Text style={styles.layaChipText}>Madhyama</Text>
                <Text style={styles.layaChipSub}>Medium</Text>
              </View>
              <View style={styles.layaChip}>
                <Text style={styles.layaChipText}>Druth</Text>
                <Text style={styles.layaChipSub}>Fast</Text>
              </View>
              <View style={styles.layaChip}>
                <Text style={styles.layaChipText}>Athidruth</Text>
                <Text style={styles.layaChipSub}>Very Fast</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tala Terminology - Collapsible */}
        <TouchableOpacity
          style={styles.sectionToggle}
          onPress={() => toggleSection(setShowTerms, showTerms)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionToggleRow}>
            <Ionicons name="book-outline" size={18} color="#ff1fa9" />
            <Text style={styles.sectionToggleText}>Words Used in Tala</Text>
          </View>
          <Ionicons name={showTerms ? 'chevron-up' : 'chevron-down'} size={20} color="#ff1fa9" />
        </TouchableOpacity>

        {showTerms && (
          <View style={styles.termsSection}>
            {TALA_TERMS.map((item, index) => (
              <View key={index} style={styles.termCard}>
                <View style={styles.termNumber}>
                  <Text style={styles.termNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.termContent}>
                  <Text style={styles.termName}>{item.term}</Text>
                  <Text style={styles.termDef}>{item.definition}</Text>
                  {item.examples && (
                    <Text style={styles.termExample}>e.g., {item.examples}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Mana - Collapsible */}
        <TouchableOpacity
          style={styles.sectionToggle}
          onPress={() => toggleSection(setShowMana, showMana)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionToggleRow}>
            <Ionicons name="layers-outline" size={18} color="#ff1fa9" />
            <Text style={styles.sectionToggleText}>Mana & Other Terms</Text>
          </View>
          <Ionicons name={showMana ? 'chevron-up' : 'chevron-down'} size={20} color="#ff1fa9" />
        </TouchableOpacity>

        {showMana && (
          <View style={styles.termsSection}>
            <View style={styles.manaIntro}>
              <Text style={styles.manaIntroTitle}>Mana</Text>
              <Text style={styles.manaIntroText}>
                Tihai ends in "dha" or "thei" pattern of Bhols repeating themselves ending on Sama. Four types:
              </Text>
            </View>
            {MANA_TYPES.map((mana, index) => (
              <View key={index} style={styles.manaCard}>
                <Text style={styles.manaLetter}>{String.fromCharCode(97 + index)}</Text>
                <View style={styles.manaContent}>
                  <Text style={styles.manaName}>{mana.name}</Text>
                  <Text style={styles.manaDesc}>{mana.description}</Text>
                </View>
              </View>
            ))}
            {ADDITIONAL_TERMS.map((item, index) => (
              <View key={index} style={styles.termCard}>
                <View style={[styles.termNumber, { backgroundColor: '#5e18eb' }]}>
                  <Ionicons name={index === 0 ? 'trending-up' : 'time-outline'} size={16} color="#0d0015" />
                </View>
                <View style={styles.termContent}>
                  <Text style={styles.termName}>{item.term}</Text>
                  <Text style={styles.termDef}>{item.definition}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Talas Section */}
        <View style={styles.talasHeader}>
          <Text style={styles.talasTitle}>Talas</Text>
          <Text style={styles.talasSubtitle}>Shastriya Parichay</Text>
        </View>

        <View style={styles.talasList}>
          {TALAS.map((tala, index) => {
            const isExpanded = expandedTala === index;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.talaCard,
                  isExpanded && styles.talaCardExpanded,
                ]}
                onPress={() => toggleTala(index)}
                activeOpacity={0.7}
              >
                <View style={styles.talaMainRow}>
                  <View style={styles.talaIndex}>
                    <Text style={styles.talaIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.talaNameSection}>
                    <Text style={styles.talaName}>{tala.name}</Text>
                    <Text style={styles.talaJati}>{tala.jati}</Text>
                  </View>
                  <View style={styles.talaMathraBadge}>
                    <Text style={styles.talaMathraText}>{tala.mathra}</Text>
                    <Text style={styles.talaMathraLabel}>mathra</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#ff1fa9"
                  />
                </View>

                {isExpanded && (
                  <View style={styles.talaDetails}>
                    <View style={styles.talaDetailRow}>
                      <Text style={styles.talaDetailLabel}>Jati</Text>
                      <Text style={styles.talaDetailValue}>{tala.jati}</Text>
                    </View>
                    <View style={styles.talaDetailRow}>
                      <Text style={styles.talaDetailLabel}>Mathra</Text>
                      <Text style={styles.talaDetailValue}>{tala.mathra}</Text>
                    </View>
                    <View style={styles.talaDetailRow}>
                      <Text style={styles.talaDetailLabel}>Bhaga</Text>
                      <Text style={styles.talaDetailValue}>{tala.bhaga}</Text>
                    </View>
                    {tala.chanda && (
                      <View style={styles.talaDetailRow}>
                        <Text style={styles.talaDetailLabel}>Chanda</Text>
                        <Text style={styles.talaDetailValue}>{tala.chanda}</Text>
                      </View>
                    )}
                    <View style={styles.dharanaSection}>
                      <Text style={styles.dharanaLabel}>DHARANA</Text>
                      {tala.dharanaByLaya ? (
                        <View>
                          <View style={styles.layaTabs}>
                            {(['VL', 'ML', 'DL'] as const).map((laya) => {
                              const currentLaya = selectedLaya[index] || 'VL';
                              const isActive = currentLaya === laya;
                              const layaLabels = { VL: 'Vilambita', ML: 'Madhyama', DL: 'Druth' };
                              return (
                                <TouchableOpacity
                                  key={laya}
                                  style={[styles.layaTab, isActive && styles.layaTabActive]}
                                  onPress={() => setSelectedLaya({ ...selectedLaya, [index]: laya })}
                                >
                                  <Text style={[styles.layaTabLabel, isActive && styles.layaTabLabelActive]}>{laya}</Text>
                                  <Text style={[styles.layaTabSub, isActive && styles.layaTabSubActive]}>{layaLabels[laya]}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <View style={styles.dharanaBox}>
                            <Text style={styles.dharanaText}>
                              {tala.dharanaByLaya[selectedLaya[index] || 'VL']}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.dharanaBox}>
                          <Text style={styles.dharanaText}>{tala.dharana}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.practiceNote}>
          <Ionicons name="bulb-outline" size={24} color="#ff1fa9" />
          <Text style={styles.practiceNoteText}>
            Mastering Tala is essential for any Odissi dancer. Practice counting the mathra in each Tala while reciting the Dharana to build rhythm.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Finger Names Modal */}
      <Modal
        visible={showFingerInfo}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFingerInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Finger Names in Sanskrit</Text>
              <TouchableOpacity onPress={() => setShowFingerInfo(false)}>
                <Ionicons name="close-circle" size={32} color="#ff1fa9" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.fingerIntro}>
                Each finger plays an important role in counting and keeping the rhythm of Tala:
              </Text>

              {FINGER_NAMES.map((finger, index) => (
                <View key={index} style={styles.fingerCard}>
                  <View style={styles.fingerNumber}>
                    <Text style={styles.fingerNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.fingerContent}>
                    <Text style={styles.fingerName}>{finger.name}</Text>
                    <Text style={styles.fingerMeaning}>{finger.meaning}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.modalNote}>
                <Ionicons name="sparkles" size={20} color="#ff1fa9" />
                <Text style={styles.modalNoteText}>
                  Proper finger positioning is used to count and keep time in Tala practice!
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
  infoButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  scrollView: {
    flex: 1,
  },
  // Introduction
  introSection: {
    padding: 24,
    paddingBottom: 8,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff1fa9',
    marginBottom: 16,
  },
  definitionBox: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.3)',
  },
  definitionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff1fa9',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  layaTypes: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  layaChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 31, 169, 0.08)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.2)',
  },
  layaChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ff1fa9',
    textAlign: 'center',
  },
  layaChipSub: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  // Section Toggles
  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    padding: 14,
    backgroundColor: 'rgba(255, 31, 169, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.25)',
  },
  sectionToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionToggleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ff1fa9',
  },
  // Terms Section
  termsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  termCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  termNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff1fa9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  termNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  termContent: {
    flex: 1,
  },
  termName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff1fa9',
    marginBottom: 4,
  },
  termDef: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  termExample: {
    fontSize: 13,
    color: '#5e18eb',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Mana Section
  manaIntro: {
    marginBottom: 12,
  },
  manaIntroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1fa9',
    marginBottom: 4,
  },
  manaIntroText: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  manaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 31, 169, 0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.15)',
  },
  manaLetter: {
    width: 28,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff1fa9',
    textAlign: 'center',
  },
  manaContent: {
    flex: 1,
    marginLeft: 8,
  },
  manaName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  manaDesc: {
    fontSize: 13,
    color: '#999',
  },
  // Talas Section
  talasHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  talasTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  talasSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontStyle: 'italic',
  },
  talasList: {
    paddingHorizontal: 16,
  },
  talaCard: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  talaCardExpanded: {
    borderColor: '#ff1fa9',
    backgroundColor: '#150020',
  },
  talaMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  talaIndex: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff1fa9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  talaIndexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  talaNameSection: {
    flex: 1,
  },
  talaName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  talaJati: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  talaMathraBadge: {
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(255, 31, 169, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  talaMathraText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  talaMathraLabel: {
    fontSize: 9,
    color: '#999',
    textTransform: 'uppercase',
  },
  // Tala Details
  talaDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 31, 169, 0.15)',
  },
  talaDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  talaDetailLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  talaDetailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dharanaSection: {
    marginTop: 14,
  },
  dharanaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ff1fa9',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dharanaBox: {
    backgroundColor: 'rgba(255, 31, 169, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.25)',
  },
  dharanaText: {
    fontSize: 16,
    color: '#ff1fa9',
    lineHeight: 28,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Laya Tabs
  layaTabs: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  layaTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.15)',
  },
  layaTabActive: {
    backgroundColor: '#ff1fa9',
    borderColor: '#ff1fa9',
  },
  layaTabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  layaTabLabelActive: {
    color: '#0d0015',
  },
  layaTabSub: {
    fontSize: 10,
    color: '#999',
    marginTop: 1,
  },
  layaTabSubActive: {
    color: '#0d0015',
  },
  practiceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 31, 169, 0.1)',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.3)',
  },
  practiceNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#ff1fa9',
    lineHeight: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0d0015',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#ff1fa9',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff1fa9',
  },
  modalScroll: {
    padding: 20,
  },
  fingerIntro: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 20,
  },
  fingerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 31, 169, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.2)',
  },
  fingerNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff1fa9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fingerNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d0015',
  },
  fingerContent: {
    flex: 1,
  },
  fingerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff1fa9',
    marginBottom: 4,
  },
  fingerMeaning: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  modalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 31, 169, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 31, 169, 0.3)',
  },
  modalNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#ff1fa9',
    lineHeight: 18,
  },
});
