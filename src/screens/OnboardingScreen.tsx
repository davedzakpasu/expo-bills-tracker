import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { createAppStyles, metrics } from "src/theme/styles";
import { useAppContext } from "../context/AppContext";
import { useThemeContext } from "../context/ThemeContext";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const { setUser } = useAppContext();
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { mode, toggleTheme } = useThemeContext();

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
      <TouchableOpacity
        onPress={toggleTheme}
        style={{
          position: "absolute",
          top: metrics.spacing * 2,
          right: metrics.spacing * 2,
          zIndex: 10,
        }}
      >
        <Ionicons
          name={mode === "light" ? "sunny" : "moon"}
          size={28}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: metrics.spacing * 2,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderRadius: 16,
            padding: metrics.spacing * 3,
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
            style={{ alignItems: "center", marginBottom: metrics.spacing * 2 }}
          >
            <Ionicons
              name="apps-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>

          <View
            style={{ alignItems: "center", marginBottom: metrics.spacing * 2 }}
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
            style={{ marginBottom: metrics.spacing * 2 }}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={onContinue}
            style={{
              borderRadius: metrics.radius,
            }}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
