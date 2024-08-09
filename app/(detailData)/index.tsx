import { backendFastApi } from "@/constants/constant";
import { useAuth } from "@/context/authContext";
import {
  ParamListBase,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
import MapView, { Marker } from "react-native-maps";

export default function DetailData() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute();
  const { id }: any = route.params;
  const { authState } = useAuth();
  const [longitude, setLongitude] = useState<any>(null);
  const [latitude, setLatitude] = useState<any>(null);
  const [data, setData] = useState({
    location: "",
    rivera_condition: "",
    riverc_condition: "",
    rivere_condition: "",
    upload_date: "",
    description: "",
    site_condition: "",
    riverb_condition: "",
    riverd_condition: "",
    weather_condition: "",
    origin_filepath: "",
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!authState?.authenticated) {
          navigation.navigate("(signin)");
        } else if (!id) {
          navigation.navigate("(tabs)");
        } else {
          try {
            const getMasterData = await axios.get(
              `${backendFastApi}/master/${id}`,
              {
                headers: { Authorization: `Bearer ${authState?.token}` },
              }
            );
            const [longitudeSpl, latitudeSpl] =
              getMasterData.data.location.split(",");
            setLongitude(parseFloat(longitudeSpl));
            setLatitude(parseFloat(latitudeSpl));
            setData(getMasterData.data);
          } catch (error) {
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Error",
              textBody: "Gagal mengambil data",
              button: "OK",
              closeOnOverlayTap: false,
              onPressButton: () => {
                navigation.navigate("(tabs)");
              },
            });
          }
        }
      })();
    }, [authState])
  );

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {data.origin_filepath ? (
            <Image
              source={{ uri: `http://${data.origin_filepath}` }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("@/assets/images/partial-react-logo.png")}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tanggal</Text>
              <View style={styles.cardContent}>
                <Text>
                  {data.upload_date &&
                    new Date(data.upload_date).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kondisi situs</Text>
              <View style={styles.cardContent}>
                <Text>{data.site_condition && data.site_condition}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={{ ...styles.cardTitle, marginBottom: 12 }}>
                Kondisi sungai
              </Text>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Pasang atau Surut</Text>
                <View style={styles.cardContent}>
                  <Text>{data.rivera_condition && data.rivera_condition}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Mengalir atau Tidak</Text>
                <View style={styles.cardContent}>
                  <Text>{data.riverb_condition && data.riverb_condition}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>
                  Air Mengalir Cepat atau Lambat
                </Text>
                <View style={styles.cardContent}>
                  <Text>{data.riverc_condition && data.riverc_condition}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Bau atau Tidak</Text>
                <View style={styles.cardContent}>
                  <Text>{data.riverd_condition && data.riverd_condition}</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Berwarna</Text>
                <View style={styles.cardContent}>
                  <Text>{data.rivere_condition && data.rivere_condition}</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kondisi cuaca</Text>
              <View style={styles.cardContent}>
                <Text>{data.weather_condition && data.weather_condition}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Deskripsi</Text>
              <View style={styles.cardContent}>
                <Text>{data.description && data.description}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lokasi</Text>
              <View
                style={{
                  ...styles.cardContent,
                  padding: 0,
                  overflow: "hidden",
                  borderColor: "transparent",
                }}
              >
                {longitude && latitude && (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude,
                      longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={{ longitude, latitude }} />
                  </MapView>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    height: 300,
    overflow: "hidden",
    width: Dimensions.get("window").width,
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    height: "auto",
    margin: "auto",
  },
  cardContainer: {
    padding: 20,
  },
  card: {
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
  cardTitle: {
    marginBottom: 5,
    fontSize: 17,
    fontWeight: "bold",
  },
  subCardTitle: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 15,
    color: "gray",
  },
  cardContent: {
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
    padding: 12,
  },
  map: {
    width: "100%",
    aspectRatio: 1,
    height: "auto",
  },
});
