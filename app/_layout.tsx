import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { View, StyleSheet, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for at least 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      // Fade out splash screen
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <View style={styles.splashContainer}>
        <LinearGradient
          colors={["#0a0a1a", "#1a0a2e", "#0a0a1a"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Image
          source={require("../assets/icon.png")}
          style={styles.splashIcon}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0a0a1a" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="highscores" />
        <Stack.Screen name="settings" />
      </Stack>
      {!appReady && (
        <Animated.View
          style={[styles.splashContainer, { opacity: fadeAnim }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={["#0a0a1a", "#1a0a2e", "#0a0a1a"]}
            style={StyleSheet.absoluteFillObject}
          />
          <Image
            source={require("../assets/icon.png")}
            style={styles.splashIcon}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a1a",
  },
  splashIcon: {
    width: 200,
    height: 200,
  },
});
