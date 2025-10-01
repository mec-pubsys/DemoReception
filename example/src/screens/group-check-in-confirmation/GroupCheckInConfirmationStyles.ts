import { StyleSheet, Platform } from "react-native";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../styles/color";
import {
  HeadingMediumBold,
  HeadingXxSmallBold,
  HeadingXxSmallRegular,
  ButtonSmallBold,
  BodyTextXLarge,
  HeadingXxxSmallBold,
  LabelMediumBold,
} from "../../styles/typography";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const isPortrait = height > width;
const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },

  bodyContainer: {
    alignItems: "center",
    backgroundColor: colors.bodyBackgroundColor,
    paddingHorizontal: wp("3.35%"),
    paddingVertical: hp("3.65%"),
    gap: 24,
    flex: 1,
    justifyContent: "center",
    ...Platform.select({
      web: {
        paddingHorizontal: wp("3.35%"),
        paddingVertical: hp("3.65%"),
      },
      ios: {
        paddingVertical: height < 745 ? hp("2%") : hp("3.65%"),
      },
    }),
  },
  innerBodyContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.gray,
    borderRadius: 16,
    width: wp("63.3%"),
    overflow: "hidden",
    borderBottomWidth: 1,
    backgroundColor: colors.secondary,
  },
  innerBodyContainerNot: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.gray,
    borderRadius: 16,
    width: wp("63.3%"),
    overflow: "hidden",
    borderBottomWidth: 1,
  },
  // familyReceptionContainer: {
  //   width: wp("63.5%"),
  //   height: hp("56%"),
  //   ...Platform.select({
  //     web: {
  //       height:
  //         width < 1195 ? hp("56%") : width < 1900 ? hp("53.3%") : hp("53.3%"),
  //     },
  //     ios: {
  //       height:
  //         height < 745 ? hp("55%") : width == 1194 ? hp("56%") : hp("56%"),
  //     },
  //   }),
  //   borderRadius: 8,
  //   backgroundColor: colors.secondary,
  //   overflow: "hidden",
  // },
  innerMainTitle: {
    width: wp("93.4%"),
    height: hp("5.45%"),
    alignItems: "center",
    justifyContent: "center",
  },
  innerMainTitleText: {
    fontSize: HeadingMediumBold.size,
    lineHeight: HeadingMediumBold.lineHeight,
    color: colors.textColor,
  },
  bodyTitle: {
    backgroundColor: colors.neutralGrayColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: wp("63.3%"),
    height: hp("7.7%"),

    ...Platform.select({
      ios: {
        height: isPortrait ? hp("6%") : hp("7.7%"),
      },
    }),
  },
  bodyTitleText: {
    fontSize: HeadingXxSmallBold.size,
    lineHeight: HeadingXxSmallBold.lineHeight,
    height: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    color: colors.textColor,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    gap: 16,
    paddingVertical: hp("1.35%"),
    paddingHorizontal: 24,
    width: wp("63.3%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    justifyContent: "space-between",
  },

  rowContent: {
    flexDirection: "row",
  },
  rowAddress: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: hp("1.35%"),
    width: wp("63.3%"),
    gap: 16,
    borderBottomWidth: 0,
    borderBottomColor: colors.gray,
    justifyContent: "space-between",
  },
  firstContent: {
    width: wp("15.5%"),
    gap: 8,
    alignContent: "center",
    color: colors.textColor,
  },
  firstContentAddress: {
    width: wp("15.5%"),
    gap: 8,
    alignContent: "center",
    color: colors.textColor,
  },

  secondContent: {
    width: wp("43.55%"),
    textAlign: "center",
    color: colors.textColor,
  },
  secondContentCorrected: {
    width: wp("37.35%"),
    textAlign: "center",
    color: colors.textColor,
  },
  secondContentAddress: {
    width: wp("43.55%"),
    color: colors.textColor,
  },
  secondContentAddressCorrected: {
    width: wp("37.25%"),
    color: colors.textColor,
  },
  correctedBadge: {
    display: "flex",
    width: 58,
    height: 29,
    borderWidth: 2,
    borderRadius: 2,
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: colors.danger,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -6,
  },
  correctedText: {
    width: 42,
    height: 21,
    color: colors.danger,
    fontSize: LabelMediumBold.size,
    lineHeight: LabelMediumBold.lineHeight,
  },
  innerBodyBoldText: {
    alignItems: "center",
    fontSize: HeadingXxSmallBold.size,
    lineHeight: HeadingXxSmallBold.lineHeight,
    fontWeight: "600",
    color: colors.textColor,
  },
  innerBodyText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: HeadingXxSmallRegular.size,
    lineHeight: height < 1024 ? 30 : 37,
    color: colors.textColor,
  },
  iconStyle: {
    alignItems: "center",
    lineHeight: ButtonSmallBold.lineHeight,
    paddingTop: 3,
    paddingLeft: 3,
    width: 27,
    height: 27,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
  },
  btnModify: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 4,
    width: 184,
    height: 44,
    alignContent: "center",
    borderColor: colors.primary,
    fontSize: ButtonSmallBold.size,
    lineHeight: ButtonSmallBold.lineHeight,
  },
  outerContainer: {
    width: wp("91.2%"),
    gap: 66,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-start",
  },
  sideScrollDiv: {
    width: wp("22.35%"),
    height: hp("51%"),
    ...Platform.select({
      web: {
        height:
          width < 1195 ? hp("52.4%") : width < 1900 ? hp("54%") : hp("53.3%"),
      },
      ios: {
        height:
          height < 745 ? hp("51%") : width == 1194 ? hp("50.5%") : hp("51%"),
      },
    }),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.secondary,
    overflow: "hidden",
  },
  btnSideDiv: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: wp("0.65%"),
    paddingVertical: hp("0.9%"),
    gap: 4,
    alignItems: "center",
    width: wp("19.7%"),
    height: hp("5.65%"),
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
    justifyContent: "space-between",
  },
  btnSideDivActive: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: wp("0.65%"),
    paddingVertical: hp("0.9%"),
    gap: 4,
    alignItems: "center",
    width: wp("19.7%"),
    height: hp("5.65%"),
    borderColor: colors.primary,
    backgroundColor: colors.neuralBlueLightColor,
    justifyContent: "space-between",
  },
  sideTitleText: {
    height: hp("6.15%"),
    width: wp("22.35%"),
    backgroundColor: colors.neutralGrayColor,
    fontSize: HeadingXxSmallBold.size,
    lineHeight: HeadingXxSmallBold.lineHeight,
    color: colors.textColor,
    paddingHorizontal: wp("1.35%"),
    paddingVertical: hp("1.35%"),
    gap: 4,
  },
  count: {
    fontSize: HeadingXxxSmallBold.size,
    lineHeight: HeadingXxxSmallBold.lineHeight,
    color: colors.greyTextColor,
    width: wp("1.5%"),
    height: hp("3.05%"),
    display: "flex",
  },
  sideText: {
    color: colors.textColor,
    fontSize: BodyTextXLarge.size,
    ...Platform.select({
      ios: {
        lineHeight: BodyTextXLarge.lineHeight,
      },
    }),
  },
  sideTextWidth: {
    width: wp("16.5%"),
  },
  sideTextWidthCorrected: {
    width: wp("11.32%"),
  },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollableGp: {
    width: wp("22.35%"),
    gap: wp("1%"),
    paddingHorizontal: wp("1.35%"),
    paddingVertical: hp("1.8%"),
    overflow: "hidden",
  },
  scrollableGroup: {
    width: wp("22.35%"),
    overflow: "hidden",
  },
  chevronLeftButton: {
    width: 52,
    height: 52,
    borderRadius: 1000,
    padding: 12,
    gap: 8,
    backgroundColor: "rgba(99, 107, 126, 0.5)",
  },
  chevronRightButton: {
    width: 52,
    height: 52,
    borderRadius: 1000,
    padding: 12,
    gap: 8,
    backgroundColor: "rgba(99, 107, 126, 0.5)",
  },
});

export default styles;
