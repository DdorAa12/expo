import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';

import Camera from '../../components/Camera';
import {useGoogleToken} from '../../components/services/GoogleAuth';
import { createNote } from '../../components/Keep';

export default function HomeScreen() {
  const [message, setMessage] = useState('');

  const handleConnectAndCreateNote = async () => {
    try {
      setMessage('🔐 Connexion en cours...');
      const token = useGoogleToken(); // Connexion Google + récupération token
      console.log('Token reçu :', token);
      // await createNote(token); // Création note Google Keep
      setMessage('✅ Note envoyée avec succès !');
    } catch (error) {
      console.warn('❌ Erreur :', error);
      setMessage('❌ Erreur : ' + error.message);
    }
  };

  return (
    <View style={{ flex: 1, }}>
      <Camera />
      {/* <View style={{ marginVertical: 20 }}>
        <Button title="Créer une note Google Keep" onPress={handleConnectAndCreateNote} />
      </View>
      {message && <Text style={{ marginTop: 20 }}>{message}</Text>} */}
    </View>
  );
}

const styles = StyleSheet.create({
  // styles optionnels
});
