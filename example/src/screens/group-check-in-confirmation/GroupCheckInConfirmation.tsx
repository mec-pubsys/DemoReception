import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from "./GroupCheckInConfirmationStyles";
import { StatusBar } from "react-native";
import { Header } from "../../components/basics/header";
import { HiraginoKakuText } from "../../components/StyledText";
import { Footer } from "../../components/basics/footer";
import { Button } from "../../components/basics/Button";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "../../styles/color";
import Completion from "../completion/Completion";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { format } from "date-fns";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { GroupCheckInConfirmationParams } from "./GroupCheckInConfirmationParams";
import { GroupCheckInEditParams } from "../group-check-in-edit/GroupCheckInEditParams";
import {
  deleteDataFromReception,
  fetchGenderName,
  getCountOfReceivedItems,
  getReceptionId,
  insertIntoReceptionHistory,
  insertReceptionData,
  insertReceptionDataFamily,
} from "./GroupCheckInConfirmationService";
import { Entrant } from "../../models/Entrant";
import { ModifiedFlags } from "../../models/ModifiedFlags";
import ExistingLGaPIDDialog from "../existing-lgap-id-dialog/ExistingLGaPIDDialog";
import { DeviceInfo } from "../../environments/DeviceInfo";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};
type Params = {
  groupCheckInConfirmationParams: GroupCheckInConfirmationParams;
};

export const GroupCheckInConfirmation = ({ navigation }: Props) => {
  const route = useRoute();
  const { groupCheckInConfirmationParams } = route.params as Params;
  const lgapId =
    groupCheckInConfirmationParams.entrantRecordList.entrantRecordList[0]
      .originalEntrant.lgapId;
  const DEVICE_ID = DeviceInfo();

  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [scrollInfoEnabled, setScrollInfoEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLgapIdDialogVisible, setIsLgapIdDialogVisible] = useState(false);
  const [heightContainer, setHeightContainer] = useState<number | undefined>(
    undefined
  );
  let [selectedId, setSelectedId] = useState<number>(
    groupCheckInConfirmationParams.selectedEntrantIndex
  );
  const [layoutHeight, setLayoutHeight] = useState<number>(0);
  
  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(groupCheckInConfirmationParams.user, 'GroupCheckInConfirmation', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    //LGaP_ID
    if (lgapId && groupCheckInConfirmationParams.isScanner) {
      fetchCountOfReceivedItems(
        groupCheckInConfirmationParams.eventId,
        groupCheckInConfirmationParams.entrantRecordList.entrantRecordList[0]
          .originalEntrant.lgapId
      );
    }

    setSelectedId(groupCheckInConfirmationParams.selectedEntrantIndex);
    handleDivSelect(groupCheckInConfirmationParams.selectedEntrantIndex);
  }, [groupCheckInConfirmationParams]);

  useEffect(() => {
    if (isModalVisible === true) {
      let timeOut = setTimeout(() => {
        closeModal();
      }, 10000);
      return () => clearTimeout(timeOut);
    }
  });

  const onLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    if (height > 250) {
      setScrollEnabled(true);
    }
  };

  useEffect(() => {}, [layoutHeight]);

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
    selectReceptionMethodParams.eventId =
      groupCheckInConfirmationParams.eventId;
    selectReceptionMethodParams.venueId =
      groupCheckInConfirmationParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      groupCheckInConfirmationParams.receptionTypeCode;
    selectReceptionMethodParams.user = groupCheckInConfirmationParams.user;
    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
  };

  const onLayoutInfoHandler = (e: any) => {
    const { height } = e.nativeEvent.layout;
    setLayoutHeight(height);
    let percentheight = hp("48%") * 1;

    if ((height ?? 0) == 0) {
      setHeightContainer(undefined);
    } else if ((height ?? 0) >= percentheight) {
      setHeightContainer(percentheight);
    } else if ((height ?? 0) < percentheight) {
      setHeightContainer(undefined);
    }

    if (height > 300) {
      setScrollInfoEnabled(true);
    }
  };

  // prev next buttons' height
  const [topPosition, setTopPosition] = useState(0);

  const onLayoutBtnHandler = (e: any) => {
    let skipBtnPosition = hp("51%") / 2 - hp("3.2%");
    setTopPosition(skipBtnPosition);
    var { height } = e.nativeEvent.layout;
  };

  const [isLeftCircleVisible, setIsLeftCircleVisible] = useState(false);
  const [isRightCircleVisible, setIsRightCircleVisible] = useState(true);

  interface DataItem {
    id: number;
    lastName: string;
    firstName: string;
    originalEntrant: Entrant;
    modifiedEntrant: Entrant;
    modifiedFlags: ModifiedFlags;
  }
  //Asc by familyOrderNumber
  groupCheckInConfirmationParams.entrantRecordList.entrantRecordList =
    groupCheckInConfirmationParams.entrantRecordList.entrantRecordList.sort(
      (a, b) =>
        a.modifiedEntrant.familyOrderNumber -
        b.modifiedEntrant.familyOrderNumber
    );
  const transformedData: DataItem[] =
    groupCheckInConfirmationParams.entrantRecordList.entrantRecordList.map(
      (record, index) => ({
        id: record.modifiedEntrant.familyOrderNumber + 1,
        lastName: `${record.modifiedEntrant.lastName}`,
        firstName: `${record.modifiedEntrant.firstName}`,
        originalEntrant: record.originalEntrant,
        modifiedEntrant: record.modifiedEntrant,
        modifiedFlags: record.modifiedFlags,
      })
    );

  groupCheckInConfirmationParams.user = groupCheckInConfirmationParams.user;
  groupCheckInConfirmationParams.eventId =
    groupCheckInConfirmationParams.eventId;
  groupCheckInConfirmationParams.venueId =
    groupCheckInConfirmationParams.venueId;
  groupCheckInConfirmationParams.receptionTypeCode =
    groupCheckInConfirmationParams.receptionTypeCode;
  groupCheckInConfirmationParams.entrantRecordList =
    groupCheckInConfirmationParams.entrantRecordList;

  const handleDivSelect = (id: any) => {
    setSelectedId(id);
    if (id == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (id === transformedData[transformedData.length - 1].id) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
  };

  //Render Scroll Item(Left Container)
  const renderScrollItem = ({ item }: { item: DataItem }) => (
    <Pressable onPress={() => handleDivSelect(item.id)}>
      <View
        style={
          selectedId === item.id ? styles.btnSideDivActive : styles.btnSideDiv
        }
      >
        <View style={styles.scrollContent}>
          <HiraginoKakuText style={styles.count}>{item.id}.</HiraginoKakuText>
          <HiraginoKakuText
            numberOfLines={1}
            style={[
              styles.sideText,
              item.modifiedFlags.isNameModified ||
              item.modifiedFlags.isKanaNameModified ||
              item.modifiedFlags.isDateOfBirthModified ||
              item.modifiedFlags.isGenderModified ||
              item.modifiedFlags.isPostalCodeModified ||
              item.modifiedFlags.isAddressModified ||
              item.modifiedFlags.isRelationshipModified
                ? styles.sideTextWidthCorrected
                : styles.sideTextWidth,
            ]}
            normal
          >
            {item.modifiedEntrant.lastName}
            {"　"}
            {item.modifiedEntrant.firstName}
          </HiraginoKakuText>
        </View>

        {(item.modifiedFlags.isNameModified ||
          item.modifiedFlags.isKanaNameModified ||
          item.modifiedFlags.isDateOfBirthModified ||
          item.modifiedFlags.isGenderModified ||
          item.modifiedFlags.isPostalCodeModified ||
          item.modifiedFlags.isAddressModified ||
          item.modifiedFlags.isRelationshipModified) && (
          <View style={styles.correctedBadge}>
            <HiraginoKakuText style={styles.correctedText}>
              修正済
            </HiraginoKakuText>
          </View>
        )}
      </View>
    </Pressable>
  );

  //Previous Person Info
  const OnPreviousCirclePress = () => {
    let currentIndex = transformedData.findIndex(
      (item) => item.id === selectedId
    );
    if (currentIndex > 0) {
      let previousIndex = transformedData[currentIndex - 1].id;
      currentIndex = previousIndex;
      setSelectedId(previousIndex);
    }
    if (currentIndex == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (
      currentIndex === transformedData[transformedData.length - 1].id
    ) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
  };

  //Next Person Info
  const OnNextCirclePress = () => {
    let currentIndex = transformedData.findIndex(
      (item) => item.id === selectedId
    );
    if (currentIndex < transformedData.length - 1) {
      let nextIndex = transformedData[currentIndex + 1].id;
      currentIndex = nextIndex;
      setSelectedId(nextIndex);
    }
    if (currentIndex == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (
      currentIndex === transformedData[transformedData.length - 1].id
    ) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
  };

  //Render Info Item(Right Container)
  const renderInfoItem = () => {
    const selectedData = transformedData.find((item) => item.id === selectedId);

    if (selectedData) {
      fetchGenderNamebyGenderCode(selectedData.modifiedEntrant.genderCode);
    }
    return (
      <View>
        {selectedData?.modifiedEntrant.relationship !== "" && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  あなたとの関係
                </HiraginoKakuText>
              </View>

              <View
                style={
                  !selectedData?.modifiedFlags.isRelationshipModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.modifiedEntrant.relationship}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData?.modifiedFlags.isRelationshipModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {(selectedData?.firstName || selectedData?.lastName) && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  お名前
                </HiraginoKakuText>
              </View>
              <View
                style={
                  !selectedData.modifiedFlags.isNameModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.lastName}
                  {"　"}
                  {selectedData?.firstName}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData.modifiedFlags.isNameModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {(selectedData?.modifiedEntrant.lastNameKana ||
          selectedData?.modifiedEntrant.firstNameKana) && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  お名前（カナ）
                </HiraginoKakuText>
              </View>
              <View
                style={
                  !selectedData.modifiedFlags.isKanaNameModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.modifiedEntrant.lastNameKana}
                  {"　"}
                  {selectedData?.modifiedEntrant.firstNameKana}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData.modifiedFlags.isKanaNameModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {selectedData?.modifiedEntrant.dateOfBirth && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  生年月日
                </HiraginoKakuText>
              </View>
              <View
                style={
                  !selectedData.modifiedFlags.isDateOfBirthModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.modifiedEntrant.dateOfBirth
                    ? format(
                        new Date(selectedData.modifiedEntrant.dateOfBirth),
                        "yyyy年MM月dd日"
                      )
                    : "N/A"}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData.modifiedFlags.isDateOfBirthModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {selectedData?.modifiedEntrant.genderCode !== "0" && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  性別
                </HiraginoKakuText>
              </View>
              <View
                style={
                  !selectedData?.modifiedFlags.isGenderModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {genderName}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData?.modifiedFlags.isGenderModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {selectedData?.modifiedEntrant.postalCode && (
          <View style={styles.row}>
            <View style={styles.rowContent}>
              <View style={styles.firstContent}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  郵便番号
                </HiraginoKakuText>
              </View>

              <View
                style={
                  !selectedData.modifiedFlags.isPostalCodeModified
                    ? styles.secondContent
                    : styles.secondContentCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.modifiedEntrant.postalCode}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData.modifiedFlags.isPostalCodeModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
        {selectedData?.modifiedEntrant.address && (
          <View style={styles.rowAddress}>
            <View style={styles.rowContent}>
              <View style={styles.firstContentAddress}>
                <HiraginoKakuText style={styles.innerBodyBoldText}>
                  住所
                </HiraginoKakuText>
              </View>
              <View
                style={
                  !selectedData.modifiedFlags.isAddressModified
                    ? styles.secondContentAddress
                    : styles.secondContentAddressCorrected
                }
              >
                <HiraginoKakuText style={styles.innerBodyText} normal>
                  {selectedData?.modifiedEntrant.address}
                </HiraginoKakuText>
              </View>
            </View>
            {selectedData.modifiedFlags.isAddressModified && (
              <View style={styles.correctedBadge}>
                <HiraginoKakuText style={styles.correctedText}>
                  修正済
                </HiraginoKakuText>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const handleCompletion = async () => {
    try {
      const クエリ結果_受付済み件数 = await fetchCountOfReceivedItems(
        groupCheckInConfirmationParams.eventId,
        lgapId
      );
      setIsLgapIdDialogVisible(false);

      if (クエリ結果_受付済み件数 > 0) {
        const クエリ結果_target_reception_ids = await getReceptionId(
          groupCheckInConfirmationParams.eventId,
          lgapId
        );

        if (クエリ結果_target_reception_ids.data.length > 0) {
          try {
            const receptionIDs = クエリ結果_target_reception_ids.data;
            const result = await insertIntoReceptionHistory(
              groupCheckInConfirmationParams.eventId,
              receptionIDs
            );
            if (result.message == "success") {
              const d = await deleteDataFromReception(
                groupCheckInConfirmationParams.eventId,
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

  const openCompletionModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    handleReceptionInsert();
    setModalVisible(false);
  };

  const handleEdit = () => {
    const groupCheckInEditParams = new GroupCheckInEditParams();
    groupCheckInEditParams.user = groupCheckInConfirmationParams.user;
    groupCheckInEditParams.eventId = groupCheckInConfirmationParams.eventId;
    groupCheckInEditParams.venueId = groupCheckInConfirmationParams.venueId;
    groupCheckInEditParams.entrantRecordList =
      groupCheckInConfirmationParams.entrantRecordList;
    groupCheckInEditParams.selectedEntrantIndex = selectedId;
    navigation.navigate("GroupCheckInEdit", {
      groupCheckInEditParams,
    });
    ActivityLogger.insertInfoLogEntry(groupCheckInConfirmationParams.user, 'GroupCheckInConfirmation', 'handleEdit', 'transition', 'GroupCheckInEdit', groupCheckInEditParams);
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId =
      groupCheckInConfirmationParams.eventId;
    selectReceptionMethodParams.venueId =
      groupCheckInConfirmationParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      groupCheckInConfirmationParams.receptionTypeCode;
    selectReceptionMethodParams.user = groupCheckInConfirmationParams.user;
    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(groupCheckInConfirmationParams.user, 'GroupCheckInConfirmation', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  //AWS
  const [genderName, setGenderName] = useState<string>();
  const [message, setMessage] = useState<string>();

  //insert reception family

  const handleReceptionInsert = async () => {
    let allResults = [];
    let receptionId = null;
    const mainEntrants = transformedData.filter(
      (data) => data.modifiedEntrant.familyOrderNumber === 0
    );
    const familyEntrants = transformedData.filter(
      (data) => data.modifiedEntrant.familyOrderNumber !== 0
    );

    try {
      for (const entrantData of mainEntrants) {
        const formattedPostCode =
          entrantData.modifiedEntrant.postalCode.replace("-", "");

        const result = await insertReceptionData(
          groupCheckInConfirmationParams.eventId,
          groupCheckInConfirmationParams.venueId,
          DEVICE_ID, // Temp acceptedTerminalId
          groupCheckInConfirmationParams.user.userId,
          entrantData.modifiedEntrant.lgapId,
          entrantData.modifiedEntrant.userRank,
          entrantData.modifiedEntrant.lastName,
          entrantData.modifiedEntrant.firstName,
          entrantData.modifiedEntrant.lastNameKana,
          entrantData.modifiedEntrant.firstNameKana,
          entrantData.modifiedEntrant.dateOfBirth,
          entrantData.modifiedEntrant.genderCode,
          formattedPostCode,
          entrantData.modifiedEntrant.address,
          entrantData.modifiedEntrant.receptionTypeCode,
          entrantData.modifiedEntrant.familyOrderNumber
        );

        receptionId = result.data[0].reception_id;
        allResults.push(result);
      }

      // Process family entrants using the obtained receptionId
      for (const entrantData of familyEntrants) {
        const formattedPostCode =
          entrantData.modifiedEntrant.postalCode.replace("-", "");

        const result = await insertReceptionDataFamily(
          groupCheckInConfirmationParams.eventId,
          groupCheckInConfirmationParams.venueId,
          receptionId,
          entrantData.modifiedEntrant.familyOrderNumber,
          DEVICE_ID, // Temp acceptedTerminalId
          groupCheckInConfirmationParams.user.userId,
          entrantData.modifiedEntrant.lgapId,
          entrantData.modifiedEntrant.userRank,
          entrantData.modifiedEntrant.lastName,
          entrantData.modifiedEntrant.firstName,
          entrantData.modifiedEntrant.lastNameKana,
          entrantData.modifiedEntrant.firstNameKana,
          entrantData.modifiedEntrant.dateOfBirth,
          entrantData.modifiedEntrant.genderCode,
          formattedPostCode,
          entrantData.modifiedEntrant.address,
          entrantData.modifiedEntrant.relationship,
          entrantData.modifiedEntrant.receptionTypeCode,
          entrantData.modifiedEntrant.familyOrderNumber
        );

        allResults.push(result);
      }
      const success = allResults.every(
        (result) => result.message === "success"
      );

      if (success) {
        const selectReceptionMethodParams = new SelectReceptionMethodParams();
        selectReceptionMethodParams.user = groupCheckInConfirmationParams.user;
        selectReceptionMethodParams.eventId =
          groupCheckInConfirmationParams.eventId;
        selectReceptionMethodParams.venueId =
          groupCheckInConfirmationParams.venueId;
        selectReceptionMethodParams.receptionTypeCode =
          groupCheckInConfirmationParams.receptionTypeCode;

        navigation.navigate("SelectReceptionMethod", {
          selectReceptionMethodParams,
        });
        ActivityLogger.insertInfoLogEntry(groupCheckInConfirmationParams.user, 'GroupCheckInConfirmation', 'handleReceptionInsert', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);

        setMessage("Inserted Successfully!!");
      } else {
        const errorResult = allResults.find(
          (result) => result.message !== "success"
        );
        const errorMessage = errorResult
          ? errorResult.message
          : "Unknown error occurred";
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("Error from ReceptionCreateService:", error);
    }
  };

  //get Gender Name
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
      console.error("Error from GetGenderNameService:", error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content"></StatusBar>
      <Header
        titleName="受付内容確認"
        buttonName="受付をやめる"
        onPress={handleSelectReceptionMethod}
      ></Header>

      <View style={styles.bodyContainer}>
        <View style={styles.innerMainTitle}>
          <HiraginoKakuText style={styles.innerMainTitleText}>
            この内容で受付しますか？
          </HiraginoKakuText>
        </View>
        <View style={styles.outerContainer}>
          <View style={styles.sideScrollDiv}>
            <HiraginoKakuText style={styles.sideTitleText}>
              受付人数
              {
                groupCheckInConfirmationParams.entrantRecordList
                  .entrantRecordList.length
              }
              人
            </HiraginoKakuText>
            <FlatList
              style={styles.scrollableGroup}
              scrollEnabled={scrollEnabled}
              data={transformedData}
              renderItem={renderScrollItem}
              keyExtractor={(item) => item.id.toString()}
              onLayout={onLayoutHandler}
              contentContainerStyle={styles.scrollableGp}
            />
          </View>

          <View>
            <View
              style={[styles.innerBodyContainer]}
              onLayout={onLayoutBtnHandler}
            >
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

              <ScrollView scrollEnabled={scrollInfoEnabled}>
                <View
                  style={{
                    height: heightContainer,
                  }}
                >
                  <View onLayout={onLayoutInfoHandler}>{renderInfoItem()}</View>
                </View>
              </ScrollView>
            </View>

            {isLeftCircleVisible && (
              <View
                style={{
                  position: "absolute",
                  top: topPosition,
                  left: -26,
                }}
              >
                <Pressable
                  onPress={OnPreviousCirclePress}
                  style={styles.chevronLeftButton}
                >
                  <Feather
                    name="chevron-left"
                    size={28}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>
            )}
            {isRightCircleVisible && (
              <View
                style={{ position: "absolute", top: topPosition, right: -26 }}
              >
                <Pressable
                  onPress={OnNextCirclePress}
                  style={styles.chevronRightButton}
                >
                  <Feather
                    name="chevron-right"
                    size={28}
                    color={colors.secondary}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        {isLgapIdDialogVisible && (
          <ExistingLGaPIDDialog
            onAccept={handleAccept}
            onCancel={handleCancel}
          />
        )}
      </View>

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

export default GroupCheckInConfirmation;
