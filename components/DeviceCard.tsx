import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, ScrollView } from 'react-native';
import { Power, Trash2, Clock, Plus, Tag } from 'lucide-react-native';
import { type Device } from '@/services/DeviceService';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { deviceService } from '@/services/DeviceService';

interface DeviceCardProps {
  device: Device;
  onToggle: () => void;
  onDelete: () => void;
}

export function DeviceCard({ device, onToggle, onDelete }: DeviceCardProps) {
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const categories: Device['category'][] = ['lighting', 'hvac', 'appliance', 'entertainment', 'other'];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={[styles.container, device.isOn && styles.activeContainer]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{device.name}</Text>
              {device.category && (
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{device.category}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                onPress={() => setIsCategoryModalVisible(true)} 
                style={styles.categoryButton}
              >
                <Tag size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsScheduleModalVisible(true)} 
                style={styles.scheduleButton}
              >
                <Clock size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.powerInfo}>
            <View style={styles.powerRating}>
              <Power size={16} color={device.isOn ? '#10B981' : '#64748B'} />
              <Text style={styles.powerText}>{device.powerRating}W</Text>
            </View>
            <Switch
              value={device.isOn}
              onValueChange={onToggle}
              trackColor={{ false: '#E2E8F0', true: '#10B981' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      {/* Schedule Modal */}
      <Modal
        visible={isScheduleModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsScheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Device</Text>
              <TouchableOpacity 
                onPress={() => setIsScheduleModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scheduleList}>
              {device.schedules?.map((schedule, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleInfo}>
                    <Clock size={16} color="#64748B" />
                    <Text style={styles.scheduleText}>
                      {schedule.time} - {schedule.action ? 'On' : 'Off'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deviceService.removeSchedule(device.id, index)}
                    style={styles.deleteScheduleButton}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.addScheduleButton}
              onPress={() => {
                deviceService.addSchedule(device.id, {
                  time: '08:00',
                  action: true,
                  days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
                });
              }}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addScheduleButtonText}>Add Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Device Category</Text>
              <TouchableOpacity 
                onPress={() => setIsCategoryModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    device.category === category && styles.selectedCategory,
                  ]}
                  onPress={() => {
                    deviceService.updateDeviceCategory(device.id, category);
                    setIsCategoryModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    device.category === category && styles.selectedCategoryText,
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  activeContainer: {
    borderColor: '#10B981',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  categoryTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  categoryButton: {
    padding: 4,
  },
  scheduleButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  powerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  powerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  scheduleList: {
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 8,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
  },
  deleteScheduleButton: {
    padding: 4,
  },
  addScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addScheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  categoryList: {
    gap: 8,
  },
  categoryOption: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  selectedCategory: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  categoryOptionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64748B',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#10B981',
  },
});