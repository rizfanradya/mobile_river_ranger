import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function FormMasterData() {
  const [buttonAddData, setButtonAddData] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const [cameraUri, setCameraUri] = useState<string | null>(null);

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
      setCameraUri(result.assets[0].uri);
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
      setCameraUri(result.assets[0].uri);
    }
    console.log(result);
  };

  return (
    <>
      <>
        {cameraUri && (
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: cameraUri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
      </>

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
          <TouchableOpacity onPress={handleForm} style={styles.button}>
            <View style={styles.buttonInner}>
              <FontAwesome6 name="image" style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </>
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    top: 50,
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 9999,
  },
  imageContainer: {
    height: 250,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    height: 350,
    marginHorizontal: "auto",
  },
  mainButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
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
    bottom: 55,
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
