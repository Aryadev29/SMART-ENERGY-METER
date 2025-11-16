const bleno = require('@abandonware/bleno');

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Simulated power data
let currentPower = 0.8;
let currentVoltage = 230.0;
let currentCurrent = currentPower * 1000 / currentVoltage; // in Amperes

class PowerCharacteristic extends bleno.Characteristic {
  constructor() {
    super({
      uuid: CHARACTERISTIC_UUID,
      properties: ['read', 'notify'],
      descriptors: [
        new bleno.Descriptor({
          uuid: '2901',
          value: 'Power Data'
        })
      ]
    });
  }

  onReadRequest(offset, callback) {
    try {
      // Create a buffer with the power data
      const buffer = Buffer.alloc(12); // 3 float32 values (4 bytes each)
      buffer.writeFloatLE(currentPower, 0);
      buffer.writeFloatLE(currentVoltage, 4);
      buffer.writeFloatLE(currentCurrent, 8);
      
      callback(this.RESULT_SUCCESS, buffer);
    } catch (error) {
      callback(this.RESULT_UNLIKELY_ERROR);
    }
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('Device subscribed to notifications');
    
    // Send updates every second
    this.intervalId = setInterval(() => {
      // Simulate power fluctuation
      currentPower = 0.8 + (Math.random() * 0.4); // Random power between 0.8 and 1.2 kW
      currentCurrent = currentPower * 1000 / currentVoltage;
      
      const buffer = Buffer.alloc(12);
      buffer.writeFloatLE(currentPower, 0);
      buffer.writeFloatLE(currentVoltage, 4);
      buffer.writeFloatLE(currentCurrent, 8);
      
      updateValueCallback(buffer);
    }, 1000);
  }

  onUnsubscribe() {
    console.log('Device unsubscribed from notifications');
    clearInterval(this.intervalId);
  }
}

// Create a new service
const powerService = new bleno.PrimaryService({
  uuid: SERVICE_UUID,
  characteristics: [
    new PowerCharacteristic()
  ]
});

// Start advertising when Bluetooth is powered on
bleno.on('stateChange', (state) => {
  console.log('Bluetooth state:', state);
  
  if (state === 'poweredOn') {
    bleno.startAdvertising('SmartEnergyMeter', [SERVICE_UUID], (error) => {
      if (error) {
        console.error('Error starting advertising:', error);
      } else {
        console.log('Started advertising');
      }
    });
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', (error) => {
  if (error) {
    console.error('Error starting advertising:', error);
    return;
  }
  
  console.log('Advertising started. Setting services...');
  bleno.setServices([powerService], (error) => {
    if (error) {
      console.error('Error setting services:', error);
    } else {
      console.log('Services set successfully');
    }
  });
});

bleno.on('accept', (clientAddress) => {
  console.log('Client connected:', clientAddress);
});

bleno.on('disconnect', (clientAddress) => {
  console.log('Client disconnected:', clientAddress);
});
