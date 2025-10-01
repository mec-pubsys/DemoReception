import React, { Component, useState } from "react";
import { StyleSheet, Modal, View, Pressable } from "react-native";
import { HiraginoKakuText } from "../StyledText";
import { HeadingXxxSmallBold } from "../../styles/typography";
import { colors } from "../../styles/color";
import { Button } from "./Button";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface ModalProps {
  modalHeight: Int32;
  text?: string;
  firstButtonText: string;
  firstButtonType?: string;
  secondButtonText: string;
  secondButtonType?: string;
  firstButtonDisable: boolean;
  secondButtonDisable: boolean;
  onFirstButtonPress: () => void;
  onSecondButtonPress: () => void;
  handleSecondButtonEnable: () => void;
  children?: React.ReactNode;
  toggleModal: () => void;
}

class ModalComponent extends Component<ModalProps> {
  static defaultProps: Partial<ModalProps> = {
    text: "",
    firstButtonText: "",
    secondButtonText: "",
    firstButtonDisable: false,
    secondButtonDisable: false,
  };

  state = {
    modalVisible: true,
  };

  toggleModalVisibility = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
    this.props.toggleModal();
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <Modal transparent={true} visible={modalVisible}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.modalBackground}
          scrollEnabled={false}
        >
          <View
            style={[styles.modalContainer, { height: this.props.modalHeight }]}
          >
            <View style={styles.modalHeader}>
              <HiraginoKakuText style={styles.headerText}>
                {this.props.text}
              </HiraginoKakuText>
              <View style={styles.headerButtonContainer}>
                <Pressable
                  style={styles.closeButton}
                  onPress={this.toggleModalVisibility}
                >
                  <Ionicons
                    name="close-sharp"
                    size={24}
                    style={styles.closeIcon}
                    color="black"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.modalBody}>{this.props.children}</View>
            <View style={styles.modalFooter}>
              <Button style={styles.blockSlot} text="" type="ButtonLText" />
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.modalButton}
                  text={this.props.firstButtonText}
                  type={
                    this.props.firstButtonDisable
                      ? "ButtonMDisable"
                      : "ButtonMGray"
                  }
                  onPress={this.props.onFirstButtonPress}
                />
                <Button
                  style={styles.modalButton}
                  text={this.props.secondButtonText}
                  type={
                    this.props.secondButtonDisable
                      ? "ButtonMDisable"
                      : "ButtonMPrimary"
                  }
                  onPress={this.props.onSecondButtonPress}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}
export default ModalComponent;

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: colors.transparentColor,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 545,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
  },
  modalHeader: {
    width: 545,
    height: 59,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    flexDirection: "row",
  },
  headerText: {
    width: 441,
    height: 27,
    fontSize: HeadingXxxSmallBold.size,
    lineHeight: HeadingXxxSmallBold.lineHeight,
    verticalAlign: "middle",
    color: colors.textColor,
  },
  headerButtonContainer: {
    width: 56,
    height: 24,
    gap: 8,
    backgroundColor: colors.secondary,
    verticalAlign: "middle",
  },
  closeButton: {
    width: 24,
    height: 24,
    alignSelf: "flex-end",
    alignItems: "center", 
  },
  closeIcon: {
    height: 24,
  },
  modalBody: {
    width: 545,
    paddingBottom: 24,
    backgroundColor: colors.secondary,
    gap: 16,
    flex: 1,
  },
  modalFooter: {
    width: 540,
    height: 76,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.secondary,
    borderTopWidth: 1,
    borderColor: colors.gray,
    flexDirection: "row",
  },
  blockSlot: {
    width: 22,
    height: 44,
  },
  buttonContainer: {
    width: 240,
    height: 44,
    gap: 16,
    flexDirection: "row",
  },
  modalButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
});
