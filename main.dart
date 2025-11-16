// Basic structure for main activity
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize Bluetooth/WiFi connection to your energy meter
        initializeDeviceConnection()
        
        // Set up real-time data listeners
        setupDataListeners()
    }
    
    private fun initializeDeviceConnection() {
        // Implementation depends on your communication method
    }
    
    private fun setupDataListeners() {
        // Listen for real-time data updates from your module
    }
}

// Example of updating real-time display
fun updatePowerDisplay(currentPower: Float, voltage: Float, current: Float) {
    runOnUiThread {
        powerTextView.text = String.format("%.2f kW", currentPower)
        voltageTextView.text = String.format("%.1f V", voltage)
        currentTextView.text = String.format("%.2f A", current)
        
        // Calculate and display cost
        val costPerHour = calculateCostPerHour(currentPower)
        costTextView.text = String.format("$%.2f/hr", costPerHour)
    }
}

fun calculateCostPerHour(powerKW: Float): Float {
    // Get electricity rate from shared preferences
    val rate = PreferenceManager.getDefaultSharedPreferences(this)
        .getFloat("electricity_rate", 0.12f) // default $0.12/kWh
    
    return powerKW * rate
}


