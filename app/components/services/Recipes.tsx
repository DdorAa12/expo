export async function fetchRecipes(query: string) {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_API_KEY est manquant.');
  }

  const url = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;
  console.log('Requête API :', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erreur API brute:', response.status, errorText);
    throw new Error(`Erreur API: ${response.statusText}`);
  }

  return response.json();
}
