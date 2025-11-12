import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import "react-native-get-random-values";
import "react-native-reanimated";
import { AppProvider, useAppContext } from "./src/context/AppContext";
import { ThemeProvider, useThemeContext } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const AppContent = () => {
  const { mode } = useThemeContext();
  if (!__DEV__) {
    console.log = () => {};
    console.warn = () => {};
  }

  return (
    <>
      <StatusBar
        barStyle={mode === "light" ? "dark-content" : "light-content"}
        backgroundColor={mode === "light" ? "#FFFFFF" : "#121212"} // optional for Android
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { ready } = useAppContext();

  useEffect(() => {
    if (ready) setAppIsReady(true);
  }, [ready]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // 1) Load fonts/assets or anything async you need before showing UI
  //       // await Font.loadAsync({
  //       //   ...Ionicons.font,
  //       // });
  //       // 2) AppProvider needs an init (restore user from AsyncStorage),
  //       // await someInitFunction();
  //     } catch (e) {
  //       console.error("Startup error:", e);
  //     } finally {
  //       setAppIsReady(true);
  //     }
  //   })();
  // }, []);

  // Hide splash once the root view has laid out AND appIsReady is true
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </View>
  );
}
