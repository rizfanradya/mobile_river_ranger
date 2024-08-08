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
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import IsPageSecure from "@/components/isPageSecure";
import FormMasterData from "@/components/formMasterData";
import axios from "axios";
import { backendFastApi } from "@/constants/constant";
import { jwtDecode } from "jwt-decode";
import { FontAwesome6 } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [reloadGetData, setReloadGetData] = useState<boolean>(false);
  const { authState } = useAuth();
  const [getMasterData, setMasterData] = useState<any[]>([]);

  useEffect(() => {
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
          console.error(error);
          Alert.alert("Failed", "Failed to get data, please try again later.");
        }
      }
    })();
  }, [authState, reloadGetData]);

  const openGoogleMaps = (location: string) => {
    const [longitude, latitude] = location.split(",");
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Google Maps is not supported on this device.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <>
      {authState?.authenticated && authState.token ? (
        <>
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
              <View style={styles.cardContainer} key={index}>
                <Image
                  source={require("@/assets/images/partial-react-logo.png")}
                  style={styles.cardImage}
                />
                <View style={styles.cardDescription}>
                  <Text
                    style={styles.cardTextDescription}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {data.description}
                  </Text>
                  <Text style={styles.cardOptionChip}>
                    {data.upload_date_format}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.containerLocationIcon}
                  onPress={() => openGoogleMaps(data.location)}
                >
                  <FontAwesome6
                    name="location-dot"
                    style={styles.locationIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ParallaxScrollView>
          <FormMasterData
            reloadGetData={reloadGetData}
            setReloadGetData={setReloadGetData}
          />
        </>
      ) : (
        <IsPageSecure />
      )}
    </>
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
    justifyContent: "space-between",
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
