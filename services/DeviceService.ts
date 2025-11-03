import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Room } from './RoomService';
import { roomService } from './RoomService';

export interface UsageRecord {
  timestamp: number;
  powerUsed: number;
}

export interface Schedule {
  time: string;
  action: boolean;  // true for ON, false for OFF
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
}

export interface Device {
  id: string;
  name: string;
  roomId: string;
  powerRating: number;
  isOn: boolean;
  schedules: Schedule[];
  usageHistory: UsageRecord[];
  category?: 'lighting' | 'hvac' | 'appliance' | 'entertainment' | 'other';
}

type DeviceListener = (devices: Device[]) => void;

class DeviceService {
  private static instance: DeviceService;
  private devices: Device[] = [];
  private listeners: Set<DeviceListener> = new Set();

  private constructor() {
    this.loadDevices();
  }

  static getInstance(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  private async loadDevices() {
    try {
      const devicesData = await AsyncStorage.getItem('devices');
      if (devicesData) {
        this.devices = JSON.parse(devicesData);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  }

  private async saveDevices() {
    try {
      await AsyncStorage.setItem('devices', JSON.stringify(this.devices));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save devices:', error);
      throw error;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.devices));
  }

  addListener(listener: DeviceListener) {
    this.listeners.add(listener);
    listener(this.devices);
    return () => this.listeners.delete(listener);
  }

  async addDevice(device: Omit<Device, 'id'>): Promise<Device> {
    const newDevice: Device = {
      ...device,
      id: Math.random().toString(36).substr(2, 9),
    };

    this.devices.push(newDevice);
    await this.saveDevices();
    return newDevice;
  }

  async updateDevice(deviceId: string, updates: Partial<Device>): Promise<Device> {
    const deviceIndex = this.devices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
      throw new Error('Device not found');
    }

    this.devices[deviceIndex] = {
      ...this.devices[deviceIndex],
      ...updates,
    };

    await this.saveDevices();
    return this.devices[deviceIndex];
  }

  async deleteDevice(deviceId: string): Promise<void> {
    this.devices = this.devices.filter(d => d.id !== deviceId);
    await this.saveDevices();
  }

  async toggleDevice(deviceId: string): Promise<Device> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    return this.updateDevice(deviceId, { isOn: !device.isOn });
  }

  async addSchedule(deviceId: string, schedule: Schedule) {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return;

    device.schedules = device.schedules || [];
    device.schedules.push(schedule);
    await this.saveDevices();
    this.notifyListeners();
  }

  async removeSchedule(deviceId: string, scheduleIndex: number) {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.schedules) return;

    device.schedules.splice(scheduleIndex, 1);
    await this.saveDevices();
    this.notifyListeners();
  }

  async updateDeviceCategory(deviceId: string, category: Device['category']) {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return;

    device.category = category;
    await this.saveDevices();
    this.notifyListeners();
  }

  getDailyUsage(deviceId: string): number {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.usageHistory) return 0;

    const startOfDay = new Date().setHours(0, 0, 0, 0);
    return device.usageHistory
      .filter((usage: UsageRecord) => usage.timestamp >= startOfDay)
      .reduce((total: number, usage: UsageRecord) => total + usage.powerUsed, 0);
  }

  getWeeklyUsage(deviceId: string): number {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.usageHistory) return 0;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return device.usageHistory
      .filter((usage: UsageRecord) => usage.timestamp >= startOfWeek.getTime())
      .reduce((total: number, usage: UsageRecord) => total + usage.powerUsed, 0);
  }

  getMonthlyUsage(deviceId: string): number {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.usageHistory) return 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return device.usageHistory
      .filter((usage: UsageRecord) => usage.timestamp >= startOfMonth.getTime())
      .reduce((total: number, usage: UsageRecord) => total + usage.powerUsed, 0);
  }

  private isWithinSchedule(currentTime: string, currentDay: string, schedules: Schedule[]): boolean {
    return schedules.some(schedule => {
      const [scheduleHour, scheduleMinute] = schedule.time.split(':').map(Number);
      const [currentHour, currentMinute] = currentTime.split(':').map(Number);
      
      const isTimeMatch = scheduleHour === currentHour && scheduleMinute === currentMinute;
      const isDayMatch = schedule.days.includes(currentDay as Schedule['days'][number]);
      
      return isTimeMatch && isDayMatch;
    });
  }

  getRooms(): Room[] {
    return roomService.getRooms();
  }

  getDevices(): Device[] {
    return [...this.devices];
  }

  // Add this method for the scheduler to use
  async checkAndUpdateSchedules() {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];

    for (const device of this.devices) {
      if (device.schedules?.length) {
        const matchingSchedule = device.schedules.find(schedule => 
          this.isWithinSchedule(currentTime, currentDay, [schedule])
        );
        
        if (matchingSchedule && device.isOn !== matchingSchedule.action) {
          await this.toggleDevice(device.id);
        }
      }
    }
  }
}

export const deviceService = DeviceService.getInstance();
