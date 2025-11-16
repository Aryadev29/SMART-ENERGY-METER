import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { deviceService } from '@/services/DeviceService';

const SCHEDULE_TASK = 'SCHEDULE_CHECK';

TaskManager.defineTask(SCHEDULE_TASK, async () => {
  try {
    await deviceService.checkAndUpdateSchedules();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background schedule check failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerScheduleWorker() {
  try {
    await BackgroundFetch.registerTaskAsync(SCHEDULE_TASK, {
      minimumInterval: 60, // Check every minute
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    console.error('Failed to register schedule worker:', error);
  }
}

export async function unregisterScheduleWorker() {
  try {
    await BackgroundFetch.unregisterTaskAsync(SCHEDULE_TASK);
  } catch (error) {
    console.error('Failed to unregister schedule worker:', error);
  }
}
