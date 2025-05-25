import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Zap, DollarSign, Info, ChevronRight } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { PowerUsageChart } from '@/components/PowerUsageChart';
import { CurrentUsageCard } from '@/components/CurrentUsageCard';
import { PowerConsumptionTile } from '@/components/PowerConsumptionTile';
import { mockPowerData } from '@/data/mockPowerData';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentPower, setCurrentPower] = useState(0);
  const [currentBill, setCurrentBill] = useState(0);
  const [powerData, setPowerData] = useState(mockPowerData);

  // Simulate real-time power updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating power usage between 0.8 and 1.2 kW
      const newPower = (Math.random() * 0.4 + 0.8).toFixed(2);
      setCurrentPower(parseFloat(newPower));
      
      // Calculate bill based on usage (sample rate: $0.12 per kWh)
      const rate = 0.12;
      const hourlyUsage = parseFloat(newPower);
      const hourlyBill = hourlyUsage * rate;
      
      // For demo purposes, show a daily estimated bill
      setCurrentBill(parseFloat((hourlyBill * 24).toFixed(2)));

      // Update chart data with the new value
      const now = new Date();
      const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setPowerData(prevData => {
        const newData = [...prevData];
        // Remove the first item and add the new one at the end
        newData.shift();
        newData.push({ time: timeLabel, power: parseFloat(newPower) });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Energy Dashboard',
          headerLargeTitle: true,
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
        contentContainerStyle={styles.contentContainer}
      >
        <CurrentUsageCard 
          currentPower={currentPower} 
          currentBill={currentBill} 
          isDark={isDark} 
        />

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Power Consumption
            </Text>
            <TouchableOpacity style={styles.infoButton}>
              <Info size={16} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>
          <PowerUsageChart data={powerData} isDark={isDark} />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Quick Stats
            </Text>
          </View>
          <View style={styles.tilesContainer}>
            <PowerConsumptionTile 
              title="Today" 
              value="8.2 kWh" 
              icon={<Zap size={20} color="#06B6D4" />} 
              isDark={isDark} 
            />
            <PowerConsumptionTile 
              title="This Month" 
              value="246 kWh" 
              icon={<Zap size={20} color="#10B981" />} 
              isDark={isDark} 
            />
            <PowerConsumptionTile 
              title="Bill to Date" 
              value="$29.52" 
              icon={<DollarSign size={20} color="#F59E0B" />} 
              isDark={isDark} 
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Active Devices
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.deviceItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={() => {}}
          >
            <View style={styles.deviceInfo}>
              <View style={[styles.deviceIcon, { backgroundColor: '#EFF6FF' }]}>
                <Zap size={20} color="#3B82F6" />
              </View>
              <View>
                <Text style={[styles.deviceName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Living Room AC
                </Text>
                <Text style={[styles.deviceStats, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  0.42 kW • On for 3h 24m
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.deviceItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}
            onPress={() => {}}
          >
            <View style={styles.deviceInfo}>
              <View style={[styles.deviceIcon, { backgroundColor: '#F0FDFA' }]}>
                <Zap size={20} color="#14B8A6" />
              </View>
              <View>
                <Text style={[styles.deviceName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Kitchen Refrigerator
                </Text>
                <Text style={[styles.deviceStats, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  0.16 kW • Always on
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.viewAllButton, { borderColor: isDark ? '#334155' : '#E2E8F0' }]}
            onPress={() => {}}
          >
            <Text style={[styles.viewAllText, { color: isDark ? '#06B6D4' : '#0891B2' }]}>
              View All Devices
            </Text>
            <ChevronRight size={16} color={isDark ? '#06B6D4' : '#0891B2'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoButton: {
    padding: 4,
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  deviceStats: {
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});