import { StyleProp, View, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface SpacerProps {
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Spacer = ({
  size = moderateScale(8),
  horizontal = false,
  style,
}: SpacerProps) => {
  return (
    <View style={[horizontal ? { width: size } : { height: size }, style]} />
  );
};
