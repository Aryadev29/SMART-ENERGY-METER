import { View, Text, StyleSheet } from 'react-native';
import { Zap, DollarSign } from 'lucide-react-native';

interface CurrentUsageCardProps {
  currentPower: number;
  currentBill: number;
  isDark: boolean;
}

export function CurrentUsageCard({ currentPower, currentBill, isDark }: CurrentUsageCardProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF'
        }
      ]}
    >
      <View style={styles.powerSection}>
        <View style={[styles.iconContainer, { backgroundColor: '#F0FDFA' }]}>
          <Zap size={28} color="#14B8A6" />
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {currentPower} kW
          </Text>
          <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Current Usage
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />

      <View style={styles.billSection}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
          <DollarSign size={28} color="#F59E0B" />
        </View>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            ${currentBill}
          </Text>
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
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: '80%',
    marginHorizontal: 16,
  },
});