import { StyleSheet } from "react-native";
import { colors } from "./color";
import { fonts } from "./font";
import { typography } from "./typography";

export const globalStyles = StyleSheet.create({
  font: {
    fontFamily: fonts.FontRegular.fontFamily,
  },
});

export default globalStyles;
