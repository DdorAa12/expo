import * as SecureStore from 'expo-secure-store';

const TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const CLIENT_ID = 'fe8d56f8784048b8be7aaee583fc05bd';
const CLIENT_SECRET = 'd5cd784459a542c8a2d7742a171357e0';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface TokenCache {
  accessToken: string | null;
  expiry: number | null;
}

const tokenCache: TokenCache = {
  accessToken: null,
  expiry: null,
};

async function saveTokenToStore(token: string, expiry: number): Promise<void> {
  await SecureStore.setItemAsync('fatsecret_token', token);
  await SecureStore.setItemAsync('fatsecret_expiry', expiry.toString());
}

async function loadTokenFromStore(): Promise<void> {
  const token = await SecureStore.getItemAsync('fatsecret_token');
  const expiryStr = await SecureStore.getItemAsync('fatsecret_expiry');
  const expiry = expiryStr ? parseInt(expiryStr, 10) : null;

  if (token && expiry) {
    tokenCache.accessToken = token;
    tokenCache.expiry = expiry;
  }
}

async function isTokenValid(): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  return (
    tokenCache.accessToken !== null &&
    tokenCache.expiry !== null &&
    now < tokenCache.expiry - 60 // refresh 1 min before actual expiration
  );
}

async function fetchNewToken(): Promise<string> {
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const encodedCreds = Buffer.from(credentials).toString('base64');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedCreds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=basic',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch token: ${errorText}`);
  }

  const data: TokenResponse = await response.json();
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + data.expires_in;

  tokenCache.accessToken = data.access_token;
  tokenCache.expiry = expiry;

  await saveTokenToStore(data.access_token, expiry);

  return data.access_token;
}

/**
 * Get a valid FatSecret access token.
 * Automatically loads and refreshes if needed.
 */
export async function getAccessToken(): Promise<string> {
  if (!tokenCache.accessToken || !tokenCache.expiry) {
    await loadTokenFromStore();
  }

  if (await isTokenValid()) {
    return tokenCache.accessToken as string;
  }

  return await fetchNewToken();
}
