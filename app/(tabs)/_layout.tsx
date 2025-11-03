import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Home, BarChart2, Settings, Smartphone, Grid } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function TabsLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark } = useTheme();
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
        }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: isDark ? '#334155' : '#E2E8F0',
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
        },
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 27,
          color: isDark ? '#F8FAFC' : '#0F172A',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Device Management',
          tabBarIcon: ({ color }) => <Smartphone size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Room Control',
          tabBarIcon: ({ color }) => <Grid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics & Reports',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title:  'Settings & Profile',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}