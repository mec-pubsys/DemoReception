import { StyleSheet, Platform } from "react-native";
import { colors } from "../../styles/color";
import { Dimensions } from "react-native";
import {
  HeadingLargeBold,
  HeadingMediumBold,
  HeadingXxSmallBold,
  LabelLargeRegular,
} from "../../styles/typography";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");
const isPortrait = height > width;
export const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  bodyContainer: {
    alignItems: "center",
    backgroundColor: colors.greyContainerColor,
    height: "100%",
    paddingTop: hp("3%"),
    paddingBottom: 32,
    paddingHorizontal: 40,
    gap: 48,
    flex: 1,
  },
  dotIcon: {
    height: 28,
  },
  bodyTextContainer: {
    ...Platform.select({
      web: {
        height: hp("10%"),
      },
      android: {
        height: hp("15%"),
        marginTop: hp("2%"),
      },
      ios: {
        height: isPortrait ? hp("8%") : hp("15%"),
        marginTop: isPortrait ? hp("1%") : hp("2%"),
      },
    }),
  },
  bodyText: {
    ...Platform.select({
      web: {
        width: 1114,
        height: 50,
        lineHeight: HeadingLargeBold.lineHeight,
      },
      android: {
        width: wp("70%"),
        height: hp("7%"),
      },
      ios: {
        width: isPortrait ? wp("70%") : wp("70%"),
        height: isPortrait ? hp("5.5%") : hp("7%"),
      },
    }),
    fontSize: HeadingLargeBold.size,
    color: colors.blackText,
    textAlign: "center",
  },
  selectionContainer: {
    alignItems: "center",
    ...Platform.select({
      web: {
        width: 924,
        height: 438,
      },
      android: {
        width: isPortrait ? wp("40%") : wp("90%"),
        height: hp("40%"),
      },
      ios: {
        width: isPortrait ? wp("40%") : wp("90%"),
        height: hp("40%"),
      },
    }),

    gap: 48,
    flexDirection: "row",
    justifyContent: "center",
  },
  qrContainer: {
    alignItems: "center",
    ...Platform.select({
      web: {
        width: 438,
        height: 438,
      },
      android: {
        width: isPortrait ? wp("45%") : wp("40%"),
        height: isPortrait ? hp("35%") : hp("50%"),
      },
      ios: {
        width: isPortrait ? wp("55%") : wp("40%"),
        height: isPortrait ? hp("35%") : hp("50%"),
      },
    }),
    backgroundColor: colors.secondary,
    paddingTop: 15,
    paddingBottom: 64,
    paddingHorizontal: 40,
    gap: 20,
    borderWidth: 10,
    borderColor: colors.primary,
    borderRadius: 16,
  },
  inputContainer: {
    alignItems: "center",
    ...Platform.select({
      web: {
        width: 438,
        height: 438,
      },
      android: {
        width: isPortrait ? wp("45%") : wp("40%"),
        height: isPortrait ? hp("35%") : hp("50%"),
      },
      ios: {
        width: isPortrait ? wp("55%") : wp("40%"),
        height: isPortrait ? hp("35%") : hp("50%"),
      },
    }),
    backgroundColor: colors.secondary,
    paddingTop: 78,
    paddingBottom: 64,
    paddingHorizontal: 138,
    gap: 24,
    borderWidth: 10,
    borderColor: colors.primary,
    borderRadius: 16,
  },
  qrCode: {
    ...Platform.select({
      web: {
        width: 164,
        height: 164,
      },
      android: {
        width: wp("17%"),
        height: hp("17%"),
      },
      ios: {
        width: wp("17%"),
        height: hp("17%"),
      },
    }),
    alignItems: "center",
  },
  qrImage: {
    ...Platform.select({
      web: {
        width: 123,
        height: 123,
        top: 20.5,
      },
      android: {
        width: isPortrait ? wp("18%") : wp("10%"),
        height: hp("12%"),
        top: isPortrait ? hp("1%") : (width === 1366 ? hp("4%") : hp("2%")),
      },
      ios: {
        width: isPortrait ? wp("18%") : wp("10%"),
        height: hp("12%"),
        top: isPortrait ? hp("1%") : (width === 1366 ? hp("4%") : hp("2%")),
      },
    }),
  },
  qrText: {
    ...Platform.select({
      web: {
        width: 212,
        height: 48,
        fontSize: HeadingMediumBold.size,
      },
      android: {
        width: wp("40%"),
        height: hp("20%"),
        marginTop: isPortrait ? -hp("3%") : hp("0%"),
        fontSize: isPortrait ? 30 : HeadingMediumBold.size,
      },
      ios: {
        width: wp("40%"),
        height: hp("20%"),
        marginTop: isPortrait ? -hp("3%") : hp("0%"),
        fontSize: isPortrait ? 30 : HeadingMediumBold.size,
      },
    }),
    lineHeight: HeadingMediumBold.lineHeight,
    color: colors.blackText,
    textAlign: "center",
  },
  qrRemark: {
    ...Platform.select({
      web: {
        width: 380,
        left: width > 1366 ? -wp("1%") : -wp('1.2%'),
      },
      android: {
        width: isPortrait ? (width === 1024 ? wp("48%") : wp("50%")) : wp("36%"),
        left: isPortrait ? (width === 1024 ? -wp("2.4%") : -wp("0.9%")) : -wp("1.0%"),
      },
      ios: {
        width: isPortrait ? (width === 1024 ? wp("48%") : wp("50%")) : wp("36%"),
        left: isPortrait ? (width === 1024 ? -wp("2.4%") : -wp("0.9%")) : -wp("1.0%"),
      },
    }),
    height: 54,
    borderRadius: 4,
    paddingVertical: 12,
    paddingRight: 16,
    paddingLeft: 7,
    gap: 8,
    backgroundColor: colors.blueLightColor,
  },
  qrRemarkText: {
    ...Platform.select({
      web: {
        width: 357,
        fontSize: HeadingXxSmallBold.size,
      },
      android: {
        width: hp("50%"),
      },
      ios: {
        width: hp("50%"),
      },
    }),
    fontSize: HeadingXxSmallBold.size,
    height: 30,
    lineHeight: HeadingXxSmallBold.lineHeight,
    gap: 8,
    color: colors.blackText,
  },
  inputImage: {
    ...Platform.select({
      web: {
        width: 141.75,
        height: 92.34,
        top: 41.65,
      },
      android: {
        width: isPortrait ? wp("20%") : wp("15%"),
        height: hp("15%"),
        top: hp("2%"),
      },
      ios: {
        width: isPortrait ? wp("20%") : wp("15%"),
        height: hp("15%"),
        top: isPortrait ? hp("1%") : (width === 1366 ? hp("4%") : hp("2%")),
      },
    }),
    left: 12.61,
  },
  inputText: {
    ...Platform.select({
      web: {
        width: 320,
        height: 48,
        fontSize: HeadingMediumBold.size,
      },
      android: {
        width: wp("40%"),
        height: hp("7%"),
        marginTop: isPortrait ? -hp("3%") : hp("0%"),
        fontSize: isPortrait ? 30 : HeadingMediumBold.size,
      },
      ios: {
        width: wp("40%"),
        height: hp("7%"),
        marginTop: isPortrait ? -hp("3%") : hp("0%"),
        fontSize: isPortrait ? 30 : HeadingMediumBold.size,
      },
    }),
    lineHeight: HeadingMediumBold.lineHeight,
    color: colors.blackText,
    textAlign: "center",
  },
  menu: {
    position: 'absolute',
    width: wp((320 / width) * 100 + "%"),
    height: hp((56 / height) * 100 + "%"),
    right: wp((40 / width) * 100 + "%"),
    backgroundColor: 'white',
    paddingVertical: hp((8 / height) * 100 + "%"),
    paddingHorizontal: wp((4 / width) * 100 + "%"),
    borderRadius: 6,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.dropdownShadowColor,
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 4,
        top: hp((92 / height) * 100 + "%"),
      },
      android: {
        shadowColor: colors.dropdownShadowColor,
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 6,
        top: hp((67 / height) * 100 + "%"),
      },
      web: {
        boxShadow: "1px 3px 14px 0px rgba(8, 18, 26, 0.12)",
        top: 76,
      },

    }),
  },
  menuLabel: {
    fontSize: LabelLargeRegular.size,
    lineHeight: LabelLargeRegular.lineHeight,
    verticalAlign: 'middle',
    color: colors.textColor,
  }
});

export default styles;
