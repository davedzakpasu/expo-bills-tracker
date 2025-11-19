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
      icon: {
        dark: "./assets/icons/ios-dark.png",
        light: "./assets/icons/ios-light.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
    },
    android: {
      package: "com.davedzakpasu.billstracker",
      jsEngine: "hermes",
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#2196F3",
      },
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-light.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#2196F3",
          dark: {
            image: "./assets/icons/splash-icon-light.png",
            backgroundColor: "#000000",
          },
        },
      ],
    ],
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
