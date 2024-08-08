import { FontAwesome6 } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { backendFastApi } from "@/constants/constant";
import { useAuth } from "@/context/authContext";
import { jwtDecode } from "jwt-decode";
const dimension = Dimensions.get("screen");

export default function FormMasterData({
  reloadGetData,
  setReloadGetData,
}: {
  reloadGetData: boolean;
  setReloadGetData: Dispatch<SetStateAction<boolean>>;
}) {
  const { authState } = useAuth();
  const [buttonAddData, setButtonAddData] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const [cameraUri, setCameraUri] = useState<any>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [siteCondition, setSiteCondition] = useState<string | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [highOrLowTide, setHighOrLowTide] = useState<string | null>(null);
  const [runningWaterOrNot, setRunningWaterOrNot] = useState<string | null>(
    null
  );
  const [waterFlowsFastOrSlow, setWaterFlowsFastOrSlow] = useState<
    string | null
  >(null);
  const [smellyWaterOrNot, setSmellyWaterOrNot] = useState<string | null>(null);
  const [coloredWater, setColoredWater] = useState<string | null>(null);

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
    if (buttonAddData) {
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
      });
      if (!resultImage.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          resultImage.assets[0].uri,
          [{ resize: { width: 400, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCameraUri(resizedImage.uri);
      }
    }
  };

  const handleFile = async () => {
    if (buttonAddData) {
      setButtonLoading(false);
      const resultImage: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!resultImage.canceled) {
        const resizedImage = await ImageManipulator.manipulateAsync(
          resultImage.assets[0].uri,
          [{ resize: { width: 400, height: 600 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCameraUri(resizedImage.uri);
      }
    }
  };

  async function onSubmit() {
    if (
      cameraUri &&
      siteCondition &&
      weatherCondition &&
      highOrLowTide &&
      runningWaterOrNot &&
      waterFlowsFastOrSlow &&
      smellyWaterOrNot &&
      coloredWater &&
      description
    ) {
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
        const decoded: { id: string } = jwtDecode(authState!.token!);
        const getLocation = await Location.getCurrentPositionAsync({});
        const formData: any = new FormData();

        formData.append("user_id", decoded.id);
        formData.append("site_condition", siteCondition);
        formData.append("weather_condition", weatherCondition);
        formData.append("high_or_low_tide", highOrLowTide);
        formData.append("running_water_or_not", runningWaterOrNot);
        formData.append("water_flows_fast_or_slow", waterFlowsFastOrSlow);
        formData.append("smelly_water_or_not", smellyWaterOrNot);
        formData.append("colored_water", coloredWater);
        formData.append("description", description);
        formData.append("longitude", getLocation.coords.longitude.toString());
        formData.append("latitude", getLocation.coords.latitude.toString());

        if (cameraUri) {
          const fileType = cameraUri.split(".").pop();
          formData.append("file", {
            uri: cameraUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
        }

        await axios.post(`${backendFastApi}/master`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authState?.token}`,
          },
        });
        handleFormClose();
        Alert.alert("Success", "Data has been saved successfully.");
        setReloadGetData(!reloadGetData);
      } catch (error: any) {
        Alert.alert("Failed", "Failed to save data, please try again later.");
      }
      setButtonLoading(false);
    }
  }

  function handleFormClose() {
    setCameraUri(null);
    setDescription(null);
    setSiteCondition(null);
    setWeatherCondition(null);
    setHighOrLowTide(null);
    setRunningWaterOrNot(null);
    setWaterFlowsFastOrSlow(null);
    setSmellyWaterOrNot(null);
    setColoredWater(null);
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

              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.formInputContainer}>
                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>Site Condition</Text>
                    <View
                      style={{
                        ...styles.inputItem,
                        borderColor: siteCondition ? "#ccc" : "red",
                      }}
                    >
                      <RNPickerSelect
                        onValueChange={setSiteCondition}
                        placeholder={{
                          label: "Select Site Condition...",
                          value: null,
                        }}
                        items={[
                          {
                            label: "Kotor (Tumpukan Sampah)",
                            value: "Kotor (Tumpukan Sampah)",
                          },
                          {
                            label: "Bersih",
                            value: "Bersih",
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>River Condition</Text>

                    <View style={{ ...styles.cardInput, marginTop: 8 }}>
                      <Text
                        style={{
                          ...styles.inputLabel,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        Air Pasang atau Surut
                      </Text>
                      <View
                        style={{
                          ...styles.inputItem,
                          borderColor: highOrLowTide ? "#ccc" : "red",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={setHighOrLowTide}
                          placeholder={{
                            label: "Yes or No...",
                            value: null,
                          }}
                          items={[
                            {
                              label: "Yes",
                              value: "Yes",
                            },
                            {
                              label: "No",
                              value: "No",
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.cardInput, marginTop: 8 }}>
                      <Text
                        style={{
                          ...styles.inputLabel,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        Air Mengalir atau Tidak
                      </Text>
                      <View
                        style={{
                          ...styles.inputItem,
                          borderColor: runningWaterOrNot ? "#ccc" : "red",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={setRunningWaterOrNot}
                          placeholder={{
                            label: "Yes or No...",
                            value: null,
                          }}
                          items={[
                            {
                              label: "Yes",
                              value: "Yes",
                            },
                            {
                              label: "No",
                              value: "No",
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.cardInput, marginTop: 8 }}>
                      <Text
                        style={{
                          ...styles.inputLabel,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        Air Mengalir Cepat atau Lambat
                      </Text>
                      <View
                        style={{
                          ...styles.inputItem,
                          borderColor: waterFlowsFastOrSlow ? "#ccc" : "red",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={setWaterFlowsFastOrSlow}
                          placeholder={{
                            label: "Yes or No...",
                            value: null,
                          }}
                          items={[
                            {
                              label: "Yes",
                              value: "Yes",
                            },
                            {
                              label: "No",
                              value: "No",
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.cardInput, marginTop: 8 }}>
                      <Text
                        style={{
                          ...styles.inputLabel,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        Air Bau atau Tidak
                      </Text>
                      <View
                        style={{
                          ...styles.inputItem,
                          borderColor: smellyWaterOrNot ? "#ccc" : "red",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={setSmellyWaterOrNot}
                          placeholder={{
                            label: "Yes or No...",
                            value: null,
                          }}
                          items={[
                            {
                              label: "Yes",
                              value: "Yes",
                            },
                            {
                              label: "No",
                              value: "No",
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={{ ...styles.cardInput, marginTop: 8 }}>
                      <Text
                        style={{
                          ...styles.inputLabel,
                          fontSize: 15,
                          color: "gray",
                        }}
                      >
                        Air Berwarna
                      </Text>
                      <View
                        style={{
                          ...styles.inputItem,
                          borderColor: coloredWater ? "#ccc" : "red",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={setColoredWater}
                          placeholder={{
                            label: "Pilih warna air...",
                            value: null,
                          }}
                          items={[
                            {
                              label: "Hitam",
                              value: "Hitam",
                            },
                            {
                              label: "Putih Susu",
                              value: "Putih Susu",
                            },
                            {
                              label: "Hijau",
                              value: "Hijau",
                            },
                            {
                              label: "Jernih",
                              value: "Jernih",
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>Weather Condition</Text>
                    <View
                      style={{
                        ...styles.inputItem,
                        borderColor: weatherCondition ? "#ccc" : "red",
                      }}
                    >
                      <RNPickerSelect
                        onValueChange={setWeatherCondition}
                        placeholder={{
                          label: "Select Weather Condition...",
                          value: null,
                        }}
                        items={[
                          {
                            label: "Hujan",
                            value: "Hujan",
                          },
                          {
                            label: "Berawan",
                            value: "Berawan",
                          },
                          {
                            label: "Cerah",
                            value: "Cerah",
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cardInput}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <View
                      style={{
                        ...styles.inputItem,
                        borderColor: description ? "#ccc" : "red",
                      }}
                    >
                      <TextInput
                        multiline
                        placeholder="Description..."
                        numberOfLines={6}
                        style={{ textAlignVertical: "top", padding: 10 }}
                        onChangeText={setDescription}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.formButtonContainer}>
                <View style={styles.formButton}>
                  <Button
                    color={"#F5365C"}
                    title="CLOSE"
                    onPress={() => handleFormClose()}
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
                    <Button color={"#2DCE89"} title="SAVE" onPress={onSubmit} />
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
    height: dimension.height - 350,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: 170,
    left: 0,
    right: 0,
    bottom: 0,
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
  cardInput: {
    borderRadius: 8,
    marginBottom: 10,
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
    fontSize: 17,
    fontWeight: "bold",
  },
  inputItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginTop: 8,
  },
  formButtonContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 10,
    alignSelf: "flex-end",
    paddingTop: 12,
    marginBottom: -8,
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
