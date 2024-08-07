import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import RNPickerSelect from "react-native-picker-select";
const dimension = Dimensions.get("screen");

export default function FormMasterData() {
  const [buttonAddData, setButtonAddData] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const [cameraUri, setCameraUri] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [choice_id, setChoice_id] = useState<number>(0);

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
    setButtonLoading(false);
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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!resultImage.canceled) {
      setCameraUri(resultImage.assets[0].uri);
    }
  };

  const handleFile = async () => {
    setButtonLoading(false);
    const resultImage: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!resultImage.canceled) {
      setCameraUri(resultImage.assets[0].uri);
    }
  };

  async function onSubmit() {
    setButtonLoading(true);
    const geoLocatePerm = await Location.requestForegroundPermissionsAsync();
    if (geoLocatePerm.status !== "granted") {
      Alert.alert(
        "Izin diperlukan",
        "Izin lokasi diperlukan untuk mengambil lokasi terkini."
      );
      return;
    }
    try {
      const data = {
        datetime: new Date().toISOString(),
        location: await Location.getCurrentPositionAsync({}),
        image: cameraUri,
        description,
        choice_id,
      };
      alert(`
            datetime    = ${data.datetime}
      -------------------------------------------
            location    = ${JSON.stringify(data.location)}
      -------------------------------------------
            image       = ${data.image}
      -------------------------------------------
            description = ${data.description}
      -------------------------------------------
            choice_id   = ${data.choice_id}
            `);
    } catch (error: any) {
      alert(error);
    }
    setButtonLoading(false);
  }

  return (
    <>
      <>
        {cameraUri && (
          <View style={styles.formMasterContainer}>
            <View style={styles.formContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: cameraUri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.formInputContainer}>
                <TextInput
                  multiline
                  placeholder="Description..."
                  numberOfLines={6}
                  style={styles.textareaInputBase}
                  onChangeText={setDescription}
                />
                <View style={styles.selectInputBase}>
                  <RNPickerSelect
                    onValueChange={setChoice_id}
                    items={[
                      {
                        label: "Banjir",
                        value: 1,
                      },
                      {
                        label: "Pencemaran",
                        value: 2,
                      },
                      {
                        label: "Kebakaran",
                        value: 3,
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.formButtonContainer}>
                <View style={styles.formButton}>
                  <Button
                    color={"#F5365C"}
                    title="CLOSE"
                    onPress={() => setCameraUri(null)}
                  />
                </View>
                <View style={styles.formButton}>
                  {buttonLoading ? (
                    <>
                      <Button title="SAVE" disabled={true} />
                      <ActivityIndicator
                        size={"large"}
                        style={styles.activityIndicator}
                      />
                    </>
                  ) : (
                    <Button
                      color={"#2DCE89"}
                      title="SAVE"
                      disabled={!description || !choice_id}
                      onPress={onSubmit}
                    />
                  )}
                </View>
              </View>
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
          <TouchableOpacity onPress={handleFile} style={styles.button}>
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
  formMasterContainer: {
    flex: 1,
    position: "absolute",
    zIndex: 9999,
    width: dimension.width,
    height: dimension.height,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  formContainer: {
    backgroundColor: "#F4F5F7",
    paddingBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
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
  formInputContainer: {
    padding: 20,
  },
  selectInputBase: {
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    backgroundColor: "#fff",
  },
  textareaInputBase: {
    borderRadius: 8,
    marginBottom: 10,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  inputLabel: {
    marginBottom: 5,
  },
  formButtonContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    alignSelf: "flex-end",
  },
  formButton: {
    width: 100,
    borderRadius: 6,
    overflow: "hidden",
  },
  activityIndicator: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
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
