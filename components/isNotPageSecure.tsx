import { ParamListBase } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";

export default function IsNotPageSecure() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 30, color: "white" }}>
        Is Authenticated
      </Text>
      <Text
        style={{
          color: "#172B4D",
          backgroundColor: "#2DCE89",
          padding: 10,
          borderRadius: 8,
          fontWeight: "600",
        }}
        onPress={() => navigation.navigate("(tabs)")}
      >
        Go to dashboard
      </Text>
    </View>
  );
}
