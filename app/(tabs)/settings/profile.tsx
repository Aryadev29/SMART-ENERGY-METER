import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Image,
  Platform,
  Animated,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, Upload, User, DollarSign, Calendar, Mail, Key } from 'lucide-react-native';
import { authService } from '@/services/AuthService';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = authService.getUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [monthlyLimit, setMonthlyLimit] = useState(
    (user?.monthlyBillLimit || 0).toString()
  );
  const [electricityRate, setElectricityRate] = useState(
    (user?.electricityRate || 7).toString()
  );
  const [loading, setLoading] = useState(false);

  // Animation values
  const [headerAnimation] = useState(new Animated.Value(0));
  const [contentAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate header and content on mount
    Animated.sequence([
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleHapticFeedback = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  };
  const handleSignOut = async () => {
    try {
      await handleHapticFeedback('heavy');
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => handleHapticFeedback('light'),
          },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await handleHapticFeedback('medium');
              await authService.signOut();
              router.replace('/auth/sign-in');
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        await handleUpdateProfile({ profilePicture: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpdateProfile = async (additionalUpdates = {}) => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    const billLimit = parseFloat(monthlyLimit);
    if (isNaN(billLimit) || billLimit < 0) {
      Alert.alert('Error', 'Please enter a valid monthly bill limit');
      return;
    }

    const rate = parseFloat(electricityRate);
    if (isNaN(rate) || rate <= 0) {
      Alert.alert('Error', 'Please enter a valid electricity rate');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        name,
        monthlyBillLimit: billLimit,
        electricityRate: rate,
        ...additionalUpdates,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.replace('/auth/sign-in');
    return null;
  }
  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0F172A' : '#fff' }
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#1E293B' : '#10B981',
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
            opacity: headerAnimation,
          },
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.avatarContainer,
            { backgroundColor: isDark ? '#2D3B4E' : '#fff' }
          ]}
          onPress={() => {
            handleHapticFeedback('light');
            handlePickImage();
          }}
        >
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={[
              styles.avatarText,
              { color: isDark ? '#fff' : '#10B981' }
            ]}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          )}
          <View style={styles.cameraIconContainer}>
            <Camera size={16} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Monthly Bill Limit (₹)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={monthlyLimit}
              onChangeText={setMonthlyLimit}
              placeholder="Enter monthly bill limit"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>
              ₹{user.monthlyBillLimit?.toFixed(2) || '0.00'}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Electricity Rate (₹/kWh)</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={electricityRate}
              onChangeText={setElectricityRate}
              placeholder="Enter electricity rate"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.value}>
              ₹{user.electricityRate?.toFixed(2) || '7.00'}/kWh
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Current Bill Amount</Text>
          <Text style={[
            styles.value,
            user.currentBillAmount && user.monthlyBillLimit &&
            user.currentBillAmount >= user.monthlyBillLimit
              ? styles.warningText
              : null
          ]}>
            ₹{user.currentBillAmount?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => handleUpdateProfile({})}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setName(user.name);
                setMonthlyLimit((user.monthlyBillLimit || 0).toString());
                setElectricityRate((user.electricityRate || 7).toString());
                setIsEditing(false);
              }}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#10B981',
    padding: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#0F172A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#10B981',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#64748B',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    marginTop: 20,
  },
  warningText: {
    color: '#EF4444',
  },
});
