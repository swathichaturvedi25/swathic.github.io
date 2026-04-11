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

// Authentic Odissi Hasta Bheda from Deepam Odissi Academy & Abhinaya Darpana

const FINGER_NAMES = [
  { name: 'ANGUSTHA', meaning: 'Thumb' },
  { name: 'TARJANI', meaning: 'Fore Finger' },
  { name: 'MADHYUMA', meaning: 'Middle Finger' },
  { name: 'ANAMIKA', meaning: 'Ring Finger' },
  { name: 'KANISHTHA', meaning: 'Little Finger' },
];

type HastaItem = {
  name: string;
  meaning: string;
  shloka?: string;
  shlokaTranslation?: string;
};

const ASAMYUKTA_HASTA: HastaItem[] = [
  {
    name: 'Pataka',
    meaning: 'Flag',
    shloka: 'Natyarambhe vaarivaahe vane vastu nishedhane\nKuchasthaale nishayaam cha nadyaam amaramandale\nTurange khandane vaayo shayanae gamanodyame\nPrataape cha prasaade cha chandrikaayaam ghane tape',
    shlokaTranslation: 'Beginning of dance, clouds, forest, forbidding things, bosom, night, river, heaven, horse, cutting, wind, sleeping, walking, prowess, grace, moonlight, intense heat',
  },
  {
    name: 'Tripataka',
    meaning: 'Three parts of a flag',
    shloka: 'Makute vrukshabhaveshu vajre tatdharvasave\nKetaki kusume deepe vanhijwaala vrijubhane\nKapote patralekhayaam banarthe parivartane',
    shlokaTranslation: 'Crown, tree, thunderbolt, Indra, ketaki flower, lamp, flames, pigeon, drawing patterns, shooting arrow, turning',
  },
  { name: 'Ardhapataka', meaning: 'Half flag' },
  {
    name: 'Kartarimukha',
    meaning: 'Scissors face',
    shloka: 'Vipareetagatau streepumdharmanae visleshane tathaa\nVipareetadrishau chaiva patanadau viniyujyate',
    shlokaTranslation: 'Opposite movement, separation of man and woman, looking the other way, falling',
  },
  {
    name: 'Mayura',
    meaning: 'Peacock',
  },
  {
    name: 'Ardhachandra',
    meaning: 'Half moon',
    shloka: 'Chandre krishnaashtami bhaaji galahastaarta kepi cha\nDevatanaam abhishechane jaanute shankare tathaa',
    shlokaTranslation: 'Moon, eighth day of dark fortnight, holding the neck, consecrating deities, waist, Lord Shiva',
  },
  { name: 'Arala', meaning: 'Crooked' },
  { name: 'Sukhatunda', meaning: 'Parrot\'s Beak' },
  {
    name: 'Mushti',
    meaning: 'Fist',
    shloka: 'Sthiratve kachagrahane daardhye vastudinaam dharane\nMallanaam yuddhabhede cha yujyate mushtirityayam',
    shlokaTranslation: 'Steadiness, grasping hair, firmness, holding objects, wrestling, combat',
  },
  {
    name: 'Shikhara',
    meaning: 'Spire',
    shloka: 'Kaarmukaye stambhae nischaye pitrukarmani\nShringaare romanchayushaanaam shabde shikharasanjnakah',
    shlokaTranslation: 'Bow, pillar, certainty, ancestor rites, love, thrilling of hair, ringing bells',
  },
  { name: 'Kapittha', meaning: 'Wood apple' },
  { name: 'Kataka Mukha (1,2 & 3)', meaning: 'Type of bird' },
  {
    name: 'Suchi',
    meaning: 'Needle',
    shloka: 'Yekaarthe padashatabde cha shatadarshanavachakae\nVishmaye brahmani vishnou suchihastah prayujyate',
    shlokaTranslation: 'Oneness, hundred, astonishment, Brahma, Vishnu, indicating number one',
  },
  { name: 'Chandrakala', meaning: 'Dark moon' },
  {
    name: 'Padmakosha',
    meaning: 'Half open lotus flower',
    shloka: 'Phalae bilavataam muurdhni sthaaleepaatratavat tathaa\nKadambakusumae stvamre vilasae padmakoshakah',
    shlokaTranslation: 'Fruit, hole, round head, vessel, kadamba flower, mango, elegance',
  },
  {
    name: 'Sarpashirsha',
    meaning: 'Serpent head',
  },
  { name: 'Mrigashirsha', meaning: 'Deer head' },
  { name: 'Simhamukha', meaning: 'Lion Face' },
  { name: 'Kangula', meaning: 'Bulb' },
  {
    name: 'Alapadma',
    meaning: 'Fully open lotus flower',
    shloka: 'Padmabodhane saundarye puurnamandaladarshane\nStanabhedae vichitreshu kaarya alapadmakah',
    shlokaTranslation: 'Blossoming lotus, beauty, full moon, variety, wonder, roundness',
  },
  { name: 'Chatura', meaning: 'Smart / Square' },
  {
    name: 'Bramhara',
    meaning: 'Bee',
    shloka: 'Bhringae pikae kukilae cha yoge pakshadivastathaa\nVyutyaam shouke kaandahane bramharasya viniyogah',
    shlokaTranslation: 'Bee, cuckoo, meditation, wings, sorrow, picking flower',
  },
  { name: 'Hamsasaya', meaning: 'Wild Goose or Swan' },
  { name: 'Hamsapakshya', meaning: 'Wild Goose or Swan\'s wing' },
  { name: 'Samdamsa', meaning: 'Firefly' },
  { name: 'Mukula', meaning: 'Flower bud' },
  { name: 'Tamrachuda', meaning: 'Rooster' },
  { name: 'Trishula', meaning: 'Trident (Emblem of Shiva)' },
];

const SAMYUKTA_HASTA: HastaItem[] = [
  {
    name: 'Anjali',
    meaning: 'Salutation',
    shloka: 'Devataaguruvipraanaam namaskareshu nakramaat\nKaaryashiirshamukhorasthu viniyogaanjalirbudhaih',
    shlokaTranslation: 'For salutation to gods (above head), to gurus (at forehead), to learned persons (at chest) — in this sequence',
  },
  {
    name: 'Kapota',
    meaning: 'Dove',
    shloka: 'Pranaame gurusamhbhaashe vinayaange kruteshvayam',
    shlokaTranslation: 'Respectful salutation, conversation with guru, acceptance and obedience',
  },
  { name: 'Karkata', meaning: 'Crab' },
  { name: 'Swastika', meaning: 'Cross' },
  { name: 'Dola', meaning: 'Swing' },
  { name: 'Pushpaputa', meaning: 'Flower casket' },
  { name: 'Utsanga', meaning: 'Embrace' },
  {
    name: 'Shivalinga',
    meaning: 'Masculine principal',
    shloka: 'Shivalingasya darshaane yujyate shivalingakah',
    shlokaTranslation: 'Depicting the sacred Shiva Linga',
  },
  { name: 'Katakavardhana', meaning: 'Link of increase' },
  { name: 'Kartariswastika', meaning: 'Crossed arrows' },
  { name: 'Shakata', meaning: 'Cart' },
  {
    name: 'Shankha',
    meaning: 'Conch shell',
    shloka: 'Shankhashankhadhvani bhoji shankhah shankhaartha yojyate',
    shlokaTranslation: 'Used for depicting conch shell and the sound of the conch',
  },
  { name: 'Chakra', meaning: 'Wheel' },
  { name: 'Samputa', meaning: 'Casket' },
  { name: 'Pasha', meaning: 'Noose' },
  { name: 'Kilaka', meaning: 'Bond' },
  { name: 'Matsya', meaning: 'Fish' },
  { name: 'Kurma', meaning: 'Turtle' },
  { name: 'Varaha', meaning: 'Wild boar' },
  { name: 'Garuda', meaning: 'Eagle' },
  { name: 'Nagabandha', meaning: 'Serpent tie' },
  { name: 'Khatva', meaning: 'Cot' },
  { name: 'Bherunda', meaning: 'Two-headed bird / pair of birds' },
];

const NRUTYA_HASTA: HastaItem[] = [
  { name: 'Pataka', meaning: 'Flag' },
  { name: 'Ardhapataka', meaning: 'Half Flag' },
  { name: 'Mayura', meaning: 'Peacock' },
  { name: 'Hansasya', meaning: 'Swan' },
  { name: 'Chatura', meaning: 'Smart' },
  { name: 'Ardhachandra', meaning: 'Half Moon' },
  { name: 'Alapadma', meaning: 'Full Lotus' },
  { name: 'Katakamukha', meaning: 'Opening of a Bracelet' },
  { name: 'Suchi', meaning: 'Needle' },
  { name: 'Sikhara', meaning: 'Spire' },
  { name: 'Kapitha', meaning: 'Wood Apple' },
  { name: 'Sukachanchu', meaning: 'Parrot\'s Beak' },
  { name: 'Anjali', meaning: 'Salutation' },
  { name: 'Swastika', meaning: 'Cross' },
  { name: 'Karkata', meaning: 'Crab' },
  { name: 'Dolahasta', meaning: 'Swing Hand' },
  { name: 'Puspaputa', meaning: 'Flower Casket' },
];

const PARAMPARA_HASTA: HastaItem[] = [
  { name: 'Bastra', meaning: 'Cloth' },
  { name: 'Tambula', meaning: 'Betel (Paan)' },
  { name: 'Puspa', meaning: 'Flower' },
  { name: 'Bana', meaning: 'Bow' },
  { name: 'Sukachanchu', meaning: 'Parrot\'s Beak' },
  { name: 'Padma', meaning: 'Lotus' },
  { name: 'Gabakshya', meaning: 'Window' },
  { name: 'Mayura', meaning: 'Peacock' },
  { name: 'Ubhaya Kartati', meaning: 'Love and affection' },
  { name: 'Pradeepa', meaning: 'Oil Lamp' },
];

// Main category enumeration shlokas from Abhinaya Darpana
const CATEGORY_SHLOKAS: Record<string, { shloka: string; translation: string }> = {
  asamyukta: {
    shloka: 'Pataakas Tripataako\'rdhapataakas\'chakaree mukhah\nMayuuraakhyo\'rdhachandrashcha aaraala shukutundakah\nMushtishcha shikharaakhyashcha kapeettha katakaamukhah\nSuchee chandrakalaa padmakosha sarpashirshathaa\nMrigashirsha simhamukhaangulashchaaalapadmakah\nChaturo bhramarashchaiva hamsaasyo hamsapakshakah\nSamdamsho mukulashchaiva taamrachoodas trishoola kah\nItyaasamyuktaah hastaanaam ashtaavimshatiriritaah',
    translation: 'Pataka, Tripataka, Ardhapataka, Kartarimukha, Mayura, Ardhachandra, Arala, Shukatunda, Mushti, Shikhara, Kapittha, Katakamukha, Suchi, Chandrakala, Padmakosha, Sarpashirsha, Mrigashirsha, Simhamukha, Kangula, Alapadma, Chatura, Bhramara, Hamsasya, Hamsapaksha, Samdamsha, Mukula, Tamrachuda, Trishula — Thus, the twenty-eight Asamyukta Hastas are described.',
  },
  samyukta: {
    shloka: 'Anjalishcha Kapothashcha Karkata Swastikastathaa\nDolahasta Pushpaputaha Utsangah Shivalingakaha\nKatakavardhanashchaiva Kartariswastikastathaa\nShakatam Shankha Chakrecha Samputa Pasha Keelakau\nMatsya Kurmo Varahashcha Garudo Nagabandhakaha\nKhatwa Bherundakakhyeshcha\nChaturvimshati sankhyaaka Samyuktaah kathitaah karaah',
    translation: 'Anjali, Kapota, Karkata, Swastika, Dola, Pushpaputa, Utsanga, Shivalinga, Katakavardhana, Kartariswastika, Shakata, Shankha, Chakra, Samputa, Pasha, Keelaka, Matsya, Kurma, Varaha, Garuda, Nagabandha, Khatva, Bherunda — Thus, the Samyukta Hastas are described.',
  },
  nrutya: {
    shloka: 'Patakaa Ardhapatakaa Mayura Hansasya Chaturah\nArdhachandra Alapadma Katakamukha Suchih\nShikhara Kapittha Sukachanchu Anjali\nSwastika Karkata Dolahasta Puspaputa cha',
    translation: 'These are the seventeen hand gestures used in pure dance (Nritta), drawn from both Asamyukta and Samyukta Hastas, frequently employed during performances.',
  },
  parampara: {
    shloka: 'Bastra Tambula Puspa Bana Sukachanchu\nPadma Gabakshya Mayura\nUbhaya Kartati Pradeepa cha\nIti parampara hastaa dashakah',
    translation: 'Cloth, Betel, Flower, Bow, Parrot\'s Beak, Lotus, Window, Peacock, Love and Affection, Oil Lamp — These ten are the traditional (Parampara) Hastas.',
  },
};

export default function HastaBhedaScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('asamyukta');
  const [showFingerInfo, setShowFingerInfo] = useState(false);
  const [expandedShloka, setExpandedShloka] = useState<number | null>(null);
  const [showCategoryShloka, setShowCategoryShloka] = useState(false);

  const categories = [
    { id: 'asamyukta', label: 'Asamyukta Hasta', count: 28 },
    { id: 'samyukta', label: 'Samyukta Hasta', count: 23 },
    { id: 'nrutya', label: 'Nrutya Hasta', count: 17 },
    { id: 'parampara', label: 'Parampara Hasta', count: 10 },
  ];

  const getCurrentList = (): HastaItem[] => {
    switch (selectedCategory) {
      case 'asamyukta': return ASAMYUKTA_HASTA;
      case 'samyukta': return SAMYUKTA_HASTA;
      case 'nrutya': return NRUTYA_HASTA;
      case 'parampara': return PARAMPARA_HASTA;
      default: return [];
    }
  };

  const getCategoryDescription = () => {
    switch (selectedCategory) {
      case 'asamyukta':
        return 'Single hand Mudras – These hand gestures are shown on single hand or on both hands separately';
      case 'samyukta':
        return 'Conjunctive Hand Gestures – These hand gestures are shown with both the hands joined together';
      case 'nrutya':
        return 'These are hand gestures for pure dance that are frequently used during performances. A collection of some Asamyukta and Samyukta Hasta Mudras.';
      case 'parampara':
        return 'Traditional Mudras commonly used during dance for easy understanding.';
      default:
        return '';
    }
  };

  const toggleShlokaExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedShloka(expandedShloka === index ? null : index);
  };

  const toggleCategoryShloka = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCategoryShloka(!showCategoryShloka);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setExpandedShloka(null);
    setShowCategoryShloka(false);
  };

  const categoryShloka = CATEGORY_SHLOKAS[selectedCategory];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasta Bheda</Text>
        <TouchableOpacity onPress={() => setShowFingerInfo(true)} style={styles.infoButton}>
          <Ionicons name="hand-left" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Speaking through Mudras</Text>
          <View style={styles.shlokaIntroBox}>
            <Text style={styles.shlokaLabel}>Abhinaya Darpana</Text>
            <Text style={styles.introShlokaSanskrit}>
              Yato hasta tato drishti{'\n'}
              Yato drishti tato manah{'\n'}
              Yato manah tato bhaavah{'\n'}
              Yato bhaavah tato rasah
            </Text>
            <View style={styles.shlokaTransDivider} />
            <Text style={styles.introQuote}>
              Where the hands are, the eyes follow{'\n'}
              Where the eyes are, the mind follows{'\n'}
              Where the mind goes, there is expression{'\n'}
              Where there is expression, mood is evoked
            </Text>
            <Text style={styles.introSubtext}>– Natya Shastra</Text>
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => handleCategoryChange(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
              <View style={[
                styles.countBadge,
                selectedCategory === cat.id && styles.countBadgeActive,
              ]}>
                <Text style={[
                  styles.countText,
                  selectedCategory === cat.id && styles.countTextActive,
                ]}>{cat.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{getCategoryDescription()}</Text>
        </View>

        {/* Category Shloka (Enumeration) */}
        {categoryShloka && (
          <TouchableOpacity
            style={styles.categoryShlokaButton}
            onPress={toggleCategoryShloka}
            activeOpacity={0.7}
          >
            <View style={styles.categoryShlokaHeader}>
              <View style={styles.categoryShlokaLabelRow}>
                <Ionicons name="book-outline" size={18} color="#FFD700" />
                <Text style={styles.categoryShlokaLabel}>Shloka</Text>
              </View>
              <Ionicons
                name={showCategoryShloka ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#FFD700"
              />
            </View>
            {showCategoryShloka && (
              <View style={styles.categoryShlokaContent}>
                <Text style={styles.categoryShlokaSanskrit}>
                  {categoryShloka.shloka}
                </Text>
                <View style={styles.shlokaTransDivider} />
                <Text style={styles.categoryShlokaTranslation}>
                  {categoryShloka.translation}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Hasta List */}
        <View style={styles.hastaList}>
          <Text style={styles.listTitle}>
            {categories.find(c => c.id === selectedCategory)?.label || ''}
          </Text>
          {getCurrentList().map((hasta, index) => {
            const hasShloka = !!hasta.shloka;
            const isExpanded = expandedShloka === index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.hastaCard,
                  hasShloka && styles.hastaCardWithShloka,
                  isExpanded && styles.hastaCardExpanded,
                ]}
                onPress={() => hasShloka && toggleShlokaExpand(index)}
                activeOpacity={hasShloka ? 0.7 : 1}
                disabled={!hasShloka}
              >
                <View style={styles.hastaMainRow}>
                  <View style={styles.hastaNumber}>
                    <Text style={styles.hastaNumberText}>{(index + 1).toString().padStart(2, '0')}</Text>
                  </View>
                  <View style={styles.hastaInfo}>
                    <Text style={styles.hastaName}>{hasta.name}</Text>
                    <Text style={styles.hastaMeaning}>{hasta.meaning}</Text>
                  </View>
                  {hasShloka && (
                    <View style={styles.shlokaIndicator}>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'book-outline'}
                        size={16}
                        color="#FFD700"
                      />
                    </View>
                  )}
                </View>
                {isExpanded && hasta.shloka && (
                  <View style={styles.hastaShlokaSection}>
                    <View style={styles.hastaShlokaLabelRow}>
                      <Ionicons name="musical-note" size={14} color="#FFD700" />
                      <Text style={styles.hastaShlokaTitle}>Viniyoga Shloka</Text>
                    </View>
                    <Text style={styles.hastaShlokaSanskrit}>{hasta.shloka}</Text>
                    {hasta.shlokaTranslation && (
                      <>
                        <View style={styles.shlokaTransDividerSmall} />
                        <Text style={styles.hastaShlokaTranslation}>{hasta.shlokaTranslation}</Text>
                      </>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Practice Note */}
        <View style={styles.practiceNote}>
          <Ionicons name="bulb-outline" size={24} color="#FFD700" />
          <Text style={styles.practiceNoteText}>
            Understanding the dance mudras and executing them correctly is a part of building yourself as a powerful performer. Each finger in our hand plays an important role in reciting the story of dance.
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
                <Ionicons name="close-circle" size={32} color="#FFD700" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.fingerIntro}>
                Each finger in our hand plays an important role in reciting the story of dance. Let us begin with naming our fingers:
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
                <Ionicons name="sparkles" size={20} color="#FFD700" />
                <Text style={styles.modalNoteText}>
                  Mastering the proper finger positions is essential for authentic Odissi Hasta Bheda!
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
  infoButton: {
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
    marginBottom: 16,
  },
  shlokaIntroBox: {
    backgroundColor: '#1a0033',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  shlokaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  introShlokaSanskrit: {
    fontSize: 15,
    color: '#FFD700',
    lineHeight: 26,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  shlokaTransDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginVertical: 12,
  },
  introQuote: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  introSubtext: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a0033',
    borderWidth: 1,
    borderColor: '#333',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  categoryTextActive: {
    color: '#1a0033',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  countBadgeActive: {
    backgroundColor: '#1a0033',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  countTextActive: {
    color: '#FFD700',
  },
  descriptionBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1a0033',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  descriptionText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  // Category Shloka Section
  categoryShlokaButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    overflow: 'hidden',
  },
  categoryShlokaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  categoryShlokaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryShlokaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD700',
  },
  categoryShlokaContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  categoryShlokaSanskrit: {
    fontSize: 14,
    color: '#FFD700',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  categoryShlokaTranslation: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Hasta List
  hastaList: {
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
  },
  hastaCard: {
    backgroundColor: '#1a0033',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  hastaCardWithShloka: {
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  hastaCardExpanded: {
    borderColor: '#FFD700',
    backgroundColor: '#1f0040',
  },
  hastaMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hastaNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  hastaNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a0033',
  },
  hastaInfo: {
    flex: 1,
  },
  hastaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  hastaMeaning: {
    fontSize: 13,
    color: '#999',
  },
  shlokaIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Individual Hasta Shloka
  hastaShlokaSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.15)',
  },
  hastaShlokaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  hastaShlokaTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hastaShlokaSanskrit: {
    fontSize: 14,
    color: '#FFD700',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  shlokaTransDividerSmall: {
    height: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    marginVertical: 10,
  },
  hastaShlokaTranslation: {
    fontSize: 13,
    color: '#CCCCCC',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  practiceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  practiceNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#FFD700',
    lineHeight: 20,
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
    maxHeight: '80%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
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
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  fingerNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fingerNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a0033',
  },
  fingerContent: {
    flex: 1,
  },
  fingerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  fingerMeaning: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  modalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  modalNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#FFD700',
    lineHeight: 18,
  },
});
