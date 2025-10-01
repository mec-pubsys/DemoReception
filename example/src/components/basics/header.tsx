import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { HiraginoKakuText } from "../StyledText";
import { HeadingLargeBold, ButtonMediumBold } from "../../styles/typography";
import { colors } from "../../styles/color";
import { Button } from "./Button";
 
type HeaderProps = {
  titleName: string;
  buttonName: string;
  buttonWidth?: number;
  icon?: React.ReactNode;
  iconPosition?: string;
  onPress?: () => void;
  hasButton?: boolean;
};
 
export const Header = (props: HeaderProps) => {
  const defaultOnPress = () => {};
  const shouldShowButton = props.hasButton !== false;
 
  return (
    <View style={styles.headerContainer}>
      <View style={styles.secondContainer}>
        <HiraginoKakuText style={styles.headerText}>
          {props.titleName}
        </HiraginoKakuText>
        {shouldShowButton && (
          <Button
            text={props.buttonName}
            onPress={props.onPress || defaultOnPress}
            style={styles.buttonStop}
            type="ButtonLGray"
            buttonWidth={(props.buttonWidth ?? 0) > 0 ? props.buttonWidth : 176}
            icon={props.icon}
            iconPosition={"center"}
          />
        )}
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  headerContainer: {
    ...Platform.select({
      ios: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 7,
      },
      android: {
        shadowColor: colors.headerFooterShadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 6,
      },
      web: {
        boxShadow: "0 1px 7px 0px rgba(8, 18, 26, 0.08)",
        paddingVertical: 24,
      },
    }),
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderTopColor: colors.secondary,
    borderRightColor: colors.secondary,
    borderBottomColor: colors.headerFooterShadowColor,
    borderLeftColor: colors.secondary,
  },
  secondContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        paddingVertical: 16,
      },
      android: {
        paddingVertical: 16,
      },
    }),
    paddingHorizontal: 40,
  },
  headerText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    fontSize: HeadingLargeBold.size,
    lineHeight: 50.4,
    color: colors.blackText,
  },
  buttonStop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 176,
    height: 52,
    lineHeight: ButtonMediumBold.lineHeight,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
  },
});