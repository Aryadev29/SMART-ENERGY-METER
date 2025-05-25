import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight, Zap } from 'lucide-react-native';

interface Device {
  id: string;
  name: string;
  room: string;
  active: boolean;
  power: number;
  runtime: string;
  icon: string;
}

interface DeviceCardProps {
  device: Device;
  isDark: boolean;
}

export function DeviceCard({ device, isDark }: DeviceCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.mainContent}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: getIconBackground(device.icon) }]}>
            <Zap size={24} color={getIconColor(device.icon)} />
          </View>
          
          <View style={styles.info}>
            <Text style={[styles.name, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {device.name}
            </Text>
            <Text style={[styles.room, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {device.room}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Switch
            trackColor={{ false: '#CBD5E1', true: '#0891B2' }}
            thumbColor={'#FFFFFF'}
            value={device.active}
          />
          <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} style={styles.chevron} />
        </View>
      </View>
      
      <View style={[styles.footer, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Current Power
          </Text>
          <Text style={[styles.footerValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {device.power} kW
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#475569' : '#E2E8F0' }]} />
        <View style={styles.footerItem}>
          <Text style={[styles.footerLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Runtime
          </Text>
          <Text style={[styles.footerValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {device.runtime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Helper functions to get colors based on device type
function getIconBackground(iconType: string): string {
  const colors = {
    'ac': '#EFF6FF',
    'fridge': '#F0FDFA',
    'tv': '#FFF7ED',
    'light': '#FEF9C3',
    'default': '#F0FDFA'
  };
  return colors[iconType as keyof typeof colors] || colors.default;
}

function getIconColor(iconType: string): string {
  const colors = {
    'ac': '#3B82F6',
    'fridge': '#14B8A6',
    'tv': '#F59E0B',
    'light': '#EAB308',
    'default': '#10B981'
  };
  return colors[iconType as keyof typeof colors] || colors.default;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  room: {
    fontSize: 14,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
  },
});