import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useState, useEffect } from 'react';

interface LineChartProps {
  isDark: boolean;
}

// Mock data for today's hourly usage
const hourlyData = [
  { hour: '00:00', value: 0.3 },
  { hour: '03:00', value: 0.2 },
  { hour: '06:00', value: 0.5 },
  { hour: '09:00', value: 1.2 },
  { hour: '12:00', value: 0.8 },
  { hour: '15:00', value: 1.5 },
  { hour: '18:00', value: 1.7 },
  { hour: '21:00', value: 0.9 },
  { hour: 'Now', value: 0.7 },
];

export function LineChart({ isDark }: LineChartProps) {
  const [path, setPath] = useState('');
  const [dots, setDots] = useState<{ x: number, y: number }[]>([]);
  
  const chartWidth = Dimensions.get('window').width - 64;
  const chartHeight = 220;
  const paddingHorizontal = 40;
  const paddingVertical = 40;
  const graphWidth = chartWidth - (paddingHorizontal * 2);
  const graphHeight = chartHeight - (paddingVertical * 2);
  
  useEffect(() => {
    // Find max for y-axis scaling
    const maxValue = Math.max(...hourlyData.map(d => d.value)) * 1.2;
    
    // Create the path and dots
    let pathD = '';
    const dotsArray: { x: number, y: number }[] = [];
    
    hourlyData.forEach((point, i) => {
      const x = paddingHorizontal + (i * (graphWidth / (hourlyData.length - 1)));
      const y = paddingVertical + graphHeight - (point.value / maxValue * graphHeight);
      
      dotsArray.push({ x, y });
      
      if (i === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    });
    
    setPath(pathD);
    setDots(dotsArray);
  }, []);

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
        
        {/* The line */}
        <Path
          d={path}
          stroke="#06B6D4"
          strokeWidth={3}
          fill="none"
        />
        
        {/* Dots */}
        {dots.map((dot, i) => (
          <Circle
            key={`dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r={4}
            fill="#FFFFFF"
            stroke="#06B6D4"
            strokeWidth={2}
          />
        ))}
        
        {/* X-axis labels */}
        {hourlyData.filter((_, i) => i % 2 === 0 || i === hourlyData.length - 1).map((point, i) => {
          const filteredData = hourlyData.filter((_, i) => i % 2 === 0 || i === hourlyData.length - 1);
          const x = paddingHorizontal + (i * (graphWidth / (filteredData.length - 1)));
          return (
            <SvgText
              key={`x-label-${i}`}
              x={x}
              y={paddingVertical + graphHeight + 15}
              fontSize={10}
              textAnchor="middle"
              fill={isDark ? '#94A3B8' : '#64748B'}
            >
              {point.hour}
            </SvgText>
          );
        })}
        
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
          y={paddingVertical + graphHeight * 0.5}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          1.0
        </SvgText>
        <SvgText
          x={paddingHorizontal - 10}
          y={paddingVertical}
          fontSize={10}
          textAnchor="end"
          fill={isDark ? '#94A3B8' : '#64748B'}
        >
          2.0
        </SvgText>
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