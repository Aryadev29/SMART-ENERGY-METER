import { Tabs } from 'expo-router';
import { View, useColorScheme } from 'react-native';
import { LayoutDashboard, Plug, PhoneIncoming as HomeIcon, ChartLine as LineChart, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = colorScheme === 'dark' ? '#06B6D4' : '#0891B2';
  const inactiveColor = colorScheme === 'dark' ? '#94A3B8' : '#64748B';
  const backgroundColor = colorScheme === 'dark' ? '#1E293B' : '#F8FAFC';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontWeight: '500',
          fontSize: 12,
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: backgroundColor,
          borderBottomWidth: 1,
          borderBottomColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
        },
        headerTintColor: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color, size }) => <Plug size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => <LineChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}