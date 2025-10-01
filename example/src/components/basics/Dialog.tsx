import React, { Component } from "react";
import { StyleSheet, Modal, View, Platform} from "react-native";
import { HiraginoKakuText } from "./../StyledText";
import {
  HeadingSmallBold,
  HeadingXxSmallRegular,
  ButtonMediumBold,
} from "../../styles/typography";
import { colors } from "../../styles/color";
import { AntDesign } from "@expo/vector-icons";
import { Button } from "./Button";
import { Dimensions } from "react-native";

interface DialogProps {
  iconVisible?: boolean;
  iconColor?: string;
  dialogTitle?: string | React.ReactNode;
  text?: string | React.ReactNode;
  firstButtonText: string;
  firstButtonType?: string;
  secondButtonText: string;
  secondButtonType?: string;
  secondButtonVisible?: boolean;
  onFirstButtonPress: () => void;
  onSecondButtonPress: () => void;
  containerHeight: number;
  containerWidth: number;
  containerGap: number;
  headerHeight: number;
  headerPaddingTop: number;
  dialogBodyGap: number;
  btnContainerHeight: number;
  children?: React.ReactNode;
  dialogItemWidth: number;
  dialogBodyHeight: number;
}

class Dialog extends Component<DialogProps> {
  static defaultProps: Partial<DialogProps> = {
    iconVisible: true,
    iconColor: "green",
    secondButtonVisible: false,
    firstButtonText: "",
    secondButtonText: "",
    dialogBodyGap: 0,
    headerHeight: 0,
    headerPaddingTop: 0,
    containerWidth: 450,
    dialogItemWidth: 338,
    dialogBodyHeight: 258,
  };

  render() {
    const {
      iconVisible,
      iconColor,
      secondButtonVisible,
      onFirstButtonPress,
      onSecondButtonPress,
    } = this.props;
    
    return (
      <Modal transparent={true} visible={true} focusable={false}>
        <View style={styles.dialogBackGround}>
          <View
            style={[
              styles.dialogContainer,
              {
                height: this.props.containerHeight,
                width: this.props.containerWidth,
                gap: this.props.containerGap,
              },
            ]}
          >
            <View
              style={[
                styles.dialogHeader,
                {
                  height: this.props.headerHeight,
                  paddingTop: this.props.headerPaddingTop,
                },
              ]}
            >
              {(() => {
                if (iconVisible) {
                  if (iconColor === "green") {
                    return (
                      <View style={styles.dialogIconContainer}>
                        <AntDesign
                          name="checkcircle"
                          size={60}
                          style={styles.dialogIconGreen}
                        />
                      </View>
                    );
                  } else if (iconColor === "blue") {
                    return (
                      <View style={styles.dialogIconContainer}>
                        <AntDesign
                          name="checkcircle"
                          size={60}
                          style={styles.dialogIconBlue}
                        />
                      </View>
                    );
                  }
                }
                return null;
              })()}
            </View>
            <View
              style={[styles.dialogBody, { gap: this.props.dialogBodyGap, width: this.props.containerWidth, height: this.props.dialogBodyHeight }]}
            >
              {(() => {
                if (this.props.children == null) {
                  return (
                    <View style={[styles.dialogTextContainer, { width: this.props.dialogItemWidth }]}>
                      <HiraginoKakuText style={styles.dialogTitle}>
                        {this.props.dialogTitle}
                      </HiraginoKakuText>
                      <HiraginoKakuText style={styles.dialogText} normal>
                        {this.props.text}
                      </HiraginoKakuText>
                    </View>
                  );
                } else {
                  return (
                    <View style={[styles.dialogChildrenContainer, { width: this.props.dialogItemWidth, height: this.props.dialogBodyHeight }]}>
                      <HiraginoKakuText style={styles.dialogTitle}>
                        {this.props.dialogTitle}
                      </HiraginoKakuText>
                      {this.props.children}
                    </View>
                  );
                }
              })()}
              <View
                style={[
                  styles.buttonContainer,
                  { height: this.props.btnContainerHeight, width: this.props.dialogItemWidth },
                ]}
              >
                <Button
                  style={styles.dialogButton}
                  onPress={onFirstButtonPress}
                  text={this.props.firstButtonText}
                  type="ButtonLPrimary"
                  buttonWidth = {this.props.dialogItemWidth}
                />
                {(() => {
                  if (this.props.secondButtonVisible) {
                    return (
                      <Button
                        style={styles.dialogButton}
                        onPress={onSecondButtonPress}
                        text={this.props.secondButtonText}
                        type="ButtonLText"
                        buttonWidth = {this.props.dialogItemWidth}
                      />
                    );
                  }
                  return null;
                })()}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
export default Dialog;

const { width, height } = Dimensions.get("window");
const isLandscape = width > height;

export const styles = StyleSheet.create({
  dialogBackGround: {
    flex: 1,
    backgroundColor: colors.transparentColor,
    justifyContent: "center",
    alignItems: "center"
  },
  dialogContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    
    ...Platform.select({
      ios: {
        maxHeight: isLandscape ? (width === 1133 ? 670 : 'auto'): 'auto'
      },
    }),
  },
  dialogHeader: {
    width: 450,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingRight: 24,
    paddingBottom: 0,
    paddingLeft: 24,
    backgroundColor: colors.secondary,
  },
  dialogBody: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 56,
    paddingBottom: 40,
    backgroundColor: colors.secondary,
  },
  dialogIconContainer: {
    width: 72,
    height: 72,
    backgroundColor: colors.secondary,
  },
  dialogIconGreen: {
    width: 60,
    height: 60,
    left: 6,
    top: 6,
    color: "rgba(15, 169, 110, 1)",
  },
  dialogIconBlue: {
    width: 60,
    height: 60,
    left: 6,
    top: 6,
    color: "rgba(72, 161, 242, 1)",
  },
  dialogTitle: {
    fontSize: HeadingSmallBold.size,
    lineHeight: HeadingSmallBold.lineHeight,
    color: colors.textColor,
    textAlign: "center",
  },
  dialogTextContainer: {
    height: 126,
    gap: 16,
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  dialogText: {
    fontSize: HeadingXxSmallRegular.size,
    lineHeight: 34,
    color: colors.blackText,
  },
  dialogChildrenContainer: {
    gap: 32,
    alignItems: "center",
    backgroundColor: colors.secondary,
  },
  buttonContainer: {
    gap: 16,
    backgroundColor: colors.secondary,
  },
  dialogButton: {
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    lineHeight: ButtonMediumBold.lineHeight,
    gap: 8,
  },
});
