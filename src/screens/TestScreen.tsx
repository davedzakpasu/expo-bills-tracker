import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokens } from "src/theme/styles";

export default function TestScreen({ navigation }: any) {
  const theme = useTheme();

  const data = [
    {
      id: "1",
      name: "Netflix Subscription",
      frequency: "Monthly",
      amount: "$15.99",
      statusLabel: "Upcoming (In 3 days)",
      dateLabel: "18/11/2025",
    },
    {
      id: "2",
      name: "Electric Bill",
      frequency: "Monthly",
      amount: "$120.50",
      statusLabel: "Overdue",
      dateLabel: "10/11/2025",
    },
    {
      id: "3",
      name: "Internet Service",
      frequency: "Monthly",
      amount: "$79.99",
      statusLabel: "Paid",
      dateLabel: "05/11/2025",
    },
    {
      id: "4",
      name: "Gym Membership",
      frequency: "Bi-Weekly",
      amount: "$35.00",
      statusLabel: "Upcoming (In 5 days)",
      dateLabel: "20/11/2025",
    },
    {
      id: "5",
      name: "Phone Bill",
      frequency: "Monthly",
      amount: "$55.00",
      statusLabel: "Upcoming (In 12 days)",
      dateLabel: "27/11/2025",
    },
  ];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Dashboard");
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      edges={["top", "left", "right"]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: tokens.spacing.md * 1.3,
          paddingVertical: tokens.spacing.md,
          backgroundColor: theme.colors.background,
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
          Test
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Test Screen
        </Text>
        {/* <TestCard
          name="Test"
          frequency="Bi-Weekly"
          amount="$35.00"
          statusLabel="Upcoming (In 5 days)"
          dateLabel="18/11/2025"
          onEdit={() => {}}
          onDelete={() => {}}
          onMarkAsPaid={() => {}}
        /> */}
        {/* <TestGrid data={data} /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  title: {
    fontSize: 24,
    // fontWeight: "bold",
  },
});
