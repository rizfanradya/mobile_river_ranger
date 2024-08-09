import { Image, StyleSheet, View, Button, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { backendFastApi } from "@/constants/constant";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { onSignOut, authState } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!authState?.authenticated) {
          navigation.navigate("(signin)");
        } else {
          try {
            const decoded: { id: string } = jwtDecode(authState!.token!);
            const getMasterData = await axios.get(
              `${backendFastApi}/user/  ${decoded.id}`,
              {
                headers: {
                  Authorization: `Bearer ${authState?.token}`,
                },
              }
            );
            setUserData(getMasterData.data);
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
        <View style={styles.iconProfileContainer}>
          <Image
            source={require("@/assets/images/profile.png")}
            style={styles.iconProfile}
          />
        </View>

        <Text style={styles.username}>{userData.username}</Text>

        <View>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.data}>{userData.first_name}</Text>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.data}>{userData.last_name}</Text>
        </View>

        <Button onPress={onSignOut} title="Logout" />
      </ParallaxScrollView>
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
  iconProfileContainer: {
    margin: "auto",
  },
  iconProfile: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginTop: -8,
  },
  label: {
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  data: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CAD1D7",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginTop: 8,
    padding: 10,
    color: "white",
    marginBottom: 14,
    fontSize: 16,
  },
});
