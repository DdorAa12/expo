// useGoogleToken.ts
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

type UseGoogleTokenCallback = (token: string | null) => void;

export function useGoogleToken(onTokenReceived: UseGoogleTokenCallback) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // depuis .env
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (request) {
      promptAsync();
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken ?? null;
      onTokenReceived(token);
    } else if (response?.type === 'error') {
      onTokenReceived(null);
    }
  }, [response]);
}
