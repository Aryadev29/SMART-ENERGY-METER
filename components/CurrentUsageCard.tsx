import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Zap, IndianRupee } from 'lucide-react-native';
import { usePowerData } from '@/hooks/usePowerData';

interface CurrentUsageCardProps {
  isDark: boolean;
}

export function CurrentUsageCard({ isDark }: CurrentUsageCardProps) {
  const { power, hourlyRate, isConnected } = usePowerData();
  const estimatedDailyBill = hourlyRate * 24; // Convert hourly rate to daily estimate

  const renderValue = (value: number, prefix: string = '', decimals: number = 2) => {
    if (!isConnected) {
      return <ActivityIndicator color={isDark ? '#94A3B8' : '#64748B'} />;
    }
    return (
      <Text style={[styles.value, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        {prefix}
        {value.toFixed(decimals)}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          opacity: isConnected ? 1 : 0.8
        }
      ]}
    >
      <View style={styles.powerSection}>
        <View style={[styles.iconContainer, { backgroundColor: '#F0FDFA' }]}>
          <Zap size={28} color={isConnected ? '#14B8A6' : '#94A3B8'} />
        </View>
        <View style={styles.valueContainer}>
          {renderValue(power)}
          <Text style={[styles.unit, { color: isDark ? '#94A3B8' : '#64748B' }]}>kW</Text>
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {isConnected ? 'Current Usage' : 'Connecting...'}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />

      <View style={styles.billSection}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
          <IndianRupee size={28} color={isConnected ? '#F59E0B' : '#94A3B8'} />
        </View>
        <View style={styles.valueContainer}>
          {renderValue(estimatedDailyBill, '₹')}
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Est. Daily Bill
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  powerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  billSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: '#94A3B8',
  },
  label: {
    fontSize: 14,
    width: '100%',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: 16,
  },
});