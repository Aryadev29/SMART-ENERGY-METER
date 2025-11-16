// Fetch directly from ESP32 HTTP endpoint
const ESP32_ENDPOINT = 'http://192.168.0.114/data';

interface PowerData {
  currentLed: number;
  currentIncandescent: number;
  currentSocket: number;
  voltage: number;
}

type DataListener = (data: PowerData) => void;

class BluetoothService {
  private static instance: BluetoothService;
  private listeners: DataListener[] = [];
  private pollInterval: number | null = null;
  private isConnected = false;

  constructor() {
    if (BluetoothService.instance) {
      return BluetoothService.instance;
    }
    BluetoothService.instance = this;
  }

  async startPolling(): Promise<void> {
    await this.cleanup();
    this.pollESP32(false);
    this.pollInterval = setInterval(() => this.pollESP32(false), 5000);
  }

  private async pollESP32(fake = false) {
    
    try {
      const res = await fetch(ESP32_ENDPOINT);
      if (!res.ok) throw new Error('Network error');
      const d = await res.json();
      console.log('ESP32 response:', d); // <-- Debug log
      // Expecting: { currentLed, currentIncandescent, currentSocket, voltage }
      const safeCurrentLed = Number.isFinite(d.currentLed) && d.currentLed >= 0 ? d.currentLed : undefined;
      const safeCurrentIncandescent = Number.isFinite(d.currentIncandescent) && d.currentIncandescent >= 0 ? d.currentIncandescent : undefined;
      const safeCurrentSocket = Number.isFinite(d.currentSocket) && d.currentSocket >= 0 ? d.currentSocket : undefined;
      const safeVoltage = Number.isFinite(d.voltage) && d.voltage > 0 ? d.voltage : undefined;
      this.isConnected = true;
      this.notifyListeners({
        currentLed: safeCurrentLed,
        currentIncandescent: safeCurrentIncandescent,
        currentSocket: safeCurrentSocket,
        voltage: safeVoltage
      });
    } catch (e) {
      this.isConnected = false;
      // Silently handle ESP32 fetch errors, do not log or show error messages
      // Do not notify listeners with zero values, just skip update
    }
  }

  addListener(callback: DataListener): void {
    this.listeners.push(callback);
  }

  removeListener(callback: DataListener): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  private notifyListeners(data: PowerData): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  async cleanup(): Promise<void> {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const bluetoothService = new BluetoothService();
