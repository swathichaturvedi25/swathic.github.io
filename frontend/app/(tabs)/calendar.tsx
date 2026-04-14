import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { api } from '../../utils/api';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventType: 'practice',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const createEvent = async () => {
    if (!newEvent.title || !selectedDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await api.createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        event_date: new Date(selectedDate).toISOString(),
        event_type: newEvent.eventType,
        reminder_enabled: true,
      });
      
      setModalVisible(false);
      setNewEvent({ title: '', description: '', eventType: 'practice' });
      loadEvents();
      Alert.alert('Success', 'Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event');
    }
  };

  const deleteEvent = async (id: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteCalendarEvent(id);
              loadEvents();
            } catch (error) {
              console.error('Error deleting event:', error);
            }
          },
        },
      ]
    );
  };

  const markedDates = events.reduce((acc: any, event: any) => {
    const date = new Date(event.event_date).toISOString().split('T')[0];
    acc[date] = { marked: true, dotColor: '#ff2d1f' };
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#ff2d1f',
    };
  }

  const selectedDateEvents = events.filter(
    (event) =>
      new Date(event.event_date).toISOString().split('T')[0] === selectedDate
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSubtitle}>Schedule your practice</Text>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#0d0015',
              calendarBackground: '#0d0015',
              textSectionTitleColor: '#ff2d1f',
              selectedDayBackgroundColor: '#ff2d1f',
              selectedDayTextColor: '#0d0015',
              todayTextColor: '#ff2d1f',
              dayTextColor: '#FFFFFF',
              textDisabledColor: '#444',
              dotColor: '#ff2d1f',
              selectedDotColor: '#0d0015',
              arrowColor: '#ff2d1f',
              monthTextColor: '#ff2d1f',
            }}
          />
        </View>

        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#ff2d1f" />
            <Text style={styles.addButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>

        {selectedDate && (
          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>
              Events on {new Date(selectedDate).toLocaleDateString()}
            </Text>
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventIconContainer}>
                      <Ionicons
                        name={
                          event.event_type === 'practice'
                            ? 'play-circle'
                            : event.event_type === 'class'
                            ? 'school'
                            : event.event_type === 'performance'
                            ? 'star'
                            : 'notifications'
                        }
                        size={24}
                        color="#ff2d1f"
                      />
                    </View>
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      {event.description && (
                        <Text style={styles.eventDescription}>
                          {event.description}
                        </Text>
                      )}
                      <Text style={styles.eventType}>
                        {event.event_type.toUpperCase()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteEvent(event.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noEventsText}>No events on this date</Text>
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Event</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              placeholderTextColor="#666"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Event Type:</Text>
            <View style={styles.eventTypeContainer}>
              {['practice', 'class', 'performance', 'reminder'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.eventTypeChip,
                    newEvent.eventType === type && styles.eventTypeChipActive,
                  ]}
                  onPress={() => setNewEvent({ ...newEvent, eventType: type })}
                >
                  <Text
                    style={[
                      styles.eventTypeText,
                      newEvent.eventType === type && styles.eventTypeTextActive,
                    ]}
                  >
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={createEvent}>
              <Text style={styles.createButtonText}>Create Event</Text>
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
  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ff2d1f',
  },
  actionBar: {
    padding: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ff2d1f',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff2d1f',
  },
  eventsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff2d1f',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#0d0015',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#050010',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 6,
  },
  eventType: {
    fontSize: 11,
    color: '#ff2d1f',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  noEventsText: {
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
    marginBottom: 12,
    fontWeight: '600',
  },
  eventTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  eventTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#050010',
    borderWidth: 1,
    borderColor: '#ff2d1f',
  },
  eventTypeChipActive: {
    backgroundColor: '#ff2d1f',
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff2d1f',
  },
  eventTypeTextActive: {
    color: '#0d0015',
  },
  createButton: {
    backgroundColor: '#ff2d1f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d0015',
  },
});