import { Platform, StyleSheet } from "react-native";
import { colors } from "../../styles/color";
import {
  HeadingLargeBold,
  HeadingSmallBold,
  LabelLargeBold,
  LabelLargeRegular,
  ButtonSmallBold,
} from "../../styles/typography";

export const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    height: 98,
    paddingHorizontal: 40,
    paddingVertical: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.7,
        shadowRadius: 7,
      },
      android: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.7,
        shadowRadius: 7,
      },
      web: {
        boxShadow: "0px 1px 7px 0px rgba(8, 18, 26, 0.08)",
      },
    }),
    elevation: 7,
    gap: 16,
    backgroundColor: colors.secondary,
  },
  headerText: {
    width: 1114,
    height: 50,
    fontSize: HeadingLargeBold.size,
    lineHeight: HeadingLargeBold.lineHeight,
    color: colors.blackText,
  },
  bodyContainer: {
    alignItems: "center",
    backgroundColor: colors.greyContainerColor,
    height: "100%",
    padding: 40,
    gap: 16,
  },
  loginText: {
    fontSize: HeadingSmallBold.size,
    lineHeight: HeadingSmallBold.lineHeight,
    color: colors.blackText,
  },
  infoBox: {
    width: 356,
    height: 348,
    borderRadius: 4,
    backgroundColor: colors.light.background,
    padding: 40,
    borderColor: "#D4D7DE",
    borderWidth: 1,
    gap: 48,
  },
  inputContainer: {
    width: 276,
    height: 176,
    gap: 24,
  },
  labelInputSetBox: {
    width: 276,
    height: 76,
    gap: 8,
  },
  label: {
    width: 276,
    height: 24,
    fontSize: LabelLargeBold.size,
    lineHeight: LabelLargeBold.lineHeight,
    color: colors.greyTextColor,
    gap: 8,
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    width: 276,
    height: 44,
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 10,
    gap: 8,
    fontWeight: "300",
    fontSize: LabelLargeRegular.size,
  },
  inputPassword: {
    paddingRight: 40
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    position: "absolute",
    top: 10,
    right: 10
  },
  eyeIcon: {
    width: 24,
    height: 24,
    color: colors.placeholderTextColor,
  },
  buttonLogin: {
    width: 276,
    height: 44,
    fontSize: ButtonSmallBold.size,
    lineHeight: ButtonSmallBold.lineHeight,
    borderRadius: 4,
  },
  messageContainer: {
    width: 276,
    height: 24,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 23.8,
    color: colors.danger,
  },
});

export default styles;
