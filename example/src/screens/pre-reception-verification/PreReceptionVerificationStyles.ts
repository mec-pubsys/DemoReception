import { StyleSheet } from "react-native";
import { colors } from "../../styles/color";
import {
  HeadingXxxSmallBold,
  BodyTextLarge,
  LabelMediumBold,
} from "../../styles/typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    borderRadius: 4,
  },
  ListContainter: {
    width: 338,
    height: "auto",
    minHeight: 179,
    borderRadius: 4,
    bordrer: 1,
    padding: 16,
    gap: 8,
    borderColor: colors.gray,
    backgroundColor: colors.bodyBackgroundColor,
  },
  subTitleText: {
    minHeight: 27,
    fontSize: HeadingXxxSmallBold.size,
    lineHeight: HeadingXxxSmallBold.lineHeight,
    color: colors.blackText,
  },
  upperContainer: {
    height: "auto",
    minHeight: 52,
    gap: 4,
    backgroundColor: colors.bodyBackgroundColor,
  },
  innerLabel: {
    fontSize: LabelMediumBold.size,
    lineHeight: LabelMediumBold.lineHeight,
    color: colors.blackText,
  },
  LowerContainer: {
    width: 306,
    height: 52,
    gap: 4,
    backgroundColor: colors.bodyBackgroundColor,
  },
  innerText: {
    fontSize: BodyTextLarge.size,
    fontWeight: "300",
    lineHeight: BodyTextLarge.lineHeight,
    color: colors.blackText,
  },
});

export default styles;
