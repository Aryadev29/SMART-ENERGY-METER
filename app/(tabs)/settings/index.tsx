import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, Bell, Moon, Sun, DollarSign, Shield, CircleHelp as HelpCircle, User, LogOut } from 'lucide-react-native';
import { authService } from '@/services/AuthService';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const user = authService.getUser();

  // Persist demo mode setting
  useEffect(() => {
    AsyncStorage.getItem('demoMode').then(val => {
      if (val === 'true') setDemoMode(true);
    });
  }, []);
  const handleDemoMode = (val: boolean) => {
    setDemoMode(val);
    AsyncStorage.setItem('demoMode', val ? 'true' : 'false');
  };

  const navigateToProfile = () => {
    router.push('/settings/profile');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
          },
          headerTintColor: isDark ? '#F8FAFC' : '#0F172A',
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <TouchableOpacity style={[styles.profileSection, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]} onPress={navigateToProfile}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={[styles.name, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          <User size={24} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Preferences
          </Text>
          
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
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>

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
              <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                <DollarSign size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Electricity Rate Settings
              </Text>
            </View>
            <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          </View>

          {/* Demo Mode Switch */}
          <View style={[styles.settingItem, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}> 
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#F0FDFA' }]}> 
                <DollarSign size={20} color="#F59E0B" />
              </View>
              <Text style={[styles.settingText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Demo Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#CBD5E1', true: '#F59E0B' }}
              thumbColor={'#FFFFFF'}
              onValueChange={handleDemoMode}
              value={demoMode}
            />
          </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
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