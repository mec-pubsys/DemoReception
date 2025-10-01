import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import styles from "./CheckInConfirmationStyles";
import { StatusBar } from "react-native";
import { Header } from "../../components/basics/header";
import { HiraginoKakuText } from "../../components/StyledText";
import { Footer } from "../../components/basics/footer";
import { Button } from "../../components/basics/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/color";
import Completion from "../completion/Completion";
import { NavigationProp, useRoute } from "@react-navigation/native";
import {
  deleteDataFromReception,
  fetchGenderName,
  getCountOfReceivedItems,
  getReceptionId,
  insertIntoReceptionHistory,
  insertReceptionData,
} from "./CheckInConfirmationService";
import { format } from "date-fns";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { CheckInConfirmationParams } from "./CheckInConfirmationParams";
import { CheckInEditParams } from "../check-in-edit/CheckInEditParams";
import ExistingLGaPIDDialog from "../existing-lgap-id-dialog/ExistingLGaPIDDialog";
import { DeviceInfo } from "../../environments/DeviceInfo";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

type Params = {
  checkInConfirmationParams: CheckInConfirmationParams;
};

export const CheckInConfirmation = ({ navigation }: Props) => {
  const route = useRoute();
  const { checkInConfirmationParams } = route.params as Params;
  const lgapId = checkInConfirmationParams.entrantRecord.originalEntrant.lgapId;
  const DEVICE_ID = DeviceInfo();

  const [isModalVisible, setModalVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isLgapIdDialogVisible, setIsLgapIdDialogVisible] = useState(false);
  const [postCode, setPostCode] = useState("");
  const [formattedDate, setformattedDate] = useState("");

  const handleCompletion = async () => {
    try {
      const acceptedItemsCount = await fetchCountOfReceivedItems(
        checkInConfirmationParams.eventId,
        lgapId
      );
      setIsLgapIdDialogVisible(false);

      if (acceptedItemsCount > 0) {
        const クエリ結果_target_reception_ids = await getReceptionId(
          checkInConfirmationParams.eventId,
          lgapId
        );

        if (クエリ結果_target_reception_ids.data.length > 0) {
          try {
            const receptionIDs = クエリ結果_target_reception_ids.data;
            const result = await insertIntoReceptionHistory(
              checkInConfirmationParams.eventId,
              receptionIDs
            );
            if (result.message == "success") {
              const d = await deleteDataFromReception(
                checkInConfirmationParams.eventId,
                receptionIDs
              );
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      }
      openCompletionModal();
    } catch (error) {
      console.error("Error fetching count of received items:", error);
    }
  };

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(checkInConfirmationParams.user, 'CheckInConfirmation', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    //LGaP_ID
    if (lgapId && checkInConfirmationParams.isScanner) {
      fetchCountOfReceivedItems(checkInConfirmationParams.eventId, lgapId);
    }
    const entrantDateOfBirth =
      checkInConfirmationParams.entrantRecord.modifiedEntrant.dateOfBirth;
    let formattedDate: string;

    if (entrantDateOfBirth) {
      formattedDate = format(entrantDateOfBirth, "yyyy年MM月dd日");
    } else {
      formattedDate = "Invalid date";
    }

    setformattedDate(formattedDate);

    const formattedPostCode =
      checkInConfirmationParams.entrantRecord.modifiedEntrant.postalCode.replace(
        "-",
        ""
      );
    setPostCode(formattedPostCode);
    // get Gender
    fetchGenderNamebyGenderCode(
      checkInConfirmationParams.entrantRecord.modifiedEntrant.genderCode
    );
  }, [formattedDate, checkInConfirmationParams]);
  useEffect(() => {
    if (isModalVisible === true) {
      let timeOut = setTimeout(() => {
        closeModal();
      }, 10000);
      return () => clearTimeout(timeOut);
    }
  });

  const openCompletionModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    handleReceptionInsert();
    setModalVisible(false);
  };

  const handleEdit = () => {
    const checkInEditParams = new CheckInEditParams();
    checkInEditParams.user = checkInConfirmationParams.user;
    checkInEditParams.eventId = checkInConfirmationParams.eventId;
    checkInEditParams.venueId = checkInConfirmationParams.venueId;
    checkInEditParams.entrantRecord = checkInConfirmationParams.entrantRecord;
    checkInEditParams.entrantRecord.originalEntrant =
      checkInConfirmationParams.entrantRecord.originalEntrant;

    navigation.navigate("CheckInEdit", {
      checkInEditParams,
    });
    ActivityLogger.insertInfoLogEntry(checkInConfirmationParams.user, 'CheckInConfirmation', 'handleEdit', 'transition', 'CheckInEdit', checkInEditParams);    
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.user = checkInConfirmationParams.user;
    selectReceptionMethodParams.eventId = checkInConfirmationParams.eventId;
    selectReceptionMethodParams.venueId = checkInConfirmationParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      checkInConfirmationParams.entrantRecord.modifiedEntrant.receptionTypeCode;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(checkInConfirmationParams.user, 'CheckInConfirmation', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  const onLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;

    if (height > 400) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  };
  //AWS
  const [genderName, setGenderName] = useState<string>();
  const [message, setMessage] = useState<string>();

  // INSERTION RECEPTION
  const handleReceptionInsert = async () => {
    try {
      const result = await insertReceptionData(
        checkInConfirmationParams.eventId,
        checkInConfirmationParams.venueId,
        checkInConfirmationParams.user.userId,
        DEVICE_ID, // Temp acceptedTerminalId
        checkInConfirmationParams.entrantRecord.modifiedEntrant.lgapId,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.userRank,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.lastName,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.firstName,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.lastNameKana,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.firstNameKana,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.dateOfBirth,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.genderCode,
        postCode,
        checkInConfirmationParams.entrantRecord.modifiedEntrant.address,
        checkInConfirmationParams.entrantRecord.modifiedEntrant
          .receptionTypeCode
      );

      const message = result.message;
      if (message === "success") {
        const selectReceptionMethodParams = new SelectReceptionMethodParams();
        selectReceptionMethodParams.user = checkInConfirmationParams.user;
        selectReceptionMethodParams.eventId = checkInConfirmationParams.eventId;
        selectReceptionMethodParams.venueId = checkInConfirmationParams.venueId;
        selectReceptionMethodParams.receptionTypeCode =
          checkInConfirmationParams.entrantRecord.modifiedEntrant.receptionTypeCode;
        navigation.navigate("SelectReceptionMethod", {
          selectReceptionMethodParams,
        });
        ActivityLogger.insertInfoLogEntry(checkInConfirmationParams.user, 'CheckInConfirmation', 'handleReceptionInsert', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
        setMessage("Inserted Successfully!!");
      } else {
        setMessage(message);
      }
    } catch (error) {
      console.error("Error from ReceptionCreateFun:", error);
    }
  };
  const fetchGenderNamebyGenderCode = async (genderCode: string) => {
    try {
      const result = await fetchGenderName(genderCode);
      const message = result.message;
      if (message === "success") {
        setMessage("Optained Successfully!!");
        setGenderName(result.data[0].name);
      } else {
        setMessage(message);
      }
    } catch (error) {
      console.error("Error from GetGenderNameFun:", error);
    }
  };

  // LGaP_ID
  const fetchCountOfReceivedItems = async (eventId: number, lgapId: string) => {
    try {
      const クエリ結果_受付済み件数 = await getCountOfReceivedItems(
        eventId,
        lgapId
      );

      if (クエリ結果_受付済み件数.data.length > 0) {
        const count = クエリ結果_受付済み件数.data[0].count;

        if (count > 0) {
          setIsLgapIdDialogVisible(true);
          return count;
        } else {
          return 0;
        }
      } else {
        console.warn("No data received from getCountOfReceivedItems");
        return 0;
      }
    } catch (error) {
      console.error("Error from fetchCountOfReceivedItems:", error);
      return 0;
    }
  };

  const handleAccept = () => {
    setIsLgapIdDialogVisible(false);
  };

  const handleCancel = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.user = checkInConfirmationParams.user;
    selectReceptionMethodParams.eventId = checkInConfirmationParams.eventId;
    selectReceptionMethodParams.venueId = checkInConfirmationParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      checkInConfirmationParams.entrantRecord.modifiedEntrant.receptionTypeCode;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content"></StatusBar>
      <Header
        titleName="受付内容確認"
        buttonName="受付をやめる"
        onPress={handleSelectReceptionMethod}
      ></Header>
      <ScrollView scrollEnabled={scrollEnabled}>
        <View style={styles.bodyContainer}>
          <View style={styles.innerMainTitle}>
            <HiraginoKakuText style={styles.innerMainTitleText}>
              この内容で受付しますか？
            </HiraginoKakuText>
          </View>

          <View style={styles.innerBodyContainer} onLayout={onLayoutHandler}>
            <View style={styles.bodyTitle}>
              <HiraginoKakuText style={styles.bodyTitleText}>
                受付内容
              </HiraginoKakuText>
              <View style={styles.buttonContainer}>
                <Button
                  text="内容を修正する"
                  type="ButtonMSecondary"
                  style={styles.btnModify}
                  icon={
                    <MaterialIcons
                      name="mode-edit"
                      size={24}
                      color={colors.primary}
                      style={styles.iconStyle}
                    />
                  }
                  iconPosition="behind"
                  onPress={handleEdit}
                ></Button>
              </View>
            </View>
            <View style={styles.rowGroup}>
              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.firstContent}>
                    <HiraginoKakuText style={styles.innerBodyBoldText}>
                      お名前
                    </HiraginoKakuText>
                  </View>
                  <View
                    style={
                      !checkInConfirmationParams.entrantRecord.modifiedFlags
                        .isNameModified
                        ? styles.secondContent
                        : styles.secondContentCorrected
                    }
                  >
                    <HiraginoKakuText style={styles.innerBodyText} normal>
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .lastName
                      }
                      {"　"}
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .firstName
                      }
                    </HiraginoKakuText>
                  </View>
                </View>
                {checkInConfirmationParams.entrantRecord.modifiedFlags
                  .isNameModified && (
                  <View style={styles.correctedBadge}>
                    <HiraginoKakuText style={styles.correctedText}>
                      修正済
                    </HiraginoKakuText>
                  </View>
                )}
              </View>
              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.firstContent}>
                    <HiraginoKakuText style={styles.innerBodyBoldText}>
                      お名前（カナ）
                    </HiraginoKakuText>
                  </View>
                  <View
                    style={
                      !checkInConfirmationParams.entrantRecord.modifiedFlags
                        .isKanaNameModified
                        ? styles.secondContent
                        : styles.secondContentCorrected
                    }
                  >
                    <HiraginoKakuText style={styles.innerBodyText} normal>
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .lastNameKana
                      }
                      {"　"}
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .firstNameKana
                      }
                    </HiraginoKakuText>
                  </View>
                </View>
                {checkInConfirmationParams.entrantRecord.modifiedFlags
                  .isKanaNameModified && (
                  <View style={styles.correctedBadge}>
                    <HiraginoKakuText style={styles.correctedText}>
                      修正済
                    </HiraginoKakuText>
                  </View>
                )}
              </View>
              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.firstContent}>
                    <HiraginoKakuText style={styles.innerBodyBoldText}>
                      生年月日
                    </HiraginoKakuText>
                  </View>
                  <View
                    style={
                      !checkInConfirmationParams.entrantRecord.modifiedFlags
                        .isDateOfBirthModified
                        ? styles.secondContent
                        : styles.secondContentCorrected
                    }
                  >
                    <HiraginoKakuText style={styles.innerBodyText} normal>
                      {formattedDate}
                    </HiraginoKakuText>
                  </View>
                </View>
                {checkInConfirmationParams.entrantRecord.modifiedFlags
                  .isDateOfBirthModified && (
                  <View style={styles.correctedBadge}>
                    <HiraginoKakuText style={styles.correctedText}>
                      修正済
                    </HiraginoKakuText>
                  </View>
                )}
              </View>
              {/* // 性別(Female/male/other) is optional. */}
              {checkInConfirmationParams.entrantRecord.modifiedEntrant
                .genderCode != "0" && (
                <View style={styles.row}>
                  <View style={styles.rowContent}>
                    <View style={styles.firstContent}>
                      <HiraginoKakuText style={styles.innerBodyBoldText}>
                        性別
                      </HiraginoKakuText>
                    </View>
                    <View
                      style={
                        !checkInConfirmationParams.entrantRecord.modifiedFlags
                          .isGenderModified
                          ? styles.secondContent
                          : styles.secondContentCorrected
                      }
                    >
                      <HiraginoKakuText style={styles.innerBodyText} normal>
                        {genderName}
                      </HiraginoKakuText>
                    </View>
                  </View>
                  {checkInConfirmationParams.entrantRecord.modifiedFlags
                    .isGenderModified && (
                    <View style={styles.correctedBadge}>
                      <HiraginoKakuText style={styles.correctedText}>
                        修正済
                      </HiraginoKakuText>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.firstContent}>
                    <HiraginoKakuText style={styles.innerBodyBoldText}>
                      郵便番号
                    </HiraginoKakuText>
                  </View>
                  <View
                    style={
                      !checkInConfirmationParams.entrantRecord.modifiedFlags
                        .isPostalCodeModified
                        ? styles.secondContent
                        : styles.secondContentCorrected
                    }
                  >
                    <HiraginoKakuText style={styles.innerBodyText} normal>
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .postalCode
                      }
                    </HiraginoKakuText>
                  </View>
                </View>
                {checkInConfirmationParams.entrantRecord.modifiedFlags
                  .isPostalCodeModified && (
                  <View style={styles.correctedBadge}>
                    <HiraginoKakuText style={styles.correctedText}>
                      修正済
                    </HiraginoKakuText>
                  </View>
                )}
              </View>
              <View style={styles.rowAddress}>
                <View style={styles.rowContent}>
                  <View style={styles.firstContent}>
                    <HiraginoKakuText style={styles.innerBodyBoldText}>
                      住所
                    </HiraginoKakuText>
                  </View>
                  <View
                    style={
                      !checkInConfirmationParams.entrantRecord.modifiedFlags
                        .isAddressModified
                        ? styles.secondContentAddress
                        : styles.secondContentAddressCorrected
                    }
                  >
                    <HiraginoKakuText style={styles.innerBodyText} normal>
                      {
                        checkInConfirmationParams.entrantRecord.modifiedEntrant
                          .address
                      }
                    </HiraginoKakuText>
                  </View>
                </View>
                {checkInConfirmationParams.entrantRecord.modifiedFlags
                  .isAddressModified && (
                  <View style={styles.correctedBadge}>
                    <HiraginoKakuText style={styles.correctedText}>
                      修正済
                    </HiraginoKakuText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        {isLgapIdDialogVisible && (
          <ExistingLGaPIDDialog
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        )}
      </ScrollView>
      <Footer
        rightButtonText="受付する"
        hasPreviousButton={false}
        showNextIcon={false}
        onPressNext={handleCompletion}
      ></Footer>
      {isModalVisible && <Completion closeModal={closeModal} />}
    </SafeAreaView>
  );
};

export default CheckInConfirmation;
