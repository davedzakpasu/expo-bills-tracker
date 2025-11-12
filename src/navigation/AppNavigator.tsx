import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "@screens/SettingsScreen";
import { useAppContext } from "../context/AppContext";
import DashboardScreen from "../screens/DashboardScreen";
import OnboardingScreen from "../screens/OnboardingScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  AddBillModal: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user } = useAppContext();
  const isSignedIn = !!(
    user &&
    typeof user.nickname === "string" &&
    user.nickname.trim().length > 0
  );

  return (
    <Stack.Navigator
      key={isSignedIn ? "app" : "guest"}
      screenOptions={{ headerShown: false }}
    >
      {!isSignedIn ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
