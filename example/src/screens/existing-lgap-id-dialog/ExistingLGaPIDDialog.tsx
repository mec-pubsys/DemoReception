import React, { useEffect } from "react";
import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from "./ExistingLGaPIDDialogStyles";
import { HiraginoKakuText } from "../../components/StyledText";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

interface Props {
  onAccept: () => void;
  onCancel: () => void;
}

const ExistingLGaPIDDialog: React.FC<Props> = ({ onAccept, onCancel }) => {
  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'ExistingLGaPIDDialog', 'useEffect', 'screen open');
  }, []);

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.mainContainer}>
            <HiraginoKakuText style={styles.titleText}>
              すでに受付済みです
            </HiraginoKakuText>
            <View style={styles.messageContainer}>
              <HiraginoKakuText normal style={styles.messageText}>
                このまま受付を続けますか？ {"\n"}
                受付を続ける場合、すでに受付済みの内容は上書きされます。
              </HiraginoKakuText>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <HiraginoKakuText style={styles.buttonText}>
                続ける
              </HiraginoKakuText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={onCancel}>
              <HiraginoKakuText style={styles.cancelButtonText}>
                キャンセル
              </HiraginoKakuText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExistingLGaPIDDialog;
