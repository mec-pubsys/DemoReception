import React from "react";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import { HiraginoKakuText } from "../../components/StyledText";
import { colors } from "../../styles/color";
import { useNavigation } from "@react-navigation/native";

interface TagLinkProps {
  url?: string;
  text?: string;
  pressableStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  normal?: boolean;
  numberOfLines?: number;
  onPressLink?: () => void;
}

export const TagLink: React.FC<TagLinkProps> = ({
  url,
  text,
  pressableStyle,
  textStyle,
  normal,
  numberOfLines,
  onPressLink,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(url as never);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={pressableStyle}
      onPressIn={onPressLink}
    >
      <HiraginoKakuText
        style={[
          { color: colors.primary, textDecorationLine: "underline" },
          textStyle,
        ]}
        normal={normal}
        numberOfLines={numberOfLines}
      >
        {text}
      </HiraginoKakuText>
    </Pressable>
  );
};
