class UsageGraphFragment : Fragment() {
    
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, 
        savedInstanceState: Bundle?): View {
        val view = inflater.inflate(R.layout.fragment_usage_graph, container, false)
        val lineChart = view.findViewById<LineChart>(R.id.lineChart)
        
        // Sample data - replace with actual from your database
        val entries = ArrayList<Entry>()
        entries.add(Entry(0f, 0.5f))
        entries.add(Entry(1f, 1.2f))
        // ... more data points
        
        val dataSet = LineDataSet(entries, "Power Consumption (kW)")
        dataSet.color = Color.GREEN
        dataSet.valueTextColor = Color.BLACK
        
        val lineData = LineData(dataSet)
        lineChart.data = lineData
        lineChart.invalidate() // refresh
        
        return view
    }
}