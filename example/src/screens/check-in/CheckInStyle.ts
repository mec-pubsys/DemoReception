import { StyleSheet, Platform, Dimensions } from "react-native";
import {
  HeadingMediumBold,
  HeadingXxSmallBold,
  LabelLargeRegular,
  BodyTextMedium,
} from "../../styles/typography";
import { colors } from "../../styles/color";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fonts } from "../../styles/font";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const isMiniScreen = screenWidth === 1133;
const isPortrait = screenHeight > screenWidth;

export const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  bodyContainer: {
    height: "auto",
    paddingHorizontal: wp("3.35%"),
    paddingVertical: hp("3.85%"),
    gap: 24,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bodyBackgroundColor,
  },
  titleText: {
    textAlign: "center",
    color: colors.textColor,
    fontSize: isMiniScreen ? 28 : HeadingMediumBold.size,
    lineHeight: isMiniScreen ? 28 : HeadingMediumBold.lineHeight,
  },
  scrollContainer: {
    borderRadius: 16,
  },
  container: {
    gap: isMiniScreen ? 18 : hp("2.9%"),
    paddingVertical: 24,
    paddingHorizontal: wp("1.6%"),
    borderRadius: 16,
    backgroundColor: colors.secondary,
    ...Platform.select({
      ios: {
        shadowColor: colors.bodyShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 7,
      },
      android: {
        shadowColor: colors.bodyShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 7,
        elevation: 5,
      },
      web: {
        boxShadow: `0px 1px 7px 0px ${colors.headerFooterShadowColor}`,
      },
    }),
  },
  nameLabelContainer: {
    gap: wp("4%"),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  labelNameText: {
    gap: wp("0.7%"),
    color: colors.greyTextColor,
    fontSize: HeadingXxSmallBold.size,
    backgroundColor: colors.secondary,
    lineHeight: HeadingXxSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        width: 152,
      },
      android: {
        width: 152,
      },
      web: {
        width: wp("14%"),
      },
    }),
  },
  nameInputsContainer: {
    gap: wp("1.31%"),
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  inputErrContainer: {
    flexDirection: "column",
    backgroundColor: colors.secondary,
    height: "auto",
  },
  FirstNameInput: {
    borderWidth: 1,
    borderRadius: 6,
    gap: wp("0.7%"),
    width: wp("27.7%"),
    height: hp("5.3"),
    paddingVertical: hp("1.19%"),
    paddingHorizontal: wp("0.71%"),
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  FirstNameInputText: {
    fontWeight: "300",
    fontSize: LabelLargeRegular.size,
    color: colors.textColor,
    lineHeight: LabelLargeRegular.lineHeight,
    fontFamily: fonts.FontRegular.fontFamily,
    ...Platform.select({
      ios: {
        lineHeight: 0,
      },
    }),
  },
  LastNameInput: {
    gap: wp("0.5%"),
    borderWidth: 1,
    borderRadius: 6,
    width: wp("27.7%"),
    height: hp("5.3"),
    paddingVertical: hp("1.19%"),
    paddingHorizontal: wp("0.71%"),
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  LastNameInputText: {
    fontWeight: "300",
    fontSize: LabelLargeRegular.size,
    color: colors.textColor,
    lineHeight: LabelLargeRegular.lineHeight,
    fontFamily: fonts.FontRegular.fontFamily,
    ...Platform.select({
      ios: {
        lineHeight: 0,
      },
    }),
  },
  birthDateContainer: {
    gap: wp("4%"),
    width: wp("73.4%"),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
    zIndex: 1,
  },
  labelBirthDateText: {
    gap: 16,
    color: colors.greyTextColor,
    fontSize: HeadingXxSmallBold.size,
    backgroundColor: colors.secondary,
    lineHeight: HeadingXxSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        width: 152,
      },
      android: {
        width: 152,
      },
      web: {
        width: wp("14%"),
      },
    }),
  },
  birthDateInputsContainer: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  birthDateInput: {
    backgroundColor: colors.secondary,
    display: "flex",
    justifyContent: "center",
  },
  birthDateInputText: {
    gap: wp("0.7%"),
    width: isPortrait ? wp("24.7%") : wp("21.99%"),
    height: hp("5.3%"),
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: hp("1.33%"),
    paddingHorizontal: wp("0.6%"),
    borderColor: colors.borderColor,
    fontFamily: fonts.FontRegular.fontFamily,
    fontSize: LabelLargeRegular.size,
    fontWeight: "300",
  },
  calendarIconContainer: {
    right: 10,
    width: 24,
    height: 24,
    position: "absolute",
  },
  calendarIcon: {
    width: 20,
    height: 22,
    top: 1,
    left: 2,
  },
  genderContainer: {
    gap: wp("4%"),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
    zIndex: 0,
  },
  labelGenderText: {
    color: colors.greyTextColor,
    fontSize: HeadingXxSmallBold.size,
    backgroundColor: colors.secondary,
    lineHeight: HeadingXxSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        width: 152,
      },
      android: {
        width: 152,
      },
      web: {
        width: wp("14%"),
      },
    }),
  },
  genderRadioContainer: {
    gap: wp("2%"),
    width: wp("24.1%"),
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  radioContainer: {
    gap: 8,
    flexDirection: "row",
    width: wp("5.35%"),
    paddingVertical: hp("1.11%"),
    paddingHorizontal: 0,
    backgroundColor: colors.secondary,
  },
  radioKaitouContainer: {
    ...Platform.select({
      ios: {
        width: isPortrait ? wp("7.6%") : wp("7.33%"),
      },
      android: {
        width: wp("7.33%"),
      },
      web: {
        width: wp("9.4%"),
      },
    }),
  },
  radioPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonIcon: {
    width: 24,
    backgroundColor: colors.secondary,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  selectedRadioButton: {
    borderColor: colors.primary,
  },
  radioTextContainer: {
    height: 24,
    backgroundColor: colors.secondary,
  },
  radioText: {
    fontSize: LabelLargeRegular.size,
    lineHeight: LabelLargeRegular.lineHeight,
    color: colors.textColor,
  },
  postCodeContainer: {
    gap: wp("4%"),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
    zIndex: 0,
    ...Platform.select({
      ios: {
        width: wp("57.31%"),
      },
      android: {
        width: wp("57.31%"),
      },
    }),
  },
  labelPostCodeText: {
    color: colors.greyTextColor,
    fontSize: HeadingXxSmallBold.size,
    backgroundColor: colors.secondary,
    lineHeight: HeadingXxSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        width: 152,
      },
      android: {
        width: 152,
      },
      web: {
        width: wp("14%"),
      },
    }),
  },
  postCodeInputsContainer: {
    gap: 16,
    flexDirection: "row",
    backgroundColor: colors.secondary,
    ...Platform.select({
      ios: {
        width: wp("22.44%"),
      },
      android: {
        width: wp("22.44%"),
      },
    }),
  },
  postCodeInput: {
    gap: 8,
    borderWidth: 1,
    borderRadius: 6,
    width: isPortrait ? wp("21.5%") : wp("19.33%"),
    height: hp("5.3%"),
    paddingVertical: hp("1.11%"),
    paddingHorizontal: 9,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  postCodeInputText: {
    fontWeight: "300",
    fontSize: LabelLargeRegular.size,
    color: colors.textColor,
    lineHeight: LabelLargeRegular.lineHeight,
    fontFamily: fonts.FontRegular.fontFamily,
    ...Platform.select({
      ios: {
        lineHeight: 0,
      },
    }),
  },
  searchButton: {
    gap: 8,
    height: hp("5.3%"),
    paddingVertical: hp("1.11%"),
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  addressContainer: {
    gap: wp("4%"),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
    zIndex: 0,
    ...Platform.select({
      ios: {
        width: wp("57.31%"),
      },
      android: {
        width: wp("57.31%"),
      },
    }),
  },
  labelAddressText: {
    color: colors.greyTextColor,
    fontSize: HeadingXxSmallBold.size,
    backgroundColor: colors.secondary,
    lineHeight: HeadingXxSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        width: 152,
      },
      android: {
        width: 152,
      },
      web: {
        width: wp("14%"),
      },
    }),
  },
  addressInput: {
    gap: 8,
    borderWidth: 1,
    borderRadius: 6,
    width: isPortrait ? wp("63.65%") : wp("56.6%"),
    height: hp("5.3%"),
    paddingVertical: hp("1.11%"),
    paddingHorizontal: 9,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  addressInputText: {
    fontWeight: "300",
    fontSize: LabelLargeRegular.size,
    color: colors.textColor,
    lineHeight: LabelLargeRegular.lineHeight,
    fontFamily: fonts.FontRegular.fontFamily,
    ...Platform.select({
      ios: {
        lineHeight: 0,
      },
    }),
  },
  errText: {
    fontWeight: "300",
    fontSize: BodyTextMedium.size,
    color: colors.danger,
    zIndex: -1,
  },
  calendarContainer: {
    position: "absolute",
    top: 0,
    height: "auto",
  },
});

export default styles;
