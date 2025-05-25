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
      
      // Create the path
      let pathD = '';
      data.forEach((point, i) => {
        const x = paddingHorizontal + (i * (graphWidth / (data.length - 1)));
        const y = paddingVertical + graphHeight - (point.power / maxPower * graphHeight);
        
        if (i === 0) {
          pathD += `M ${x} ${y}`;
        } else {
          pathD += ` L ${x} ${y}`;
        }
      });
      
      setPath(pathD);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Horizontal grid lines */}
        <Line 
          x1={paddingHorizontal} 
          y1={paddingVertical + graphHeight * 0.25} 
          x2={paddingHorizontal + graphWidth} 
          y2={paddingVertical + graphHeight * 0.25} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
          strokeWidth={1} 
        />
        <Line 
          x1={paddingHorizontal} 
          y1={paddingVertical + graphHeight * 0.5} 
          x2={paddingHorizontal + graphWidth} 
          y2={paddingVertical + graphHeight * 0.5} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
          strokeWidth={1} 
        />
        <Line 
          x1={paddingHorizontal} 
          y1={paddingVertical + graphHeight * 0.75} 
          x2={paddingHorizontal + graphWidth} 
          y2={paddingVertical + graphHeight * 0.75} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
          strokeWidth={1} 
        />
        
        {/* X-axis line */}
        <Line 
          x1={paddingHorizontal} 
          y1={paddingVertical + graphHeight} 
          x2={paddingHorizontal + graphWidth} 
          y2={paddingVertical + graphHeight} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
          strokeWidth={1} 
        />
        
        {/* Y-axis line */}
        <Line 
          x1={paddingHorizontal} 
          y1={paddingVertical} 
          x2={paddingHorizontal} 
          y2={paddingVertical + graphHeight} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
          strokeWidth={1} 
        />
        
        {/* The power usage line */}
        <Path
          d={path}
          stroke="#06B6D4"
          strokeWidth={3}
          fill="none"
        />
        
        {/* X-axis labels */}
        {data.filter((_, i) => i % Math.ceil(data.length / 4) === 0 || i === data.length - 1).map((point, i) => (
          <SvgText
            key={`x-label-${i}`}
            x={paddingHorizontal + (i * (graphWidth / (Math.ceil(data.length / 4) - 1 + (data.length % Math.ceil(data.length / 4) === 0 ? 0 : 1))))}
            y={paddingVertical + graphHeight + 15}
            fontSize={10}
            textAnchor="middle"
            fill={isDark ? '#94A3B8' : '#64748B'}
          >
            {point.time}
          </SvgText>
        ))}
        
        {/* Y-axis labels */}
        <SvgText
          x={paddingHorizontal - 15}
          y={paddingVertical + graphHeight}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          0
        </SvgText>
        <SvgText
          x={paddingHorizontal - 15}
          y={paddingVertical + graphHeight * 0.75}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          0.5
        </SvgText>
        <SvgText
          x={paddingHorizontal - 15}
          y={paddingVertical + graphHeight * 0.5}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          1.0
        </SvgText>
        <SvgText
          x={paddingHorizontal - 15}
          y={paddingVertical + graphHeight * 0.25}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          1.5
        </SvgText>
        <SvgText
          x={paddingHorizontal - 15}
          y={paddingVertical + 5}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          2.0
        </SvgText>
      </Svg>
      
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#06B6D4' }]} />
          <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#64748B' }]}>kW</Text>
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