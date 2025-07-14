import { useAppTheme } from '@/context/ThemeContext';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const PI = Math.PI;

export default function StorageScreen() {
  const { colors } = useAppTheme();
  const [cacheSizeMB, setCacheSizeMB] = useState<number | null>(null);
  const [totalSizeMB, setTotalSizeMB] = useState<number | null>(null);

  useEffect(() => {
    const calculateSizes = async () => {
      const getDirSize = async (dirUri: string) => {
        let totalSize = 0;
        const files = await FileSystem.readDirectoryAsync(dirUri);
        for (const file of files) {
          const fileInfo = await FileSystem.getInfoAsync(dirUri + file);
          if (fileInfo.exists && fileInfo.size) {
            totalSize += fileInfo.size;
          }
        }
        return totalSize;
      };

      const cacheDir = FileSystem.cacheDirectory || '';
      const docDir = FileSystem.documentDirectory || '';

      const cacheSize = await getDirSize(cacheDir);
      const docSize = await getDirSize(docDir);

      const total = cacheSize + docSize;

      setCacheSizeMB(cacheSize / (1024 * 1024));
      setTotalSizeMB(total / (1024 * 1024));
    };

    calculateSizes();
  }, []);

  const PieChart = () => {
    if (cacheSizeMB === null || totalSizeMB === null) return null;

    const dataSizeMB = totalSizeMB - cacheSizeMB;
    const cacheAngle = (cacheSizeMB / totalSizeMB) * 360;
    const dataAngle = 360 - cacheAngle;

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(x, y, radius, endAngle);
      const end = polarToCartesian(x, y, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${x} ${y} Z`;
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    return (
      <Svg height={200} width={200} viewBox="0 0 200 200">
        <G>
          {/* Cache slice */}
          <Path
            d={describeArc(100, 100, 80, 0, cacheAngle)}
            fill={colors.accent} // Cache color
          />

          {/* Data slice */}
          <Path
            d={describeArc(100, 100, 80, cacheAngle, 360)}
            fill={colors.card} // App data color
          />
        </G>
      </Svg>
    );
  };

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Storage Usage</Text>

      {cacheSizeMB === null || totalSizeMB === null ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : (
        <>
          <PieChart />

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { color: colors.text }]}>
              Cache Used: {cacheSizeMB.toFixed(2)} MB
            </Text>
            <Text style={[styles.text, { color: colors.text }]}>
              Total App Data: {totalSizeMB.toFixed(2)} MB
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.text, { color: colors.text }]}>Cache</Text>
            <View style={[styles.legendDot, { backgroundColor: colors.card, marginLeft: 16 }]} />
            <Text style={[styles.text, { color: colors.text }]}>Other App Data</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  infoContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
});
