import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HighScore = {
  score: number;
  level: number;
  date: string;
};

export default function HighScoresScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    try {
      const scoresJson = await AsyncStorage.getItem("highScores");
      if (scoresJson) {
        const scores = JSON.parse(scoresJson);
        setHighScores(scores);
      }
    } catch (error) {
      console.log("Error loading high scores:", error);
    }
  };

  const clearScores = async () => {
    try {
      await AsyncStorage.removeItem("highScores");
      setHighScores([]);
    } catch (error) {
      console.log("Error clearing scores:", error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#0a0a1a", "#1a0a2e", "#0a0a1a"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Neon glow circles */}
      <View style={styles.glowCircle1} />
      <View style={styles.glowCircle2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HIGH SCORES</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Scores List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {highScores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No scores yet!</Text>
            <Text style={styles.emptySubtext}>
              Play a game to set your first record
            </Text>
          </View>
        ) : (
          highScores.map((item, index) => (
            <View key={index} style={styles.scoreCard}>
              <LinearGradient
                colors={
                  index === 0
                    ? ["rgba(255, 0, 255, 0.2)", "rgba(0, 255, 255, 0.2)"]
                    : ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
                }
                style={styles.scoreCardGradient}
              >
                <View style={styles.scoreRank}>
                  <Text
                    style={[
                      styles.rankText,
                      index === 0 && styles.rankTextFirst,
                    ]}
                  >
                    #{index + 1}
                  </Text>
                </View>
                <View style={styles.scoreInfo}>
                  <Text
                    style={[
                      styles.scoreText,
                      index === 0 && styles.scoreTextFirst,
                    ]}
                  >
                    {item.score}
                  </Text>
                  <Text style={styles.levelText}>Level {item.level}</Text>
                </View>
                <View style={styles.scoreDate}>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </LinearGradient>
            </View>
          ))
        )}
      </ScrollView>

      {/* Clear Button */}
      {highScores.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearScores}>
          <Text style={styles.clearButtonText}>Clear All Scores</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backButtonText: {
    fontSize: 28,
    color: "#fff",
    marginTop: -7,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#00ffff",
    letterSpacing: 3,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  placeholder: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    opacity: 0.5,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.3,
  },
  scoreCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.2)",
  },
  scoreCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  scoreRank: {
    width: 50,
  },
  rankText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    opacity: 0.7,
  },
  rankTextFirst: {
    color: "#ff00ff",
    opacity: 1,
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  scoreTextFirst: {
    color: "#00ffff",
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  levelText: {
    fontSize: 14,
    color: "#00ffff",
    opacity: 0.7,
  },
  scoreDate: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.5,
  },
  clearButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    color: "#ff0000",
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
