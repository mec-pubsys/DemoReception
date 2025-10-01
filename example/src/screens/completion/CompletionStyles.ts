import { StyleSheet } from "react-native";
import {
  HeadingSmallBold,
  HeadingXxSmallRegular,
  ButtonMediumBold,
} from "../../styles/typography";
import { colors } from "../../styles/color";
 
export const styles = StyleSheet.create({
  modalText: {
    fontSize: HeadingXxSmallRegular.size,
    lineHeight: 34,
    color: colors.blackText,
  },
});
 
export default styles;