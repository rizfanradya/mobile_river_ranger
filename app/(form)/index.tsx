import { useAuth } from "@/context/authContext";
import {
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from "react-native-picker-select";
import * as Location from "expo-location";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { backendFastApi } from "@/constants/constant";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

export default function FormMasterData() {
  const route = useRoute();
  const { fileUri }: any = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { authState } = useAuth();
  const [buttonLoading, setButtonLoading] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!fileUri) {
          navigation.navigate("(tabs)");
        }
      })();
    }, [fileUri])
  );

  async function onSubmit() {
    if (
      fileUri &&
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

        if (fileUri) {
          const fileType = fileUri.split(".").pop();
          formData.append("file", {
            uri: fileUri,
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
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Berhasil",
          textBody: "Data behasil disimpan",
          button: "OK",
          closeOnOverlayTap: false,
          onPressButton: () => {
            handleFormClose();
          },
        });
      } catch (error: any) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Gagal",
          textBody: "Data gagal disimpan",
          button: "OK",
          closeOnOverlayTap: false,
        });
      }
      setButtonLoading(false);
    }
  }

  function handleFormClose() {
    setButtonLoading(false);
    setDescription(null);
    setSiteCondition(null);
    setWeatherCondition(null);
    setHighOrLowTide(null);
    setRunningWaterOrNot(null);
    setWaterFlowsFastOrSlow(null);
    setSmellyWaterOrNot(null);
    setColoredWater(null);
    navigation.goBack();
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.formContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: fileUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formInputContainer}>
            <View style={styles.cardInput}>
              <Text style={styles.inputLabel}>Kondisi situs</Text>
              <View
                style={{
                  ...styles.inputItem,
                  borderColor: siteCondition ? "#ccc" : "red",
                }}
              >
                <RNPickerSelect
                  onValueChange={setSiteCondition}
                  placeholder={{
                    label: "Pilih kondisi situs...",
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
              <Text style={styles.inputLabel}>Kondisi Sungai</Text>

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
                      label: "Pilih kondisi air...",
                      value: null,
                    }}
                    items={[
                      {
                        label: "Pasang",
                        value: "Pasang",
                      },
                      {
                        label: "Surut",
                        value: "Surut",
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
                      label: "Iya atau Tidak...",
                      value: null,
                    }}
                    items={[
                      {
                        label: "Iya",
                        value: "Iya",
                      },
                      {
                        label: "Tidak",
                        value: "Tidak",
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
                      label: "Pilih kondisi air...",
                      value: null,
                    }}
                    items={[
                      {
                        label: "Cepat",
                        value: "Cepat",
                      },
                      {
                        label: "Lambat",
                        value: "Lambat",
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
                      label: "Iya atau Tidak...",
                      value: null,
                    }}
                    items={[
                      {
                        label: "Iya",
                        value: "Iya",
                      },
                      {
                        label: "Tidak",
                        value: "Tidak",
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
              <Text style={styles.inputLabel}>Kondisi Cuaca</Text>
              <View
                style={{
                  ...styles.inputItem,
                  borderColor: weatherCondition ? "#ccc" : "red",
                }}
              >
                <RNPickerSelect
                  onValueChange={setWeatherCondition}
                  placeholder={{
                    label: "Pilih Kondisi Cuaca...",
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

            <KeyboardAwareScrollView>
              <View style={styles.cardInput}>
                <Text style={styles.inputLabel}>Deskripsi</Text>
                <View
                  style={{
                    ...styles.inputItem,
                    borderColor: description ? "#ccc" : "red",
                  }}
                >
                  <TextInput
                    multiline
                    placeholder="Deskripsi..."
                    numberOfLines={6}
                    style={{ textAlignVertical: "top", padding: 10 }}
                    onChangeText={setDescription}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </ScrollView>

        <View style={styles.formButton}>
          {buttonLoading ? (
            <View>
              <Button title="SAVE" disabled={true} />
              <ActivityIndicator
                size={"large"}
                style={styles.activityIndicator}
              />
            </View>
          ) : (
            <Button color={"#2DCE89"} title="SAVE" onPress={onSubmit} />
          )}
        </View>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#F4F5F7",
    flex: 1,
  },
  imageContainer: {
    height: 300,
    overflow: "hidden",
    width: Dimensions.get("window").width,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    height: "auto",
    margin: "auto",
  },
  formInputContainer: {
    padding: 20,
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
  formButton: {
    width: "auto",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
  },
  activityIndicator: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
});
