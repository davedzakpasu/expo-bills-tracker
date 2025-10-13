import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import "react-native-reanimated";
import { AppProvider } from "./src/context/AppContext";
import { ThemeProvider, useThemeContext } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

const AppContent = () => {
  const { mode } = useThemeContext();

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
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}
