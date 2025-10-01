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
  LabelMediumBold,
} from "../../styles/typography";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const isPortrait = height > width;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  bodyContainer: {
    alignItems: "center",
    backgroundColor: colors.bodyBackgroundColor,
    height: "auto",
    paddingHorizontal: wp("3.35%"),
    paddingVertical: hp("3.85%"),
    gap: wp("2.02%"),
    flex: 1,
    justifyContent: "center",
    ...Platform.select({
      web: {
        paddingHorizontal: 0,
        paddingVertical: hp("2%"),
      },
    }),
  },
  innerBodyContainer: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.gray,
    borderRadius: 16,
    width: wp("77.5%"),
    overflow: "hidden",
    borderBottomWidth: 1,
  },
  innerMainTitle: {
    height: hp("5.75%"),
  },
  innerMainTitleText: {
    fontSize: HeadingMediumBold.size,
    lineHeight: HeadingMediumBold.lineHeight,
    alignItems: "center",
    justifyContent: "center",
    color: colors.textColor,
  },
  bodyTitle: {
    backgroundColor: colors.neutralGrayColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: hp("8.15%"),
    ...Platform.select({
      ios: {
        height: isPortrait ? hp("7%") : hp("8.15%"),
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
    paddingHorizontal: 24,
    paddingVertical: wp("1%"),
    gap: wp("1.35%"),
    ...Platform.select({
      web: {
        gap: 16,
        paddingVertical: 12,
      },
    }),

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
    paddingVertical: wp("1%"),
    gap: wp("1.35%"),
    ...Platform.select({
      web: {
        gap: 16,
        paddingVertical: 12,
      },
    }),

    justifyContent: "space-between",
  },
  firstContent: {
    width: wp("14.4%"),
    gap: wp("0.65%"),
    justifyContent: "center",
  },
  firstContentAddress: {
    width: wp("14.4%"),
    gap: wp("0.65%"),
    justifyContent: "center",
  },

  secondContent: {
    width: wp("57.64%"),
  },
  secondContentCorrected: {
    width: wp("51.42%"),
  },
  secondContentAddress: {
    width: wp("57.64%"),
  },
  secondContentAddressCorrected: {
    width: wp("51.42%"),
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
    lineHeight: 34,
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
    paddingHorizontal: wp("1.66%"),
    paddingVertical: wp("0.85%"),
    gap: wp("0.65%"),
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
  rowGroup: {
    width: wp("77.5%"),
    overflow: "hidden",
    backgroundColor: colors.secondary,
  },
});

export default styles;
