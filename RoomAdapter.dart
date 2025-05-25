class RoomAdapter(private val rooms: List<Room>) : RecyclerView.Adapter<RoomAdapter.ViewHolder>() {
    
    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val roomName: TextView = view.findViewById(R.id.roomName)
        val deviceRecycler: RecyclerView = view.findViewById(R.id.deviceRecycler)
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_room, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val room = rooms[position]
        holder.roomName.text = room.name
        
        // Set up nested recycler view for devices
        val deviceAdapter = DeviceAdapter(room.devices)
        holder.deviceRecycler.adapter = deviceAdapter
        holder.deviceRecycler.layoutManager = LinearLayoutManager(holder.itemView.context)
    }
    
    override fun getItemCount() = rooms.size
}