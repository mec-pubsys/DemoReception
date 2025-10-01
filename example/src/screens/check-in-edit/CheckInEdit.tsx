import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import { checkInEditStyles } from "./CheckInEditStyle";
import { Header } from "../../components/basics/header";
import { View } from "../../components/Themed";
import { Footer } from "../../components/basics/footer";
import { HiraginoKakuText } from "../../components/StyledText";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/color";
import { Button } from "../../components/basics/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { CustomCalendar } from "../../components/basics/Calendar";
import { add, format, parse } from "date-fns";
import { CheckInEditParams } from "./CheckInEditParams";
import { CheckInConfirmationParams } from "../check-in-confirmation/CheckInConfirmationParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { searchAddressFromPostalCode } from "../../environments/InputMethods";
import {
  handleZipCodeChange,
  isKatakanaText,
  isValidPostalCode,
} from "../../environments/InputValidationMethods";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

type Params = {
  checkInEditParams: CheckInEditParams;
};

export const CheckInEdit = ({ navigation }: Props) => {
  const route = useRoute();
  const { checkInEditParams } = route.params as Params;

  const dateOfBirth =
    checkInEditParams.entrantRecord.modifiedEntrant.dateOfBirth;
  const formattedDate = dateOfBirth
    ? format(new Date(dateOfBirth), "yyyy-MM-dd")
    : "";

  const initialDateOfBirth =
    checkInEditParams.entrantRecord.originalEntrant.dateOfBirth;
  const initialFormattedDate = initialDateOfBirth
    ? format(new Date(initialDateOfBirth), "yyyy-MM-dd")
    : "";

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionCode, setSelectedOptionCode] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.genderCode
  );
  const [isBirthDateCalendarVisible, setBirthDateCalendarVisible] =
    useState(false);

  const [firstName, setFirstName] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.firstName
  );
  const [lastName, setLastName] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.lastName
  );
  const [kanaFirstName, setkanaFirstName] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.firstNameKana
  );
  const [kanaLastName, setKanaLastName] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.lastNameKana
  );
  const [birthDate, setBirthDate] = useState(formattedDate);
  const [zipCode, setZipCode] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.postalCode
  );
  const [address, setAddress] = useState(
    checkInEditParams.entrantRecord.modifiedEntrant.address
  );

  // ERR Msg
  const [firstNameErrMsg, setFirstNameErrMsg] = useState("");
  const [lastNameErrMsg, setLastNameErrMsg] = useState("");
  const [kanaFirstNameErrMsg, setkanaFirstNameErrMsg] = useState("");
  const [kanaLastNameErrMsg, setKanaLastNameErrMsg] = useState("");
  const [zipCodeErrMsg, setZipCodeErrMsg] = useState("");
  const [addressErrMsg, setAddressErrMsg] = useState("");
  const [hasAllErrMsg, setHasAllErrMsg] = useState(false);
  const styles = checkInEditStyles(hasAllErrMsg);

  const birthDateInputRef = useRef(null);
  const birthDateRef = useRef(null);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(checkInEditParams.user, 'CheckInEdit', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    if (
      !checkInEditParams.entrantRecord.modifiedEntrant.genderCode &&
      !selectedOption
    ) {
      setSelectedOptionCode("0");
      setSelectedOption("回答しない");
    }

    // SET Styles
    if (
      (firstNameErrMsg || lastNameErrMsg) &&
      (kanaFirstNameErrMsg || kanaLastNameErrMsg) &&
      zipCodeErrMsg &&
      addressErrMsg
    ) {
      setHasAllErrMsg(true);
    }
  }, [
    checkInEditParams.entrantRecord.modifiedEntrant.genderCode,
    firstNameErrMsg,
    lastNameErrMsg,
    kanaFirstNameErrMsg,
    kanaLastNameErrMsg,
    zipCodeErrMsg,
    addressErrMsg,
  ]);

  const handleGenderOption = (code: string, value: string) => {
    setSelectedOptionCode(code);
    setSelectedOption(value);
  };

  const handleReturnCheckInConfirmation = () => {
    if (
      firstName &&
      lastName &&
      isKatakanaText(kanaFirstName) &&
      isKatakanaText(kanaLastName) &&
      zipCode &&
      !zipCodeErrMsg &&
      address
    ) {
      const checkInConfirmationParams = new CheckInConfirmationParams();
      checkInConfirmationParams.user.userId = checkInEditParams.user.userId;
      checkInConfirmationParams.eventId = checkInEditParams.eventId;
      checkInConfirmationParams.venueId = checkInEditParams.venueId;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.receptionTypeCode =
        checkInEditParams.entrantRecord.originalEntrant.receptionTypeCode;

      checkInConfirmationParams.entrantRecord.modifiedEntrant.firstName =
        firstName;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.lastName =
        lastName;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.firstNameKana =
        kanaFirstName;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.lastNameKana =
        kanaLastName;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.dateOfBirth =
        new Date(birthDate);
      checkInConfirmationParams.entrantRecord.modifiedEntrant.genderCode =
        selectedOptionCode;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.postalCode =
        zipCode;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.address = address;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.lgapId =
        checkInEditParams.entrantRecord.originalEntrant.lgapId;
      checkInConfirmationParams.entrantRecord.modifiedEntrant.userRank =
        checkInEditParams.entrantRecord.originalEntrant.userRank;
      checkInConfirmationParams.entrantRecord.originalEntrant =
        checkInEditParams.entrantRecord.originalEntrant;

      checkInConfirmationParams.entrantRecord.modifiedFlags.isNameModified =
        isNameModified();
      checkInConfirmationParams.entrantRecord.modifiedFlags.isKanaNameModified =
        isKanaNameModified();
      checkInConfirmationParams.entrantRecord.modifiedFlags.isDateOfBirthModified =
        isBirthDateModified();
      checkInConfirmationParams.entrantRecord.modifiedFlags.isGenderModified =
        isGenderModified();
      checkInConfirmationParams.entrantRecord.modifiedFlags.isPostalCodeModified =
        isZipcodeModified();
      checkInConfirmationParams.entrantRecord.modifiedFlags.isAddressModified =
        isAddressModified();

      navigation.navigate("CheckInConfirmation", {
        checkInConfirmationParams,
      });
      ActivityLogger.insertInfoLogEntry(checkInEditParams.user, 'CheckInEdit', 'handleReturnCheckInConfirmation', 'transition', 'CheckInConfirmation', checkInConfirmationParams);
    } else {
      handleFirstNameBlur();
      handleLastNameBlur();
      handleKanaFirstName();
      handleKanaLastName();
      isValidPostalCode(zipCode);
      handleAddressBlur();
    }
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.user.userId = checkInEditParams.user.userId;
    selectReceptionMethodParams.eventId = checkInEditParams.eventId;
    selectReceptionMethodParams.venueId = checkInEditParams.venueId;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(checkInEditParams.user, 'CheckInEdit', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  const handleBirthDateCalendarPress = (event: any) => {
    setBirthDateCalendarVisible(!isBirthDateCalendarVisible);
  };

  const handleBirthDateSelect = (date: any) => {
    birthDate == date ? setBirthDate("") : setBirthDate(date);
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

  // HANDLE Err Msg
  const handleFirstNameBlur = () => {
    setFirstName(firstName.trim());
    if (!firstName) {
      setFirstNameErrMsg("お名前を入力してください");
    } else {
      setFirstNameErrMsg("");
    }
  };

  const handleLastNameBlur = () => {
    setLastName(lastName.trim());
    if (!lastName) {
      setLastNameErrMsg("お名前を入力してください");
    } else {
      setLastNameErrMsg("");
    }
  };

  const handleKanaFirstName = () => {
    setkanaFirstName(kanaFirstName.trim());
    if (!kanaFirstName) {
      setkanaFirstNameErrMsg("お名前（カナ）を入力してください");
    } else if (!isKatakanaText(kanaFirstName)) {
      setkanaFirstNameErrMsg("カタカナで入力してください");
    } else {
      setkanaFirstNameErrMsg("");
    }
  };

  const handleKanaLastName = () => {
    setKanaLastName(kanaLastName.trim());
    if (!kanaLastName) {
      setKanaLastNameErrMsg("お名前（カナ）を入力してください");
    } else if (!isKatakanaText(kanaLastName)) {
      setKanaLastNameErrMsg("カタカナで入力してください");
    } else {
      setKanaLastNameErrMsg("");
    }
  };

  const handleAddressBlur = () => {
    setAddress(address.trim());
    if (!address) {
      setAddressErrMsg("住所を入力してください");
    } else {
      setAddressErrMsg("");
    }
  };

  // HANDLE Update Flag
  const isNameModified = () => {
    const isChanged =
      checkInEditParams.entrantRecord.originalEntrant.lastName !== lastName ||
      checkInEditParams.entrantRecord.originalEntrant.firstName !== firstName;
    return isChanged;
  };

  const isKanaNameModified = () => {
    const isChanged =
      checkInEditParams.entrantRecord.originalEntrant.lastNameKana !==
        kanaLastName ||
      checkInEditParams.entrantRecord.originalEntrant.firstNameKana !==
        kanaFirstName;
    return isChanged;
  };

  const isBirthDateModified = () => {
    const isChanged = initialFormattedDate !== birthDate;
    return isChanged;
  };

  const isGenderModified = () => {
    const isChanged =
      checkInEditParams.entrantRecord.originalEntrant.genderCode !==
      selectedOptionCode;
    return isChanged;
  };

  const isZipcodeModified = () => {
    const isChanged =
      checkInEditParams.entrantRecord.originalEntrant.postalCode !== zipCode;
    return isChanged;
  };

  const isAddressModified = () => {
    const isChanged =
      checkInEditParams.entrantRecord.originalEntrant.address !== address;
    return isChanged;
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, width: "100%" }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.mainContainer}
      scrollEnabled={false}
    >
      <Pressable onPress={closeCalendar} style={styles.mainContainer}>
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar barStyle="dark-content" />
          <Header
            titleName="受付内容修正"
            buttonName="受付をやめる"
            onPress={handleSelectReceptionMethod}
          />
          <View style={styles.bodyContainer}>
            <HiraginoKakuText style={styles.titleText}>
              受付内容を修正してください
            </HiraginoKakuText>
            <View style={styles.container}>
              <View style={styles.nameLabelContainer}>
                <HiraginoKakuText style={styles.labelNameText}>
                  お名前
                </HiraginoKakuText>
                <View>
                  <View style={styles.nameInputsContainer}>
                    <View style={styles.inputWithErrBoxes}>
                      <TextInput
                        style={[styles.LastNameInput, styles.LastNameInputText]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={lastName}
                        onChangeText={(text) => setLastName(text)}
                        onBlur={() => {
                          isNameModified();
                          handleLastNameBlur();
                        }}
                      />
                      {typeof lastNameErrMsg === "string" &&
                        lastNameErrMsg.length > 0 && (
                          <HiraginoKakuText style={styles.errorText} normal>
                            {lastNameErrMsg}
                          </HiraginoKakuText>
                        )}
                    </View>
                    <View style={styles.inputWithErrBoxes}>
                      <TextInput
                        style={[
                          styles.FirstNameInput,
                          styles.FirstNameInputText,
                        ]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                        onBlur={() => {
                          isNameModified();
                          handleFirstNameBlur();
                        }}
                      />
                      {typeof firstNameErrMsg === "string" &&
                        firstNameErrMsg.length > 0 && (
                          <HiraginoKakuText style={styles.errorText} normal>
                            {firstNameErrMsg}
                          </HiraginoKakuText>
                        )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.nameLabelContainer}>
                <HiraginoKakuText style={styles.labelNameText}>
                  お名前（カナ）
                </HiraginoKakuText>
                <View>
                  <View style={styles.nameInputsContainer}>
                    <View style={styles.inputWithErrBoxes}>
                      <TextInput
                        style={[styles.LastNameInput, styles.LastNameInputText]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={kanaLastName}
                        onChangeText={(text) => setKanaLastName(text)}
                        onBlur={() => {
                          isKanaNameModified();
                          handleKanaLastName();
                        }}
                      />
                      {typeof kanaLastNameErrMsg === "string" &&
                        kanaLastNameErrMsg.length > 0 && (
                          <HiraginoKakuText style={styles.errorText} normal>
                            {kanaLastNameErrMsg}
                          </HiraginoKakuText>
                        )}
                    </View>
                    <View style={styles.inputWithErrBoxes}>
                      <TextInput
                        style={[
                          styles.FirstNameInput,
                          styles.FirstNameInputText,
                        ]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={kanaFirstName}
                        onChangeText={(text) => setkanaFirstName(text)}
                        onBlur={() => {
                          isKanaNameModified();
                          handleKanaFirstName();
                        }}
                      />
                      {typeof kanaFirstNameErrMsg === "string" &&
                        kanaFirstNameErrMsg.length > 0 && (
                          <HiraginoKakuText style={styles.errorText} normal>
                            {kanaFirstNameErrMsg}
                          </HiraginoKakuText>
                        )}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.birthDateContainer}>
                <HiraginoKakuText style={styles.labelBirthDateText}>
                  生年月日
                </HiraginoKakuText>
                <View style={styles.birthDateInputsContainer}>
                  <View style={styles.birthDateInput}>
                    <TextInput
                      ref={birthDateInputRef}
                      style={styles.birthDateInputText}
                      value={
                        birthDate != ""
                          ? format(new Date(birthDate), "yyyy/MM/dd")
                          : birthDate
                      }
                      onPressIn={handleBirthDateCalendarPress}
                      onPointerDown={handleBirthDateCalendarPress}
                      showSoftInputOnFocus={false}
                      onTouchStart={() => Keyboard.dismiss()}
                      inputMode="none"
                      onBlur={isBirthDateModified}
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
                      <CustomCalendar
                        selectedDate={birthDate}
                        onDateSelect={handleBirthDateSelect}
                        minDate={""}
                      />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.genderContainer}>
                <HiraginoKakuText style={styles.labelGenderText}>
                  性別
                </HiraginoKakuText>
                <View style={styles.genderRadioContainer}>
                  <View style={styles.radioContainer}>
                    <RadioPanel
                      selected={selectedOptionCode === "1"}
                      onPress={() => handleGenderOption("1", "男性")}
                      radioBtnText="男性"
                    />
                  </View>
                  <View style={styles.radioContainer}>
                    <RadioPanel
                      selected={selectedOptionCode === "2"}
                      onPress={() => handleGenderOption("2", "女性")}
                      radioBtnText="女性"
                    />
                  </View>
                  <View
                    style={[styles.radioContainer, styles.radioKaitouContainer]}
                  >
                    <RadioPanel
                      selected={selectedOptionCode === "0"}
                      onPress={() => handleGenderOption("0", "回答しない")}
                      radioBtnText="回答しない"
                    />
                  </View>
                </View>
              </View>
              <View style={styles.postCodeContainer}>
                <HiraginoKakuText style={styles.labelPostCodeText}>
                  郵便番号
                </HiraginoKakuText>
                <View style={styles.inputWithErrBoxes}>
                  <View style={styles.postCodeInputsContainer}>
                    <TextInput
                      style={[styles.postCodeInput, styles.postCodeInputText]}
                      onFocus={() => setBirthDateCalendarVisible(false)}
                      value={zipCode}
                      onChangeText={(text) => {
                        const formattedText = handleZipCodeChange(text);
                        if (formattedText !== null) {
                          setZipCode(formattedText);
                          setZipCodeErrMsg("");
                        } else {
                          setZipCodeErrMsg(
                            "郵便番号は数字7桁で入力してください"
                          );
                        }
                      }}
                      inputMode="numeric"
                      maxLength={8}
                      onBlur={() => {
                        setZipCodeErrMsg(isValidPostalCode(zipCode));
                        isZipcodeModified();
                      }}
                    />
                    <Button
                      text="住所検索"
                      onPress={() => {
                        if (zipCode) {
                          searchAddressFromPostalCode(zipCode)
                            .then(([state, city]) => {
                              setAddress(`${state} ${city}`);
                              setZipCodeErrMsg("");
                              setAddressErrMsg("");
                            })
                            .catch((error) => {
                              if (error.message === "Postal code not found") {
                                setAddress("");
                                setZipCodeErrMsg(isValidPostalCode(zipCode));
                                if (!zipCodeErrMsg) {
                                  setZipCodeErrMsg(
                                    "この郵便番号は使用できません"
                                  );
                                }
                              } else {
                                console.error("Other error occurred:", error);
                                setZipCodeErrMsg(
                                  "現在、郵便番号による住所検索はご利用いただけません"
                                );
                              }
                            });
                        }
                      }}
                      style={styles.searchButton}
                      type="ButtonMSecondary"
                    />
                  </View>
                  {typeof zipCodeErrMsg === "string" &&
                    zipCodeErrMsg.length > 0 && (
                      <HiraginoKakuText style={styles.errorText} normal>
                        {zipCodeErrMsg}
                      </HiraginoKakuText>
                    )}
                </View>
              </View>
              <View style={styles.addressContainer}>
                <HiraginoKakuText style={styles.labelAddressText}>
                  住所
                </HiraginoKakuText>
                <View style={styles.inputWithErrBoxes}>
                  <TextInput
                    style={[styles.addressInput, styles.addressInputText]}
                    onFocus={() => setBirthDateCalendarVisible(false)}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    onBlur={() => {
                      isAddressModified();
                      handleAddressBlur();
                    }}
                  />
                  {typeof addressErrMsg === "string" &&
                    addressErrMsg.length > 0 && (
                      <HiraginoKakuText style={styles.errorText} normal>
                        {addressErrMsg}
                      </HiraginoKakuText>
                    )}
                </View>
              </View>
            </View>
          </View>
          <Footer
            rightButtonText="確認する"
            hasPreviousButton={false}
            onPressNext={handleReturnCheckInConfirmation}
            style={{ zIndex: -1 }}
          ></Footer>
        </SafeAreaView>
      </Pressable>
    </KeyboardAwareScrollView>
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
  const styles = checkInEditStyles(false);
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
