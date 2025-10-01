import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StatusBar,
  SafeAreaView,
  Modal,
} from "react-native";
import { HiraginoKakuText } from "../../components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import styles from "./LoginStyles";
import { colors } from "../../styles/color";
import ModalPopup from "../completion/Completion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "../../components/basics/Button";
import { NavigationProp } from "@react-navigation/native";
import { realtimeDB } from "../../config/firebaseConfig";
import { get, ref } from "firebase/database";
import * as crypto from "crypto-js";
import { EventListParams } from "../event-list/EventListParams";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

export const Login = ({ navigation }: Props) => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputNotEmpty, setInputNotEmpty] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Login', 'useEffect', 'screen open');
  }, []);

  const checkLogin = () => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Login', 'checkLogin', 'login', '', null, '', 'userid=' + userid + ',password=' + password);

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
                navigation.navigate("EventList", { eventListParams });
                ActivityLogger.insertInfoLogEntry(user, 'Login', 'checkLogin', 'transition', 'EventList', eventListParams);
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

  useEffect(() => {
    let timeOut = setTimeout(() => {
      closeModal();
    }, 10000);
    return () => clearTimeout(timeOut);
  });

  const openCompletionModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleFirstButton = () => {
    setLogoutModalVisible(false);
  };

  const handleSecondButton = () => {
    setLogoutModalVisible(false);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, width: "100%" }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.mainContainer}
      scrollEnabled={false}
    >
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.headerContainer}>
          <HiraginoKakuText style={styles.headerText}>
            受付システム
          </HiraginoKakuText>
        </View>
        <View style={styles.bodyContainer}>
          <HiraginoKakuText style={styles.loginText}>ログイン</HiraginoKakuText>
          <View style={styles.infoBox}>
            <View style={styles.inputContainer}>
              <View style={styles.labelInputSetBox}>
                <HiraginoKakuText style={styles.label}>ID</HiraginoKakuText>
                <TextInput
                  style={styles.input}
                  placeholder="ID"
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={(text) => handleInputChange(text, false)}
                  value={userid}
                />
              </View>

              <View style={styles.labelInputSetBox}>
                <HiraginoKakuText style={styles.label}>
                  パスワード
                </HiraginoKakuText>
                <View>
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="パスワード"
                    placeholderTextColor={colors.placeholderTextColor}
                    value={password}
                    onChangeText={(text) => handleInputChange(text, true)}
                    style={[styles.input, styles.inputPassword]}
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
            <Button
              text="ログイン"
              onPress={checkLogin}
              style={styles.buttonLogin}
              type={inputNotEmpty ? "ButtonMPrimary" : "ButtonMDisable"}
            />
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <ModalPopup closeModal={closeModal} />
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};
