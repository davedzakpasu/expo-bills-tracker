import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { palette } from "../theme/styles";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const toggleTheme = () => {
    if (mode === "light") setMode("dark");
    else if (mode === "dark") setMode("light");
    else setMode(systemScheme === "dark" ? "light" : "dark"); // manual from system
  };

  const theme = useMemo(() => {
    const effectiveMode =
      mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

    return effectiveMode === "light"
      ? {
          ...MD3LightTheme,
          colors: { ...MD3LightTheme.colors, ...palette.light },
        }
      : {
          ...MD3DarkTheme,
          colors: { ...MD3DarkTheme.colors, ...palette.dark },
        };
  }, [mode, systemScheme]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
