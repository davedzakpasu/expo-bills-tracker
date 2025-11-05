export default {
  expo: {
    name: "expo-bills-tracker",
    slug: "expo-bills-tracker",
    platforms: ["ios", "android"],
    web: {
      bundler: "metro",
      output: "single",
      ssr: false,
      favicon: "./assets/favicon.png",
    },
    ios: {
      bundleIdentifier: "com.davedzakpasu.billstracker",
      jsEngine: "hermes",
      icon: "./assets/icon.png",
    },
    android: {
      package: "com.davedzakpasu.billstracker",
      jsEngine: "hermes",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2196F3",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2196F3",
    },
    experiments: {
      typedRoutes: false, // force disable expo-router auto detection
    },
    extra: {
      eas: {
        projectId: "2250156d-8029-4879-b60f-a3c0ccbe66b2",
      },
    },
    updates: {
      url: "https://u.expo.dev/2250156d-8029-4879-b60f-a3c0ccbe66b2",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
