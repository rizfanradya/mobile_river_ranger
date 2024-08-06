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
import { AuthProvider, useAuth } from "@/context/authContext";
import { Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./(tabs)";
import SignIn from "./(signin)";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { authState, onSignOut } = useAuth();
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
          <Stack.Navigator>
            <Stack.Screen
              name="dashboard"
              component={HomeScreen}
            ></Stack.Screen>
            <Stack.Screen
              name="signin"
              component={SignIn}
              options={{ headerShown: false }}
            ></Stack.Screen>
          </Stack.Navigator>
          {/* <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                headerRight: () => (
                  <Button onPress={onSignOut} title="Logout" />
                ),
              }}
            />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(signin)" options={{ headerShown: false }} />
          </Stack> */}
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
