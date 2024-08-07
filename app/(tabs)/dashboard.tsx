import {
  Image,
  StyleSheet,
  Platform,
  View,
  Button,
  TouchableOpacity,
  Animated,
} from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import IsPageSecure from "@/components/isPageSecure";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { authState, onSignOut } = useAuth();
  const [buttonAddData, setButtonAddData] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cameraAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    const timeout = setTimeout(() => {
      if (buttonAddData) {
        setButtonAddData(false);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [buttonAddData]);

  const cameraTranslateY = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -75],
  });

  const cameraTranslateX = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -10],
  });

  const formTranslateX = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -75],
  });

  useEffect(() => {
    if (!authState?.authenticated) {
      navigation.navigate("(signin)");
    }
  }, [authState]);

  return (
    <>
      {authState?.authenticated && authState.token ? (
        <>
          <View style={{ flex: 1 }}>
            <ParallaxScrollView
              headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
              headerImage={
                <Image
                  source={require("@/assets/images/partial-react-logo.png")}
                  style={styles.reactLogo}
                />
              }
            >
              <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
              </ThemedView>
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 1: Try it</ThemedText>
                <ThemedText>
                  Edit{" "}
                  <ThemedText type="defaultSemiBold">
                    app/(tabs)/index.tsx
                  </ThemedText>{" "}
                  to see changes. Press{" "}
                  <ThemedText type="defaultSemiBold">
                    {Platform.select({ ios: "cmd + d", android: "cmd + m" })}
                  </ThemedText>{" "}
                  to open developer tools.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 2: Explore</ThemedText>
                <ThemedText>
                  Tap the Explore tab to learn more about what's included in
                  this starter app.
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">
                  Step 3: Get a fresh start
                </ThemedText>
                <ThemedText>
                  When you're ready, run{" "}
                  <ThemedText type="defaultSemiBold">
                    npm run reset-project
                  </ThemedText>{" "}
                  to get a fresh{" "}
                  <ThemedText type="defaultSemiBold">app</ThemedText> directory.
                  This will move the current{" "}
                  <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
                  <ThemedText type="defaultSemiBold">app-example</ThemedText>.{" "}
                  <ThemedText type="defaultSemiBold">
                    {authState?.token}
                  </ThemedText>
                  .
                  <ThemedText type="defaultSemiBold">
                    {authState?.authenticated?.toString()}
                  </ThemedText>
                  .
                </ThemedText>
              </ThemedView>

              <View>
                <Button onPress={onSignOut} title="Logout" />
              </View>
            </ParallaxScrollView>

            <>
              <TouchableOpacity
                onPress={() => setButtonAddData(!buttonAddData)}
                style={{
                  position: "absolute",
                  bottom: 50,
                  right: 30,
                  width: 70,
                  height: 70,
                  zIndex: 999,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#2DCE89",
                    borderRadius: 99999,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name={buttonAddData ? "ban" : "plus"}
                    style={{
                      color: "rgb(1, 1, 1)",
                      fontSize: 30,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <Animated.View
                style={{
                  position: "absolute",
                  bottom: 55,
                  right: 35,
                  transform: [
                    { translateY: cameraTranslateY },
                    { translateX: cameraTranslateX },
                  ],
                  opacity: cameraAnim,
                }}
              >
                <TouchableOpacity
                  onPress={() => alert("Kamera")}
                  style={{
                    width: 50,
                    height: 50,
                    display: buttonAddData ? "flex" : "none",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#11CDEF",
                      borderRadius: 99999,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="camera"
                      style={{
                        color: "rgb(1, 1, 1)",
                        fontSize: 20,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  position: "absolute",
                  bottom: 55,
                  right: 35,
                  transform: [
                    { translateY: formTranslateY },
                    { translateX: formTranslateX },
                  ],
                  opacity: formAnim,
                }}
              >
                <TouchableOpacity
                  onPress={() => alert("Form")}
                  style={{
                    width: 50,
                    height: 50,
                    display: buttonAddData ? "flex" : "none",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#11CDEF",
                      borderRadius: 99999,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome
                      name="image"
                      style={{
                        color: "rgb(1, 1, 1)",
                        fontSize: 20,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          </View>
        </>
      ) : (
        <IsPageSecure />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
