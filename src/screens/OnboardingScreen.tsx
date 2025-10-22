import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { createAppStyles, tokens } from "src/theme/styles";
import { useAppContext } from "../context/AppContext";
import { useThemeContext } from "../context/ThemeContext";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const { setUser } = useAppContext();
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { mode, toggleTheme } = useThemeContext();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const onContinue = async () => {
    if (!name.trim()) return;
    await setUser({ nickname: name.trim() });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Theme toggle */}
      <IconButton
        icon={({ size, color }) => (
          <Ionicons
            name={mode === "light" ? "sunny" : "moon"}
            size={size * 1.2}
            color={theme.colors.primary}
          />
        )}
        style={{
          position: "absolute",
          top: tokens.spacing.md * 2,
          right: tokens.spacing.md * 2,
          zIndex: 10,
        }}
        onPress={toggleTheme}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: tokens.spacing.md * 2,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            padding: tokens.spacing.md * 3,
            alignSelf: "center",
            width: "100%",
            maxWidth: 400,
            shadowColor: theme.dark ? "#000" : "#333",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: theme.dark ? 0.3 : 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {/* Generic icon above the title */}
          <View
            style={{
              alignItems: "center",
              marginBottom: tokens.spacing.md * 2,
            }}
          >
            <Ionicons
              name="apps-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              marginBottom: tokens.spacing.md * 2,
            }}
          >
            <Text style={styles.title}>Bills Tracker</Text>
            <Text style={styles.subtitle}>
              We'll ask a few things to set up your app.
            </Text>
          </View>

          <TextInput
            label="Nickname"
            placeholder="How should we call you?"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: tokens.spacing.md * 2 }}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={onContinue}
            style={{
              borderRadius: tokens.radius.md,
            }}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
