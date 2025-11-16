import { useEffect } from 'react';
// import { bluetoothService } from '@/services/BluetoothService';
// import { registerScheduleWorker, unregisterScheduleWorker } from '../workers/ScheduleWorker';
import { UsageTracker } from '@/workers/UsageTracker';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize Bluetooth service if we're on a native platform
        if (Platform.OS !== 'web') {
          // await bluetoothService.cleanup(); // Clean up any existing instance
          // await bluetoothService.initializeBluetooth();
          // await registerScheduleWorker();
          await UsageTracker.start();
        }
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initializeServices();
    window.frameworkReady?.();

    return () => {
      // Cleanup services on app shutdown
      if (Platform.OS !== 'web') {
        // bluetoothService.cleanup().catch(error => {
        //   console.error('Failed to cleanup services:', error);
        // });
        // unregisterScheduleWorker();
        UsageTracker.stop().catch(error => {
          console.error('Failed to stop usage tracker:', error);
        });
      }
    };
  }, []);
}
