
export default async function ImageNutritionScreen(fileUri: string) {
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  const formData = new FormData();

  formData.append("file", {
    uri: fileUri,
    name: "image",
    type: "image/*",
  } as any);

  const response = await fetch("https://api.calorieninjas.com/v1/imagetextnutrition", {
    method: "POST",
    headers: {
      "X-Api-Key": API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${errorText}`);
  }

  return await response.json();
}
