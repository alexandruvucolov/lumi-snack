import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openLink = (url: string) => {
    Linking.openURL(url);
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
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Game</Text>

          <View style={styles.card}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.05)",
                "rgba(255, 255, 255, 0.02)",
              ]}
              style={styles.cardGradient}
            >
              <Text style={styles.cardTitle}>Lumi Snack</Text>
              <Text style={styles.cardText}>Version 1.0.0</Text>
              <Text style={styles.cardDescription}>
                A modern reimagining of the classic Nokia Snake II game with
                beautiful neon aesthetics and smooth gameplay.
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* How to Play */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Play</Text>

          <View style={styles.card}>
            <LinearGradient
              colors={["rgba(0, 255, 255, 0.1)", "rgba(0, 255, 255, 0.05)"]}
              style={styles.cardGradient}
            >
              <Text style={styles.instructionTitle}>🎮 Controls</Text>
              <Text style={styles.instructionText}>
                • Swipe in any direction to move
              </Text>
              <Text style={styles.instructionText}>
                • Use on-screen arrow buttons
              </Text>

              <Text style={[styles.instructionTitle, { marginTop: 15 }]}>
                🎯 Objective
              </Text>
              <Text style={styles.instructionText}>
                • Collect pink food to grow
              </Text>
              <Text style={styles.instructionText}>
                • Earn 10 points per food
              </Text>
              <Text style={styles.instructionText}>
                • Level up every 50 points
              </Text>

              <Text style={[styles.instructionTitle, { marginTop: 15 }]}>
                ⚠️ Avoid
              </Text>
              <Text style={styles.instructionText}>• Hitting the walls</Text>
              <Text style={styles.instructionText}>
                • Colliding with yourself
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Features</Text>

          <View style={styles.card}>
            <LinearGradient
              colors={["rgba(255, 0, 255, 0.1)", "rgba(255, 0, 255, 0.05)"]}
              style={styles.cardGradient}
            >
              <Text style={styles.featureText}>✨ Modern neon design</Text>
              <Text style={styles.featureText}>
                🎨 Beautiful gradients & glows
              </Text>
              <Text style={styles.featureText}>📱 Touch & swipe controls</Text>
              <Text style={styles.featureText}>📊 Level-based difficulty</Text>
              <Text style={styles.featureText}>
                🎯 Progressive speed increase
              </Text>
              <Text style={styles.featureText}>📳 Haptic feedback</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity
            style={styles.legalButton}
            onPress={() =>
              openLink(
                "https://alexandruvucolov.github.io/lumi-snack/privacy-policy.html"
              )
            }
          >
            <LinearGradient
              colors={["rgba(0, 255, 255, 0.15)", "rgba(0, 255, 255, 0.05)"]}
              style={styles.legalButtonGradient}
            >
              <Text style={styles.legalButtonText}>📜 Privacy Policy</Text>
              <Text style={styles.legalButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalButton}
            onPress={() =>
              openLink(
                "https://alexandruvucolov.github.io/lumi-snack/terms-and-conditions.html"
              )
            }
          >
            <LinearGradient
              colors={["rgba(255, 0, 255, 0.15)", "rgba(255, 0, 255, 0.05)"]}
              style={styles.legalButtonGradient}
            >
              <Text style={styles.legalButtonText}>📋 Terms & Conditions</Text>
              <Text style={styles.legalButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credits</Text>

          <View style={styles.card}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.05)",
                "rgba(255, 255, 255, 0.02)",
              ]}
              style={styles.cardGradient}
            >
              <Text style={styles.creditText}>Inspired by Nokia Snake II</Text>
              <Text style={styles.creditText}>
                Built with Expo & React Native
              </Text>
              <Text style={styles.creditText}>
                © 2025 Atech Engineering Solutions SRL
              </Text>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    letterSpacing: 2,
    opacity: 0.7,
  },
  card: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardGradient: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#00ffff",
    marginBottom: 5,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    lineHeight: 22,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 5,
    lineHeight: 20,
  },
  featureText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 10,
    lineHeight: 20,
  },
  legalButton: {
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 12,
  },
  legalButtonGradient: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legalButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  legalButtonArrow: {
    fontSize: 20,
    color: "#00ffff",
    fontWeight: "bold",
  },
  creditText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    marginBottom: 8,
    textAlign: "center",
  },
});
