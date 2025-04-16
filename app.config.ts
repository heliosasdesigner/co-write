import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "co-write",
    slug: "co-write",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.co-write",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.cowrite",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    },
  };
};
