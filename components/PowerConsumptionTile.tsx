import { View, Text, StyleSheet, ReactNode } from 'react-native';

interface PowerConsumptionTileProps {
  title: string;
  value: string;
  icon: ReactNode;
  isDark: boolean;
}

export function PowerConsumptionTile({ title, value, icon, isDark }: PowerConsumptionTileProps) {
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }
      ]}
    >
      <View style={styles.header}>
        {icon}
      </View>
      <Text style={[styles.value, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        {value}
      </Text>
      <Text style={[styles.title, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
  },
});