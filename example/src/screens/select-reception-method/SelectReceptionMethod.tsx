import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { HiraginoKakuText } from "../../components/StyledText";
import styles from "./SelectReceptionMethodStyles";
import { Header } from "../../components/basics/header";
import { AntDesign } from "@expo/vector-icons";
import { Certification } from "../certification/Certification";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { PravicyConsent } from "../privacy-consent/PrivacyConsent";
import { fetchEventNameById } from "./SelectReceptionMethodService";
import { SelectReceptionMethodParams } from "./SelectReceptionMethodParams";
import { SelfqrDescriptionParams } from "../serlfqr-description/SelfqrDescriptionParams";
import { CheckInParams } from "../check-in/CheckInParams";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};
type Params = {
  selectReceptionMethodParams: SelectReceptionMethodParams;
};

export const SelectReceptionMethod = ({ navigation }: Props) => {
  const route = useRoute();
  let { selectReceptionMethodParams } = route.params as Params;

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isCertificationModalVisible, setCertificationModalVisible] =
    useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isPrivacyManualModalVisible, setPrivacyManualModalVisible] =
    useState(false);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(selectReceptionMethodParams.user, 'SelectReceptionMethod', 'useEffect', 'screen open');
    handleEventNameRead();
  });

  const showMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    if (isMenuVisible && !isCertificationModalVisible) {
      setMenuVisible(false);
    }
  };

  const showCertification = () => {
    setMenuVisible(false);
    setCertificationModalVisible(!isCertificationModalVisible);
  };

  const handleCancelButton = () => {
    setCertificationModalVisible(false);
  };

  const handleQrContainer = () => {
    setPrivacyModalVisible(true);
  };

  const handleQrCodeContainer = () => {
    setPrivacyManualModalVisible(true);
  };

  const handleAgree = () => {
    setPrivacyModalVisible(false);

    const selfqrDescriptionParams = new SelfqrDescriptionParams();
    selfqrDescriptionParams.user.userId =
      selectReceptionMethodParams.user.userId;
    selfqrDescriptionParams.eventId = selectReceptionMethodParams.eventId;
    selfqrDescriptionParams.venueId = selectReceptionMethodParams.venueId;
    selfqrDescriptionParams.receptionTypeCode = "1";

    navigation.navigate("SelfqrDescription", {
      selfqrDescriptionParams,
    });
    ActivityLogger.insertInfoLogEntry(selectReceptionMethodParams.user, 'SelectReceptionMethod', 'handleAgree', 'transition', 'SelfqrDescription', selfqrDescriptionParams);
  };

  const handleManualAgree = () => {
    setPrivacyManualModalVisible(false);

    const checkInParams = new CheckInParams();
    checkInParams.user.userId = selectReceptionMethodParams.user.userId;
    checkInParams.eventId = selectReceptionMethodParams.eventId;
    checkInParams.venueId = selectReceptionMethodParams.venueId;
    checkInParams.receptionTypeCode = "2";

    navigation.navigate("CheckIn", {
      checkInParams,
    });
    ActivityLogger.insertInfoLogEntry(selectReceptionMethodParams.user, 'SelectReceptionMethod', 'handleManualAgree', 'transition', 'CheckIn', checkInParams);
  };

  const handleDisagree = () => {
    setPrivacyModalVisible(false);

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(selectReceptionMethodParams.user, 'SelectReceptionMethod', 'handleDisagree', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };
  const handleManualDisagree = () => {
    setPrivacyManualModalVisible(false);

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(selectReceptionMethodParams.user, 'SelectReceptionMethod', 'handleManualDisagree', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  //AWS
  const [eventName, setEventName] = useState<any[]>([]);

  const handleEventNameRead = async () => {
    const result = await fetchEventNameById(
      selectReceptionMethodParams.eventId
    );
    if (result.data) {
      var getEventName = result.data[0].name;
      setEventName(getEventName);
    } else {
      console.log("Error: イベントIDには該当するイベント名がありません。");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          titleName="受付"
          buttonName=""
          buttonWidth={52}
          onPress={showMenu}
          icon={
            <AntDesign
              name="ellipsis1"
              size={28}
              style={styles.dotIcon}
              color="black"
            />
          }
          iconPosition="center"
        ></Header>
        <View style={styles.bodyContainer}>
          <View style={styles.bodyTextContainer}>
            <HiraginoKakuText style={styles.bodyText}>
              [{eventName}]の
            </HiraginoKakuText>
            <HiraginoKakuText style={styles.bodyText}>
              受付方法を選択してください
            </HiraginoKakuText>
          </View>
          <View style={styles.selectionContainer}>
            <Pressable style={styles.qrContainer} onPress={handleQrContainer}>
              <View style={styles.qrRemark}>
                <HiraginoKakuText style={styles.qrRemarkText}>
                  ご利用には、[自治体アプリ]が必要です
                </HiraginoKakuText>
              </View>
              <View style={styles.qrCode}>
                <Image
                  source={require("../../assets/images/qr_code.png")}
                  style={styles.qrImage}
                ></Image>
              </View>
              <HiraginoKakuText style={styles.qrText}>
                自己QRで受付
              </HiraginoKakuText>
            </Pressable>
            <Pressable
              style={styles.inputContainer}
              onPress={handleQrCodeContainer}
            >
              <View style={styles.qrCode}>
                <Image
                  source={require("../../assets/images/input.png")}
                  style={styles.inputImage}
                ></Image>
              </View>
              <HiraginoKakuText style={styles.inputText}>
                この場で入力して受付
              </HiraginoKakuText>
            </Pressable>
          </View>
        </View>
        {isMenuVisible && (
          <Pressable style={styles.menu} onPress={showCertification}>
            <HiraginoKakuText style={styles.menuLabel} normal>
              {" "}
              管理者画面へ
            </HiraginoKakuText>
          </Pressable>
        )}
        {isCertificationModalVisible && (
          <Certification
            onCancelButtonPress={handleCancelButton}
            toggleModal={showCertification}
            navigation={navigation}
            user={selectReceptionMethodParams.user}
          />
        )}
        {isPrivacyModalVisible && (
          <PravicyConsent
            onHandleAgree={handleAgree}
            onHandleDisagree={handleDisagree}
          />
        )}
        {isPrivacyManualModalVisible && (
          <PravicyConsent
            onHandleAgree={handleManualAgree}
            onHandleDisagree={handleManualDisagree}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
