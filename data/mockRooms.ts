import { type Room } from '@/services/RoomService';

export const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Living Room',
    devices: 5,
    powerUsage: 0.8,
    color: '#10B981',
  },
  {
    id: '2',
    name: 'Kitchen',
    devices: 4,
    powerUsage: 1.2,
    color: '#3B82F6',
  },
  {
    id: '3',
    name: 'Master Bedroom',
    devices: 3,
    powerUsage: 0.5,
    color: '#8B5CF6',
  },
  {
    id: '4',
    name: 'Study Room',
    devices: 2,
    powerUsage: 0.3,
    color: '#EC4899',
  },
];