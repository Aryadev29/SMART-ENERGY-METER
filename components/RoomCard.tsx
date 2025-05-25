import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Zap } from 'lucide-react-native';

interface Room {
  id: string;
  name: string;
  deviceCount: number;
  activeDevices: number;
  power: number;
  image: string;
}

interface RoomCardProps {
  room: Room;
  isDark: boolean;
}

export function RoomCard({ room, isDark }: RoomCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image 
        source={{ uri: room.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{room.name}</Text>
        <Text style={styles.deviceCount}>
          {room.deviceCount} {room.deviceCount === 1 ? 'Device' : 'Devices'} • {room.activeDevices} Active
        </Text>
        
        <View style={styles.powerContainer}>
          <Zap size={16} color="#FFFFFF" />
          <Text style={styles.powerText}>{room.power} kW</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  deviceCount: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.9,
  },
  powerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  powerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});