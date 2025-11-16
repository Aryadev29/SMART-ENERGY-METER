import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { TriangleAlert as AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react-native';
import { PowerUsageChart } from '@/components/PowerUsageChart';
import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';
import { deviceService } from '@/services/DeviceService';
import { mockWeeklyData, mockMonthlyData } from '@/data/mockChartData';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('daily');
  const [weeklyData] = useState(mockWeeklyData);
  const [monthlyData] = useState(mockMonthlyData);

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const devices = deviceService.getDevices();

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    devices.forEach(device => {
      const category = device.category || 'other';
      data[category] = (data[category] || 0) + deviceService.getDailyUsage(device.id);
    });
    return Object.entries(data).map(([category, usage]) => ({
      category,
      usage,
    }));
  }, [devices]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Usage Analytics',
        }}
      />
      <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'daily' && [
                styles.activeTab, 
                { backgroundColor: isDark ? '#06B6D4' : '#0891B2' }
              ]
            ]}
            onPress={() => setActiveTab('daily')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'daily' ? styles.activeTabText : { color: isDark ? '#F8FAFC' : '#0F172A' }
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'weekly' && [
                styles.activeTab, 
                { backgroundColor: isDark ? '#06B6D4' : '#0891B2' }
              ]
            ]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'weekly' ? styles.activeTabText : { color: isDark ? '#F8FAFC' : '#0F172A' }
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'monthly' && [
                styles.activeTab, 
                { backgroundColor: isDark ? '#06B6D4' : '#0891B2' }
              ]
            ]}
            onPress={() => setActiveTab('monthly')}
          >
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'monthly' ? styles.activeTabText : { color: isDark ? '#F8FAFC' : '#0F172A' }
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {activeTab === 'daily' ? 'Today\'s Usage' : activeTab === 'weekly' ? 'This Week\'s Usage' : 'This Month\'s Usage'}
            </Text>
            
            {activeTab === 'daily' && (
              <LineChart isDark={isDark} />
            )}

            {activeTab === 'weekly' && (
              <BarChart data={weeklyData} isDark={isDark} />
            )}

            {activeTab === 'monthly' && (
              <BarChart data={monthlyData} isDark={isDark} />
            )}
          </View>

          <View style={[styles.insightsCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Energy Insights
            </Text>
            
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#EEFDF6' }]}>
                <TrendingDown size={20} color="#10B981" />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  15% less energy used
                </Text>
                <Text style={[styles.insightDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Compared to last {activeTab === 'daily' ? 'day' : activeTab === 'weekly' ? 'week' : 'month'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#FEF3F2' }]}>
                <AlertTriangle size={20} color="#EF4444" />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  Peak usage alert
                </Text>
                <Text style={[styles.insightDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  High energy consumption between 6-8 PM
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: '#EFF6FF' }]}>
                <TrendingUp size={20} color="#3B82F6" />
              </View>
              <View style={styles.insightContent}>
                <Text style={[styles.insightTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  $24.65 estimated savings
                </Text>
                <Text style={[styles.insightDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Based on your current usage patterns
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Consumption by Room
            </Text>

            <View style={styles.roomStats}>
              <View style={styles.roomStatItem}>
                <View style={styles.roomStatBar}>
                  <View 
                    style={[
                      styles.roomStatFill, 
                      { backgroundColor: '#06B6D4', width: '65%' }
                    ]} 
                  />
                </View>
                <View style={styles.roomStatLabels}>
                  <Text style={[styles.roomStatName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Living Room
                  </Text>
                  <Text style={[styles.roomStatValue, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    65%
                  </Text>
                </View>
              </View>

              <View style={styles.roomStatItem}>
                <View style={styles.roomStatBar}>
                  <View 
                    style={[
                      styles.roomStatFill, 
                      { backgroundColor: '#10B981', width: '20%' }
                    ]} 
                  />
                </View>
                <View style={styles.roomStatLabels}>
                  <Text style={[styles.roomStatName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Kitchen
                  </Text>
                  <Text style={[styles.roomStatValue, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    20%
                  </Text>
                </View>
              </View>

              <View style={styles.roomStatItem}>
                <View style={styles.roomStatBar}>
                  <View 
                    style={[
                      styles.roomStatFill, 
                      { backgroundColor: '#F59E0B', width: '10%' }
                    ]} 
                  />
                </View>
                <View style={styles.roomStatLabels}>
                  <Text style={[styles.roomStatName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Bedroom
                  </Text>
                  <Text style={[styles.roomStatValue, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    10%
                  </Text>
                </View>
              </View>

              <View style={styles.roomStatItem}>
                <View style={styles.roomStatBar}>
                  <View 
                    style={[
                      styles.roomStatFill, 
                      { backgroundColor: '#8B5CF6', width: '5%' }
                    ]} 
                  />
                </View>
                <View style={styles.roomStatLabels}>
                  <Text style={[styles.roomStatName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    Other
                  </Text>
                  <Text style={[styles.roomStatValue, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                    5%
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.categoryStats}>
            {categoryData.map(({ category, usage }) => (
              <View key={category} style={styles.statCard}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.usageValue}>{usage.toFixed(2)} kWh</Text>
                <Text style={styles.percentage}>
                  {((usage / categoryData.reduce((sum, d) => sum + d.usage, 0)) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#06B6D4',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 12,
    opacity: 0.5,
  },
  roomStats: {
    marginTop: 8,
  },
  roomStatItem: {
    marginBottom: 16,
  },
  roomStatBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  roomStatFill: {
    height: '100%',
    borderRadius: 4,
  },
  roomStatLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roomStatName: {
    fontSize: 14,
    fontWeight: '500',
  },
  roomStatValue: {
    fontSize: 14,
  },
  categoryStats: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64748B',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
    marginBottom: 4,
  },
  percentage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#10B981',
  },
});