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
    shloka: 'Natyarambhae vaarivahae vanai vastu nishedhanae\nKuchasthalae nishayam cha nadyam amaramandalae\nTurangae khandanae vayo shayanae gamanodyamae\nPratapae cha prasadae cha chandrikayam Ghana tapae\nKavaadapaatanae saptavibhaktyarthae tharangae\nVeedi praveshabhavepi samatvae cha angaragakae\nAatmarthae shapathae chapae thooshnim bhava nidharshanae\nThaalapatrae cha kheitae cha dravyadi sparshanae thatha\nAashirvadaekriyayam cha nrupa sreshtasya\nThatra Thatreti vachanae sindhyo cha sukruthikramae\nSambhodhanae purogaepae khadgarupasya dharanae\nMasae samvathsarae varsha dinae sammarjanae thatha\nYevamardhyeshu yujanthae pataaka hasta bhavanaha',
    shlokaTranslation: 'Natyarambhae: Beginning of dance | Vaarivahae: Rain clouds | Vanai: Forest | Vastu nishedhanae: To deny/object/avoid | Kuchasthalae: Bosom | Nisha: Night | Nadyam: River | Amaramandalae: Heaven | Thurangae: Horse | Khandanae: Cutting | Vayo: Wind | Shayanae: Sleeping | Gamanodhyamae: Walking | Prataapae: Show power | Prasaadae: Bless | Chandrika: Moon light | Ghana tapae: Strong sunlight | Kavaadapaatana: Opening & closing door | Sapthavibhakthiyarthae: Seven cases | Tharangae: Waves | Veedi pravesha: Entering a street | Samatvae: Equality | Anga ragakae: Applying sandal paste | Aathmarthae: Oneself | Shapathae: Take an oath | Thooshnim bhava: Silence/Secret act | Thaala patrae: Palm leaf/Letter | Kheitae: Shield | Dravyadis sparshanae: Touching things | Ashirvadae: Blessing | Nrupa sreshtasya: Powerful king | Thathra Tatreti vachanae: \'This\' or \'That\' | Sindhyo: Ocean | Sukrithikramae: To be good | Sambhodhanam: Address someone | Purogaipae: Move forward | Khadga: Sword | Dharanae: To wear | Masae: Month | Samvathsarae: Year | Varsha dinae: Rainy day | Sammarjanae: To sweep',
  },
  {
    name: 'Tripataka',
    meaning: 'Three parts of a flag',
    shloka: 'Makutae vrikshabhaavecha Vajrae Thaddharavasavae\nKetakae kusumae Deepae Vanhijwalavigrumbhanae\nKapoothae patralekhayaam Baanaarthae parivarthanae\nYujyathae Tripataakoyaam Kathithou Bharatamuthamaihi',
    shlokaTranslation: 'Makutae: Crown | Vriksha: Tree | Vajrae: Thunderbolt | Thaddharavasavae: Lord Indra | Ketakae kusumae: Ketaki flower | Deepae: Lamp | Vanhijwalavi grumbhanae: Flames | Kapothae: Pigeon | Patralekhayam: Drawing patterns on face/chest | Baanaarthae: Shooting arrow | Parivarthanae: Circling',
  },
  {
    name: 'Ardhapataka',
    meaning: 'Half flag',
    shloka: 'Pallavae phalakae theerae Ubhayorithivachakae\nKrakachae Churikayam cha dhwajae gopura shringayoho\nYujyathae ardhapataakoyam Thathatkarmaprayogakae',
    shlokaTranslation: 'Pallavae: Leaves | Phalakae: Writing pad | Theerae: Bank of a river | Ubhayorithi vachakae: To say Both | Krakachae: Saw | Churikayam: Knife | Dhwajae: Flag | Gopura: Gopuram of a Temple | Shringayoho: Horns',
  },
  {
    name: 'Kartarimukha',
    meaning: 'Scissors face',
    shloka: 'Shtripum-sayoosthu-vishlasya Viparyaa-sapaday-pivaa\nLuntana Nayana-amtham Marana Bheda-bhavana\nVidhyu-dartha Api-yekashiyaa-viraha Patana Latayan\nYujathay Yasthu Sakara Kartarimukhaa',
    shlokaTranslation: 'Shtripum vishlasya: Separation of man & woman | Viparyaa: Opposition/overturning | Luntana: Stealing/rolling | Nayana-amtham: Corner of the eye | Marana: Death | Bheda-bhavana: Disagreement | Vidhyu-dartha: Lightning | Viraha: Separation from loved one | Patana: To fall down | Latayan: A creeper',
  },
  {
    name: 'Mayura',
    meaning: 'Peacock',
    shloka: 'Mayurasyam Latayancha Shakuna Vamana\nAlakashyapa Nayana Lalaata-Tilakam-Shucha\nNadyu-Ddakasya-Niksheypam Shastra-Vaada Prasi-Dhaka\nEvamarteshu Yujyanthe MayuraKara Bhaavanaaha',
    shlokaTranslation: 'Mayurasyam: Peacock | Latayancha: A creeper vine | Shakuna: Bird of Omen | Vamana: Vomiting | Alakashyapa: Decorating forehead | Nayana: Eye/putting Kajal | Lalaata-Tilakam: Tilak on forehead | Nadyu-Ddakasya-Niksheypam: Sprinkling holy water | Shastra-Vaada: Discussing the sastra | Prasi-Dhaka: Very famous',
  },
  {
    name: 'Ardhachandra',
    meaning: 'Half moon',
    shloka: 'Chandray Krishna AshtamiBaaji Gala Hastartha Kepicha\nBhalaYudha Devathanam Abishechana Karmani\nBukpathra Chudbava Katyaam Chintayam Athma-Vachakam\nDhyana Prathana Anganam-Sparsha\nPrakruthanam Namaskaram Ardha Chandrani Jujyathay',
    shlokaTranslation: 'Chandray: Moon | Krishna Ashtami: 8th day of waning moon | Gala Hastartha: Seizing by throat | Bhala Yudha: A spear | Devathanam Abishechana: Offering to God | Bukpathra: Plate | Chudbava: Origin/Birth | Katyaam: Waist | Chintayam: Thinking/Worrying | Athma Vachakam: Contemplation | Dhyana: Meditation | Prathana: Prayers | Anganam Sparsha: Touching limbs | Prakruthanam Namaskaram: Greeting common people',
  },
  {
    name: 'Arala',
    meaning: 'Bent',
    shloka: 'Vishadhyam Amritam Panay Pranchanda Pavana',
    shlokaTranslation: 'Vishadhyam Amritam Panay: To drink poison/nectar | Pranchanda Pavana: Strong winds (storm/gale)',
  },
  {
    name: 'Shukatunda',
    meaning: 'Parrot\'s Beak',
    shloka: 'Bhaana Prayooga Kunthartha Aalayasyas smridikarma\nMarmookthyam Mugrabhava',
    shlokaTranslation: 'Bhaana Prayooga: Shooting an arrow | Kunthartha: A Spear | Aalayasyas smridikarma: Remembering the past | Marmookthyam: Mystic feeling | Mugrabhava: Angry mood',
  },
  {
    name: 'Mushti',
    meaning: 'Fist',
    shloka: 'Shtiram Kachagraha Daartya Vasthvadeenaamcha Dharana\nMaliaanam Yudhabava Mushti Hasta Ya Mishyate',
    shlokaTranslation: 'Shtiram: Steadiness | Kachagraha: Grasping one\'s hair | Daartya: Courage | Vasthvadeenaamcha Dharana: Holding things | Maliaanam Yudhabava: Fighting mood of wrestlers',
  },
  {
    name: 'Shikhara',
    meaning: 'Peak / Spire',
    shloka: 'Madhana Kaamuka Sthamba Nishchaya Pithrukarmani\nOshtra Pravishtaroopa Radhana Prashnabhavana\nLinga Naastheetivachana Samarana Katibhandhakarshana\nParirambhavidikrama Gantaninadha\nSikhara Jujyate Bharata Dibi',
    shlokaTranslation: 'Madhana: God of love (Kama) | Kaamuka: Bow | Sthamba: Pillar | Nishchaya: Certainty | Pithrukarmani: Offering to ancestors | Oshtra: Lips | Pravishtaroopa: To pour liquid | Radhana: Teeth | Prashnabhavana: Questioning | Linga: Shiva Lingam | Naastheetivachana: Saying "I don\'t know" | Samarana: Recollection | Katibhandhakarshana: Tightening waist band | Parirambhavidikrama: Embracing | Gantaninadha: Sounding a bell',
  },
  {
    name: 'Kapittha',
    meaning: 'Elephant-apple / Wood apple',
    shloka: 'Lakshmyamchiva Saraswatyam Veshtane Taladharane\nGodohanechanjanecha Leelattasumadharane\nChelanchaladigrahane Patasyivavakuntane\nDhoopadeepaarchanechapi Kapithasamprayujyate',
    shlokaTranslation: 'Lakshmyamchiva: Goddess Lakshmi | Saraswatyam: Goddess Saraswati | Veshtane: Going around | Taladharane: Holding cymbals (Tala) | Godohanech: Milking cows | Anjanecha: Putting eye liner | Leelattasumadharane: Holding flowers | Chelanchaladigrahane: Holding saree pallu | Patasyivavakuntane: Draping cloth on face | Dhoopadeepaarchanechapi: Holding lamp & incense',
  },
  {
    name: 'Katakamukha',
    meaning: 'Opening in a bracelet',
    shloka: 'Kusumaapachayae muktasrakdamnam dharanam\nSharamadhyaakarshanam Nagavallipradhanam\nKasturikaadivastunam peshana Gandhavasana\nVachana Drushti yujyathae katakamukha karaha',
    shlokaTranslation: 'Kusumaapachayae: Plucking flowers | Muktasrakdamnam dharanam: Wearing pearl necklace | Sharamadhyaakarshanam: Drawing arrow at centre of bow | Nagavallipradhanam: Offering betel leaves | Kasturikaadivastunam peshana: Preparing paste of musk | Gandhavasana: To smell | Vachana: Speak | Drushti: Glancing',
  },
  {
    name: 'Suchi',
    meaning: 'Needle',
    shloka: 'Ekarthepi arabrahmabhavanayam Shatapicha\nRavou Nagaryam Lokarthe Tathepivachanepicha\nYachabdepichatatchabdhe Vyajanarthepitarjane\nKarshye Shalakavapushe Ashcharye Venibhavane\nChatre Samarthe Konecha Romalyam Bheribhedhane\nKulalachakrabhramane Rathange Mandaletatha\nVivechane Dinantecha Suchi Hasta Prakeertithaha',
    shlokaTranslation: 'Ekarthepi: Number one | arabrahmabhavanayam: Para Brahma | Shatapicha: Number 100 | Ravou: Sun | Nagaryam: City/Universe | Lokarthe: \'That\'s how it is\' | Yachabde: Asking when/why/who/how | Vyajanarthepitarjane: Scaring | Karshye: Thin/Skinny | Ashcharye: Wonder | Venibhavane: Showing hair | Chatre: Umbrella | Samarthe: Capable | Konecha: Room | Romalyam: Excitement | Bheribhedhane: Beating Bheri instrument | Kulalachakrabhramane: Potter\'s wheel | Rathange: Chariot wheel | Mandaletatha: Group of people | Vivechane Dinantecha: Thinking/Evening',
  },
  {
    name: 'Chandrakala',
    meaning: 'Crescent moon',
    shloka: 'Yesha Chandrakalaa chandrakallayame Vyujyate',
    shlokaTranslation: 'Used to depict the Moon',
  },
  {
    name: 'Padmakosha',
    meaning: 'Lotus bud',
    shloka: 'Phalae bilwa kapitha Sthrinam cha kutch kumbhayoh\nAvartakae kandukae sthalyam Bhojanae pushpa koraka\nShakaraphala pushpavarsha Manjarikaadishu japakusuma\nGantarupavidhanaka valmika Kamala Anda\nEthi padmakoshayo karaha',
    shlokaTranslation: 'Phalae bilwa kapitha: Various fruits | Sthrinam kutch kumbhayoh: Round breast | Avartakae: Circular movement | Kandukae: Ball | Sthalyam: Bowl | Bhojanae: Food | Pushpa koraka: Flower garland | Shakaraphala: Mango | Pushpavarsha: Showering flowers | Manjarikadishu: Cluster of flowers | Japakusuma: Hibiscus flower | Gantarupa vidhanaka: Bell shape | Valmika: Ant hill | Kamala: Lotus | Anda: Egg',
  },
  {
    name: 'Sarpashirsha',
    meaning: 'Snake\'s hood',
    shloka: 'Chandane Bhujage Mande Prokshane Poshanadishu\nDevarshudakadaaneshu Hyaspale Gajakumbhayoho\nBhujaasphaletu Mallanaam Yujyate Sarpasheershakaha',
    shlokaTranslation: 'Chandane: Sandalwood paste | Bhujage: Snake | Mande: Slow | Prokshane: Sprinkling | Poshanadishu: Caring | Devarshudakadaaneshu: Holy water | Gajakumbhayoho: Elephant\'s forehead | Bhujaasphaletu Mallanaam: Show muscles of wrestlers',
  },
  {
    name: 'Mrigashirsha',
    meaning: 'Deer\'s head',
    shloka: 'Streenamarthe Kapolecha Krama Maryadayorapi\nBheete Vivade Nepathye Aavasecha Tripundrake\nMukhamukhe Rangavalyom Paadasamvahanepicha\nSarvasammelanekaarye Mandire Chatradharane\nSopane Padavinyase Priyahvane Tathivacha\nSancharecha Prayujyeta Bharatagamakovidhihi',
    shlokaTranslation: 'Streenamarthe: To show Women | Kapolecha: Cheeks | Krama: Way of doing things | Maryadayorapi: Respect | Bheete: Scare | Vivade: Argument | Nepathye: Back stage | Aavasecha: Place of living | Tripundrake: Forehead | Mukhamukhe: Meeting of people | Rangavalyom: Sacred floor design | Paadasamvahanepicha: Massaging feet | Sarvasammelanekaarye: Getting people together | Mandire: House | Chatradharane: Holding umbrella | Sopane: Stairs | Padavinyase: Gait | Priyahvane: Call the loved one | Sancharecha: Movement',
  },
  {
    name: 'Simhamukha',
    meaning: 'Lion\'s face',
    shloka: 'Vidrume Mouktikechiva Sugandhe Alakasparshane\nAakarnanecha Prushati Moksharthe Hrudisamstitaha\nHome Shashe Gaje Darbhachalane Padmadamini\nSimhanane Vaidyapakashodhane Simhavakrakaha',
    shlokaTranslation: 'Vidrume: Coral | Mouktikechiva: Pearl | Sugandhe: Fragrance | Alakasparshane: Curls | Aakarnanecha: Hearing | Prushati: Point | Moksharthe: Salvation | Hrudisamstitaha: Heart | Home: Sacred fire | Shashe: Rabbit | Gaje: Elephant | Darbhachalane: Sacred grass | Padmadamini: Flower | Simhanane: Lion\'s face | Vaidyapakashodhane: Examining medicinal preparations',
  },
  {
    name: 'Kangula',
    meaning: 'Tail',
    shloka: 'Lakuchasya Phale Balakuche Kalharake tatha\nChakore Kramuke Baalakinkinyam Ghutikadike\nChaatake Yujyatechayam Kangoolakaranaamakaha',
    shlokaTranslation: 'Lakuchasya Phale: Lemon | Balakuche: Breasts of a teenager | Kalharake: Kalhara flower | Chakore: Chakora bird | Kramuke: Beetle nut | Baalakinkinyam: Jingles | Ghutikadike: Tablets | Chaatake: Chataka bird',
  },
  {
    name: 'Alapadma',
    meaning: 'Lotus in full bloom',
    shloka: 'Vikachaabjae Kapitthadiphalae cha Aavarthakae Kuchae\nVirahae Mukurae Poorna-chandrae Sowndarya-bhavanae\nDhamillae Chandrashalayam Gramae Uddhata kopayoho\nTatakae Shakatae Chakravakae Kalakalaravae Shlaganae\nSo alapadmashcha Keertito Bharatagamae',
    shlokaTranslation: 'Vikachaabjae: Fully bloomed lotus | Kapitthadiphala: Wood apple | Aavarthaka: Circular movement | Kucha: Breast | Virahae: Yearning for beloved | Mukurae: Mirror | Poorna-chandra: Full moon | Sowndarya bhavanae: Beautiful form | Dhamillae: Hair-knot | Chandrashalayam: Moon pavilion | Gramae: Village | Uddhata kopa: Great anger | Tatakae: Pond/lake | Shakatae: Cart | Chakravakae: Type of bird | Kalakalaravae: Murmuring sound | Shlaganae: Praise',
  },
  {
    name: 'Chatura',
    meaning: 'Square / Smart',
    shloka: 'Kastooryam kinchidapyarthae Swarnataamraadi lohakae\nAardrae khede rasaaswasae lochanae varnabhedakae\nPramanae sarasae mandhagamanae shakaleekrutae\nAasanae ghruta tailadao yujyatae chaturakaraha',
    shlokaTranslation: 'Kastooryaam: Kastoori fragrance | Kinchidapyarthe: Small quantity | Swarnataamraadilohake: Gold & other metals | Aardre: Wetness | Khede: Sadness | Rasaaswade: Taste | Lochane: Eye | Varnabhedake: Differentiate color | Pramane: Promise | Sarase: Romance | Mandhagamane: Slow movement | Shakaleekrute: Breaking | Aasane: Seated | Ghruta: Molten butter | Tailadou: Oil',
  },
  {
    name: 'Bhramara',
    meaning: 'Bee',
    shloka: 'Bhramarecha shukae yogae\nSarasaeKokiladishu bhramarakhyascha\nHastoyam Keerthitho Bharatagamae',
    shlokaTranslation: 'Bhramarecha: Honey bee | Shukae: Parrot | Yogae: Meditation | SarasaeKokiladishu: Birds like kokila & sarasa',
  },
  {
    name: 'Hamsasya',
    meaning: 'Swan\'s beak',
    shloka: 'Mangalyasutra bandhechapyupadesha Vinishchayae\nRomanchae mouktikadoucha Chitrasamlekhanae thatha\nDamshathua jalabindoucha Deepavartiprasaranae\nNikashae shodhanae mallikadou cha Rekhavalekhanae\nMalayaamvahanae Sohambhavanayancha Roopakae\nNaasteetivachanechapi Nikashanamchabhavane\nKrutakrutyepi Hamsasyaha Eerito Bharatagame',
    shlokaTranslation: 'Mangalyasootrabandhe: Tying sacred marriage thread | Upadeshe: Advice | Vinishchaye: Decision | Romanche: Excitement | Mouktikadoucha: Pearls & precious stones | Chitrasamlekhane: Drawing | Damshetu: Fly | Jalabindoucha: Drop of water | Deepavarteeprasarane: Wick of the lamp | Nikashe: Polishing | Shodhane: Searching | Mallikadou: Jasmine & other flowers | Rekhavalekhane: Drawing a line | Malayaamvahane: Holding garland | Sohambhavanayancha: \'I am Brahma\' | Naasteetivachane: Saying \'No\' | Nikashanamchabhavane: Looking at polished article',
  },
  {
    name: 'Hamsapaksha',
    meaning: 'Swan\'s wing',
    shloka: 'Shatsankhyayaam Setubandhe\nNakharakankhanetatha Vidhane\nHamsapakshoyam Keertito Bharatagame',
    shlokaTranslation: 'Shatsankhyayaam: Number 6 | Setubandhe: Bridge | Nakharakankhanetatha: Impression of nails | Vidhane: Way of doing things',
  },
  {
    name: 'Samdamsha',
    meaning: 'Pincers',
    shloka: 'Udaare Balidanecha Vranae Keetae Manobhaye\nArchane Panchavakravye Samdamshakyobhidheeyate',
    shlokaTranslation: 'Udaare: Generosity | Balidanecha: Sacrificial offering | Vranae: Wound | Keetae: Insects | Manobhaye: Fear | Archane: Offering | Panchavakravye: Number 5',
  },
  {
    name: 'Mukula',
    meaning: 'Flower bud',
    shloka: 'Kumudae bhojanae Panchabanae mudradi dharanae\nNabhao cha kadalipushpae Yujyathae mukula karaha',
    shlokaTranslation: 'Kumudae: Lily flower | Bhojanae: Eating | Panchabane: Cupid/angel | Mudradidharane: Smearing sacred marks | Naabhoucha: Belly button | Kadaleepushpe: Banana flower',
  },
  {
    name: 'Tamrachuda',
    meaning: 'Rooster',
    shloka: 'Kukkutadou bakae kaakae Ushtrae vatsae cha lekhanae\nTaamrachoodaKarakhyasou Keertitou Bharatagame',
    shlokaTranslation: 'Kukkutadou: Rooster | Bakae: Baka bird | Kaake: Crow | Ushtre: Camel | Vatsecha: Calf | Lekhane: Letters/writing',
  },
  {
    name: 'Trishula',
    meaning: 'Trident (Emblem of Shiva)',
    shloka: 'Bilwa patrae tritwayuktae Trishoola karaeritaha',
    shlokaTranslation: 'Bilwapatre: Bilwa leaf | Tritwayukte: Number 3',
  },
];

const SAMYUKTA_HASTA: HastaItem[] = [
  {
    name: 'Anjali',
    meaning: 'Salutation',
    shloka: 'Devataguru Vipranaam Namaskaraepyanukramaat\nKaryas shiromukhorastho Viniyoganjali karaha',
    shlokaTranslation: 'Used for salutation to God (above head), Teacher (in front of face) and the Learned (in front of chest)',
  },
  {
    name: 'Kapotha',
    meaning: 'Pigeon / Dove',
    shloka: 'Pranaamae Gurusambhashae Vinayangi kritaeshwayam',
    shlokaTranslation: 'Respectful salutation to teachers, mark of acceptance, to show politeness (vinayam)',
  },
  {
    name: 'Karkata',
    meaning: 'Crab',
    shloka: 'Samoohaa gamanae Tundadarshanae\nShankhapoorane Angaanaam Motane\nShaakhonnamaanecha Niyujyate',
    shlokaTranslation: 'Samoohaa gamanae: Arrival of a crowd | Tundadarshanae: Showing the belly | Shankhapoorane: Blowing the conch | Angaanaam Motane: Twisting & stretching limbs | Shaakhonnamaanecha: Bending branch of a tree',
  },
  {
    name: 'Swastika',
    meaning: 'Cross',
    shloka: 'Samyogena Swastikakhyo Makarae viniyujyate\nBhayavade Vivadecha Keertane Swastikobhavet',
    shlokaTranslation: 'Makarae: Alligator/Crocodile | Bhayavade: Talking with fear | Vivadecha: Argument | Keertane: To praise',
  },
  {
    name: 'Dola',
    meaning: 'Swing',
    shloka: 'Naatyarambhe Prayoktavyam Iti Natyavidovidhuhu',
    shlokaTranslation: 'Used in the beginning of a dance',
  },
  {
    name: 'Pushpaputa',
    meaning: 'Holding Flowers',
    shloka: 'Neeraajenavidhou baala Vaari Phaladikrehanaepicha\nSandhyayaam marghyadaanecha Mantrapushpecha yujyathae',
    shlokaTranslation: 'Neeraajenavidhou: Lamp offering | Baala: Children | Vaari Phaladikrehanaepicha: Accept fruits | Sandhyayaam marghyadaanecha: Offering to the Sun in evenings | Mantrapushpecha: Chant holy prayers',
  },
  {
    name: 'Utsanga',
    meaning: 'Embrace',
    shloka: 'Aalinganaecha lajjayaam Angadaadipradarshanae\nBaalanaamshikshanechayaam Utsango yujyatae karaha',
    shlokaTranslation: 'Aalinganaecha: Embracing someone | Lajjayaam: Shyness | Angadaadipradarshanae: Show one\'s body | Baalanaamshikshanechayaam: Teaching discipline to children',
  },
  {
    name: 'Shivalinga',
    meaning: 'Shivalingam',
    shloka: 'Viniyogastu tatsyva Shivalingasya darshanae',
    shlokaTranslation: 'Used to show Shivalinga (Lord Shiva)',
  },
  {
    name: 'Katakavardhana',
    meaning: 'Pair of bracelets',
    shloka: 'Pattabhishaekae Poojayam Vivahadishu Yujyate',
    shlokaTranslation: 'Pattabhishaekae: Coronation | Poojayam: Worship | Vivahadishu: Weddings',
  },
  {
    name: 'Kartariswastika',
    meaning: 'Crossing two scissors',
    shloka: 'Shakhaasucha Adri Shikhare Vruksheshucha Niyujyate',
    shlokaTranslation: 'Shakhaasucha: Branches of a tree | Adri Shikhare: Tip of mountains | Vruksheshucha: Trees',
  },
  {
    name: 'Shakata',
    meaning: 'Chariot Wheel',
    shloka: 'Raakshasaabhinayechaayam Niyukto Bharatadibhihi',
    shlokaTranslation: 'Used to show Demons (Rakshasas)',
  },
  {
    name: 'Shankha',
    meaning: 'Conch',
    shloka: 'Shankhaadishuniyujyoya Mityevam Bharataadayaha',
    shlokaTranslation: 'Used to show the Shanku (Conch)',
  },
  {
    name: 'Chakra',
    meaning: 'Discus / Wheel',
    shloka: 'Chakrahastassa vigneyachakrarthe viniyujyate',
    shlokaTranslation: 'Used to show Chakra, the weapon of Lord Vishnu',
  },
  {
    name: 'Samputa',
    meaning: 'Containers / Casket',
    shloka: 'Vastvaacchchade Samputecha Samputahkara Eeritaha',
    shlokaTranslation: 'Vastvaacchchade: To cover things | Samputecha: Sacred box in which idols are placed',
  },
  {
    name: 'Pasha',
    meaning: 'Rope / Bond',
    shloka: 'Anyonyakalahe Paashe Shynkhalaayaam Niyujyate',
    shlokaTranslation: 'Anyonyakalahe: Playful quarrel | Paashe: Rope | Shynkhalaayaam: Chains',
  },
  {
    name: 'Kilaka',
    meaning: 'Axle / Bond',
    shloka: 'Snehecha Narmalaapecha Viniyogosya Sammataha',
    shlokaTranslation: 'Snehecha: Friendly/Affectionate | Narmalaapecha: Friendly talk',
  },
  {
    name: 'Matsya',
    meaning: 'Fish',
    shloka: 'Etasya Viniyogastu Matsyarthe Sammatobhavet',
    shlokaTranslation: 'Used to show Fish',
  },
  {
    name: 'Kurma',
    meaning: 'Tortoise / Turtle',
    shloka: 'Koormahastasyavigneyaha Koormarthe Viniyujyate',
    shlokaTranslation: 'Used to show Turtle/Tortoise',
  },
  {
    name: 'Varaha',
    meaning: 'Wild Boar',
    shloka: 'Etasyaviniyogastu Varaharthe tu Yujyate',
    shlokaTranslation: 'Used to show Boar (Wild Pig)',
  },
  {
    name: 'Garuda',
    meaning: 'Eagle',
    shloka: 'Garudo Garudarthe cha Yujyate Baratagame',
    shlokaTranslation: 'Used to show the bird Garuda',
  },
  {
    name: 'Nagabandha',
    meaning: 'Coiled Serpent',
    shloka: 'Bhujagadampatee Bhaave Nikunchanaamcha darshane\nAthrvanasya mantreshu Yojyo Bharatakovidhihi',
    shlokaTranslation: 'Bhujagadampatee: Snakes | Nikunchanaamcha: Creeper/Chamber | Athrvanasya mantreshu: Atharva Veda Slokas',
  },
  {
    name: 'Khatva',
    meaning: 'Cot / Bed',
    shloka: 'Khatvahastobhavedeshaha Khatvaadishu Niyujyate',
    shlokaTranslation: 'Used to show Bed',
  },
  {
    name: 'Bherunda',
    meaning: 'Heavenly Bird / Bird couple',
    shloka: 'Bherundhapakshi Dampatyorbherundhaka Eteeritaha',
    shlokaTranslation: 'Used to show a bird couple',
  },
  {
    name: 'Avahittha',
    meaning: 'Hidden / Secret in heart',
    shloka: 'Srungara Natanechiva Leelaa Kanduka dharane\nKucharthe Yujyate Soyamavahitthakaraabhidhaha',
    shlokaTranslation: 'Srungara Natanechiva: Love | Leelaa Kanduka dharane: Catching the ball | Kucharthe: Breasts',
  },
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
    shloka: 'Anjalishcha Kapothashcha Karkata Swastikastathaa\nDolahasta Pushpaputaha Utsangah Shivalingakaha\nKatakavardhanashchaiva Kartariswastikastathaa\nShakatam Shankha Chakrecha Samputa Pasha Keelakau\nMatsya Kurmo Varahashcha Garudo Nagabandhakaha\nKhatwa Bherundakakhyeshcha Avahittas tathaa eva cha\nChaturvimshati sankhyaaka Samyuktaah kathitaah karaah',
    translation: 'Anjali, Kapotha, Karkata, Swastika, Dola, Pushpaputa, Utsanga, Shivalinga, Katakavardhana, Kartariswastika, Shakata, Shankha, Chakra, Samputa, Pasha, Keelaka, Matsya, Kurma, Varaha, Garuda, Nagabandha, Khatva, Bherunda, Avahittha — Thus, the twenty-four Samyukta Hastas are described.',
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
    { id: 'samyukta', label: 'Samyukta Hasta', count: 24 },
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
          <Ionicons name="arrow-back" size={24} color="#ffd21f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasta Bheda</Text>
        <TouchableOpacity onPress={() => setShowFingerInfo(true)} style={styles.infoButton}>
          <Ionicons name="hand-left" size={24} color="#ffd21f" />
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
                <Ionicons name="book-outline" size={18} color="#ffd21f" />
                <Text style={styles.categoryShlokaLabel}>Shloka</Text>
              </View>
              <Ionicons
                name={showCategoryShloka ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#ffd21f"
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
                        color="#ffd21f"
                      />
                    </View>
                  )}
                </View>
                {isExpanded && hasta.shloka && (
                  <View style={styles.hastaShlokaSection}>
                    <View style={styles.hastaShlokaLabelRow}>
                      <Ionicons name="musical-note" size={14} color="#ffd21f" />
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
          <Ionicons name="bulb-outline" size={24} color="#ffd21f" />
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
                <Ionicons name="close-circle" size={32} color="#ffd21f" />
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
                <Ionicons name="sparkles" size={20} color="#ffd21f" />
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
    color: '#ffd21f',
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
    color: '#ffd21f',
    marginBottom: 16,
  },
  shlokaIntroBox: {
    backgroundColor: '#0d0015',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 31, 0.3)',
  },
  shlokaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffd21f',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  introShlokaSanskrit: {
    fontSize: 15,
    color: '#ffd21f',
    lineHeight: 26,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  shlokaTransDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 210, 31, 0.2)',
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
    backgroundColor: '#0d0015',
    borderWidth: 1,
    borderColor: '#333',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#ffd21f',
    borderColor: '#ffd21f',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  categoryTextActive: {
    color: '#0d0015',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 210, 31, 0.2)',
  },
  countBadgeActive: {
    backgroundColor: '#0d0015',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffd21f',
  },
  countTextActive: {
    color: '#ffd21f',
  },
  descriptionBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#0d0015',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffd21f',
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
    backgroundColor: 'rgba(255, 210, 31, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 31, 0.25)',
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
    color: '#ffd21f',
  },
  categoryShlokaContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  categoryShlokaSanskrit: {
    fontSize: 14,
    color: '#ffd21f',
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
    color: '#ffd21f',
    marginBottom: 16,
  },
  hastaCard: {
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  hastaCardWithShloka: {
    borderColor: 'rgba(255, 210, 31, 0.2)',
  },
  hastaCardExpanded: {
    borderColor: '#ffd21f',
    backgroundColor: '#150020',
  },
  hastaMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hastaNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffd21f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  hastaNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d0015',
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
    backgroundColor: 'rgba(255, 210, 31, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Individual Hasta Shloka
  hastaShlokaSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 210, 31, 0.15)',
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
    color: '#ffd21f',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  hastaShlokaSanskrit: {
    fontSize: 14,
    color: '#ffd21f',
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  shlokaTransDividerSmall: {
    height: 1,
    backgroundColor: 'rgba(255, 210, 31, 0.15)',
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
    backgroundColor: 'rgba(255, 210, 31, 0.1)',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 31, 0.3)',
  },
  practiceNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#ffd21f',
    lineHeight: 20,
  },
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
    borderColor: '#ffd21f',
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
    color: '#ffd21f',
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
    backgroundColor: 'rgba(255, 210, 31, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 31, 0.2)',
  },
  fingerNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffd21f',
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
    color: '#ffd21f',
    marginBottom: 4,
  },
  fingerMeaning: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  modalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 210, 31, 0.1)',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 210, 31, 0.3)',
  },
  modalNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#ffd21f',
    lineHeight: 18,
  },
});
