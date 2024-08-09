import IsNotPageSecure from "@/components/isNotPageSecure";
import { useAuth } from "@/context/authContext";
import { FontAwesome } from "@expo/vector-icons";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get("screen");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { onSignIn, authState } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    const result = await onSignIn!(username, password);
    if (result && result.error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Gagak",
        textBody: "Username atau password salah",
        button: "OK",
        closeOnOverlayTap: false,
      });
    } else {
      navigation.navigate("(tabs)");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authState?.authenticated) {
      navigation.navigate("(tabs)");
    }
  }, [authState]);

  return (
    <>
      {!authState?.authenticated && !authState?.token ? (
        <AlertNotificationRoot>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  source={require("../../assets/images/register-bg.png")}
                  style={{
                    width,
                    height,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ width: width * 0.9, minHeight: height * 0.4 }}>
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
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <View style={{ marginVertical: 20 }}>
                        <Text style={{ fontSize: 30, color: "#8898AA" }}>
                          Login
                        </Text>
                      </View>

                      <View
                        style={{ flex: 1, width: width * 0.8, marginTop: 20 }}
                      >
                        <View style={{ gap: 10 }}>
                          <View
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 16,
                              paddingHorizontal: 8,
                            }}
                          >
                            <FontAwesome
                              name="user"
                              size={20}
                              color="#172B4D"
                              style={{ marginLeft: 8 }}
                            />
                            <TextInput
                              placeholder="Username"
                              onChangeText={setUsername}
                              style={{ padding: 10, flex: 1 }}
                            />
                          </View>

                          <View
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: 8,
                              flexDirection: "row",
                              alignItems: "center",
                              paddingHorizontal: 8,
                            }}
                          >
                            <FontAwesome
                              name="lock"
                              size={20}
                              color="#172B4D"
                              style={{ marginLeft: 8 }}
                            />
                            <TextInput
                              placeholder="Password"
                              onChangeText={setPassword}
                              secureTextEntry={!passwordVisible}
                              style={{ padding: 10, flex: 1 }}
                            />
                            <FontAwesome
                              name={passwordVisible ? "eye" : "eye-slash"}
                              size={20}
                              color="#172B4D"
                              onPress={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                              style={{ marginRight: 8 }}
                            />
                          </View>
                        </View>

                        <View
                          style={{
                            width: "100%",
                            alignItems: "center",
                            marginTop: 30,
                          }}
                        >
                          {loading ? (
                            <View
                              style={{ position: "relative", width: "100%" }}
                            >
                              <Button title="SIGN IN" disabled={true} />
                              <ActivityIndicator
                                size={"large"}
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                }}
                              />
                            </View>
                          ) : (
                            <View
                              style={{ width: "100%", alignItems: "stretch" }}
                            >
                              <Button
                                color="#2DCE89"
                                title="LOGIN"
                                disabled={!username || !password}
                                onPress={() => handleSignIn()}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </AlertNotificationRoot>
      ) : (
        <IsNotPageSecure />
      )}
    </>
  );
}
