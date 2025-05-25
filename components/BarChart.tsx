import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

interface BarData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarData[];
  isDark: boolean;
}

export function BarChart({ data, isDark }: BarChartProps) {
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 220;
  const paddingHorizontal = 40;
  const paddingVertical = 40;
  const graphWidth = chartWidth - (paddingHorizontal * 2);
  const graphHeight = chartHeight - (paddingVertical * 2);
  
  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value)) * 1.2; // Add 20% margin
  
  // Calculate bar width based on number of data points and spacing
  const barCount = data.length;
  const barSpacing = 8;
  const barWidth = (graphWidth - (barSpacing * (barCount - 1))) / barCount;
  
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
        
        {/* Y-axis labels */}
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical + graphHeight}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          0
        </SvgText>
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical + graphHeight * 0.75}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          {(maxValue * 0.25).toFixed(1)}
        </SvgText>
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical + graphHeight * 0.5}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          {(maxValue * 0.5).toFixed(1)}
        </SvgText>
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical + graphHeight * 0.25}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          {(maxValue * 0.75).toFixed(1)}
        </SvgText>
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical + 10}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          {maxValue.toFixed(1)}
        </SvgText>
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * graphHeight;
          const x = paddingHorizontal + (index * (barWidth + barSpacing));
          const y = paddingVertical + graphHeight - barHeight;
          
          return (
            <Rect
              key={`bar-${index}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill="#06B6D4"
            />
          );
        })}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = paddingHorizontal + (index * (barWidth + barSpacing)) + (barWidth / 2);
          const y = paddingVertical + graphHeight + 15;
          
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fontSize={10}
              textAnchor="middle"
              fill={isDark ? '#94A3B8' : '#64748B'}
            >
              {item.label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 8,
  },
});