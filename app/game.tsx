import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AD_UNITS, USE_TEST_ADS } from "../constants/ads";

const { width, height } = Dimensions.get("window");
const GRID_SIZE = 20;
const CELL_SIZE = Math.floor((width - 40) / GRID_SIZE);
const GAME_WIDTH = CELL_SIZE * GRID_SIZE;
const GAME_HEIGHT = CELL_SIZE * GRID_SIZE;
const INITIAL_SPEED = 400;
const SPEED_INCREMENT = 10;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [level, setLevel] = useState(1);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const directionRef = useRef<Direction>("RIGHT");
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const rewardedRef = useRef<RewardedAd | null>(null);

  // Initialize ads
  useEffect(() => {
    // Create and load interstitial ad
    const interstitialAdUnitId = USE_TEST_ADS
      ? TestIds.INTERSTITIAL
      : AD_UNITS.INTERSTITIAL;
    const interstitialAd =
      InterstitialAd.createForAdRequest(interstitialAdUnitId);

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setInterstitialLoaded(true);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setInterstitialLoaded(false);
        interstitialAd.load();
      }
    );

    interstitialAd.load();
    interstitialRef.current = interstitialAd;

    // Create and load rewarded ad
    const rewardedAdUnitId = USE_TEST_ADS
      ? TestIds.REWARDED
      : AD_UNITS.REWARDED;
    const rewardedAd = RewardedAd.createForAdRequest(rewardedAdUnitId);

    const unsubscribeRewardedLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setRewardedLoaded(true);
      }
    );

    const unsubscribeRewarded = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        // Continue the game by removing last 3 segments and reversing direction
        setSnake((prevSnake) => {
          if (prevSnake.length <= 3) {
            // If snake is too small, just reset to center
            return [{ x: 10, y: 10 }];
          }
          // Remove last 3 segments as penalty
          return prevSnake.slice(0, -3);
        });

        // Reverse direction to move away from collision
        setDirection((prevDirection) => {
          const opposites: Record<Direction, Direction> = {
            UP: "DOWN",
            DOWN: "UP",
            LEFT: "RIGHT",
            RIGHT: "LEFT",
          };
          const newDir = opposites[prevDirection];
          directionRef.current = newDir;
          return newDir;
        });

        setGameOver(false);
        setCanContinue(false);
        setIsPaused(false);
      }
    );

    const unsubscribeRewardedClosed = rewardedAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setRewardedLoaded(false);
        rewardedAd.load();
      }
    );

    rewardedAd.load();
    rewardedRef.current = rewardedAd;

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeRewardedLoaded();
      unsubscribeRewarded();
      unsubscribeRewardedClosed();
    };
  }, []);

  // Save high score
  const saveHighScore = async (finalScore: number, finalLevel: number) => {
    try {
      const existingScores = await AsyncStorage.getItem("highScores");
      const scores = existingScores ? JSON.parse(existingScores) : [];

      const newScore = {
        score: finalScore,
        level: finalLevel,
        date: new Date().toISOString(),
      };

      scores.push(newScore);
      scores.sort((a: any, b: any) => b.score - a.score);
      const topScores = scores.slice(0, 10);

      await AsyncStorage.setItem("highScores", JSON.stringify(topScores));
    } catch (error) {
      console.error("Error saving high score:", error);
    }
  };

  // Generate random food position
  const generateFood = (currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  };

  // Check collision
  const checkCollision = (head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // Self collision
    return snakeBody.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  };

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (directionRef.current) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Check collision
        if (checkCollision(newHead, prevSnake)) {
          // Save high score
          saveHighScore(score, level);

          // Increment games played and show interstitial every 3rd game
          const newGamesPlayed = gamesPlayed + 1;
          setGamesPlayed(newGamesPlayed);

          if (
            newGamesPlayed % 3 === 0 &&
            interstitialLoaded &&
            interstitialRef.current
          ) {
            interstitialRef.current.show();
          }

          // Enable continue option if rewarded ad is available
          setCanContinue(rewardedLoaded);

          setGameOver(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          setFood(generateFood(newSnake));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

          // Level up every 50 points
          const newLevel = Math.floor(newScore / 50) + 1;
          if (newLevel > level) {
            setLevel(newLevel);
            setSpeed((prev) => Math.max(100, prev - SPEED_INCREMENT));
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, isPaused, speed, food]);

  // Update direction ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Gesture handling
  const panGesture = Gesture.Pan().onEnd((event) => {
    const { velocityX, velocityY } = event;

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      // Horizontal swipe
      if (velocityX > 0 && directionRef.current !== "LEFT") {
        setDirection("RIGHT");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (velocityX < 0 && directionRef.current !== "RIGHT") {
        setDirection("LEFT");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // Vertical swipe
      if (velocityY > 0 && directionRef.current !== "UP") {
        setDirection("DOWN");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (velocityY < 0 && directionRef.current !== "DOWN") {
        setDirection("UP");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  });

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setCanContinue(false);
  };

  const watchAdToContinue = () => {
    if (!rewardedRef.current) {
      console.log("Rewarded ad not initialized");
      return;
    }

    if (!rewardedLoaded) {
      console.log("Rewarded ad still loading, please wait...");
      // Try to load the ad again
      rewardedRef.current.load();
      return;
    }

    try {
      rewardedRef.current.show();
    } catch (error) {
      console.error("Error showing rewarded ad:", error);
      // Reload the ad for next time
      rewardedRef.current.load();
    }
  };

  const changeDirection = (newDirection: Direction) => {
    if (gameOver || isPaused) return;

    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (opposites[directionRef.current] !== newDirection) {
      setDirection(newDirection);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <StatusBar style="light" />

        <LinearGradient
          colors={["#0a0a1a", "#1a0a2e", "#0a0a1a"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreLabel}>LEVEL {level}</Text>
            <Text style={styles.scoreText}>{score}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsPaused(!isPaused)}
            style={styles.pauseButton}
          >
            <Text style={styles.pauseButtonText}>{isPaused ? "▶" : "❚❚"}</Text>
          </TouchableOpacity>
        </View>

        {/* Game Board */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.gameContainer}>
            <View
              style={[
                styles.gameBoard,
                { width: GAME_WIDTH, height: GAME_HEIGHT },
              ]}
            >
              {/* Grid background */}
              <View style={styles.grid}>
                {Array.from({ length: GRID_SIZE }).map((_, y) =>
                  Array.from({ length: GRID_SIZE }).map((_, x) => (
                    <View
                      key={`${x}-${y}`}
                      style={[
                        styles.gridCell,
                        {
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          left: x * CELL_SIZE,
                          top: y * CELL_SIZE,
                        },
                      ]}
                    />
                  ))
                )}
              </View>

              {/* Food */}
              <View
                style={[
                  styles.food,
                  {
                    width: CELL_SIZE - 4,
                    height: CELL_SIZE - 4,
                    left: food.x * CELL_SIZE + 2,
                    top: food.y * CELL_SIZE + 2,
                  },
                ]}
              />

              {/* Snake */}
              {snake.map((segment, index) => (
                <View
                  key={index}
                  style={[
                    styles.snakeSegment,
                    index === 0 && styles.snakeHead,
                    {
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2,
                      left: segment.x * CELL_SIZE + 1,
                      top: segment.y * CELL_SIZE + 1,
                    },
                  ]}
                />
              ))}

              {/* Game Over Overlay */}
              {gameOver && (
                <View style={styles.gameOverOverlay}>
                  <LinearGradient
                    colors={[
                      "rgba(10, 10, 26, 0.95)",
                      "rgba(26, 10, 46, 0.95)",
                    ]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.gameOverText}>GAME OVER</Text>
                  <Text style={styles.finalScore}>{score}</Text>

                  {canContinue && (
                    <TouchableOpacity
                      style={[
                        styles.continueButton,
                        !rewardedLoaded && { opacity: 0.5 },
                      ]}
                      onPress={watchAdToContinue}
                      disabled={!rewardedLoaded}
                    >
                      <LinearGradient
                        colors={["#00ff00", "#00ffff"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.continueButtonGradient}
                      >
                        <Text style={styles.continueButtonText}>
                          {rewardedLoaded
                            ? "📺 WATCH AD TO CONTINUE"
                            : "⏳ LOADING AD..."}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={resetGame}
                  >
                    <LinearGradient
                      colors={["#ff00ff", "#00ffff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.retryButtonGradient}
                    >
                      <Text style={styles.retryButtonText}>RETRY</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.homeButton}>HOME</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Pause Overlay */}
              {isPaused && !gameOver && (
                <View style={styles.pauseOverlay}>
                  <Text style={styles.pausedText}>PAUSED</Text>
                  <Text style={styles.pauseHint}>Tap ▶ to continue</Text>
                </View>
              )}
            </View>
          </View>
        </GestureDetector>

        {/* Instructions */}
        <Text style={styles.instruction}>Swipe or use arrows to control</Text>

        {/* Arrow Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.arrowRow}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeDirection("UP")}
              activeOpacity={0.7}
            >
              <Text style={styles.arrowText}>▲</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowRow}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeDirection("LEFT")}
              activeOpacity={0.7}
            >
              <Text style={styles.arrowText}>◀</Text>
            </TouchableOpacity>
            <View style={styles.arrowSpacer} />
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeDirection("RIGHT")}
              activeOpacity={0.7}
            >
              <Text style={styles.arrowText}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.arrowRow}>
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={() => changeDirection("DOWN")}
              activeOpacity={0.7}
            >
              <Text style={styles.arrowText}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    lineHeight: 28,
    textAlign: "center",
    marginTop: -7,
  },
  scoreDisplay: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#00ffff",
    letterSpacing: 2,
    opacity: 0.7,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  pauseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  pauseButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameBoard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.3)",
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridCell: {
    position: "absolute",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  snakeSegment: {
    position: "absolute",
    backgroundColor: "#00ffff",
    borderRadius: 3,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  snakeHead: {
    backgroundColor: "#00ffff",
    shadowColor: "#00ffff",
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  food: {
    position: "absolute",
    backgroundColor: "#ff00ff",
    borderRadius: 50,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  instruction: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    marginBottom: 10,
    letterSpacing: 1,
  },
  controlsContainer: {
    marginBottom: 55,
    paddingBottom: 20,
    alignItems: "center",
    gap: 5,
  },
  arrowRow: {
    flexDirection: "row",
    gap: 5,
  },
  arrowButton: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(0, 255, 255, 0.15)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.3)",
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  arrowText: {
    fontSize: 32,
    color: "#00ffff",
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  arrowSpacer: {
    width: 70,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 30,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ff00ff",
    letterSpacing: 4,
    textShadowColor: "#ff00ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginTop: 0,
  },
  finalScore: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  continueButton: {
    width: 280,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 5,
    shadowColor: "#00ff00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  continueButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
  },
  retryButton: {
    width: 200,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#ff00ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  retryButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 4,
  },
  homeButton: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.7,
    letterSpacing: 2,
    marginTop: 5,
    marginBottom: 0,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 26, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  pausedText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#00ffff",
    letterSpacing: 4,
    textShadowColor: "#00ffff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  pauseHint: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.5,
    letterSpacing: 1,
  },
});
