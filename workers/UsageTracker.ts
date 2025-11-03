import { deviceService } from '@/services/DeviceService';
// import BackgroundService from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

// Background task options
const options = {
  taskName: 'Usage Tracker',
  taskTitle: 'Smart Energy Meter',
  taskDesc: 'Tracking device power usage',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#10B981',
  linkingURI: 'smartenergymeter://usage',
  parameters: {
    delay: 300000, // Record usage every 5 minutes
  },
};

// The background task
// const usageTask = async (taskDataArguments: any) => {
//   const { delay } = taskDataArguments;
//   let lastUpdate = Date.now();
//
//   // Background loop
//   while (BackgroundService.isRunning()) {
//     try {
//       const now = Date.now();
//       const duration = now - lastUpdate;
//
//       // Get all active devices
//       const devices = deviceService.getDevices().filter(d => d.isOn);
//
//       // Record usage for each active device
//       for (const device of devices) {
//         await deviceService.recordUsage(device.id, duration);
//       }
//
//       lastUpdate = now;
//     } catch (error) {
//       console.error('Error in usage tracker:', error);
//     }
//     await sleep(delay);
//   }
// };

export class UsageTracker {
  static async start() {
    // BackgroundService is not available in Expo Go, so this is a no-op
    console.log('Usage tracker start called (no-op in Expo Go)');
  }

  static async stop() {
    // BackgroundService is not available in Expo Go, so this is a no-op
    console.log('Usage tracker stop called (no-op in Expo Go)');
  }
}
