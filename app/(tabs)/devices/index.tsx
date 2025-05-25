import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Zap, CirclePlus as PlusCircle, Search, ChevronRight, Power, X } from 'lucide-react-native';
import { DeviceCard } from '@/components/DeviceCard';
import { mockDevices } from '@/data/mockDevices';

export default function DevicesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [devices, setDevices] = useState(mockDevices);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = searchQuery 
    ? devices.filter(device => 
        device.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : devices;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Devices',
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
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer, 
            { 
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              borderColor: isDark ? '#334155' : '#E2E8F0' 
            }
          ]}>
            <Search size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              placeholder="Search devices..."
              placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={isDark ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: isDark ? '#06B6D4' : '#0891B2',
                }
              ]}
            >
              <Text style={[styles.filterButtonText, { color: '#FFFFFF' }]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: 'transparent',
                  borderColor: isDark ? '#334155' : '#E2E8F0' 
                }
              ]}
            >
              <Text style={[styles.filterButtonText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: 'transparent',
                  borderColor: isDark ? '#334155' : '#E2E8F0' 
                }
              ]}
            >
              <Text style={[styles.filterButtonText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Inactive</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { 
                  backgroundColor: 'transparent',
                  borderColor: isDark ? '#334155' : '#E2E8F0' 
                }
              ]}
            >
              <Text style={[styles.filterButtonText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Recently Added</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.devicesList} contentContainerStyle={styles.devicesListContent}>
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <DeviceCard 
                key={device.id}
                device={device}
                isDark={isDark}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyStateIcon, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
                <Power size={32} color={isDark ? '#94A3B8' : '#64748B'} />
              </View>
              <Text style={[styles.emptyStateTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                No devices found
              </Text>
              <Text style={[styles.emptyStateMessage, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {searchQuery 
                  ? `No devices match "${searchQuery}"`
                  : "You haven't added any devices yet. Tap the + button to add your first device."}
              </Text>
              {!searchQuery && (
                <TouchableOpacity 
                  style={[styles.addDeviceButton, { backgroundColor: isDark ? '#06B6D4' : '#0891B2' }]}
                  onPress={() => {}}
                >
                  <PlusCircle size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.addDeviceButtonText}>Add Device</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersScroll: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  devicesList: {
    flex: 1,
  },
  devicesListContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 80,
  },
  emptyStateIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  addDeviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addDeviceButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});