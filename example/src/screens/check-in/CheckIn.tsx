import React, { useEffect, useState, useRef } from "react";
import {
  StatusBar,
  SafeAreaView,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import styles from "./CheckInStyle";
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
import { format } from "date-fns";
import { CheckInParams } from "./CheckInParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import {
  handleZipCodeChange,
  isKatakanaText,
  isValidPostalCode,
} from "../../environments/InputValidationMethods";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { searchAddressFromPostalCode } from "../../environments/InputMethods";
import { CheckInConfirmationParams } from "../check-in-confirmation/CheckInConfirmationParams";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

type Params = {
  checkInParams: CheckInParams;
};

export const CheckIn = ({ navigation }: Props) => {
  const route = useRoute();
  let { checkInParams } = route.params as Params;

  const [selectedOption, setSelectedOption] = useState("");
  const [isBirthDateCalendarVisible, setBirthDateCalendarVisible] =
    useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastKanaName, setLastKanaName] = useState("");
  const [firstKanaName, setFirstKanaName] = useState("");
  const [genderCode, setGenderCode] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [firstNameErrMsg, setFirstNameErrMsg] = useState("");
  const [lastNameErrMsg, setLastNameErrMsg] = useState("");
  const [kanaFirstNameErrMsg, setkanaFirstNameErrMsg] = useState("");
  const [kanaLastNameErrMsg, setKanaLastNameErrMsg] = useState("");
  const [dateOfBirthErrMsg, setDateOfBirthErrMsg] = useState("");
  const [genderErrMsg, setGenderErrMsg] = useState("");
  const [postalCodeErrMsg, setPostalCodeErrMsg] = useState("");
  const [addressErrMsg, setAddressErrMsg] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [inputContainerHeight, setInputContainerHeight] = useState(0);

  const birthDateInputRef = useRef(null);
  const birthDateRef = useRef(null);
  console.log("eventId" + checkInParams.eventId);
  console.log("userId" + checkInParams.user.userId);
  console.log("venueId" + checkInParams.venueId);
  console.log("reception code" + checkInParams.receptionTypeCode);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(checkInParams.user, 'CheckIn', 'useEffect', 'screen open');
  }, []);

  const handleSelectOption = (option: string) => {
    setSelectedOption((prevOption) =>
      prevOption === option ? prevOption : option
    );
    setGenderCode(option == "M" ? "1" : option == "F" ? "2" : "0");
    if (genderErrMsg != "") {
      setGenderErrMsg("");
    }
  };

  const handleReturn = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId = checkInParams.eventId;
    selectReceptionMethodParams.venueId = checkInParams.venueId;
    selectReceptionMethodParams.receptionTypeCode =
      checkInParams.receptionTypeCode;
    selectReceptionMethodParams.user = checkInParams.user;
    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(checkInParams.user, 'CheckIn', 'handleReturn', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  const handleValidInputs = () => {
    const isLastNameValid = handleLastNameBlur();
    const isFirstNameValid = handleFirstNameBlur();
    const isLastKanaNameValid = handleLastKanaNameBlur();
    const isFirstKanaNameValid = handleFirstKanaNameBlur();
    const isBirthDateValid = handleBirthDateBlur();
    const isGenderValid = isValidGenderCode();
    const postalCodeErr = isValidPostalCode(postalCode.trim());
    const isPostalCodeValid = postalCodeErr !== "" ? false : true;
    setPostalCodeErrMsg(postalCodeErr);
    const isAddressValid = handleAddressBlur();

    const isValid =
      isLastNameValid &&
      isFirstNameValid &&
      isLastKanaNameValid &&
      isFirstKanaNameValid &&
      isBirthDateValid &&
      isGenderValid &&
      isPostalCodeValid &&
      isAddressValid;
    return isValid;
  };

  const handleCheckInConfirmation = () => {
    handleValidInputs();
    const valid = handleValidInputs();
    if (valid) {
      const checkInConfirmationParams = new CheckInConfirmationParams();

      checkInConfirmationParams.user.userId = checkInParams.user.userId;
      checkInConfirmationParams.eventId = checkInParams.eventId;
      checkInConfirmationParams.venueId = checkInParams.venueId;
      checkInConfirmationParams.entrantRecord.originalEntrant.receptionTypeCode =
        checkInParams.receptionTypeCode;
      checkInConfirmationParams.entrantRecord.originalEntrant.lastName =
        lastName;
      checkInConfirmationParams.entrantRecord.originalEntrant.firstName =
        firstName;
      checkInConfirmationParams.entrantRecord.originalEntrant.lastNameKana =
        lastKanaName;
      checkInConfirmationParams.entrantRecord.originalEntrant.firstNameKana =
        firstKanaName;
      checkInConfirmationParams.entrantRecord.originalEntrant.dateOfBirth =
        new Date(birthDate);
      checkInConfirmationParams.entrantRecord.originalEntrant.genderCode =
        genderCode;
      checkInConfirmationParams.entrantRecord.originalEntrant.postalCode =
        postalCode;
      checkInConfirmationParams.entrantRecord.originalEntrant.address = address;
      checkInConfirmationParams.entrantRecord.modifiedEntrant =
        checkInConfirmationParams.entrantRecord.originalEntrant;

      navigation.navigate("CheckInConfirmation", {
        checkInConfirmationParams,
      });
      ActivityLogger.insertInfoLogEntry(checkInParams.user, 'CheckIn', 'handleCheckInConfirmation', 'transition', 'CheckInConfirmation', checkInConfirmationParams);
    }
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId = checkInParams.eventId;
    selectReceptionMethodParams.venueId = checkInParams.venueId;
    selectReceptionMethodParams.user.userId = checkInParams.user.userId;
    selectReceptionMethodParams.receptionTypeCode =
      checkInParams.receptionTypeCode;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(checkInParams.user, 'CheckIn', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  const handleBirthDateCalendarPress = (event: any) => {
    setBirthDateCalendarVisible(!isBirthDateCalendarVisible);
  };

  const handleBirthDateSelect = (date: any) => {
    birthDate == date ? setBirthDate("") : setBirthDate(date);
    setBirthDateCalendarVisible(false);
    setDateOfBirthErrMsg("");
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
  const onLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    setInputContainerHeight(height);
    if (height > 400) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  };

  const onCalendarLayout = (e: any) => {
    setInputContainerHeight(inputContainerHeight + hp("17%"));
  };

  const handleLastNameBlur = () => {
    setLastName(lastName.trim());
    if (!lastName || lastName === "") {
      setLastNameErrMsg("お名前を入力してください");
      return false;
    } else {
      setLastNameErrMsg("");
      return true;
    }
  };
  const handleFirstNameBlur = () => {
    setFirstName(firstName.trim());
    if (!firstName || firstName === "") {
      setFirstNameErrMsg("お名前を入力してください");
      return false;
    } else {
      setFirstNameErrMsg("");
      return true;
    }
  };
  const handleLastKanaNameBlur = () => {
    setLastKanaName(lastKanaName.trim());
    if (!lastKanaName || lastKanaName === "") {
      setKanaLastNameErrMsg("お名前（カナ）を入力してください");
      return false;
    } else if (!isKatakanaText(lastKanaName.trim())) {
      setKanaLastNameErrMsg("カタカナで入力してください");
      return false;
    } else {
      setKanaLastNameErrMsg("");
      return true;
    }
  };
  const handleFirstKanaNameBlur = () => {
    setFirstKanaName(firstKanaName.trim());
    if (!firstKanaName || firstKanaName === "") {
      setkanaFirstNameErrMsg("お名前（カナ）を入力してください");
      return false;
    } else if (!isKatakanaText(firstKanaName.trim())) {
      setkanaFirstNameErrMsg("カタカナで入力してください");
      return false;
    } else {
      setkanaFirstNameErrMsg("");
      return true;
    }
  };

  const handleBirthDateBlur = () => {
    if (!birthDate) {
      setDateOfBirthErrMsg("生年月日を選択してください");
      return false;
    } else {
      setDateOfBirthErrMsg("");
      return true;
    }
  };

  const isValidGenderCode = () => {
    if (!selectedOption) {
      setGenderErrMsg("性別を選択してください");
      return false;
    } else {
      setGenderErrMsg("");
      return true;
    }
  };

  const getAddress = (postalCode: string) => {
    if (postalCode) {
      searchAddressFromPostalCode(postalCode)
        .then(([state, city]) => {
          setAddress(`${state} ${city}`);
          setPostalCodeErrMsg("");
          setAddressErrMsg("");
          return true;
        })
        .catch((error) => {
          if (error.message === "Postal code not found") {
            setAddress("");
            setPostalCodeErrMsg(isValidPostalCode(postalCode));
            if (!postalCodeErrMsg) {
              setPostalCodeErrMsg("この郵便番号は使用できません");
            }
          } else {
            console.error("Other error occurred:", error);
            setPostalCodeErrMsg(
              "現在、郵便番号による住所検索はご利用いただけません"
            );
          }
        });
    } else {
      return false;
    }
  };

  const handleAddressBlur = () => {
    setAddress(address.trim());
    if (!address) {
      setAddressErrMsg("住所を入力してください");
      return false;
    } else {
      setAddressErrMsg("");
      return true;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeCalendar}>
      <SafeAreaView style={styles.mainContainer}>
        <StatusBar barStyle="dark-content" />
        <Header
          titleName="この場で入力して受付"
          buttonName="受付をやめる"
          onPress={handleSelectReceptionMethod}
        />
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.mainContainer}
          scrollEnabled={false}
        >
          <View style={styles.bodyContainer}>
            <HiraginoKakuText style={styles.titleText}>
              受付情報を入力してください
            </HiraginoKakuText>
            <ScrollView
              style={styles.scrollContainer}
              scrollEnabled={scrollEnabled}
            >
              <View
                style={[
                  styles.container,
                  isBirthDateCalendarVisible && {
                    height: inputContainerHeight,
                  },
                ]}
                onLayout={onLayoutHandler}
              >
                <View style={styles.nameLabelContainer}>
                  <HiraginoKakuText style={styles.labelNameText}>
                    お名前
                  </HiraginoKakuText>
                  <View style={styles.nameInputsContainer}>
                    <View
                      style={[
                        styles.inputErrContainer,
                        lastNameErrMsg != ""
                          ? { gap: hp("0.95%") }
                          : { gap: 0 },
                      ]}
                    >
                      <TextInput
                        style={[styles.LastNameInput, styles.LastNameInputText]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={lastName}
                        onChangeText={(text) => setLastName(text)}
                        onBlur={handleLastNameBlur}
                      />
                      {lastNameErrMsg != "" && (
                        <HiraginoKakuText style={styles.errText} normal>
                          {lastNameErrMsg}
                        </HiraginoKakuText>
                      )}
                    </View>
                    <View
                      style={[
                        styles.inputErrContainer,
                        firstNameErrMsg != ""
                          ? { gap: hp("0.95%") }
                          : { gap: 0 },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.FirstNameInput,
                          styles.FirstNameInputText,
                        ]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                        onBlur={handleFirstNameBlur}
                      />
                      {firstNameErrMsg != "" && (
                        <HiraginoKakuText style={styles.errText} normal>
                          {firstNameErrMsg}
                        </HiraginoKakuText>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.nameLabelContainer}>
                  <HiraginoKakuText style={styles.labelNameText}>
                    お名前（カナ）
                  </HiraginoKakuText>
                  <View style={styles.nameInputsContainer}>
                    <View
                      style={[
                        styles.inputErrContainer,
                        kanaLastNameErrMsg != ""
                          ? { gap: hp("0.95%") }
                          : { gap: 0 },
                      ]}
                    >
                      <TextInput
                        style={[styles.LastNameInput, styles.LastNameInputText]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={lastKanaName}
                        onChangeText={(text) => setLastKanaName(text)}
                        onBlur={handleLastKanaNameBlur}
                      />
                      {kanaLastNameErrMsg != "" && (
                        <HiraginoKakuText style={styles.errText} normal>
                          {kanaLastNameErrMsg}
                        </HiraginoKakuText>
                      )}
                    </View>
                    <View
                      style={[
                        styles.inputErrContainer,
                        kanaLastNameErrMsg != ""
                          ? { gap: hp("0.95%") }
                          : { gap: 0 },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.FirstNameInput,
                          styles.FirstNameInputText,
                        ]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        value={firstKanaName}
                        onChangeText={(text) => setFirstKanaName(text)}
                        onBlur={handleFirstKanaNameBlur}
                      />
                      {kanaFirstNameErrMsg != "" && (
                        <HiraginoKakuText style={styles.errText} normal>
                          {kanaFirstNameErrMsg}
                        </HiraginoKakuText>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.birthDateContainer}>
                  <HiraginoKakuText style={styles.labelBirthDateText}>
                    生年月日
                  </HiraginoKakuText>
                  <View style={styles.birthDateInputsContainer}>
                    <View
                      style={[
                        styles.inputErrContainer,
                        dateOfBirthErrMsg != ""
                          ? { gap: hp("0.95%") }
                          : { gap: 0 },
                      ]}
                    >
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
                          onBlur={handleBirthDateBlur}
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
                            style={styles.calendarContainer}
                          >
                            <CustomCalendar
                              selectedDate={birthDate}
                              onDateSelect={handleBirthDateSelect}
                              minDate={""}
                            />
                          </View>
                        )}
                      </View>
                      {dateOfBirthErrMsg != "" && (
                        <HiraginoKakuText style={styles.errText} normal>
                          {dateOfBirthErrMsg}
                        </HiraginoKakuText>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.genderContainer}>
                  <HiraginoKakuText style={styles.labelGenderText}>
                    性別
                  </HiraginoKakuText>
                  <View
                    style={[
                      styles.inputErrContainer,
                      genderErrMsg != "" ? { gap: hp("0.95%") } : { gap: 0 },
                    ]}
                  >
                    <View style={styles.genderRadioContainer}>
                      <View style={styles.radioContainer}>
                        <RadioPanel
                          selected={selectedOption === "M"}
                          onPress={() => handleSelectOption("M")}
                          radioBtnText="男性"
                        />
                      </View>
                      <View style={styles.radioContainer}>
                        <RadioPanel
                          selected={selectedOption === "F"}
                          onPress={() => handleSelectOption("F")}
                          radioBtnText="女性"
                        />
                      </View>
                      <View
                        style={[
                          styles.radioContainer,
                          styles.radioKaitouContainer,
                        ]}
                      >
                        <RadioPanel
                          selected={selectedOption === "N"}
                          onPress={() => handleSelectOption("N")}
                          radioBtnText="回答しない"
                        />
                      </View>
                    </View>
                    {genderErrMsg != "" && (
                      <HiraginoKakuText style={styles.errText} normal>
                        {genderErrMsg}
                      </HiraginoKakuText>
                    )}
                  </View>
                </View>
                <View style={styles.postCodeContainer}>
                  <HiraginoKakuText style={styles.labelPostCodeText}>
                    郵便番号
                  </HiraginoKakuText>
                  <View
                    style={[
                      styles.inputErrContainer,
                      postalCodeErrMsg != ""
                        ? { gap: hp("0.95%") }
                        : { gap: 0 },
                    ]}
                  >
                    <View style={styles.postCodeInputsContainer}>
                      <TextInput
                        value={postalCode}
                        style={[styles.postCodeInput, styles.postCodeInputText]}
                        onFocus={() => setBirthDateCalendarVisible(false)}
                        onChangeText={(text) => {
                          const formattedText = handleZipCodeChange(
                            text.trim()
                          );
                          if (formattedText !== null) {
                            setPostalCode(formattedText);
                            setPostalCodeErrMsg("");
                          } else {
                            setPostalCodeErrMsg(
                              "郵便番号は数字7桁で入力してください"
                            );
                          }
                        }}
                        inputMode="numeric"
                        maxLength={8}
                        onBlur={() => {
                          setPostalCodeErrMsg(isValidPostalCode(postalCode));
                        }}
                      />
                      <Button
                        text="住所検索"
                        onPress={() => getAddress(postalCode)}
                        style={styles.searchButton}
                        type="ButtonMSecondary"
                      />
                    </View>
                    {postalCodeErrMsg != "" && (
                      <HiraginoKakuText style={styles.errText} normal>
                        {postalCodeErrMsg}
                      </HiraginoKakuText>
                    )}
                  </View>
                </View>
                <View style={styles.addressContainer}>
                  <HiraginoKakuText style={styles.labelAddressText}>
                    住所
                  </HiraginoKakuText>
                  <View
                    style={[
                      styles.inputErrContainer,
                      addressErrMsg != "" ? { gap: hp("0.95%") } : { gap: 0 },
                    ]}
                  >
                    <TextInput
                      value={address}
                      style={[styles.addressInput, styles.addressInputText]}
                      onFocus={() => setBirthDateCalendarVisible(false)}
                      onChangeText={(text) => setAddress(text)}
                      onBlur={handleAddressBlur}
                    />
                    {addressErrMsg != "" && (
                      <HiraginoKakuText style={styles.errText} normal>
                        {addressErrMsg}
                      </HiraginoKakuText>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
        <Footer
          onPressPrevious={handleReturn}
          onPressNext={handleCheckInConfirmation}
          style={{ zIndex: -1 }}
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
