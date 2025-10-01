import { useEffect, useState } from "react";
import { Text, TextProps } from "./Themed";
import { fonts } from "../styles/font";
import { StyleSheet, TextStyle, Platform } from "react-native";
import { colors } from "../styles/color";

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />;
}

interface CustomTextProps extends TextProps {
  normal?: boolean;
  numberOfLines?: number;
}

export function HiraginoKakuText(props: CustomTextProps) {
  const { normal, style, numberOfLines, ...rest } = props;
  const textStyle = normal ? styles.normalText : styles.boldText;
  const [fontWeight, setFontWeight] = useState<"600" | "500" | "300">("600");

  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      if (!normal) {
        if (
          navigator.userAgent.search("Safari") >= 0 &&
          navigator.userAgent.search("Chrome") < 0
        ) {
          setFontWeight("500");
        } else {
          setFontWeight("600");
        }
      } else {
        setFontWeight("300");
      }
    } else {
      if (!normal) {
        setFontWeight("600");
      } else {
        setFontWeight("300");
      }
    }
  }, []);

  // Add default color style if color is not provided
  const defaultColorStyle = { color: colors.textColor };

  return (
    <Text
      {...rest}
      style={[defaultColorStyle, style, textStyle, { fontWeight }]}
      numberOfLines={numberOfLines}
    />
  );
}

const styles = StyleSheet.create({
  normalText: {
    fontFamily: fonts.FontRegular.fontFamily,
  },
  boldText: {
    fontFamily: fonts.FontBold.fontFamily,
  },
});
