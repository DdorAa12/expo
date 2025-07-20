import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecipeSearch from '../../components/Search';

export default function SearchTab() {
  return (
    <View style={styles.container}>
      <RecipeSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
