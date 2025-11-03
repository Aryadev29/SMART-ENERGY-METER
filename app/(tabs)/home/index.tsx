import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Zap, Lightbulb, Plug } from 'lucide-react-native';
import { bluetoothService } from '@/services/BluetoothService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RATE_PER_KWH = 7;

// Helper to safely format numbers or show fallback
function safeFixed(val: any, digits = 2, fallback = "--") {
  return typeof val === "number" && isFinite(val) ? val.toFixed(digits) : fallback;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [data, setData] = useState({
    currentLed: 0,
    currentIncandescent: 0,
    currentSocket: 0,
    voltage: 0
  });
  const [energy, setEnergy] = useState({
    led: 0,
    incandescent: 0,
    socket: 0
  });
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('demoMode').then(val => {
      if (val === 'true') setDemoMode(true);
    });
  }, []);

  // Keep demoMode in sync with settings
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('demoMode').then(val => {
        setDemoMode(val === 'true');
      });
    }, [])
  );

  useEffect(() => {
    bluetoothService.startPolling(); // Remove demoMode argument, always fetch real data
    let lastTimestamp = Date.now();
    const listener = (d: typeof data) => {
      const now = Date.now();
      const dt = (now - lastTimestamp) / 3600000; // hours
      lastTimestamp = now;
      // Use previous value if undefined
      setData(prev => ({
        currentLed: typeof d.currentLed === 'number' ? d.currentLed : prev.currentLed,
        currentIncandescent: typeof d.currentIncandescent === 'number' ? d.currentIncandescent : prev.currentIncandescent,
        currentSocket: typeof d.currentSocket === 'number' ? d.currentSocket : prev.currentSocket,
        voltage: typeof d.voltage === 'number' ? d.voltage : prev.voltage
      }));
      const v = typeof d.voltage === 'number' ? d.voltage : data.voltage;
      const iLed = typeof d.currentLed === 'number' ? d.currentLed / 1000 : data.currentLed / 1000;
      const iInc = typeof d.currentIncandescent === 'number' ? d.currentIncandescent / 1000 : data.currentIncandescent / 1000;
      const iSock = typeof d.currentSocket === 'number' ? d.currentSocket / 1000 : data.currentSocket / 1000;
      setEnergy(e => ({
        led: e.led + v * iLed * dt / 1000,
        incandescent: e.incandescent + v * iInc * dt / 1000,
        socket: e.socket + v * iSock * dt / 1000
      }));
    };
    bluetoothService.addListener(listener);
    return () => {
      bluetoothService.removeListener(listener);
      bluetoothService.cleanup();
    };
  }, []);

  // Demo mode: generate fake values every 5s
  useEffect(() => {
    if (!demoMode) {
      // When demo mode is turned off, do not reset current/voltage values
      return;
    }
    let lastTimestamp = Date.now();
    const interval = setInterval(() => {
      const isOn = Math.random() > 0.1;
      const voltage = isOn ? Math.random() * 10 + 225 : Math.random() * 19 + 6; // 225V ±5V when on
      // Fake currents in mA, trend: [Incandescent: 634, LED: 256, Socket: 294]
      const currentIncandescent = isOn ? (634 + (Math.random() - 0.5) * 0.2 * 634) : (Math.random() * 50 + 10); // 634mA ±10%
      const currentLed = isOn ? (256 + (Math.random() - 0.5) * 0.2 * 256) : (Math.random() * 20 + 5); // 256mA ±10%
      const currentSocket = isOn ? (294 + (Math.random() - 0.5) * 0.2 * 294) : (Math.random() * 30 + 10); // 294mA ±10%
      const now = Date.now();
      const dt = (now - lastTimestamp) / 3600000;
      lastTimestamp = now;
      setEnergy(e => ({
        led: e.led + voltage * (currentLed / 1000) * dt / 1000,
        incandescent: e.incandescent + voltage * (currentIncandescent / 1000) * dt / 1000,
        socket: e.socket + voltage * (currentSocket / 1000) * dt / 1000
      }));
      setData({
        currentLed,
        currentIncandescent,
        currentSocket,
        voltage
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [demoMode]);

  // Bedroom 2 (LED + Socket)
  const bedroom2Current = data.currentLed + data.currentSocket;
  const bedroom2Energy = energy.led + energy.socket;
  const bedroom2Bill = bedroom2Energy * RATE_PER_KWH;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.heading, { color: '#000' }]}>⚡️ HOME</Text>
      {/* Incandescent Bulb */}
      <View style={styles.deviceTile}>
        <Lightbulb size={28} color="#F59E0B" />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceTitle}>Incandescent Bulb</Text>
          <Text style={styles.deviceLabel}>Current: <Text style={styles.deviceValue}>{safeFixed(data.currentIncandescent, 0)} mA</Text></Text>
          <Text style={styles.deviceLabel}>Voltage: <Text style={styles.deviceValue}>{safeFixed(data.voltage, 1)} V</Text></Text>
          <Text style={styles.deviceLabel}>Energy: <Text style={styles.deviceValue}>{safeFixed(energy.incandescent, 4)} kWh</Text></Text>
          <Text style={[styles.deviceLabel, { color: '#B91C1C' }]}>Bill: <Text style={styles.deviceValue}>₹{safeFixed(energy.incandescent * RATE_PER_KWH, 2)}</Text></Text>
        </View>
      </View>
      {/* LED Bulb */}
      <View style={styles.deviceTile}>
        <Lightbulb size={28} color="#3B82F6" />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceTitle}>LED Bulb</Text>
          <Text style={styles.deviceLabel}>Current: <Text style={styles.deviceValue}>{safeFixed(data.currentLed, 0)} mA</Text></Text>
          <Text style={styles.deviceLabel}>Voltage: <Text style={styles.deviceValue}>{safeFixed(data.voltage, 1)} V</Text></Text>
          <Text style={styles.deviceLabel}>Energy: <Text style={styles.deviceValue}>{safeFixed(energy.led, 4)} kWh</Text></Text>
          <Text style={[styles.deviceLabel, { color: '#B91C1C' }]}>Bill: <Text style={styles.deviceValue}>₹{safeFixed(energy.led * RATE_PER_KWH, 2)}</Text></Text>
        </View>
      </View>
      {/* Socket */}
      <View style={styles.deviceTile}>
        <Plug size={28} color="#14B8A6" />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceTitle}>Socket</Text>
          <Text style={styles.deviceLabel}>Current: <Text style={styles.deviceValue}>{safeFixed(data.currentSocket, 0)} mA</Text></Text>
          <Text style={styles.deviceLabel}>Voltage: <Text style={styles.deviceValue}>{safeFixed(data.voltage, 1)} V</Text></Text>
          <Text style={styles.deviceLabel}>Energy: <Text style={styles.deviceValue}>{safeFixed(energy.socket, 4)} kWh</Text></Text>
          <Text style={[styles.deviceLabel, { color: '#B91C1C' }]}>Bill: <Text style={styles.deviceValue}>₹{safeFixed(energy.socket * RATE_PER_KWH, 2)}</Text></Text>
        </View>
      </View>
      {/* Bedroom 2 Combined */}
      <View style={[styles.deviceTile, { backgroundColor: '#FEF9C3' }]}> 
        <Zap size={28} color="#F59E0B" />
        <View style={styles.deviceInfo}>
          <Text style={[styles.deviceTitle, { color: '#92400E' }]}>Bedroom 2 (LED + Socket)</Text>
          <Text style={styles.deviceLabel}>Current: <Text style={styles.deviceValue}>{safeFixed(data.currentLed + data.currentSocket, 0)} mA</Text></Text>
          <Text style={styles.deviceLabel}>Voltage: <Text style={styles.deviceValue}>{safeFixed(data.voltage, 1)} V</Text></Text>
          <Text style={styles.deviceLabel}>Energy: <Text style={styles.deviceValue}>{safeFixed(energy.led + energy.socket, 4)} kWh</Text></Text>
          <Text style={[styles.deviceLabel, { color: '#B91C1C' }]}>Bill: <Text style={styles.deviceValue}>₹{safeFixed((energy.led + energy.socket) * RATE_PER_KWH, 2)}</Text></Text>
        </View>
      </View>
    </ScrollView>
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
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  deviceTile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
  },
  deviceInfo: {
    marginLeft: 16,
    flex: 1,
  },
  deviceTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000',
  },
  deviceLabel: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  deviceValue: {
    fontWeight: '600',
    color: '#000',
  },
});