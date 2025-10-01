import { StyleSheet } from "react-native";
import {
  BodyTextLarge,
  BodyTextMedium,
  HeadingXSmallBold,
  HeadingXxxSmallBold,
  HeadingXxxxSmallBold,
  HeadingXxxxSmallRegular,
} from "../../styles/typography";
import { colors } from "../../styles/color";

export const styles = StyleSheet.create({
  detailMainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    gap: 24,
  },
  detailContainer: {
    flex: 1,
    marginBottom: 21
  },
  detailBodyContainer: {
    height: "auto",
    maxHeight: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 23,
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 4,
  },
  detailOuterFrame1: {
    width: "100%",
    height: "auto",
    gap: 8,
  },
  detailOuterFrame2: {
    width: "100%",
    gap: 16,
  },
  detailInnerFrame1: {
    flexDirection: "row",
    width: "100%",
    height: 24,
    gap: 4,
  },
  detailInnerFrame2: {
    width: "100%",
    height: 63,
    gap: 9,
  },
  detailLineBreak: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D4D7DE",
    marginVertical: 24,
  },
  sentakuTitleText: {
    width: "100%",
    fontSize: HeadingXxxSmallBold.size,
    lineHeight: HeadingXxxSmallBold.lineHeight,
    color: "black",
  },
  radioPanel: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#D4D7DE",
    justifyContent: "center",
  },
  selectedRadioPanel: {
    backgroundColor: "#F0F8FF",
    borderColor: "#346DF4",
  },
  radioPressable: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonIcon: {
    paddingLeft: 16,
    width: 24,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderColor: "#B8BCC7",
  },
  selectedRadioButton: {
    borderColor: "#346DF4",
  },
  radioTextContainer: {
    paddingLeft: 16,
    height: 24,
  },
  subTitle: {
    fontSize: HeadingXSmallBold.size,
    lineHeight: HeadingXSmallBold.lineHeight,
    color: "black",
  },
  eventText: {
    fontSize: HeadingXxxxSmallRegular.size,
    lineHeight: HeadingXxxxSmallRegular.lineHeight,
    color: "black",
  },
  sentakuSubTitleText: {
    width: "100%",
    fontSize: BodyTextLarge.size,
    lineHeight: BodyTextLarge.lineHeight,
    color: "black",
  },
  radioText: {
    fontSize: HeadingXxxxSmallBold.size,
    lineHeight: HeadingXxxxSmallBold.lineHeight,
    color: "black",
  },
  errorText: {
    width: "100%",
    fontSize: BodyTextMedium.size,
    lineHeight: BodyTextMedium.lineHeight,
    color: colors.danger,
  },
  scrollView: {
    flex: 1,
  },
});
