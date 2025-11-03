import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Power, Zap, Trash2, Plus } from 'lucide-react-native';
import { type Room } from '@/services/RoomService';
import { type Device } from '@/services/DeviceService';
import { deviceService } from '@/services/DeviceService';
import { DeviceCard } from './DeviceCard';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { useTheme } from '@/contexts/ThemeContext';

interface RoomCardProps {
  room: Room;
  onDelete: () => void;
  onAddDevice: () => void;
}

export function RoomCard({ room, onDelete, onAddDevice }: RoomCardProps) {
  const { isDark } = useTheme();
  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  React.useEffect(() => {
    const unsubscribe = deviceService.addListener((allDevices) => {
      const roomDevices = allDevices.filter(d => d.roomId === room.id);
      setDevices(roomDevices);
    });

    return () => {
      unsubscribe();
    };
  }, [room.id]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container,
          { 
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderLeftColor: room.color 
          }
        ]}
        onPress={() => setShowDevices(true)}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {room.name}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={onAddDevice} style={styles.addButton}>
              <Plus size={20} color={isDark ? '#94A3B8' : '#10B981'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
              <Power size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Devices
              </Text>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {devices.length}
              </Text>
            </View>
          </View>

          <View style={styles.stat}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
              <Zap size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Power Usage
              </Text>
              <Text style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {devices
                  .filter(d => d.isOn)
                  .reduce((total, d) => total + d.powerRating, 0) / 1000}
                kW
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showDevices}
        animationType="slide"
        onRequestClose={() => setShowDevices(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderBottomColor: isDark ? '#334155' : '#E2E8F0',
          }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {room.name}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowDevices(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeButtonText, { color: isDark ? '#0EA5E9' : '#10B981' }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DeviceCard
                device={item}
                onToggle={() => deviceService.toggleDevice(item.id)}
                onDelete={async () => {
                  await deviceService.deleteDevice(item.id);
                }}
              />
            )}
            contentContainerStyle={styles.deviceList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  No devices added yet
                </Text>
                <TouchableOpacity 
                  style={[styles.addDeviceButton, { backgroundColor: '#10B981' }]}
                  onPress={() => {
                    setShowDevices(false);
                    onAddDevice();
                  }}
                >
                  <Text style={styles.addDeviceButtonText}>Add Device</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  addButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  deviceList: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  addDeviceButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addDeviceButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});