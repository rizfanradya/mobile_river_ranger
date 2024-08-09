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
  const [data, setData] = useState();

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
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tanggal</Text>
              <View style={styles.cardContent}>
                <Text>08 Agustus 2024 pukul 12.18.47</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kondisi situs</Text>
              <View style={styles.cardContent}>
                <Text>Kotor (Tumpukan Sampah)</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={{ ...styles.cardTitle, marginBottom: 12 }}>
                Kondisi sungai
              </Text>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Pasang atau Surut</Text>
                <View style={styles.cardContent}>
                  <Text>Pasang</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Mengalir atau Tidak</Text>
                <View style={styles.cardContent}>
                  <Text>Iya</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>
                  Air Mengalir Cepat atau Lambat
                </Text>
                <View style={styles.cardContent}>
                  <Text>Lambat</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Bau atau Tidak</Text>
                <View style={styles.cardContent}>
                  <Text>Tidak</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.subCardTitle}>Air Berwarna</Text>
                <View style={styles.cardContent}>
                  <Text>Putih Susu</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Kondisi cuaca</Text>
              <View style={styles.cardContent}>
                <Text>Berawan</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Deskripsi</Text>
              <View style={styles.cardContent}>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                  in ipsum eu nunc mattis aliquet vitae pretium arcu. Nulla
                  commodo justo id venenatis eleifend. Vestibulum mauris elit,
                  ullamcorper quis massa a, molestie vestibulum ex. Aliquam ac
                  dui finibus, volutpat leo et, eleifend nisl. Nam vitae ligula
                  condimentum quam lobortis iaculis id faucibus enim. Ut vitae
                  nunc luctus, varius elit id, feugiat turpis. Proin tincidunt
                  erat felis, a cursus tortor consequat non.
                </Text>
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
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: -4.777625,
                    longitude: 105.268715,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{ longitude: 105.268715, latitude: -4.777625 }}
                  />
                </MapView>
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
