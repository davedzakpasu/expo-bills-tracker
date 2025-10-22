import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { tokens } from "../theme/styles";

interface DashboardFooterProps {
  totalBills?: number;
  lastUpdated?: Date;
}

export default function DashboardFooter({
  totalBills = 0,
  lastUpdated,
}: DashboardFooterProps) {
  const theme = useTheme();

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return lastUpdated.toLocaleDateString();
  };

  return (
    <View
      style={{
        paddingVertical: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.md,
        // backgroundColor: theme.colors.surfaceVariant,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outline,
        opacity: 0.8,
      }}
    >
      {/* Stats Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: tokens.spacing.sm,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name="receipt-outline"
            size={16}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
            }}
          >
            {totalBills} {totalBills <= 1 ? "Bill" : "Bills"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name="time-outline"
            size={16}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Updated {formatLastUpdated()}
          </Text>
        </View>
      </View>

      {/* App Info */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 11,
            color: theme.colors.onSurfaceVariant,
            opacity: 0.7,
          }}
        >
          Bills Tracker v1.0.0
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: theme.colors.onSurfaceVariant,
            opacity: 0.6,
            marginTop: 2,
          }}
        >
          Keep your finances organized
        </Text>
      </View>
    </View>
  );
}
