import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  Alert,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import { Header } from "../../components/basics/header";
import { Footer } from "../../components/basics/footer";
import { selfqrScannerstyles } from "./SelfqrScannerStyles";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { captureRef } from "react-native-view-shot";
import { Html5QrcodeScanType, Html5QrcodeScanner } from "html5-qrcode";
import { CheckInConfirmationParams } from "../check-in-confirmation/CheckInConfirmationParams";
import { SelfqrScannerParams } from "./SelfqrScannerParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { GroupCheckInConfirmationParams } from "../group-check-in-confirmation/GroupCheckInConfirmationParams";
import {
  decryptDecodedText,
  resetDecryptionState,
  getRelationshipInfo,
} from "./SelfqrScannerService";
import { EntrantRecord } from "../../models/EntrantRecord";
import { HiraginoKakuText } from "../../components/StyledText";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};
type Params = {
  selfqrScannerParams: SelfqrScannerParams;
};
export const SelfqrScanner = ({ navigation }: Props) => {
  const route = useRoute();
  let { selfqrScannerParams } = route.params as Params;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScannerReady, setIsScannerReady] = useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [countOfQrViews, setCountOfQrViews] = useState<number>();
  const [toggleMsg, setToggleMsg] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const qrCodeScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const readerRef = useRef(null);

  const [isScanning, setIsScanning] = useState<boolean | null>(null);
  let styles = selfqrScannerstyles(isScanning as boolean);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(selfqrScannerParams.user, 'SelfqrScanner', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    if (hasPermission && Platform.OS !== "ios") {
      setIsScannerReady(true);
    }
  }, [hasPermission, countOfQrViews]);

  useEffect(() => {
    // CONFIGs of Web Camera
    if (isScannerReady) {
      let intervalId: any;
      let stateCheckIntervalId: any;
      let scanningTimeout;
      let state = 0;

      const config = {
        fps: 30,
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      };

      qrCodeScannerRef.current = new Html5QrcodeScanner(
        "reader",
        config,
        false
      );
      qrCodeScannerRef.current.render(
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      stateCheckIntervalId = setInterval(() => {
        if (qrCodeScannerRef.current) {
          state = qrCodeScannerRef.current.getState();
        }

        if (state === 2 && !isScanning) {
          setIsScanning(true);
        } else if (state !== 2 && isScanning) {
          setIsScanning(false);
        }
      }, 1000);

      intervalId = setInterval(() => {
        if (state === 2) {
          setIsScanning((prev) => !prev);
        }
      }, 6000);

      scanningTimeout = setTimeout(() => {
        qrCodeScannerRef.current?.pause();
        setIsScanning(false);
      }, 300000);

      return () => {
        clearInterval(stateCheckIntervalId);
        clearInterval(intervalId);
        if (qrCodeScannerRef.current) {
          qrCodeScannerRef.current.clear();
        }
      };
    }

    // RESET
    resetDecryptionState();

    // CONFIGs of iPad
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [isScannerReady]);

  // FOR Web
  const qrCodeSuccessCallback = async (decodedText: string) => {
    // DECRYPTION
    let decryptedQ4: string, decryptedQ3: string;
    let decryptedQ2: number = 0;
    const result = decryptDecodedText(decodedText);

    if ("error" in result) {
      console.error("Error from tsx:", result.error);
      qrCodeScannerRef.current?.pause();
      setIsScanning(false);
    } else if (result.message && result.Q2) {
      console.log(result.message);
      // HANDLE QRImages
      decryptedQ2 = +result.Q2;
      if (readerRef.current) {
        const uri = await captureRef(readerRef, {
          format: "png",
          quality: 0.8,
        });
        setCapturedImages((prevImages) => [...prevImages, uri]);
        setCountOfQrViews(decryptedQ2);
      }
    } else if (result.warning) {
      setToggleMsg("QRコードはすでにスキャンされています。");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setToggleMsg("");
      }, 3000);
    } else if (result.data) {
      decryptedQ2 = +result.data.Q2;
      decryptedQ3 = result.data.Q3;
      decryptedQ4 = result.data.Q4;

      if (decryptedQ4 && decryptedQ3) {
        const Q4json = JSON.parse(decryptedQ4);
        const Q3json = JSON.parse(decryptedQ3);

        // PARAMS
        const lgapId = Q3json["h3"];
        const userRank = Q3json["h4"];
        const fullName = Q4json["1"]["2"];
        const fullNameKana = Q4json["1"]["3"];
        const dateOfBirth = Q4json["1"]["4"];
        const postalCode = Q4json["1"]["9"];
        const address = Q4json["1"]["7"];

        const [lastName, firstName]: [string, string] = fullName.split(" ");
        const [lastNameKana, firstNameKana]: [string, string] =
          fullNameKana.split(" ");

        // SET Gender Code
        let genderCode;
        if (Q4json["1"].hasOwnProperty("6")) {
          if (Q4json["1"]["6"] === "1") {
            genderCode = "0";
          } else {
            genderCode = Q4json["1"]["5"];
          }
        } else if (Q4json["1"]["5"] == null) {
          genderCode = "1";
        } else {
          genderCode = Q4json["1"]["5"];
        }

        // CHANGE Date Format
        const year: string = dateOfBirth.substring(0, 4);
        const month: string = dateOfBirth.substring(4, 6);
        const day: string = dateOfBirth.substring(6, 8);
        const formattedDate: string = `${year}-${month}-${day}`;

        // CHANGE Postal Code Format
        const firstPart: string = postalCode.substring(0, 3);
        const secondPart: string = postalCode.substring(3, 7);
        const formattedPostalCode: string = `${firstPart}-${secondPart}`;

        try {
          if (decryptedQ2 && Q4json) {
            if (qrCodeScannerRef.current) {
              await qrCodeScannerRef.current?.clear();
            }

            if (!Q4json["1"].hasOwnProperty("10")) {
              const checkInConfirmationParams = new CheckInConfirmationParams();
              checkInConfirmationParams.user = selfqrScannerParams.user;
              checkInConfirmationParams.eventId = selfqrScannerParams.eventId;
              checkInConfirmationParams.venueId = selfqrScannerParams.venueId;
              checkInConfirmationParams.isScanner = true;

              checkInConfirmationParams.entrantRecord.originalEntrant.lgapId =
                lgapId;
              checkInConfirmationParams.entrantRecord.originalEntrant.userRank =
                userRank;
              checkInConfirmationParams.entrantRecord.originalEntrant.firstName =
                firstName;
              checkInConfirmationParams.entrantRecord.originalEntrant.lastName =
                lastName;
              checkInConfirmationParams.entrantRecord.originalEntrant.firstNameKana =
                firstNameKana;
              checkInConfirmationParams.entrantRecord.originalEntrant.lastNameKana =
                lastNameKana;
              checkInConfirmationParams.entrantRecord.originalEntrant.dateOfBirth =
                new Date(formattedDate);
              checkInConfirmationParams.entrantRecord.originalEntrant.postalCode =
                formattedPostalCode;
              checkInConfirmationParams.entrantRecord.originalEntrant.genderCode =
                genderCode;
              checkInConfirmationParams.entrantRecord.originalEntrant.address =
                address;
              checkInConfirmationParams.entrantRecord.originalEntrant.familyOrderNumber = 0;
              checkInConfirmationParams.entrantRecord.originalEntrant.receptionTypeCode =
                selfqrScannerParams.receptionTypeCode;
              checkInConfirmationParams.entrantRecord.modifiedEntrant =
                checkInConfirmationParams.entrantRecord.originalEntrant;

              navigation.navigate("CheckInConfirmation", {
                checkInConfirmationParams,
              });
              ActivityLogger.insertInfoLogEntry(selfqrScannerParams.user, 'SelfqrScanner', 'qrCodeSuccessCallback', 'transition', 'CheckInConfirmation', checkInConfirmationParams);
            } else {
              if (qrCodeScannerRef.current) {
                await qrCodeScannerRef.current?.clear();
              }
              // HANDLE QRimages
              if (readerRef.current) {
                const uri = await captureRef(readerRef, {
                  format: "png",
                  quality: 0.8,
                });
                setCapturedImages((prevImages) => [...prevImages, uri]);
              }

              const groupCheckInConfirmationParams =
                new GroupCheckInConfirmationParams();
              groupCheckInConfirmationParams.user = selfqrScannerParams.user;
              groupCheckInConfirmationParams.eventId =
                selfqrScannerParams.eventId;
              groupCheckInConfirmationParams.venueId =
                selfqrScannerParams.venueId;
              groupCheckInConfirmationParams.isScanner = true;
              groupCheckInConfirmationParams.selectedEntrantIndex = 1;

              const entrantRecordList =
                groupCheckInConfirmationParams.entrantRecordList;

              // Main Person
              const entrant = new EntrantRecord();
              entrant.originalEntrant.lgapId = lgapId;
              entrant.originalEntrant.userRank = userRank;
              entrant.originalEntrant.firstName = firstName;
              entrant.originalEntrant.lastName = lastName;
              entrant.originalEntrant.firstNameKana = firstNameKana;
              entrant.originalEntrant.lastNameKana = lastNameKana;
              entrant.originalEntrant.dateOfBirth = new Date(formattedDate);
              entrant.originalEntrant.postalCode = formattedPostalCode;
              entrant.originalEntrant.genderCode = genderCode;
              entrant.originalEntrant.address = address;
              entrant.originalEntrant.familyOrderNumber = 0;
              entrant.originalEntrant.receptionTypeCode =
                selfqrScannerParams.receptionTypeCode;
              entrant.modifiedEntrant = entrant.originalEntrant;
              entrantRecordList.addEntrantRecord(entrant);

              // Other Entrants
              await Promise.all(
                Object.values(Q4json["1"]["10"]).map(
                  async (personData: any, index: number) => {
                    const [lastName, firstName]: [string, string] =
                      personData["10-5"].split(" ");
                    const [lastNameKana, firstNameKana]: [string, string] =
                      personData["10-6"].split(" ");
                    const birthDate = personData["10-7"];

                    // CHANGE Date Format
                    const year: string = birthDate.substring(0, 4);
                    const month: string = birthDate.substring(4, 6);
                    const day: string = birthDate.substring(6, 8);
                    const formattedDateOfBirth: string = `${year}-${month}-${day}`;

                    // SET Gender Code
                    let genderCode;
                    if (personData["10-9"] === "1") {
                      genderCode = "0";
                    } else {
                      genderCode = personData["10-8"];
                    }

                    // SET & CHANGE Postal Code Format
                    let postalCode;
                    if (personData["10-10"] === 1) {
                      postalCode = Q4json["1"]["9"];
                    } else {
                      postalCode = personData["10-11"];
                    }

                    const firstPart: string = postalCode.substring(0, 3);
                    const secondPart: string = postalCode.substring(3, 7);
                    const formattedPostalCode: string = `${firstPart}-${secondPart}`;

                    // SET Address
                    let address;
                    if (personData["10-10"] === 1) {
                      address = Q4json["1"]["7"];
                    } else {
                      address = personData["10-12"];
                    }

                    // SET Relationship
                    let relationship;
                    const relationResult = await getRelationshipInfo(
                      personData["10-3"]
                    );
                    if (relationResult) {
                      if (relationResult.data[0].is_manual_entry == true) {
                        relationship = personData["10-4"];
                      } else {
                        relationship = relationResult.data[0].name;
                      }
                    } else {
                      relationship = "";
                    }

                    const entrant = new EntrantRecord();
                    entrant.originalEntrant.relationship = relationship;
                    entrant.originalEntrant.firstName = firstName;
                    entrant.originalEntrant.lastName = lastName;
                    entrant.originalEntrant.firstNameKana = firstNameKana;
                    entrant.originalEntrant.lastNameKana = lastNameKana;
                    entrant.originalEntrant.dateOfBirth = new Date(
                      formattedDateOfBirth
                    );
                    entrant.originalEntrant.postalCode = formattedPostalCode;
                    entrant.originalEntrant.genderCode = genderCode;
                    entrant.originalEntrant.address = address;
                    entrant.originalEntrant.familyOrderNumber = parseInt(
                      personData["10-2"]
                    );
                    entrant.originalEntrant.receptionTypeCode =
                      selfqrScannerParams.receptionTypeCode;
                    entrant.modifiedEntrant = entrant.originalEntrant;
                    entrantRecordList.addEntrantRecord(entrant);
                  }
                )
              );

              navigation.navigate("GroupCheckInConfirmation", {
                groupCheckInConfirmationParams,
              });
              ActivityLogger.insertInfoLogEntry(selfqrScannerParams.user, 'SelfqrScanner', 'qrCodeSuccessCallback', 'transition', 'GroupCheckInConfirmation', groupCheckInConfirmationParams);
            }
          }
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      } else {
        console.error("decryptedQ4 is undefined");
      }
    }
  };

  const qrCodeErrorCallback = (errorMessage: string) => {
    const err = errorMessage;
  };

  // For iPad
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert(
        "QR Code Scanned",
        `Bar code with data ${data} has been scanned!`,
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleReturnButton = () => {
    navigation.navigate("SelfqrDescription", {
      selfqrDescriptionParams: selfqrScannerParams,
    });
    ActivityLogger.insertInfoLogEntry(selfqrScannerParams.user, 'SelfqrScanner', 'handleReturnButton', 'transition', 'SelfqrDescription', selfqrScannerParams);
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId = selfqrScannerParams.eventId;
    selectReceptionMethodParams.venueId = selfqrScannerParams.venueId;
    selectReceptionMethodParams.user = selfqrScannerParams.user;
    selectReceptionMethodParams.receptionTypeCode =
      selfqrScannerParams.receptionTypeCode;
    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(selfqrScannerParams.user, 'SelfqrScanner', 'handleSelectReceptionMethod', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <Header
        titleName="自己QRをかざしてください"
        buttonName="受付をやめる"
        onPress={handleSelectReceptionMethod}
      />
      <View style={styles.container}>
        <View style={styles.leftSide}>
          <Image
            source={require("../../assets/images/qrScanner.png")}
            style={styles.image}
          />
        </View>
        {hasPermission &&
          (Platform.OS === "ios" ? (
            <View style={styles.rightSide}>
              <View style={styles.messageContainer}>
                {isScanning && (
                  <Image
                    source={require("../../assets/images/qr_inprocess.png")}
                    style={styles.scanningMessage}
                  />
                )}

                {isScanning === false && (
                  <Image
                    source={require("../../assets/images/qr_fail.png")}
                    style={styles.errorMessage}
                  />
                )}
              </View>
              <Camera
                style={styles.camera}
                type={"back" as any}
                onBarCodeScanned={handleBarcodeScanned}
              />
              <View style={[styles.corner, styles.topLeftCorner]} />
              <View style={[styles.corner, styles.topRightCorner]} />
              <View style={[styles.corner, styles.bottomLeftCorner]} />
              <View style={[styles.corner, styles.bottomRightCorner]} />
            </View>
          ) : (
            <View style={styles.rightSide}>
              <View style={styles.messageContainer}>
                {isScanning && (
                  <Image
                    source={require("../../assets/images/qr_inprocess.png")}
                    style={styles.scanningMessage}
                  />
                )}

                {isScanning === false && (
                  <Image
                    source={require("../../assets/images/qr_fail.png")}
                    style={styles.errorMessage}
                  />
                )}
              </View>
              <View ref={readerRef} style={styles.webCamContainer}>
                <View id="reader" style={styles.webCamera} />
              </View>

              <View style={[styles.corner, styles.topLeftCornerWeb]} />
              <View style={[styles.corner, styles.topRightCornerWeb]} />
              <View style={[styles.corner, styles.bottomLeftCornerWeb]} />
              <View style={[styles.corner, styles.bottomRightCornerWeb]} />

              {toggleMsg ? (
                <View style={styles.toggleMsgContainer}>
                  <HiraginoKakuText>{toggleMsg}</HiraginoKakuText>
                </View>
              ) : null}

              <View style={styles.qrPhotoContainer}>
                {capturedImages
                  .slice(0, countOfQrViews || 0)
                  .map((uri, index) => (
                    <View key={index}>
                      <Image source={{ uri }} style={styles.capturedImage} />
                      <HiraginoKakuText normal style={styles.imageNumber}>
                        {index + 1}
                      </HiraginoKakuText>
                    </View>
                  ))}
                {Array.from({
                  length: (countOfQrViews || 0) - capturedImages.length,
                }).map((_, index) => (
                  <View key={index + capturedImages.length}>
                    <View style={styles.plainView}></View>
                    <HiraginoKakuText normal style={styles.imageNumber}>
                      {index + capturedImages.length + 1}
                    </HiraginoKakuText>
                  </View>
                ))}
              </View>
            </View>
          ))}
      </View>
      <Footer
        hasNextButton={false}
        onPressPrevious={handleReturnButton}
      ></Footer>
    </SafeAreaView>
  );
};
