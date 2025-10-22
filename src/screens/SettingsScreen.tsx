import { useAppContext } from "@context/AppContext";
import { useThemeContext } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Button,
  Divider,
  List,
  RadioButton,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { createAppStyles, tokens } from "src/theme/styles";

export default function SettingsScreen({ navigation }: any) {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { mode, toggleTheme, setMode } = useThemeContext();
  const [notifications, setNotifications] = useState(true);
  const { user, setUser } = useAppContext();
  const [nickname, setNickname] = useState(user?.nickname ?? "");

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Dashboard");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: tokens.spacing.md * 1.3,
          paddingVertical: tokens.spacing.md,
          backgroundColor: theme.colors.surface,
          elevation: 4,
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: theme.colors.primary,
            marginLeft: tokens.spacing.md,
          }}
        >
          Settings
        </Text>
      </View>

      <TextInput
        label="Nickname"
        value={nickname}
        onChangeText={setNickname}
        style={{
          marginHorizontal: tokens.spacing.md * 1.3,
          marginVertical: tokens.spacing.md,
        }}
      />
      <Button
        mode="contained"
        onPress={() => setUser({ nickname })}
        style={{ marginHorizontal: tokens.spacing.md * 1.3 }}
      >
        Save
      </Button>
      <View
        style={{
          marginHorizontal: tokens.spacing.md * 1.3,
          marginVertical: tokens.spacing.md,
        }}
      >
        <Text style={{ fontWeight: "600", marginBottom: tokens.spacing.sm }}>
          Theme
        </Text>
        <RadioButton.Group
          onValueChange={(value) =>
            setMode(value as "light" | "dark" | "system")
          }
          value={mode}
        >
          <RadioButton.Item label="Light" value="light" />
          <RadioButton.Item label="Dark" value="dark" />
          <RadioButton.Item label="Auto (system)" value="system" />
        </RadioButton.Group>
      </View>
      <Divider />

      <List.Item
        title="Notifications"
        description="Receive payment reminders"
        right={() => (
          <Switch value={notifications} onValueChange={setNotifications} />
        )}
      />
      <Divider />

      <List.Item title="Currency" description="Currently set to USD" />
    </View>
  );
}
