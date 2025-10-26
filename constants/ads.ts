// Ad Unit IDs from .env
export const AD_UNITS = {
  APP_ID: "ca-app-pub-5565395942692666~2808601554",
  BANNER: "ca-app-pub-5565395942692666/3850220488",
  INTERSTITIAL: "ca-app-pub-5565395942692666/2577679028",
  REWARDED: "ca-app-pub-5565395942692666/8951515688",
};

// Test IDs for development (use these in Expo Go)
export const TEST_AD_UNITS = {
  BANNER: "ca-app-pub-3940256099942544/6300978111",
  INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
  REWARDED: "ca-app-pub-3940256099942544/5224354917",
};

// Use test IDs in development
export const USE_TEST_ADS = __DEV__;
