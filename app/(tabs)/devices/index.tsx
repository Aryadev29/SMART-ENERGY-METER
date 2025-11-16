import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const ESP32_ENDPOINT = 'http://192.168.0.101/data'; // <-- ESP32's actual IP and endpoint

export default function DevicesScreen() {
  const { isDark } = useTheme();
  const [espData, setEspData] = useState({ current: 0, voltage: 0, power: 0 });
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchESP32Data = async () => {
      try {
        const res = await fetch(ESP32_ENDPOINT);
        const data = await res.json();
        setEspData({
          current: Number(data.current) || 0,
          voltage: Number(data.voltage) || 0,
          power: Number(data.power) || 0,
        });
        setIsConnected(true);
      } catch (e) {
        setEspData({ current: 0, voltage: 0, power: 0 });
        setIsConnected(false);
      }
    };
    fetchESP32Data();
    const interval = setInterval(fetchESP32Data, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
      contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.heading, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>ESP32 Live Data</Text>
      <View style={styles.dataTile}>
        <Zap size={24} color="#3B82F6" />
        <Text style={[styles.dataLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Current</Text>
        <Text style={[styles.dataValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{espData.current} A</Text>
      </View>
      <View style={styles.dataTile}>
        <Zap size={24} color="#14B8A6" />
        <Text style={[styles.dataLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Voltage</Text>
        <Text style={[styles.dataValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{espData.voltage} V</Text>
      </View>
      <View style={styles.dataTile}>
        <Zap size={24} color="#F59E0B" />
        <Text style={[styles.dataLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>Power</Text>
        <Text style={[styles.dataValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{espData.power} W</Text>
      </View>
      {!isConnected && (
        <Text style={{ color: 'red', marginTop: 16 }}>ESP32 not connected or data unavailable.</Text>
      )}
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
  dataTile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    padding: 16,
  },
  dataLabel: {
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
    flex: 1,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});