import { useState, useEffect, useCallback } from 'react';
import { bluetoothService } from '../services/BluetoothService';

interface PowerData {
  power: number;
  voltage: number;
  current: number;
}

export function usePowerData() {
  const [powerData, setPowerData] = useState<PowerData>({
    power: 0,
    voltage: 0,
    current: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  const handleData = useCallback((data: PowerData) => {
    setPowerData(data);
    setIsConnected(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const setupBluetooth = async () => {
      try {
        // Only add listener and start scan if the component is still mounted
        if (isMounted && bluetoothService) {
          bluetoothService.addListener(handleData);
          await bluetoothService.startScan();
        }
      } catch (error) {
        console.error('Failed to setup bluetooth service:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    setupBluetooth();

    // Cleanup function
    return () => {
      isMounted = false;
      if (bluetoothService) {
        try {
          bluetoothService.removeListener(handleData);
          bluetoothService.disconnect();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    };
  }, [handleData]);

  // Calculate cost in Indian Rupees (₹)
  // Assuming average electricity rate in India is ₹7 per kWh
  const calculateCost = (powerInKW: number): number => {
    const RATE_PER_KWH = 7;
    return powerInKW * RATE_PER_KWH;
  };

  const hourlyRate = calculateCost(powerData.power);

  return {
    ...powerData,
    isConnected,
    hourlyRate,
    reconnect: () => bluetoothService?.startScan()
  };
}
