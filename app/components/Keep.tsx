import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import GoogleAuth from './services/GoogleAuth';

export const createNote = async (accessToken : String) => {
  const response = await fetch('https://keep.googleapis.com/v1/notes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Note créée via API 🎉',
      textContent: {
        text: 'Ceci est le contenu de ma note créée depuis mon app Expo !'
      }
    }),
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Note créée :', data);
  } else {
    console.error('❌ Erreur lors de la création :', data);
  }
};
