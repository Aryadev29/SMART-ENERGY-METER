import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bluetooth, BluetoothOff } from 'lucide-react-native';
import { usePowerData } from '@/hooks/usePowerData';
import { bluetoothService } from '@/services/BluetoothService';
import { useState } from 'react';

interface BluetoothStatusProps {
  isDark: boolean;
}

export function BluetoothStatus({ isDark }: BluetoothStatusProps) {
  const { isConnected } = usePowerData();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleReconnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      await bluetoothService.startScan();
    } catch (error) {
      console.error('Failed to reconnect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getStatusColor = () => {
    if (isConnected) return '#10B981'; // Connected - Green
    if (isConnecting) return '#F59E0B'; // Connecting - Yellow
    return '#EF4444'; // Disconnected - Red
  };

  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isConnecting) return 'Connecting...';
    return 'Tap to reconnect';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          borderColor: getStatusColor()
        }
      ]}
      onPress={handleReconnect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <ActivityIndicator size="small" color={getStatusColor()} />
          <Text style={[styles.text, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {getStatusText()}
          </Text>
        </>
      ) : isConnected ? (
        <>
          <Bluetooth size={20} color={getStatusColor()} />
          <Text style={[styles.text, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {getStatusText()}
          </Text>
        </>
      ) : (
        <>
          <BluetoothOff size={20} color={getStatusColor()} />
          <Text style={[styles.text, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {getStatusText()}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
