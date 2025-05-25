import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useColorScheme, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { ChevronRight, Bell, Moon, Sun, DollarSign, Shield, CircleHelp as HelpCircle, User, LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Account
          </Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                <User size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Profile Information
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3F2' }]}>
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Sign Out
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Preferences
          </Text>

          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F0FDFA' }]}>
                <Bell size={20} color="#14B8A6" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Notifications
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#0891B2' }}
              thumbColor={'#FFFFFF'}
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
              value={notificationsEnabled}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                {isDark ? (
                  <Moon size={20} color="#3B82F6" />
                ) : (
                  <Sun size={20} color="#3B82F6" />
                )}
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#0891B2' }}
              thumbColor={'#FFFFFF'}
              onValueChange={handleDarkModeToggle}
              value={darkMode}
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                <DollarSign size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Electricity Rate Settings
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Help & Support
          </Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F0FDFA' }]}>
                <HelpCircle size={20} color="#14B8A6" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Help Center
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                <Shield size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Privacy Policy
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Smart Energy Meter v1.0.0
          </Text>
          <Text style={[styles.appCopyright, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            © 2025 College Project
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
  },
});