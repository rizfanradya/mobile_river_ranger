import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function FormMasterData() {
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
    }, 3000);
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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin diperlukan",
        "Izin kamera diperlukan untuk mengambil gambar."
      );
      return;
    }
    const result: any = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert("Gambar dipilih", `URI Gambar: ${result.assets[0].uri}`);
    }
    console.log(result);
  };

  const handleForm = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      Alert.alert("File dipilih", `URI File: ${result.assets[0].uri}`);
    }
    console.log(result);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setButtonAddData(!buttonAddData)}
        style={{
          position: "absolute",
          bottom: 50,
          right: 30,
          width: 70,
          height: 70,
          zIndex: 999,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#2DCE89",
            borderRadius: 99999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name={buttonAddData ? "xmark" : "plus"}
            style={{
              color: "rgb(1, 1, 1)",
              fontSize: 30,
            }}
          />
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 55,
          right: 35,
          transform: [
            { translateY: cameraTranslateY },
            { translateX: cameraTranslateX },
          ],
          opacity: cameraAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => handleCamera()}
          style={{
            width: 50,
            height: 50,
            display: buttonAddData ? "flex" : "none",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#11CDEF",
              borderRadius: 99999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6
              name="camera"
              style={{
                color: "rgb(1, 1, 1)",
                fontSize: 20,
              }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 55,
          right: 35,
          transform: [
            { translateY: formTranslateY },
            { translateX: formTranslateX },
          ],
          opacity: formAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => handleForm()}
          style={{
            width: 50,
            height: 50,
            display: buttonAddData ? "flex" : "none",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#11CDEF",
              borderRadius: 99999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6
              name="image"
              style={{
                color: "rgb(1, 1, 1)",
                fontSize: 20,
              }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
