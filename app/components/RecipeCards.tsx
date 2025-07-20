import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NutritionChart from './Nutrition'; // Assure-toi que ce chemin est correct

type Recipe = {
  name: string;
  calories: number;
  serving_size_g: number;
};

type Props = {
  recipes: Recipe[];
};

export const RecipeCards: React.FC<Props> = ({ recipes }) => {
  const [nutritionData, setNutritionData] = useState<Recipe | null>(null);
  const [showNutrition, setShowNutrition] = useState(false);

  const handleAnalyze = (item: Recipe) => {
    console.log('Analyse déclenchée pour :', item.name);
    setNutritionData(item);
    setShowNutrition(true);
  };

  const handleCloseNutrition = () => {
    setShowNutrition(false);
    setTimeout(() => setNutritionData(null), 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {recipes.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => handleAnalyze(item)}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Portion : {item.serving_size_g} g</Text>
            <Text>Calories : {item.calories}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showNutrition && nutritionData && (
        <NutritionChart
          data={[nutritionData]} // NutritionChart attend un tableau
          onClose={handleCloseNutrition}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
});
