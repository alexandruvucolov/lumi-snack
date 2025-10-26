# Lumi Snack 🐍✨

A modern neon-themed Snake game built with Expo Router and React Native.

## Features

- 🎮 Classic Snake gameplay reimagined
- 🌈 Beautiful neon design with glowing effects
- 📱 Swipe controls for smooth gameplay
- 🎯 Score tracking and increasing difficulty
- 🔊 Haptic feedback for immersive experience
- ⏸️ Pause/Resume functionality
- 🎨 Gradient backgrounds and animations

## Tech Stack

- **Expo SDK 54**
- **Expo Router** for navigation
- **React Native**
- **TypeScript**
- **expo-linear-gradient** for neon effects
- **expo-haptics** for tactile feedback
- **react-native-gesture-handler** for swipe controls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## How to Play

1. Tap **PLAY** to start the game
2. Swipe in any direction to control the snake
3. Collect the pink food to grow and score points
4. Avoid hitting the walls or yourself
5. The game gets faster as you score more points!

## Controls

- **Swipe Up/Down/Left/Right**: Change snake direction
- **Pause button**: Pause/Resume the game
- **Back button**: Return to home screen
- **Retry**: Start a new game after game over

## Project Structure

```
lumi-snack/
├── app/
│   ├── _layout.tsx      # Root layout with navigation
│   ├── index.tsx        # Home screen
│   └── game.tsx         # Game screen with Snake logic
├── assets/
│   ├── icon.png         # App icon
│   └── adaptive-icon.png # Adaptive icon for Android
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## Game Mechanics

- Grid: 20x20 cells
- Initial speed: 150ms per move
- Speed increases by 5ms for each food collected
- Score: +10 points per food
- Collision detection for walls and self

## Design

The game features a modern neon aesthetic with:
- Dark purple/blue gradient backgrounds
- Cyan (#00ffff) snake with glow effects
- Magenta (#ff00ff) food with glow effects
- Smooth animations and transitions
- Minimalist UI with floating controls

## License

MIT

## Credits

Inspired by the classic Nokia Snake II game, reimagined for modern mobile devices.
