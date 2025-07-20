import { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import CopiableText from './CopiableText';
import { useClipboard } from '../ClipboardContext';

interface NutritionItem {
  calories: number;
  fat_total_g: number;
  fat_saturated_g: number;
  sugar_g: number;
  protein_g: number;
  fiber_g: number;
  sodium_mg: number;
  carbohydrates_total_g: number;
  serving_size_g: number;
}

interface NutritionDataProps {
  data: NutritionItem[];
  onClose: () => void;
}

export default function NutritionChart({ data, onClose }: NutritionDataProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const { copy } = useClipboard();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 300, duration: 600, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      onClose();
    });
  };

  const total = data.reduce((sum, item) => sum + (item.serving_size_g || 0), 0);

  const totals = data.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.fat_total_g += item.fat_total_g || 0;
      acc.fat_saturated_g += item.fat_saturated_g || 0;
      acc.sugar_g += item.sugar_g || 0;
      acc.protein_g += item.protein_g || 0;
      acc.fiber_g += item.fiber_g || 0;
      acc.sodium_mg += item.sodium_mg || 0;
      acc.carbohydrates_total_g += item.carbohydrates_total_g || 0;
      return acc;
    },
    {
      calories: 0,
      fat_total_g: 0,
      fat_saturated_g: 0,
      sugar_g: 0,
      protein_g: 0,
      fiber_g: 0,
      sodium_mg: 0,
      carbohydrates_total_g: 0,
    }
  );

  const dataForChart = [
    { name: 'Calories', value: totals.calories },
    { name: 'Fat', value: totals.fat_total_g },
    { name: 'Saturated Fat', value: totals.fat_saturated_g },
    { name: 'Sugar', value: totals.sugar_g },
    { name: 'Protein', value: totals.protein_g },
    { name: 'Fiber', value: totals.fiber_g },
    { name: 'Sodium (mg)', value: totals.sodium_mg },
    { name: 'Carbs', value: totals.carbohydrates_total_g },
  ];

  const handleCopyAll = () => {
    const fullText = [
      'Nutritional Overview',
      ...dataForChart.map((item) => `${item.name}: ${item.value.toFixed(1)}`),
      ...Object.entries(totals).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value.toFixed(1)}`),
    ].join('\n');

    copy(fullText);
    Alert.alert('Copié !', 'Toutes les données nutritionnelles ont été copiées.');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <CopiableText style={styles.header}>Nutritional Overview</CopiableText>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <CopiableText style={styles.closeButtonText}>✕</CopiableText>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onLongPress={handleCopyAll}>
        <View>
          <View style={styles.dragBar} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartRow}>
            {dataForChart
              .filter((item) => item.name !== 'Calories' && item.name !== 'Sodium (mg)')
              .map((item) => {
                const percent = (item.value / Math.max(total, 1)) * 100;
                const displayPercent = Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(1)}%`;

                return (
                  <View key={item.name} style={styles.chartItem}>
                    <CopiableText style={styles.chartLabel}>{item.name}</CopiableText>
                    <View style={styles.chartBarBg}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${Math.min(percent, 100)}%`,
                          },
                        ]}
                      />
                    </View>
                    <CopiableText style={styles.chartValue}>{displayPercent}</CopiableText>
                  </View>
                );
              })}
          </ScrollView>

          <ScrollView style={styles.tableContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.table}>
              {Object.entries(totals).map(([key, value]) => (
                <View key={key} style={styles.tableRow}>
                  <CopiableText style={styles.tableKey}>{key.replace(/_/g, ' ')}</CopiableText>
                  <CopiableText style={styles.tableValue}>{value.toFixed(1)}</CopiableText>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f3f4f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  dragBar: {
    width: 60,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  chartItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  chartLabel: {
    fontSize: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  chartBarBg: {
    width: 24,
    height: 120,
    backgroundColor: '#dbeafe',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 4,
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#3b82f6',
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableKey: {
    textTransform: 'capitalize',
    color: '#6b7280',
  },
  tableValue: {
    fontWeight: '500',
    color: '#111827',
  },
});
