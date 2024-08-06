import { useAuth } from "@/context/authContext";
import { FontAwesome } from "@expo/vector-icons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { Block, Input, Text } from "galio-framework";
import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  View,
} from "react-native";

export default function SignIn() {
  const { width, height } = Dimensions.get("screen");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { onSignIn, authState } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const router = useRouter();

  const handleSignIn = async () => {
    const result = await onSignIn!(username, password);
    if (result && result.error) {
      alert("Invalid username or password");
    } else {
      // router.replace("/(tabs)");
      navigation.navigate("dashboard");
    }
  };

  useEffect(() => {
    if (authState?.authenticated) {
      // router.replace("/(tabs)");
      navigation.navigate("dashboard");
    }
  }, [authState]);

  // if (authState?.authenticated) {
  //   // router.replace("/(tabs)");
  // } else {
  return (
    <Block flex middle>
      <ImageBackground
        source={require("../../assets/images/register-bg.png")}
        style={{ width, height }}
      >
        <Block flex middle>
          <View
            style={{
              backgroundColor: "#F4F5F7",
              borderRadius: 14,
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 8,
              shadowOpacity: 0.1,
              paddingHorizontal: 20,
              flex: 0.4,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Block flex={0.2} middle style={{ marginVertical: 20 }}>
              <Text color="#8898AA" size={30}>
                Sign In
              </Text>
            </Block>

            <KeyboardAvoidingView
              style={{ flex: 1, width: width * 0.8 }}
              behavior="padding"
              enabled
            >
              <View style={{ flex: 0.5, gap: 14 }}>
                <Input
                  borderless
                  placeholder="Username"
                  onChangeText={setUsername}
                  iconContent={
                    <FontAwesome
                      name="user"
                      size={16}
                      color={"#172B4D"}
                      style={{ marginRight: 12 }}
                    />
                  }
                />

                <Input
                  password
                  borderless
                  onChangeText={setPassword}
                  placeholder="Password"
                  iconContent={
                    <FontAwesome
                      name="lock"
                      size={16}
                      color={"#172B4D"}
                      style={{ marginRight: 12 }}
                    />
                  }
                />
              </View>

              <View style={{ width: "50%", margin: "auto" }}>
                <Button
                  color="#2DCE89"
                  title="SIGN IN"
                  onPress={() => handleSignIn()}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </Block>
      </ImageBackground>
    </Block>
  );
}
// }
