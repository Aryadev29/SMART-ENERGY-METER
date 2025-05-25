import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { CirclePlus as PlusCircle, ChevronRight, Zap } from 'lucide-react-native';
import { mockRooms } from '@/data/mockRooms';
import { RoomCard } from '@/components/RoomCard';

export default function RoomsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [rooms, setRooms] = useState(mockRooms);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Rooms',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {}}
            >
              <PlusCircle size={24} color={isDark ? '#06B6D4' : '#0891B2'} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <ScrollView 
          style={styles.roomsList} 
          contentContainerStyle={styles.roomsListContent}
          showsVerticalScrollIndicator={false}
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} isDark={isDark} />
          ))}
          
          <TouchableOpacity 
            style={[
              styles.addRoomCard, 
              { 
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#E2E8F0' 
              }
            ]}
          >
            <View style={styles.addRoomContent}>
              <View style={[styles.addRoomIcon, { backgroundColor: '#F0FDFA' }]}>
                <PlusCircle size={28} color="#10B981" />
              </View>
              <Text style={[styles.addRoomText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Add New Room
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    padding: 8,
  },
  roomsList: {
    flex: 1,
  },
  roomsListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  addRoomCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  addRoomContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRoomIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addRoomText: {
    fontSize: 16,
    fontWeight: '600',
  },
});