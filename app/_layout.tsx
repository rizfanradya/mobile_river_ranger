import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router/stack";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer independent>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(signin)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(form)"
              options={{ headerShown: false }}
              initialParams={{ fileUri: null }}
            />
            <Stack.Screen
              name="(detailData)"
              options={{ headerShown: false }}
              initialParams={{ id: null }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
