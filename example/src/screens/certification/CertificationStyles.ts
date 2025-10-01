import { StyleSheet } from "react-native";
import { colors } from "../../styles/color";
import {  
  BodyTextLarge,
  LabelLargeBold,
} from "../../styles/typography";

export const styles = StyleSheet.create({
  bodyContainer: {
    width: 545,
    height: 299,
    padding: 24,
    gap: 16,
    backgroundColor: colors.secondary,
  },
  bodyText: {
    width: 497,
    height: 27,
    fontSize: BodyTextLarge.size,
    lineHeight: BodyTextLarge.lineHeight,
    color: colors.textColor,
  },
  inputContainer: {
    width: 497,
    height: 176,
    gap: 24,
    backgroundColor: colors.secondary,
    flex: 1,
  },
  inputItem: {
    width: 497,
    height: 76,
    gap: 8,
    backgroundColor: colors.secondary,
  },
  inputHeadingContainer: {
    width: 497,
    height: 24,
    gap: 8,    
  },
  headingText: {
    fontSize: LabelLargeBold.size,
    lineHeight: LabelLargeBold.lineHeight,
    color: colors.textColor,
  },
  pwContainer: {
    backgroundColor: colors.secondary,
    gap: 8,
  },
  idInput: {
    width: 497,
    height: 44,
    paddingHorizontal: 9,
    paddingVertical: 10,
    gap: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  pwInput: {
    width: 497,
    height: 44,
    paddingHorizontal: 9,
    paddingVertical: 10,
    gap: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.secondary,
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    position: "absolute",
    top: 10,
    right: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    color: colors.placeholderTextColor,
  },
  messageContainer: {
    width: 497,
    height: 24,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 23.8,
    color: colors.danger,    
  },
})

export default styles;