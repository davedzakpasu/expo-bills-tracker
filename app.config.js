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
    },
    android: {
      package: "com.davedzakpasu.billstracker",
    },
    experiments: {
      typedRoutes: false, // force disable expo-router auto detection
    },
    extra: {
      eas: {
        projectId: "2250156d-8029-4879-b60f-a3c0ccbe66b2",
      },
    },
  },
};
