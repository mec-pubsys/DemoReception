import React, { useEffect, useState } from "react";
import { View } from "../../components/Themed";
import { HiraginoKakuText } from "../../components/StyledText";
import styles from "./CertificationStyles";
import ModalComponent from "../../components/basics/ModalComponent";
import { TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/color";
import { NavigationProp } from "@react-navigation/native";
import { realtimeDB } from "../../config/firebaseConfig";
import { get, ref } from "firebase/database";
import * as crypto from "crypto-js";
import { EventListParams } from "../event-list/EventListParams";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type CertificationProps = {
  onCancelButtonPress?: () => void;
  toggleModal?: () => void;
  navigation: NavigationProp<any>;
  user: User;
};

export const Certification = (props: CertificationProps) => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputNotEmpty, setInputNotEmpty] = useState(false);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Certificatin', 'useEffect', 'screen open');
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (text: string, isPassword: boolean = false) => {
    if (isPassword) {
      setPassword(text);
      setInputNotEmpty(userid.trim().length > 0 && text.trim().length > 0);
    } else {
      setUserId(text);
      setInputNotEmpty(text.trim().length > 0 && password.trim().length > 0);
    }
  };

  const handleLoginVerification = () => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Certificatin', 'handleLoginVerification', 'login', '', null, '', 'userid=' + userid + ',password=' + password);

    const userRef = ref(realtimeDB, "baseMember");
    // 'baseMember'ノードからデータをフェッチする
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();

          // ログインをチェック
          let loggedIn = false;
          for (const userId in userData) {
            if (userData.hasOwnProperty(userId)) {
              const user = userData[userId];
              let hashpassword = crypto
                .SHA256(password)
                .toString(crypto.enc.Hex);
              if (user.id === userid && user.password === hashpassword) {
                loggedIn = true;
                setErrorMessage("");

                const eventListParams = new EventListParams();
                const user = new User();
                user.userId = userid;
                eventListParams.user = user;
                props.navigation.navigate("EventList", { eventListParams });
                ActivityLogger.insertInfoLogEntry(user, 'Certificatin', 'handleLoginVerification', 'transition', 'EventList', eventListParams);
                console.log("ログイン成功");
                break;
              }
            }
          }
          if (!loggedIn) {
            setErrorMessage("IDまたはパスワードが正しくありません");
            console.log("IDまたはパスワードが正しくありません");
          }
        } else {
          console.log("ユーザーデータが見つかりません");
        }
      })
      .catch((error) => {
        console.error("ユーザーデータの取得に失敗しました", error);
      });
  };

  return (
    <ModalComponent
      text="管理者画面"
      firstButtonText="キャンセル"
      secondButtonText="ログイン"
      onFirstButtonPress={props.onCancelButtonPress}
      onSecondButtonPress={handleLoginVerification}
      modalHeight={errorMessage !== "" ? 434 : 402}
      toggleModal={props.toggleModal}
      secondButtonDisable={!inputNotEmpty}
    >
      <form autoComplete="off">
        <View style={styles.bodyContainer}>
          <HiraginoKakuText style={styles.bodyText} normal>
            管理者画面への移動は、ログインが必要です。
          </HiraginoKakuText>
          <View style={styles.inputContainer}>
            <View style={styles.inputItem}>
              <HiraginoKakuText style={styles.headingText}>ID</HiraginoKakuText>
              <TextInput
                style={styles.idInput}
                placeholder="ID"
                onChangeText={(text) => handleInputChange(text, false)}
                value={userid}
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>
            <View style={styles.inputItem}>
              <HiraginoKakuText style={styles.headingText}>
                パスワード
              </HiraginoKakuText>
              <View style={[styles.pwContainer]}>
                <TextInput
                  style={styles.pwInput}
                  secureTextEntry={!showPassword}
                  placeholder="パスワード"
                  placeholderTextColor={colors.placeholderTextColor}
                  value={password}
                  onChangeText={(text) => handleInputChange(text, true)}
                />
                <Pressable
                  style={styles.eyeIconContainer}
                  onPress={togglePasswordVisibility}
                  hitSlop={16}
                >
                  {showPassword ? (
                    <Ionicons
                      name="eye"
                      size={24}
                      color="black"
                      style={styles.eyeIcon}
                    />
                  ) : (
                    <Ionicons
                      name="eye-off"
                      size={24}
                      color="black"
                      style={styles.eyeIcon}
                    />
                  )}
                </Pressable>
                <View style={styles.messageContainer}>
                  {errorMessage !== "" && (
                    <HiraginoKakuText style={styles.errorMessage} normal>
                      {errorMessage}
                    </HiraginoKakuText>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </form>
    </ModalComponent>
  );
};
