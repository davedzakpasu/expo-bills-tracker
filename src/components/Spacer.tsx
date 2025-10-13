import { StyleProp, View, ViewStyle } from "react-native";

interface SpacerProps {
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Spacer = ({
  size = 16,
  horizontal = false,
  style,
}: SpacerProps) => {
  return (
    <View style={[horizontal ? { width: size } : { height: size }, style]} />
  );
};
