// BlynkService.ts
// Simple Blynk HTTP API integration for Expo/React Native
// Usage: import BlynkService from '@/services/BlynkService';

const BLYNK_AUTH_TOKEN = 'YOUR_BLYNK_TOKEN_HERE'; // <-- Set your Blynk token here
const BLYNK_BASE_URL = 'https://blynk.cloud/external/api';

const BlynkService = {
  // Get value of a virtual pin
  async getPinValue(pin: string): Promise<string | null> {
    try {
      const res = await fetch(`${BLYNK_BASE_URL}/get?token=${BLYNK_AUTH_TOKEN}&v${pin}`);
      if (!res.ok) throw new Error('Failed to fetch pin value');
      const data = await res.json();
      return data[0];
    } catch (e) {
      console.error('Blynk getPinValue error:', e);
      return null;
    }
  },

  // Set value of a virtual pin
  async setPinValue(pin: string, value: string | number): Promise<boolean> {
    try {
      const res = await fetch(`${BLYNK_BASE_URL}/update?token=${BLYNK_AUTH_TOKEN}&v${pin}=${value}`);
      return res.ok;
    } catch (e) {
      console.error('Blynk setPinValue error:', e);
      return false;
    }
  },
};

export default BlynkService;
