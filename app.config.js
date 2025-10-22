export default {
  expo: {
    name: "expo-bills-tracker",
    slug: "expo-bills-tracker",
    platforms: ["ios", "android", "web"],
    web: {
      bundler: "metro",
      output: "static",
      ssr: false, // ✅ force disable SSR (no expo-router)
      favicon: "./assets/favicon.png",
    },
    experiments: {
      typedRoutes: false, // 👈 force disable expo-router auto detection
    },
  },
};
