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
import { Plus } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { RoomCard } from '@/components/RoomCard';
import { roomService, type Room } from '@/services/RoomService';
import { useTheme } from '@/contexts/ThemeContext';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

const ROOM_COLORS = [
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Yellow
  '#EF4444', // Red
];

export default function RoomsScreen() {
  const { isDark } = useTheme();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });
  useEffect(() => {
    const unsubscribe = roomService.addListener((updatedRooms) => {
      setRooms(updatedRooms);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    setLoading(true);
    try {
      await roomService.addRoom({
        name: newRoomName.trim(),
        devices: 0,
        powerUsage: 0,
        color: ROOM_COLORS[rooms.length % ROOM_COLORS.length],
      });
      setModalVisible(false);
      setNewRoomName('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    Alert.alert(
      'Delete Room',
      'Are you sure you want to delete this room?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await roomService.deleteRoom(roomId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete room');
            }
          },
        },
      ],
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      <Stack.Screen
        options={{
          headerTitle: "Rooms",
          headerTitleStyle: {
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 20,
            color: isDark ? '#F8FAFC' : '#0F172A',
          },
          headerStyle: {
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
          },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onDelete={() => handleDeleteRoom(room.id)}
            onAddDevice={() => {
              // Handle add device
            }}
          />
        ))}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color={isDark ? '#F8FAFC' : '#10B981'} />
          <Text style={[styles.addButtonText, { color: isDark ? '#F8FAFC' : '#10B981' }]}>
            Add Room
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Add New Room
            </Text>
            
            <TextInput
              style={[styles.input, { 
                borderColor: isDark ? '#334155' : '#E2E8F0',
                color: isDark ? '#F8FAFC' : '#0F172A',
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF'
              }]}
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="Enter room name"
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { 
                  backgroundColor: isDark ? '#334155' : '#F1F5F9',
                  borderColor: isDark ? '#475569' : '#E2E8F0'
                }]}
                onPress={() => {
                  setModalVisible(false);
                  setNewRoomName('');
                }}
                disabled={loading}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? '#94A3B8' : '#64748B' }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addRoomButton]}
                onPress={handleAddRoom}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Adding...' : 'Add Room'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  addRoomButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
});