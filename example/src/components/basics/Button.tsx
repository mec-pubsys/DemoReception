import React from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  GestureResponderEvent,
} from "react-native";
import { HiraginoKakuText } from "../StyledText";
import { ButtonSmallBold, ButtonMediumBold } from "../../styles/typography";
import { colors } from "../../styles/color";

type ButtonProps = {
  onPress?: (() => void) | ((event: GestureResponderEvent) => void);
  text: string;
  type?:
    | "ButtonMPrimary"
    | "ButtonMDisable"
    | "ButtonSDisable"
    | "ButtonLPrimary"
    | "ButtonSPrimary"
    | "ButtonLGray"
    | "ButtonMediumGray"
    | "ButtonSGray"
    | "ButtonLText"
    | "ButtonMGray"
    | "ButtonMSecondary";
  style?: ViewStyle;
  textSize?: number;
  icon?: React.ReactNode;
  iconPosition?: "front" | "behind" | "center";
  buttonWidth?: number;
};

export const Button = (props: ButtonProps) => {
  const defaultOnPress = () => {};

  const buttonStyle =
    props.type === "ButtonMPrimary"
      ? styles.ButtonMPrimary
      : props.type === "ButtonMDisable"
      ? styles.ButtonMDisable
      : props.type === "ButtonSDisable"
      ? styles.ButtonSDisable
      : props.type === "ButtonLPrimary"
      ? styles.ButtonLPrimary
      : props.type === "ButtonSPrimary"
      ? styles.ButtonSPrimary
      : props.type === "ButtonLGray"
      ? styles.ButtonLGray
      : props.type === "ButtonMediumGray"
      ? styles.ButtonMediumGray
      : props.type === "ButtonSGray"
      ? styles.ButtonSGray
      : props.type === "ButtonLText"
      ? styles.ButtonLText
      : props.type === "ButtonMGray"
      ? styles.ButtonMGray
      : props.type === "ButtonMSecondary"
      ? styles.ButtonMSecondary
      : {};

  const defaultFontSize =
    props.type === "ButtonMPrimary"
      ? 16
      : props.type === "ButtonMDisable"
      ? ButtonSmallBold.size
      : props.type === "ButtonLPrimary"
      ? ButtonMediumBold.size
      : props.type === "ButtonSPrimary"
      ? ButtonSmallBold.size
      : props.type === "ButtonLGray"
      ? ButtonMediumBold.size
      : props.type === "ButtonMediumGray"
      ? ButtonSmallBold.size
      : props.type === "ButtonMSecondary"
      ? ButtonSmallBold.size
      : props.type === "ButtonSGray"
      ? ButtonSmallBold.size
      : props.type === "ButtonLText"
      ? ButtonMediumBold.size
      : props.type === "ButtonMGray"
      ? ButtonSmallBold.size
      : ButtonMediumBold.size;

  const buttonTextStyle = {
    fontSize: props.textSize || defaultFontSize,
  };

  return (
    <Pressable
      onPress={props.onPress || defaultOnPress}
      style={[
        styles.buttonContainer,
        buttonStyle,
        props.style,
        {
          width:
            props.buttonWidth ?? 0 > 0 ? props.buttonWidth : props.style?.width,
        },
      ]}
      disabled={
        props.type === "ButtonMDisable" || props.type === "ButtonSDisable"
      }
    >
      {props.iconPosition === "front" && props.icon && (
        <View>{props.icon}</View>
      )}
      {props.iconPosition === "center" && props.icon != null && (
        <View>{props.icon}</View>
      )}
      {(props.icon == null || props.iconPosition !== "center") && (
        <HiraginoKakuText style={[buttonStyle, buttonTextStyle]}>
          {props.text}
        </HiraginoKakuText>
      )}
      {props.iconPosition === "behind" && props.icon && (
        <View>{props.icon}</View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ButtonMPrimary: {
    gap: 8,
    backgroundColor: colors.primary,
    color: colors.secondary,
    fontWeight: "600",
  },
  ButtonMDisable: {
    gap: 8,
    backgroundColor: colors.gray,
    color: colors.greyTextColor,
    fontWeight: ButtonSmallBold.weight,
  },
  ButtonSDisable: {
    gap: 8,
    backgroundColor: colors.gray,
    color: colors.greyTextColor,
  },
  ButtonLPrimary: {
    gap: 8,
    backgroundColor: colors.primary,
    color: colors.secondary,
    fontWeight: "600",
  },
  ButtonSPrimary: {
    gap: 8,
    backgroundColor: colors.primary,
    color: colors.secondary,
    fontWeight: "600",
    lineHeight: ButtonSmallBold.lineHeight,
  },
  ButtonLGray: {
    gap: 8,
    backgroundColor: colors.secondary,
    color: colors.textColor,
    fontWeight: "600",
  },
  ButtonMediumGray: {
    gap: 8,
    backgroundColor: colors.secondary,
    color: colors.textColor,
    fontWeight: "600",
    height: 24,
  },
  ButtonSGray: {
    gap: 8,
    backgroundColor: colors.secondary,
    color: colors.textColor,
    fontWeight: "600",
    lineHeight: ButtonSmallBold.lineHeight,
  },
  ButtonLText: {
    gap: 8,
    backgroundColor: colors.secondary,
    fontWeight: "600",
    color: colors.primary,
    fontSize: ButtonMediumBold.size,
  },
  ButtonMGray: {
    gap: 8,
    backgroundColor: colors.secondary,
    color: colors.textColor,
    fontWeight: "600",
  },
  ButtonMSecondary: {
    gap: 8,
    color: colors.primary,
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
});
