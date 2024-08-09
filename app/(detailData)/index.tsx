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
import { Text, View } from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

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
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {/* <Text>{data && data}</Text> */}
      </View>
    </AlertNotificationRoot>
  );
}
