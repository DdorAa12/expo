import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import React, { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import ImageNutritionScreen from "./services/ImageRecognition";
import * as ImagePicker from "expo-image-picker";
import NutritionChart from "./Nutrition";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode | "gallery">("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [nutritionData, setNutritionData] = useState(null);
  const [showNutrition, setShowNutrition] = useState(false);

  useEffect(() => {
    if (base64) {
      console.log("Image encodée en base64 :", base64.substring(0, 100) + "...");
    }
  }, [base64]);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      const photo = await ref.current?.takePictureAsync({
        base64: true,
        quality: 0.3,
      });

      if (!photo?.base64) {
        console.warn("La photo est manquante ou sans base64.");
        return;
      }

      setUri(photo.uri);
      setBase64(photo.base64);
    } catch (e) {
      console.error("Erreur lors de la prise de photo:", e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const picked = result.assets[0];
      setUri(picked.uri);
      setBase64(picked.base64 || null);
    } else {
      console.log("Image selection canceled or failed.");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "picture" ? "gallery" : "picture";
    setMode(newMode);

    if (newMode === "gallery") {
      pickImage();
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleAnalyze = async () => {
    if (!uri) {
      console.warn("No image URI available.");
      return;
    }

    try {
      console.log("Analyzing image...");
      const result = await ImageNutritionScreen(uri);
      if (result?.items?.length > 0) {
        setNutritionData(result.items);
        setShowNutrition(true);
      } else {
        console.warn("No nutritional data found in the result.");
      }
    } catch (err) {
      console.error("Analyse échouée :", err);
    }
  };

  const handleCloseNutrition = () => {
    setShowNutrition(false);
    // Ne pas réinitialiser nutritionData immédiatement pour éviter les re-renders
    setTimeout(() => {
      setNutritionData(null);
    }, 100);
  };

  const renderPicture = () => {
    if (!uri) return null;

    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
        <View style={{ marginTop: 10 }}>
          <Button onPress={handleAnalyze} title="Analyze food" />
        </View>
      </View>
    );
  };

  const renderCamera = () => (
    <CameraView
      style={styles.camera}
      ref={ref}
      mode="picture"
      facing={facing}
      mute={false}
      responsiveOrientationWhenOrientationLocked
    >
      <View style={styles.shutterContainer}>
        <Pressable onPress={toggleMode}>
          <AntDesign
            name={mode === "picture" ? "picture" : "folderopen"}
            size={32}
            color="white"
          />
        </Pressable>
        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View style={[styles.shutterBtn, { opacity: pressed ? 0.5 : 1 }]}>
              <View style={styles.shutterBtnInner} />
            </View>
          )}
        </Pressable>
        <Pressable onPress={toggleFacing}>
          <FontAwesome6 name="rotate-left" size={32} color="white" />
        </Pressable>
      </View>
    </CameraView>
  );

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
      {showNutrition && nutritionData && (
        <NutritionChart 
          data={nutritionData} 
          onClose={handleCloseNutrition}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});