import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";

export default function ButtonAddData() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [buttonAddData, setButtonAddData] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cameraAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    const timeout = setTimeout(() => {
      if (buttonAddData) {
        setButtonAddData(false);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [buttonAddData]);

  const cameraTranslateY = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -75],
  });
  const cameraTranslateX = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -10],
  });
  const formTranslateX = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -75],
  });

  const handleCamera = async () => {
    if (buttonAddData) {
      const imagePerm = await ImagePicker.requestCameraPermissionsAsync();
      if (imagePerm.status !== "granted") {
        Alert.alert(
          "Izin diperlukan",
          "Izin kamera diperlukan untuk mengambil gambar."
        );
        return;
      }
      const resultImage: any = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!resultImage.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          resultImage.assets[0].uri,
          [{ resize: { width: 400, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        navigation.navigate("(form)", { fileUri: resizedImage.uri });
      }
    }
  };

  const handleFile = async () => {
    if (buttonAddData) {
      const resultImage: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!resultImage.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          resultImage.assets[0].uri,
          [{ resize: { width: 400, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        navigation.navigate("(form)", { fileUri: resizedImage.uri });
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setButtonAddData(!buttonAddData)}
        style={styles.mainButton}
      >
        <View style={styles.mainButtonInner}>
          <FontAwesome6
            name={buttonAddData ? "xmark" : "plus"}
            style={styles.mainButtonIcon}
          />
        </View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.animatedButton,
          {
            transform: [
              { translateY: cameraTranslateY },
              { translateX: cameraTranslateX },
            ],
            opacity: cameraAnim,
          },
        ]}
      >
        <TouchableOpacity onPress={handleCamera} style={styles.button}>
          <View style={styles.buttonInner}>
            <FontAwesome6 name="camera" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedButton,
          {
            transform: [
              { translateY: formTranslateY },
              { translateX: formTranslateX },
            ],
            opacity: formAnim,
          },
        ]}
      >
        <TouchableOpacity onPress={handleFile} style={styles.button}>
          <View style={styles.buttonInner}>
            <FontAwesome6 name="image" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  mainButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 70,
    height: 70,
    zIndex: 999,
  },
  mainButtonInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2DCE89",
    borderRadius: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonIcon: {
    color: "rgb(1, 1, 1)",
    fontSize: 30,
  },
  animatedButton: {
    position: "absolute",
    bottom: 35,
    right: 35,
  },
  button: {
    width: 50,
    height: 50,
    display: "flex",
  },
  buttonInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "#11CDEF",
    borderRadius: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonIcon: {
    color: "rgb(1, 1, 1)",
    fontSize: 20,
  },
});
