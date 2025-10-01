import React from "react";
import { StyleSheet, View, Platform, ViewStyle } from "react-native";
import { ButtonLargeBold } from "../../styles/typography";
import { colors } from "../../styles/color";
import { Button } from "./Button";
import { Entypo } from "@expo/vector-icons";

type FooterProps = {
  text?: string;
  onPress?: () => void;
  leftButtonText?: string;
  rightButtonText?: string;
  hasPreviousButton?: boolean;
  hasNextButton?: boolean;
  currentIndex?: number;
  slides?: any[];
  onPressPrevious?: () => void;
  onPressNext?: () => void;
  showNextIcon?: boolean;
  style?: ViewStyle;
};

export const Footer = (props: FooterProps) => {
  const {
    currentIndex = 0,
    slides = [],
    leftButtonText = "もどる",
    rightButtonText = "次へ",
  } = props;

  const defaultOnPress = () => {};

  const shouldShowPrevButton = props.hasPreviousButton !== false;
  const shouldShowNextButton = props.hasNextButton !== false;
  const showNextIcon = props.showNextIcon !== false;
  const isFinalIndex = currentIndex === slides.length - 1;

  return (
    <View style={[styles.footerContainer, props.style]}>
      <View
        style={[
          styles.buttonContainer,
          shouldShowPrevButton
            ? { justifyContent: "space-between" }
            : { justifyContent: "flex-end" },
        ]}
      >
        {shouldShowPrevButton && (
          <Button
            text={leftButtonText}
            onPress={props.onPressPrevious}
            style={styles.buttonBack}
            type="ButtonLGray"
            textSize={ButtonLargeBold.size}
            icon={
              <Entypo
                name="chevron-left"
                size={48}
                color="black"
                style={styles.iconStyle}
              />
            }
            iconPosition="front"
          />
        )}
        {shouldShowNextButton && !isFinalIndex && (
          <Button
            text={rightButtonText}
            onPress={props.onPressNext}
            style={styles.buttonNext}
            type="ButtonMPrimary"
            textSize={ButtonLargeBold.size}
            icon={
              showNextIcon && shouldShowNextButton && !isFinalIndex ? (
                <Entypo
                  name="chevron-right"
                  size={48}
                  color={colors.secondary}
                  style={styles.iconStyle}
                />
              ) : null
            }
            iconPosition="behind"
          />
        )}
        {shouldShowNextButton && isFinalIndex && (
          <Button
            text="読み取りへ"
            onPress={props.onPress || defaultOnPress}
            style={styles.buttonNext}
            type="ButtonMPrimary"
            textSize={ButtonLargeBold.size}
            icon={
              <Entypo
                name="chevron-right"
                size={48}
                color={colors.secondary}
                style={styles.iconStyle}
              />
            }
            iconPosition="behind"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: colors.secondary,
    ...Platform.select({
      ios: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 7,
      },
      android: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 7,
      },
      web: {
        boxShadow: "0 2px 2px rgba(8, 18, 26, 0.08)",
      },
    }),
    justifyContent: "center",
  },
  buttonContainer: {
    height: 100,
    display: "flex",
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  buttonBack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 261,
    height: 68,
    lineHeight: ButtonLargeBold.lineHeight,
    fontSize: ButtonLargeBold.size,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    gap: 8,
  },
  buttonNext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 260,
    height: 68,
    borderRadius: 8,
    gap: 8,
  },
  iconStyle: {
    width: 48,
    height: 48,
  },
});
