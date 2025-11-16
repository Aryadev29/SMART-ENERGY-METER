import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockRooms } from '@/data/mockRooms';

export interface Room {
  id: string;
  name: string;
  devices: number;
  powerUsage: number;
  color: string;
}

class RoomService {
  private static instance: RoomService;
  private rooms: Room[] = [];
  private listeners: Set<(rooms: Room[]) => void> = new Set();

  private constructor() {
    this.loadRooms();
  }

  static getInstance(): RoomService {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }
    return RoomService.instance;
  }

  private async loadRooms() {
    try {
      const roomsData = await AsyncStorage.getItem('rooms');
      if (roomsData) {
        this.rooms = JSON.parse(roomsData);
      } else {
        // Initialize with mock data if no rooms exist
        this.rooms = [...mockRooms];
        await this.saveRooms();
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  }

  private async saveRooms() {
    try {
      await AsyncStorage.setItem('rooms', JSON.stringify(this.rooms));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save rooms:', error);
      throw error;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.rooms));
  }

  addListener(listener: (rooms: Room[]) => void) {
    this.listeners.add(listener);
    listener(this.rooms);
    return () => this.listeners.delete(listener);
  }

  async addRoom(room: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = {
      ...room,
      id: Math.random().toString(36).substr(2, 9),
    };

    this.rooms.push(newRoom);
    await this.saveRooms();
    return newRoom;
  }

  async updateRoom(roomId: string, updates: Partial<Room>): Promise<Room> {
    const roomIndex = this.rooms.findIndex(r => r.id === roomId);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    this.rooms[roomIndex] = {
      ...this.rooms[roomIndex],
      ...updates,
    };

    await this.saveRooms();
    return this.rooms[roomIndex];
  }
  async deleteRoom(roomId: string): Promise<void> {
    const updatedRooms = this.rooms.filter(r => r.id !== roomId);
    this.rooms = updatedRooms;
    await this.saveRooms();
  }

  getRooms(): Room[] {
    return [...this.rooms];
  }
}

export const roomService = RoomService.getInstance();
