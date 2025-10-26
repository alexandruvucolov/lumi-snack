import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerAdComponent from "../components/BannerAd";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);
  const insets = useSafeAreaInsets();

  // Animation values
  const glowPulse1 = useRef(new Animated.Value(1)).current;
  const glowPulse2 = useRef(new Animated.Value(1)).current;
  const titleBounce = useRef(new Animated.Value(0)).current;
  const underlineScale = useRef(new Animated.Value(1)).current;
  const playButtonPulse = useRef(new Animated.Value(1)).current;
  const scoreGlow = useRef(new Animated.Value(1)).current;

  // Load high score
  const loadHighScore = useCallback(async () => {
    try {
      const existingScores = await AsyncStorage.getItem("highScores");
      if (existingScores) {
        const scores = JSON.parse(existingScores);
        if (scores.length > 0) {
          setHighScore(scores[0].score);
        }
      }
    } catch (error) {
      console.error("Error loading high score:", error);
    }
  }, []);

  // Reload high score when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHighScore();
    }, [loadHighScore])
  );

  useEffect(() => {
    // Pulsing glow circles
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse1, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse2, {
          toValue: 1.3,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse2, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleBounce, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(titleBounce, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Underline breathing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(underlineScale, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(underlineScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Play button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(playButtonPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(playButtonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Score glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(scoreGlow, {
          toValue: 1.5,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(scoreGlow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />

      {/* Animated background */}
      <LinearGradient
        colors={["#0a0a1a", "#1a0a2e", "#0a0a1a"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Neon glow circles */}
      <Animated.View
        style={[
          styles.glowCircle1,
          {
            transform: [{ scale: glowPulse1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowCircle2,
          {
            transform: [{ scale: glowPulse2 }],
          },
        ]}
      />

      {/* Title */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [{ translateY: titleBounce }],
          },
        ]}
      >
        <Text style={styles.title}>LUMI</Text>
        <Text style={styles.subtitle}>SNACK</Text>
        <Animated.View
          style={[
            styles.titleUnderline,
            {
              transform: [{ scaleX: underlineScale }],
            },
          ]}
        />
      </Animated.View>

      {/* High Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>HIGH SCORE</Text>
        <Animated.Text
          style={[
            styles.scoreValue,
            {
              textShadowRadius: scoreGlow.interpolate({
                inputRange: [1, 1.5],
                outputRange: [10, 20],
              }),
            },
          ]}
        >
          {highScore}
        </Animated.Text>
      </View>

      {/* Play Button */}
      <Animated.View
        style={{
          transform: [{ scale: playButtonPulse }],
        }}
      >
        <Pressable
          style={styles.playButton}
          onPress={() => router.push("/game")}
        >
          <LinearGradient
            colors={["#ff00ff", "#00ffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playButtonGradient}
          >
            <Text style={styles.playButtonText}>PLAY</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>Swipe to control the snake</Text>
        <Text style={styles.instructionText}>Collect food to grow</Text>
        <Text style={styles.instructionText}>
          Don't hit the walls or yourself!
        </Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menuButtons}>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push("/highscores")}
        >
          <Text style={styles.menuButtonText}>🏆 High Scores</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.menuButtonText}>⚙️ Settings</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Classic Snake Reimagined</Text>

      {/* Banner Ad at bottom */}
      <View style={styles.bannerAdContainer}>
        <BannerAdComponent />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowCircle1: {
    position: "absolute",
    top: 100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ff00ff",
    opacity: 0.15,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  glowCircle2: {
    position: "absolute",
    bottom: 150,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#00ffff",
    opacity: 0.1,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 8,
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#00ffff",
    letterSpacing: 12,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginTop: -10,
  },
  titleUnderline: {
    width: 200,
    height: 3,
    backgroundColor: "#fff",
    marginTop: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#00ffff",
    letterSpacing: 3,
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  playButton: {
    width: width * 0.6,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 50,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  playButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 6,
  },
  instructions: {
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    letterSpacing: 1,
  },
  menuButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  menuButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.3)",
  },
  menuButtonText: {
    fontSize: 14,
    color: "#00ffff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 100,
    fontSize: 12,
    color: "#fff",
    opacity: 0.3,
    letterSpacing: 2,
  },
  bannerAdContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#0a0a1a",
    paddingBottom: 20,
  },
});
