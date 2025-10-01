import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  View,
  ScrollView,
  Pressable,
  TextInput,
  GestureResponderEvent,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
  Platform,
} from "react-native";
import styles from "./GroupCheckInEditStyles";
import { Header } from "../../components/basics/header";
import { HiraginoKakuText } from "../../components/StyledText";
import { Footer } from "../../components/basics/footer";
import { Button } from "../../components/basics/Button";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "../../styles/color";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CustomCalendar } from "../../components/basics/Calendar";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import Clipboard from "@react-native-community/clipboard";
import { ActivityLogger } from "../../log/ActivityLogger";

const width = Dimensions.get("window").width;

interface TooltipProps {
  isVisible: boolean;
  x: number;
  y: number;
  text: string;
}

const Tooltip = ({ isVisible, x, y, text }: TooltipProps) => {
  if (!isVisible) return null;

  return (
    <View style={[styles.tooltip, { left: x - 70, top: y - 70 }]}>
      <HiraginoKakuText style={styles.tooltipText} normal>
        {text}
      </HiraginoKakuText>
      <View style={styles.arrow} />
    </View>
  );
};

interface ToastProps {
  isVisible: boolean;
  x: number;
  y: number;
  text: string;
}

const Toast = ({ isVisible, x, y, text }: ToastProps) => {
  if (!isVisible) return null;

  return (
    <View style={[styles.addresstoastContainer, { left: x - 70, top: y + 20 }]}>
      <HiraginoKakuText style={styles.toastText}>{text}</HiraginoKakuText>
    </View>
  );
};
import { NavigationProp, useRoute } from "@react-navigation/native";
import { GroupCheckInConfirmationParams } from "../group-check-in-confirmation/GroupCheckInConfirmationParams";
import { GroupCheckInEditParams } from "./GroupCheckInEditParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import {
  handleZipCodeChange,
  isKatakanaText,
  isValidPostalCode,
} from "../../environments/InputValidationMethods";
import { searchAddressFromPostalCode } from "../../environments/InputMethods";
import { EntrantRecord } from "../../models/EntrantRecord";

type Props = {
  navigation: NavigationProp<any, any>;
};
type Params = {
  groupCheckInEditParams: GroupCheckInEditParams;
};

type Errors = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  dob: string;
  gender: string;
  postalCode: string;
  address: string;
  relationship: string;
};
type MemberErrors = {
  errors: Errors;
  errorCount: number;
};
export const GroupCheckInEdit = ({ navigation }: Props) => {
  const route = useRoute();
  const { groupCheckInEditParams } = route.params as Params;
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastX, setToastX] = useState(0);
  const [toastY, setToastY] = useState(0);
  const [editScrollEnabled, setEditScrollEnabled] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [memberErrors, setMemberErrors] = useState<{
    [id: number]: { errors: { [key: string]: string }; errorCount: number };
  }>({});
  const [errorTitle, setErrorTitle] = useState(
    "に正しく入力されていない項目があります"
  );
  const [isBirthDateCalendarVisible, setBirthDateCalendarVisible] =
    useState(false);
  const [editContainerHeight, seteditContainerHeight] = useState(0);
  const [membersWithErrorsList, setMembersWithErrorsList] =
    useState<string>("");

  let [selectedId, setSelectedId] = useState<number>(
    groupCheckInEditParams.selectedEntrantIndex
  );

  const [editedData, setEditedData] = useState<Partial<DataItem>>({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    dob: null,
    gender: "",
    postalCode: "",
    address: "",
    relationship: "",
  });

  interface DataItem {
    id: number;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    dob: Date | null;
    gender: string;
    postalCode: string;
    address: string;
    relationship: string;
  }
  groupCheckInEditParams.entrantRecordList.entrantRecordList =
    groupCheckInEditParams.entrantRecordList.entrantRecordList.sort(
      (a, b) =>
        a.modifiedEntrant.familyOrderNumber -
        b.modifiedEntrant.familyOrderNumber
    );
  const initialData: DataItem[] =
    groupCheckInEditParams.entrantRecordList.entrantRecordList.map(
      (record, index) => ({
        id: record.originalEntrant.familyOrderNumber + 1,
        lastName: `${record.originalEntrant.lastName}`,
        firstName: `${record.originalEntrant.firstName}`,
        lastNameKana: `${record.originalEntrant.lastNameKana}`,
        firstNameKana: `${record.originalEntrant.firstNameKana}`,
        dob: record.originalEntrant.dateOfBirth,
        gender: record.originalEntrant.genderCode,
        postalCode: record.originalEntrant.postalCode,
        address: record.originalEntrant.address,
        relationship: record.originalEntrant.relationship,
      })
    );

  const modifiedData: DataItem[] =
    groupCheckInEditParams.entrantRecordList.entrantRecordList.map(
      (record, index) => ({
        id: record.modifiedEntrant.familyOrderNumber + 1,
        lastName: `${record.modifiedEntrant.lastName}`,
        firstName: `${record.modifiedEntrant.firstName}`,
        lastNameKana: `${record.modifiedEntrant.lastNameKana}`,
        firstNameKana: `${record.modifiedEntrant.firstNameKana}`,
        dob: record.modifiedEntrant.dateOfBirth,
        gender: record.modifiedEntrant.genderCode,
        postalCode: record.modifiedEntrant.postalCode,
        address: record.modifiedEntrant.address,
        relationship: record.modifiedEntrant.relationship,
      })
    );

  const [data, setData] = useState(modifiedData);

  const birthDateInputRef = useRef(null);
  const birthDateRef = useRef(null);
  const calendarRef = useRef(null);
  const editContainerRef = useRef(null);

  const handleCopyPress = (event: GestureResponderEvent, text: string) => {
    const { nativeEvent } = event;
    if (text !== "") {
      if (Platform.OS === "web") {
        try {
          navigator.clipboard
            .writeText(text)
            .then(() => {
              console.log("Copied to clipboard!");
            })
            .catch((err) => {
              console.log("Failed to copy!", err.toString());
            });
        } catch (err: any) {
          console.log("Failed to copy!", err.toString());
        }
      } else {
        Clipboard.setString(text);
        console.log("Copied to clipboard!");
      }
      setTooltipVisible(true);
      setTooltipX(nativeEvent.pageX);
      setTooltipY(nativeEvent.pageY);
      setTimeout(() => setTooltipVisible(false), 2000);
    }
    setBirthDateCalendarVisible(false);
  };

  const handleAddressPress = (event: GestureResponderEvent) => {
    const { nativeEvent } = event;
    if (selectedId !== null) {
      const selectedMember = data.find((item) => item.id === selectedId);
      if (selectedMember) {
        const newAddress = selectedMember.address;
        if (newAddress !== "") {
          setData((prevData) =>
            prevData.map((item) => ({
              ...item,
              address: newAddress,
            }))
          );
          const updatedMemberErrors = { ...memberErrors };
          Object.keys(updatedMemberErrors).forEach((memberId) => {
            if (updatedMemberErrors[parseInt(memberId)]?.errors) {
              updatedMemberErrors[parseInt(memberId)].errors.address = "";
              const errorCount = Object.values(
                updatedMemberErrors[parseInt(memberId)].errors
              ).filter((error) => error !== "").length;
              updatedMemberErrors[parseInt(memberId)].errorCount = errorCount;
            }
          });
          setMemberErrors(updatedMemberErrors);
          setToastVisible(true);
          setToastX(nativeEvent.pageX);
          setToastY(nativeEvent.pageY);
          setTimeout(() => setToastVisible(false), 2000);
        }
      }
    }
    setBirthDateCalendarVisible(false);
  };

  const handleSelectOption = (option: string) => {
    handleEdit("gender", option);
  };

  const defaultOnPress = () => {
    setBirthDateCalendarVisible(false);
  };

  const onLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    if (height > 300) {
      setScrollEnabled(true);
    }
    setSelectedId(groupCheckInEditParams.selectedEntrantIndex);
    handleDivSelect(groupCheckInEditParams.selectedEntrantIndex);
  };

  const onEditLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    seteditContainerHeight(height);
    if (height > hp("56.2%")) {
      setEditScrollEnabled(true);
    }
  };

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(groupCheckInEditParams.user, 'GroupCheckInEdit', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    setMembersWithErrorsList(getMembersWithErrors());
  }, [memberErrors]);

  const getMembersWithErrors = (): string => {
    const membersWithErrors = Object.entries(memberErrors)
      .filter(([id, memberError]) => memberError.errorCount > 0)
      .map(([id, memberError]) => {
        const member = initialData.find((m) => m.id === parseInt(id));
        return member ? member.lastName + "　" + member.firstName + "さん" : "";
      });

    return membersWithErrors.join("、");
  };

  const handleEdit = (key: any, value: any) => {
    if (key === "postalCode") {
      const formattedText = handleZipCodeChange(value);
      if (formattedText !== null) {
        errors.postalCode = "";
      } else {
        errors.postalCode = "郵便番号は数字7桁で入力してください";
      }
      value = formattedText ?? "";
      let newErrors = { ...errors };
      setErrors(newErrors);
      const errorCount = Object.values(newErrors).filter(
        (error) => error !== ""
      ).length;

      if (selectedId !== null) {
        setMemberErrors({
          ...memberErrors,
          [selectedId]: { errors: newErrors, errorCount },
        });
      }
    }
    else if(key == "dob") {
      if(editedData.dob && value == format(editedData.dob, "yyyy-MM-dd")) {
        value = "";
      }
    }
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedId ? { ...item, [key]: value } : item
      )
    );
  };

  const validateField = (key: keyof DataItem, value: string) => {
    let newErrors = { ...errors };
    if (
      key === "lastName" ||
      key === "firstName" ||
      key === "lastNameKana" ||
      key === "firstNameKana" ||
      key === "postalCode" ||
      key === "address" ||
      key === "relationship"
    ) {
      const trimmedValue = editedData[key]?.trim() || "";
      setEditedData((prev) => ({
        ...prev,
        [key]: trimmedValue,
      }));
      setData((prevData) =>
        prevData.map((item) =>
          item.id === selectedId ? { ...item, ...editedData } : item
        )
      );
    }
    switch (key) {
      case "lastName":
        {
          if (value.trim() == "") {
            newErrors.lastName = "お名前を入力してください";
          } else {
            newErrors.lastName = "";
          }
        }
        break;
      case "firstName":
        {
          if (value.trim() == "") {
            newErrors.firstName = "お名前を入力してください";
          } else {
            newErrors.firstName = "";
          }
        }
        break;
      case "lastNameKana":
        {
          if (value.trim() == "") {
            newErrors.lastNameKana = "お名前（カナ）を入力してください";
          } else if (!isKatakanaText(value.trim())) {
            newErrors.lastNameKana = "カタカナで入力してください";
          } else {
            newErrors.lastNameKana = "";
          }
        }
        break;
      case "firstNameKana":
        {
          if (value.trim() == "") {
            newErrors.firstNameKana = "お名前（カナ）を入力してください";
          } else if (!isKatakanaText(value.trim())) {
            newErrors.firstNameKana = "カタカナで入力してください";
          } else {
            newErrors.firstNameKana = "";
          }
        }
        break;
      case "postalCode":
        {
          newErrors.postalCode = isValidPostalCode(value.trim());
        }
        break;
      case "address":
        {
          if (value.trim() == "") {
            newErrors.address = "住所を入力してください";
          } else {
            newErrors.address = "";
          }
        }
        break;
      case "relationship":
        {
          if (value.trim() == "") {
            newErrors.relationship = "あなたとの関係を入力してください";
          } else {
            newErrors.relationship = "";
          }
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
    const errorCount = Object.values(newErrors).filter(
      (error) => error !== ""
    ).length;
    if (selectedId !== null) {
      setMemberErrors({
        ...memberErrors,
        [selectedId]: { errors: newErrors, errorCount },
      });
    }
  };

  const handleDivSelect = (id: any) => {
    setSelectedId(id);
    const selectedMember = data.find((item) => item.id === id);
    setEditedData({ ...selectedMember });
    const memberErrorData = memberErrors[id];
    setErrors(memberErrorData ? memberErrorData.errors : {});

    if (id == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (id === data[data.length - 1].id) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
  };

  // prev next buttons' height
  const [topPosition, setTopPosition] = useState(0);

  const onLayoutBtnHandler = () => {
    let skipBtnPosition = hp("51%") / 2 - hp("3.2%");
    setTopPosition(skipBtnPosition);
  };

  //Render Edit Info Item
  const [isLeftCircleVisible, setIsLeftCircleVisible] = useState(false);
  const [isRightCircleVisible, setIsRightCircleVisible] = useState(true);
  //Previous Person Info
  const OnPreviousCirclePress = () => {
    let currentIndex = data.findIndex((item) => item.id === selectedId);
    if (currentIndex > 0) {
      let previousIndex = data[currentIndex - 1].id;
      currentIndex = previousIndex;
      handleDivSelect(previousIndex);
    }
    if (currentIndex == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (currentIndex === data[data.length - 1].id) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
    setBirthDateCalendarVisible(false);
  };

  //Next Person Info
  const OnNextCirclePress = () => {
    let currentIndex = data.findIndex((item) => item.id === selectedId);
    if (currentIndex < data.length - 1) {
      let nextIndex = data[currentIndex + 1].id;
      currentIndex = nextIndex;
      handleDivSelect(nextIndex);
    }
    if (currentIndex == 1) {
      setIsLeftCircleVisible(false);
      setIsRightCircleVisible(true);
    } else if (currentIndex === data[data.length - 1].id) {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(false);
    } else {
      setIsLeftCircleVisible(true);
      setIsRightCircleVisible(true);
    }
    setBirthDateCalendarVisible(false);
  };

  const isNameModified = (n: number) => {
    const isChanged =
      initialData[n].lastName !== data[n].lastName ||
      initialData[n].firstName !== data[n].firstName;
    return isChanged;
  };

  const isKanaNameModified = (n: number) => {
    const isChanged =
      initialData[n].lastNameKana !== data[n].lastNameKana ||
      initialData[n].firstNameKana !== data[n].firstNameKana;
    return isChanged;
  };

  const isBirthDateModified = (n: number) => {
    const isChanged = initialData[n].dob !== data[n].dob;
    return isChanged;
  };

  const isGenderModified = (n: number) => {
    const isChanged = initialData[n].gender !== data[n].gender;
    return isChanged;
  };

  const isPostalcodeModified = (n: number) => {
    const isChanged = initialData[n].postalCode !== data[n].postalCode;
    return isChanged;
  };

  const isAddressModified = (n: number) => {
    const isChanged = initialData[n].address !== data[n].address;
    return isChanged;
  };

  const isRelationshipModified = (n: number) => {
    const isChanged = initialData[n].relationship !== data[n].relationship;
    return isChanged;
  };

  const isAnyFieldNull = (data: DataItem[]): boolean => {
    for (let i = 0; i < data.length; i++) {
      const member = data[i];
      for (const key in member) {
        if (key === "relationship" && i === 0) {
          continue;
        }
        if (
          member[key as keyof DataItem] === null ||
          member[key as keyof DataItem] === ""
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const handleConfirm = () => {
    const anyFieldNull = isAnyFieldNull(data);
    if (!anyFieldNull && membersWithErrorsList.length == 0) {
      const groupCheckInConfirmationParams =
        new GroupCheckInConfirmationParams();
      groupCheckInConfirmationParams.user = groupCheckInEditParams.user;
      groupCheckInConfirmationParams.eventId = groupCheckInEditParams.eventId;
      groupCheckInConfirmationParams.venueId = groupCheckInEditParams.venueId;
      groupCheckInConfirmationParams.receptionTypeCode =
        groupCheckInEditParams.receptionTypeCode;
      groupCheckInConfirmationParams.selectedEntrantIndex = selectedId;
      for (let i = 0; i < data.length; i++) {
        const record = new EntrantRecord();
        record.modifiedEntrant.lastName = data[i].lastName;
        record.modifiedEntrant.firstName = data[i].firstName;
        record.modifiedEntrant.lastNameKana = data[i].lastNameKana;
        record.modifiedEntrant.firstNameKana = data[i].firstNameKana;
        record.modifiedEntrant.genderCode = data[i].gender;
        record.modifiedEntrant.dateOfBirth = data[i].dob;
        record.modifiedEntrant.postalCode = data[i].postalCode;
        record.modifiedEntrant.address = data[i].address;
        record.modifiedEntrant.relationship = data[i].relationship;
        record.modifiedEntrant.receptionTypeCode =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].modifiedEntrant.receptionTypeCode;
        record.modifiedEntrant.familyOrderNumber =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].modifiedEntrant.familyOrderNumber;
        record.modifiedEntrant.userRank =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].modifiedEntrant.userRank;
        record.modifiedEntrant.lgapId =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].modifiedEntrant.lgapId;
        record.originalEntrant.lastName = initialData[i].lastName;
        record.originalEntrant.firstName = initialData[i].firstName;
        record.originalEntrant.lastNameKana = initialData[i].lastNameKana;
        record.originalEntrant.firstNameKana = initialData[i].firstNameKana;
        record.originalEntrant.genderCode = initialData[i].gender;
        record.originalEntrant.dateOfBirth = initialData[i].dob;
        record.originalEntrant.postalCode = initialData[i].postalCode;
        record.originalEntrant.address = initialData[i].address;
        record.originalEntrant.relationship = initialData[i].relationship;
        record.originalEntrant.familyOrderNumber =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].originalEntrant.familyOrderNumber;
        record.originalEntrant.userRank =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].originalEntrant.userRank;
        record.originalEntrant.lgapId =
          groupCheckInEditParams.entrantRecordList.entrantRecordList[
            i
          ].originalEntrant.lgapId;
        record.modifiedFlags.isNameModified = isNameModified(i);
        record.modifiedFlags.isKanaNameModified = isKanaNameModified(i);
        record.modifiedFlags.isDateOfBirthModified = isBirthDateModified(i);
        record.modifiedFlags.isGenderModified = isGenderModified(i);
        record.modifiedFlags.isPostalCodeModified = isPostalcodeModified(i);
        record.modifiedFlags.isAddressModified = isAddressModified(i);
        record.modifiedFlags.isRelationshipModified = isRelationshipModified(i);
        groupCheckInConfirmationParams.entrantRecordList.addEntrantRecord(
          record
        );
      }
      navigation.navigate("GroupCheckInConfirmation", {
        groupCheckInConfirmationParams,
        isReturn: "true",
      });
      ActivityLogger.insertInfoLogEntry(groupCheckInEditParams.user, 'GroupCheckInEdit', 'handleConfirm', 'transition', 'GroupCheckInConfirmation', groupCheckInConfirmationParams);
    }
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId = groupCheckInEditParams.eventId;
    selectReceptionMethodParams.venueId = groupCheckInEditParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      groupCheckInEditParams.receptionTypeCode;
    selectReceptionMethodParams.user = groupCheckInEditParams.user;
    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(groupCheckInEditParams.user, 'GroupCheckInEdit', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  const handleBirthDateCalendarPress = (event: any) => {
    setBirthDateCalendarVisible(!isBirthDateCalendarVisible);
  };

  const handleBirthDateSelect = (date: any) => {
    handleEdit("dob", date);
    setBirthDateCalendarVisible(false);
  };

  const closeCalendar = (event: any) => {
    if (
      event.nativeEvent.target != birthDateInputRef.current &&
      event.nativeEvent.target != birthDateRef
    ) {
      if (isBirthDateCalendarVisible) {
        setBirthDateCalendarVisible(false);
      }
    }
  };

  const onCalendarLayout = (e: any) => {
    if (calendarRef.current) {
      seteditContainerHeight(editContainerHeight + hp("16%"));
    }
  };

  const renderScrollItem = ({ item }: { item: DataItem }) => (
    <Pressable
      onPress={() => {
        handleDivSelect(item.id);
        setBirthDateCalendarVisible(false);
      }}
    >
      <View
        style={
          selectedId === item.id ? styles.btnSideDivActive : styles.btnSideDiv
        }
      >
        <HiraginoKakuText style={styles.count}>{item.id}.</HiraginoKakuText>
        <HiraginoKakuText numberOfLines={1} style={styles.sideText} normal>
          {item.lastName}
          {"　"}
          {item.firstName}
        </HiraginoKakuText>
        {memberErrors[item.id] && memberErrors[item.id].errorCount > 0 && (
          <AntDesign
            name="exclamationcircle"
            size={24}
            style={styles.errorIcon}
          />
        )}
      </View>
    </Pressable>
  );

  const renderInputItem = () => {
    return (
      <View
        ref={editContainerRef}
        style={[
          styles.editContainer,
          isBirthDateCalendarVisible && {
            height: editContainerHeight,
          },
        ]}
        onLayout={onEditLayoutHandler}
      >
        {initialData.find((item) => item.id === selectedId)?.relationship !==
          "" && (
          <View
            style={[
              styles.row,
              styles.lowerRow,
              (errors.relationship ?? "") != ""
                ? { height: "auto" }
                : { height: hp("5.15%") },
            ]}
          >
            <View style={styles.labelContainer}>
              <HiraginoKakuText style={styles.labelText}>
                あなたとの関係
              </HiraginoKakuText>
            </View>
            <View style={styles.innerRowContainer}>
              <View
                style={[
                  styles.inputErrContainer,
                  (errors.relationship ?? "") != ""
                    ? { gap: hp("0.95%") }
                    : { gap: 0 },
                ]}
              >
                <TextInput
                  style={[styles.input, styles.inputText]}
                  value={editedData.relationship}
                  onChangeText={(text) => handleEdit("relationship", text)}
                  onFocus={() => setBirthDateCalendarVisible(false)}
                  onBlur={() =>
                    validateField("relationship", editedData.relationship ?? "")
                  }
                />
                {(errors.relationship ?? "") != "" && (
                  <HiraginoKakuText
                    style={[styles.errText, styles.errLongText]}
                    normal
                  >
                    {errors.relationship}
                  </HiraginoKakuText>
                )}
              </View>
            </View>
          </View>
        )}
        <View
          style={[
            styles.row,
            (errors.firstName ?? "" != "") || (errors.lastName ?? "" != "")
              ? { height: "auto" }
              : { height: hp("5.15%") },
          ]}
        >
          <View style={styles.labelContainer}>
            <HiraginoKakuText style={styles.labelText}>お名前</HiraginoKakuText>
          </View>
          <View style={styles.inputsContainer}>
            <View
              style={[
                styles.inputErrContainer,
                (errors.lastName ?? "") != ""
                  ? { gap: hp("0.95%") }
                  : { gap: 0 },
              ]}
            >
              <TextInput
                style={[styles.input, styles.inputText]}
                value={editedData.lastName}
                onChangeText={(text) => handleEdit("lastName", text)}
                onFocus={() => setBirthDateCalendarVisible(false)}
                onBlur={() =>
                  validateField("lastName", editedData.lastName ?? "")
                }
              />
              {(errors.lastName ?? "") != "" && (
                <HiraginoKakuText style={styles.errText} normal>
                  {errors.lastName}
                </HiraginoKakuText>
              )}
            </View>
            <View
              style={[
                styles.inputErrContainer,
                (errors.firstName ?? "") != ""
                  ? { gap: hp("0.95%") }
                  : { gap: 0 },
              ]}
            >
              <TextInput
                style={[styles.input, styles.inputText]}
                value={editedData.firstName}
                onChangeText={(text) => handleEdit("firstName", text)}
                onFocus={() => setBirthDateCalendarVisible(false)}
                onBlur={() =>
                  validateField("firstName", editedData.firstName ?? "")
                }
              />
              {(errors.firstName ?? "") != "" && (
                <HiraginoKakuText style={styles.errText} normal>
                  {errors.firstName}
                </HiraginoKakuText>
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            styles.row,
            (errors.firstNameKana ?? "" != "") ||
            (errors.lastNameKana ?? "" != "")
              ? { height: "auto" }
              : { height: hp("5.15%") },
          ]}
        >
          <View style={styles.labelContainer}>
            <HiraginoKakuText style={styles.labelText}>
              お名前（カナ）
            </HiraginoKakuText>
          </View>
          <View style={styles.inputsContainer}>
            <View
              style={[
                styles.inputErrContainer,
                (errors.lastNameKana ?? "") != ""
                  ? { gap: hp("0.95%") }
                  : { gap: 0 },
              ]}
            >
              <TextInput
                style={[styles.input, styles.inputText]}
                value={editedData.lastNameKana}
                onChangeText={(text) => handleEdit("lastNameKana", text)}
                onFocus={() => setBirthDateCalendarVisible(false)}
                onBlur={() =>
                  validateField("lastNameKana", editedData.lastNameKana ?? "")
                }
              />
              {(errors.lastNameKana ?? "") != "" && (
                <HiraginoKakuText style={styles.errText} normal>
                  {errors.lastNameKana}
                </HiraginoKakuText>
              )}
            </View>
            <View
              style={[
                styles.inputErrContainer,
                (errors.firstNameKana ?? "") != ""
                  ? { gap: hp("0.95%") }
                  : { gap: 0 },
              ]}
            >
              <TextInput
                style={[styles.input, styles.inputText]}
                value={editedData.firstNameKana}
                onChangeText={(text) => handleEdit("firstNameKana", text)}
                onFocus={() => setBirthDateCalendarVisible(false)}
                onBlur={() =>
                  validateField("firstNameKana", editedData.firstNameKana ?? "")
                }
              />
              {(errors.firstNameKana ?? "") != "" && (
                <HiraginoKakuText style={styles.errText} normal>
                  {errors.firstNameKana}
                </HiraginoKakuText>
              )}
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <HiraginoKakuText style={styles.labelText}>
              生年月日
            </HiraginoKakuText>
          </View>
          <View style={styles.innerRowContainer}>
            <View style={styles.birthDateInputContainer}>
              <TextInput
                ref={birthDateInputRef}
                style={styles.birthDateInputText}
                value={
                  editedData.dob
                    ? format(editedData.dob, "yyyy/MM/dd")
                    : ""
                }
                onPressIn={handleBirthDateCalendarPress}
                onPointerDown={handleBirthDateCalendarPress}
                showSoftInputOnFocus={false}
                onTouchStart={() => Keyboard.dismiss()}
                inputMode="none"
              />
              <Pressable
                style={styles.calendarIconContainer}
                ref={birthDateRef}
                onPress={handleBirthDateCalendarPress}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={22}
                  color={colors.activeCarouselColor}
                  style={styles.calendarIcon}
                />
              </Pressable>
              {isBirthDateCalendarVisible && (
                <View
                  onLayout={onCalendarLayout}
                  ref={calendarRef}
                  style={styles.calendarContainer}
                >
                  <CustomCalendar
                    selectedDate={
                      editedData.dob
                        ? format(editedData.dob, "yyyy/MM/dd")
                        : ""
                    }
                    onDateSelect={handleBirthDateSelect}
                    minDate={""}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={[styles.row, styles.lowerRow]}>
          <View style={styles.labelContainer}>
            <HiraginoKakuText style={styles.labelText}>性別</HiraginoKakuText>
          </View>
          <View style={styles.genderRadioContainer}>
            <View style={styles.radioContainer}>
              <RadioPanel
                selected={editedData.gender === "1"}
                onPress={() => handleSelectOption("1")}
                radioBtnText="男性"
              />
            </View>
            <View style={styles.radioContainer}>
              <RadioPanel
                selected={editedData.gender === "2"}
                onPress={() => handleSelectOption("2")}
                radioBtnText="女性"
              />
            </View>
            <View style={[styles.radioContainer, styles.radioKaitouContainer]}>
              <RadioPanel
                selected={editedData.gender === "0"}
                onPress={() => handleSelectOption("0")}
                radioBtnText="回答しない"
              />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.row,
            styles.lowerRow,
            (errors.postalCode ?? "") != ""
              ? { height: "auto" }
              : { height: hp("5.15%") },
          ]}
        >
          <View style={styles.labelContainer}>
            <HiraginoKakuText style={styles.labelText}>
              郵便番号
            </HiraginoKakuText>
          </View>
          <View style={styles.postCodeInputsContainer}>
            <View
              style={[
                styles.inputErrContainer,
                (errors.postalCode ?? "") != ""
                  ? { gap: hp("0.95%") }
                  : { gap: 0 },
              ]}
            >
              <TextInput
                style={[styles.postCodeInput, styles.postCodeInputText]}
                value={editedData.postalCode}
                onFocus={() => setBirthDateCalendarVisible(false)}
                onChangeText={(text) => handleEdit("postalCode", text)}
                inputMode="numeric"
                maxLength={8}
                onBlur={() => {
                  validateField("postalCode", editedData.postalCode ?? "");
                }}
              />
              {(errors.postalCode ?? "") != "" && (
                <HiraginoKakuText
                  style={[styles.errText, styles.errLongText]}
                  normal
                >
                  {errors.postalCode}
                </HiraginoKakuText>
              )}
            </View>
            <Button
              text="住所検索"
              onPress={() => getAddress(editedData.postalCode ?? "")}
              style={styles.btnSearch}
              type="ButtonMSecondary"
              textSize={16}
            />
          </View>
        </View>
        <View
          style={[
            styles.lastRowContainer,
            (errors.address ?? "") != ""
              ? { height: hp("14.5%") }
              : { height: hp("10.8%") },
          ]}
        >
          <View style={styles.lastRowItem}>
            <View style={styles.labelContainer}>
              <HiraginoKakuText style={styles.labelText}>住所</HiraginoKakuText>
            </View>
            <View style={styles.addressInputsContainer}>
              <View
                style={[
                  styles.inputErrContainer,
                  (errors.address ?? "") != ""
                    ? { gap: hp("0.95%") }
                    : { gap: 0 },
                ]}
              >
                <TextInput
                  style={[styles.addressInput, styles.addressInputText]}
                  value={editedData.address}
                  onChangeText={(text) => handleEdit("address", text)}
                  onFocus={() => setBirthDateCalendarVisible(false)}
                  onBlur={() => {
                    validateField("address", editedData.address ?? "");
                  }}
                />
                {(errors.address ?? "") != "" && (
                  <HiraginoKakuText style={styles.errText} normal>
                    {errors.address}
                  </HiraginoKakuText>
                )}
              </View>
              <Button
                text=""
                type="ButtonMSecondary"
                style={styles.btnCopy}
                icon={
                  <MaterialIcons
                    name="content-copy"
                    size={24}
                    color={colors.primary}
                  />
                }
                iconPosition="center"
                onPress={(event) => {
                  handleCopyPress(event, editedData.address ?? "");
                }}
              />
            </View>
          </View>
          <View style={styles.lastRowBtn}>
            <View style={styles.labelContainer}></View>
            <Button
              text="全員の住所に適用"
              type="ButtonSGray"
              style={styles.btnAddress}
              onPress={handleAddressPress}
            />
          </View>
        </View>
      </View>
    );
  };

  const getAddress = (postalCode: string) => {
    if (postalCode) {
      searchAddressFromPostalCode(postalCode)
        .then(([state, city]) => {
          handleEdit("address", `${state} ${city}`);
          errors.postalCode = "";
          errors.address = "";
          let newErrors = { ...errors };
          setErrors(newErrors);
          const errorCount = Object.values(newErrors).filter(
            (error) => error !== ""
          ).length;
          if (selectedId !== null) {
            setMemberErrors({
              ...memberErrors,
              [selectedId]: { errors: newErrors, errorCount },
            });
          }
          return true;
        })
        .catch((error) => {
          if (error.message === "Postal code not found") {
            handleEdit("address", "");
            errors.postalCode = isValidPostalCode(postalCode);
            if (!errors.postalCode) {
              errors.postalCode = "この郵便番号は使用できません";
            }
          } else {
            console.error("Other error occurred:", error);
            errors.postalCode =
              "現在、郵便番号による住所検索はご利用いただけません";
          }
        });
    } else {
      return false;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeCalendar}>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content"></StatusBar>
        <Header
          titleName="受付内容修正"
          buttonName="受付をやめる"
          onPress={handleSelectReceptionMethod}
        ></Header>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.mainContainer}
          scrollEnabled={false}
        >
          <View style={[styles.bodyContainer]}>
            <View style={styles.innerMainTitle}>
              <HiraginoKakuText style={styles.innerMainTitleText}>
                受付内容を修正してください
              </HiraginoKakuText>
            </View>
            {membersWithErrorsList.length > 0 && (
              <View style={styles.errorTitleContainer}>
                <AntDesign
                  name="exclamationcircle"
                  size={24}
                  style={styles.errorIcon}
                />
                <HiraginoKakuText style={styles.errorTitleText}>
                  {membersWithErrorsList}
                  {errorTitle}
                </HiraginoKakuText>
              </View>
            )}
            <View style={styles.outerContainer}>
              <View style={styles.sideScrollDiv}>
                <View style={styles.sideTitleDiv}>
                  <HiraginoKakuText style={styles.sideTitleText}>
                    受付人数
                    {
                      groupCheckInEditParams.entrantRecordList.entrantRecordList
                        .length
                    }
                    人
                  </HiraginoKakuText>
                </View>
                <FlatList
                  data={initialData}
                  renderItem={renderScrollItem}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={styles.scrollableGp}
                  onLayout={onLayoutHandler}
                  style={styles.scrollableGroup}
                  scrollEnabled={scrollEnabled}
                />
              </View>
              <ScrollView
                style={styles.editScrollContainer}
                scrollEnabled={editScrollEnabled}
                onLayout={onLayoutBtnHandler}
              >
                <TouchableWithoutFeedback onPress={closeCalendar}>
                  {renderInputItem()}
                </TouchableWithoutFeedback>
              </ScrollView>

              {isLeftCircleVisible && (
                <View
                  style={{
                    position: "absolute",
                    top: topPosition,
                    left: width > 1194 ? wp("26.1%") : wp("25.6%"),
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
                  style={{
                    position: "absolute",
                    top: topPosition,
                    right: -26,
                  }}
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
        </KeyboardAwareScrollView>
        <Footer
          rightButtonText="確認する"
          hasPreviousButton={false}
          showNextIcon={true}
          onPressNext={handleConfirm}
          hasNextButton={true}
        ></Footer>
        <Toast
          isVisible={toastVisible}
          x={toastX}
          y={toastY}
          text="全員の住所を変更しました"
        />
        <Tooltip
          isVisible={tooltipVisible}
          x={tooltipX}
          y={tooltipY}
          text="コピーしました"
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const RadioButton = (props: any) => {
  return (
    <View
      style={[
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: colors.fullyTransparentBlack,
          alignItems: "center",
          justifyContent: "center",
        },
        props.style,
      ]}
    >
      {props.selected ? (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 6,
            backgroundColor: colors.primary,
          }}
        />
      ) : null}
    </View>
  );
};

interface RadioPanelProps {
  selected: boolean;
  onPress: () => void;
  radioBtnText: string;
}

const RadioPanel = ({ selected, onPress, radioBtnText }: RadioPanelProps) => {
  return (
    <Pressable onPress={onPress} style={styles.radioPressable}>
      <View style={styles.radioButtonIcon}>
        <RadioButton
          selected={selected}
          style={[styles.radioButton, selected && styles.selectedRadioButton]}
        />
      </View>
      <View style={styles.radioTextContainer}>
        <HiraginoKakuText style={styles.radioText} normal>
          {radioBtnText}
        </HiraginoKakuText>
      </View>
    </Pressable>
  );
};
export default GroupCheckInEdit;
