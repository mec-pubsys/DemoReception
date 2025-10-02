import { StyleSheet, Platform, Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors } from "../../styles/color";
import {
  ButtonSmallBold,
  LabelLargeBold,
  LabelLargeRegular,
  LinkLarge,
  LabelMediumRegular,
  BodyTextLarge,
} from "../../styles/typography";
import { fonts } from "../../styles/font";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  bodyContainer: {
    paddingVertical: hp("1%"),
    paddingHorizontal: 40,
    gap: 24,
    backgroundColor: colors.secondary,
  },
  firstChildContainer: {
    backgroundColor: colors.bodyBackgroundColor,
    padding: 16,
    borderRadius: 8,
  },
  infoContainer: {
    gap: 16,
    backgroundColor: colors.bodyBackgroundColor,
  },
  parentInputContainer: {
    gap: 24,
    backgroundColor: colors.bodyBackgroundColor,
  },
  childInputContainer: {
    width: wp("17.05%"),
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
  },
  labelContainer: {
    width: 262,
    height: 24,
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
  },
  labelText: {
    height: 24,
    fontSize: LabelLargeBold.size,
    lineHeight: LabelLargeBold.lineHeight,
    color: colors.greyTextColor,
  },
  inputContainer: {
    width: 262,
    height: 44,
    backgroundColor: colors.bodyBackgroundColor,
  },
  input: {
    width: 262,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 9,
    gap: 8,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  dropdownContainer: {
    width: 150,
    height: 32,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "row",
  },
  dropdownText: {
    height: 24,
    fontSize: ButtonSmallBold.size,
    lineHeight: ButtonSmallBold.lineHeight,
    color: colors.primary,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  hiddenContainer: {
    gap: 24,
    backgroundColor: colors.bodyBackgroundColor,
  },
  mainDateContainer: {
    gap: 24,
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  miniDateContainer: {
    gap: 24,
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "column",
    zIndex: 1,
  },
  parentDateContainer: {
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
  },
  secondParentDateContainer: {
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
    zIndex: -1,
  },
  childDateContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.bodyBackgroundColor,
  },
  dateInputContainer: {
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "row",
  },
  secondDateInputContainer: {
    backgroundColor: colors.bodyBackgroundColor,
    flexDirection: "row",
    zIndex: -1,
  },
  dateInput: {
    width: 248.5,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 9,
    gap: 8,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
    fontFamily: fonts.FontRegular.fontFamily,
    fontSize: LabelLargeRegular.size,
    fontWeight: "300",
  },
  calendarIconContainer: {
    width: 24,
    height: 24,
    position: "absolute",
    top: 10,
    right: 10,
  },
  tildeText: {
    width: 16,
    height: 24,
    fontSize: LabelLargeBold.size,
    lineHeight: LabelLargeBold.lineHeight,
    color: colors.greyTextColor,
  },
  rightDateContainer: {
    gap: 8,
    backgroundColor: colors.bodyBackgroundColor,
  },
  buttonContainer: {
    height: 44,
    gap: 8,
    flexDirection: "row",
    backgroundColor: colors.bodyBackgroundColor,
    zIndex: -1,
  },
  grayMButton: {
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    lineHeight: ButtonSmallBold.lineHeight,
    ...Platform.select({
      ios: {
        paddingTop: 19,
      },
      android: {
        paddingBottom: 15,
      },
    }),
  },
  PrimaryMButton: {
    height: 44,
    borderRadius: 4,
    lineHeight: ButtonSmallBold.lineHeight,
    ...Platform.select({
      android: {
        paddingVertical: 8,
        paddingHorizontal: 20,
      },
      ios: {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      web: {
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
    }),
  },
  mainPaginationContainer: {
    gap: 32,
    backgroundColor: colors.secondary,
    zIndex: -1,
  },
  parentPaginationContainer: {
    gap: 16,
    height: 384,
    backgroundColor: colors.secondary,
    ...Platform.select({
      ios: {
        height: 350,
      },
    }),
  },
  topPaginationContainer: {
    backgroundColor: colors.secondary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        height: 34,
      },
      web: {
        height: 44,
      },
      android: {
        height: 44,
      },
    }),
  },
  countContainer: {
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  paginationCount: {
    fontSize: LabelLargeRegular.size,
    lineHeight: LabelLargeRegular.lineHeight,
    color: colors.textColor,
  },
  sortingContainer: {
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownIconStyle: {
    width: 20,
    height: 20,
  },
  dropdown: {
    width: 320,
    position: "absolute",
    top: 47,
    right: 0,
    backgroundColor: "white",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: colors.iosShadowColor,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        shadowColor: colors.dropdownShadowColor,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
      },
      web: {
        boxShadow: "0px 3px 14px 0px rgba(8, 18, 26, 0.12)",
      },
    }),
  },
  modalContainer: {
    width: 320,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: colors.secondary,
    ...Platform.select({
      ios: {
        shadowColor: colors.iosShadowColor,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        top: 439,
        left: 850,
      },
      android: {
        shadowColor: colors.dropdownShadowColor,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
      },
      web: {
        boxShadow: "0px 3px 14px 0px rgba(8, 18, 26, 0.12)",
        top: 428,
        left: 1190,
      },
    }),
  },
  dropdownItem: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  tableContainer: {
    backgroundColor: colors.secondary,
    zIndex: -1,
  },
  tableItemContainer: {
    height: 288,
  },
  noDataContainer: {
    height: 182,
    paddingVertical: 64,
    paddingHorizontal: 12,
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataChildContainer: {
    width: "auto",
    height: 54,
  },
  noDataText: {
    fontSize: BodyTextLarge.size,
    lineHeight: BodyTextLarge.lineHeight,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderColor: colors.gray,
  },
  headerText: {
    color: colors.greyTextColor,
    textAlign: "left",
    fontSize: LabelLargeBold.size,
    lineHeight: LabelLargeBold.lineHeight,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  eventHeaderText: {
    width: "58%",
    gap: 4,
  },
  venueHeaderText: {
    width: "17.8%",
    gap: 4,
  },
  eventDateText: {
    width: "24.2%",
    gap: 4,
  },
  row: {
    ...Platform.select({
      ios: {
        height: 45,
      },
      web: {
        height: 48,
      },
      android: {
        height: 48,
      },
    }),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderColor: colors.gray,
  },
  eventBodyText: {
    lineHeight: LinkLarge.lineHeight,
    color: colors.primary,
    overflow: "hidden",
    fontSize: screenWidth < 1194 ? 14 : LinkLarge.size,
    textDecorationLine: "underline",
  },
  eventBodyPressableText: {
    width: "58%",
  },
  venueBodyText: {
    width: "17.8%",
    color: colors.textColor,
    fontSize: screenWidth < 1194 ? 14 : LabelLargeRegular.size,
    lineHeight: LabelLargeRegular.lineHeight,
  },
  eventDateBodyText: {
    width: "24.2%",
    color: colors.textColor,
    fontSize: screenWidth < 1194 ? 14 : LabelLargeRegular.size,
    lineHeight: LabelLargeRegular.lineHeight,
  },
  cell: {
    color: colors.blackText,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  onChangePageContainer: {
    height: 32,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: colors.secondary,
  },
  previousButtonsContainer: {
    height: 32,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    gap: 8,
  },
  skipBackDisable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.bodyBackgroundColor,
    opacity: 50,
  },
  skipBackEnable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.secondary,
  },
  chevronDisable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.bodyBackgroundColor,
    opacity: 50,
  },
  chevronEnable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.secondary,
    opacity: 50,
  },
  skipForwardDisable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.bodyBackgroundColor,
    opacity: 50,
  },
  skipForwardEnable: {
    width: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.secondary,
  },
  pageNumberContainer: {
    height: 32,
    gap: 12,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  activeButton: {
    height: 32,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary,
    gap: 8,
  },
  inactiveButton: {
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.secondary,
  },
  activeText: {
    color: colors.secondary,
    lineHeight: ButtonSmallBold.lineHeight,
  },
  inactiveText: {
    color: colors.textColor,
    lineHeight: ButtonSmallBold.lineHeight,
  },
  threeDots: {
    fontSize: LabelMediumRegular.size,
    lineHeight: LabelMediumRegular.lineHeight,
    color: colors.textColor,
  },
  nextButtonsContainer: {
    height: 32,
    gap: 8,
    backgroundColor: colors.secondary,
    flexDirection: "row",
  },
  chevronRightEnable: {
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chevronRightDisable: {
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.bodyBackgroundColor,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default styles;
