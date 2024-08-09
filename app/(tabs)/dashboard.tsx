import {
  Image,
  StyleSheet,
  View,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { backendFastApi } from "@/constants/constant";
import { jwtDecode } from "jwt-decode";
import { FontAwesome6 } from "@expo/vector-icons";
import ButtonAddData from "@/components/buttonAddData";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { authState } = useAuth();
  const [getMasterData, setMasterData] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!authState?.authenticated) {
          navigation.navigate("(signin)");
        } else {
          try {
            const decoded: { id: string } = jwtDecode(authState!.token!);
            const getMasterData = await axios.get(
              `${backendFastApi}/master?limit=10&offset=0&user_id=${decoded.id}`,
              {
                headers: { Authorization: `Bearer ${authState?.token}` },
              }
            );
            setMasterData(getMasterData.data);
          } catch (error) {
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Error",
              textBody: "Gagal mengambil data",
              button: "OK",
              closeOnOverlayTap: false,
            });
          }
        }
      })();
    }, [authState])
  );

  const openGoogleMaps = (location: string) => {
    const [longitude, latitude] = location.split(",");
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Google Maps tidak tersedia.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <AlertNotificationRoot>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        {getMasterData.map((data, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("(detailData)", { id: data.id })}
            style={styles.cardContainer}
            key={index}
          >
            <Image
              source={require("@/assets/images/partial-react-logo.png")}
              style={styles.cardImage}
            />
            <View style={styles.cardDescription}>
              <Text
                style={{
                  color: "white",
                  opacity: 0.7,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                {data.upload_date
                  ? new Date(data.upload_date).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""}
              </Text>
              <Text
                style={styles.cardTextDescription}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {data.description}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.containerLocationIcon}
              onPress={() => openGoogleMaps(data.location)}
            >
              <FontAwesome6 name="location-dot" style={styles.locationIcon} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ParallaxScrollView>
      <ButtonAddData />
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  cardContainer: {
    backgroundColor: "#373A40",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardDescription: {
    flex: 1,
    padding: 8,
  },
  cardTextDescription: {
    color: "white",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  cardOptionChip: {
    color: "white",
    fontSize: 12,
    backgroundColor: "#FFAD60",
    borderRadius: 6,
    padding: 4,
    alignSelf: "flex-start",
  },
  containerLocationIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 16,
  },
  locationIcon: {
    fontSize: 40,
    color: "#FFAD60",
  },
});
