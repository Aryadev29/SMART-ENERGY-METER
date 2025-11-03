import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';

interface DataPoint {
  time: string;
  power: number;
}

interface PowerUsageChartProps {
  data: DataPoint[];
  isDark: boolean;
}

export function PowerUsageChart({ data, isDark }: PowerUsageChartProps) {
  const [path, setPath] = useState('');
  const [costPath, setCostPath] = useState('');
  
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 160;
  const paddingHorizontal = 20;
  const paddingVertical = 20;
  const graphWidth = chartWidth - (paddingHorizontal * 2);
  const graphHeight = chartHeight - (paddingVertical * 2);
  
  useEffect(() => {
    if (data && data.length > 0) {
      // Find min and max for y-axis scaling
      const maxPower = Math.max(...data.map(d => d.power)) * 1.2; // Add 20% margin
      const RATE_PER_KWH = 7; // ₹7 per kWh
      
      // Create the power usage path
      let powerPathD = '';
      // Create the cost path
      let costPathD = '';
      
      data.forEach((point, i) => {
        const x = paddingHorizontal + (i * (graphWidth / Math.max(data.length - 1, 1)));
        const powerY = paddingVertical + graphHeight - (point.power / maxPower * graphHeight);
        const cost = point.power * RATE_PER_KWH;
        const costY = paddingVertical + graphHeight - (cost / (maxPower * RATE_PER_KWH) * graphHeight);
        
        if (i === 0) {
          powerPathD += `M ${x} ${powerY}`;
          costPathD += `M ${x} ${costY}`;
        } else {
          powerPathD += ` L ${x} ${powerY}`;
          costPathD += ` L ${x} ${costY}`;
        }
      });
      
      setPath(powerPathD);
      setCostPath(costPathD);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Grid lines */}
        {[0, 1, 2, 3].map((i) => (
          <Line
            key={i}
            x1={paddingHorizontal}
            y1={paddingVertical + (i * graphHeight / 3)}
            x2={chartWidth - paddingHorizontal}
            y2={paddingVertical + (i * graphHeight / 3)}
            stroke={isDark ? '#334155' : '#E2E8F0'}
            strokeWidth="1"
          />
        ))}
        
        {/* Power usage line */}
        <Path
          d={path}
          stroke="#0891B2"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Cost line */}
        <Path
          d={costPath}
          stroke="#F59E0B"
          strokeWidth="2"
          fill="none"
          opacity={0.6}
        />
      </Svg>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#0891B2' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#64748B' }]}>Power (kW)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#64748B' }]}>Cost (₹/h)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
  },
});