import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { styles } from "./EventDetailStyles";
import { Header } from "../../components/basics/header";
import { Footer } from "../../components/basics/footer";
import { HiraginoKakuText } from "../../components/StyledText";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { PreReceptionVerification } from "../pre-reception-verification/PreReceptionVerification";
import { getVenueNameAndId } from "./EventDetailService";
import { EventDetailParams } from "./EventDetailParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { EventListParams } from "../event-list/EventListParams";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

type Params = {
  eventDetailParams: EventDetailParams;
};

export const EventDetail = ({ navigation }: Props) => {
  const route = useRoute();
  const { eventDetailParams } = route.params as Params;
  const [selectedVenueId, setselectedVenueId] = useState(0);
  const [selectedVenue, setselectedVenue] = useState("");
  const [isPreReceptionModalVisible, setIsPreReceptionModalVisible] =
    useState(false);
  const [venueNames, setVenueNames] = useState<any[]>([]);
  const [radioErrMsg, setRadioErrMsg] = useState("");
  const [venueDbResult, setVenueDbResult] = useState<any[]>([]);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(eventDetailParams.user, 'EventDetail', 'useEffect', 'screen open');

    const fetchData = async () => {
      const result = await fetchVenueName();
      setVenueNames(result);
    };

    fetchData();
  }, []);

  let eventTime = "";
  // CHECK EventTime
  if (!eventDetailParams.eventPeriod) {
    eventTime = "指定なし";
  } else {
    eventTime = eventDetailParams.eventPeriod;
  }

  // GET VenueName and Id
  const fetchVenueName = async () => {
    if (eventDetailParams.eventId) {
      const result = await getVenueNameAndId(eventDetailParams.eventId);
      setVenueDbResult(result.data);
      return result.data;
    } else {
      console.log("Error: イベントIDまたは会場IDには値がありません");
    }
  };

  const fetchName = async (venueId: number) => {
    // GET VenueName
    const venue = venueDbResult.find(
      (venue: { venue_id: number }) => venue.venue_id === venueId
    );
    if (venue) {
      setselectedVenue(venue.name);
    } else {
      console.log(`Error: Venue with ID ${venueId} not found.`);
    }
  };

  const handleSelectedVenue = async (option: number) => {
    if (option) {
      setselectedVenueId(option);
      await fetchName(option);
    }
  };

  const handleBack = () => {
    const eventListParams = new EventListParams();
    eventListParams.user = eventDetailParams.user;
    navigation.navigate("EventList", {
      eventListParams
    });
    ActivityLogger.insertInfoLogEntry(eventDetailParams.user, 'EventDetail', 'handleBack', 'transition', 'EventList', eventListParams);
  };

  const handleNext = () => {
    if (selectedVenue) {
      if (eventDetailParams.eventId && selectedVenueId) {
        setIsPreReceptionModalVisible(true);
      } else {
        console.log("Error: イベントIDまたは会場IDには値がありません");
      }
    } else {
      setRadioErrMsg("会場を選択してください");
    }
  };

  const handleAccept = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.user = eventDetailParams.user;
    selectReceptionMethodParams.eventId = eventDetailParams.eventId;
    selectReceptionMethodParams.venueId = selectedVenueId;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
    ActivityLogger.insertInfoLogEntry(eventDetailParams.user, 'EventDetail', 'handleAccept', 'transition', 'SelectReceptionMethod', selectReceptionMethodParams);
    setIsPreReceptionModalVisible(false);
  };

  const handleCancel = () => {
    setIsPreReceptionModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.detailMainContainer}>
      <StatusBar barStyle="dark-content" />
      <Header titleName="詳細" buttonName="" hasButton={false} />
      <View style={styles.detailContainer}>
        <View style={styles.detailBodyContainer}>
          <ScrollView>
            <View style={styles.detailOuterFrame1}>
              <HiraginoKakuText style={styles.subTitle}>
                {eventDetailParams.eventName}
              </HiraginoKakuText>
              <View style={styles.detailInnerFrame1}>
                <HiraginoKakuText style={styles.eventText} normal>
                  イベント期間：
                </HiraginoKakuText>
                <HiraginoKakuText style={styles.eventText} normal>
                  {eventTime}
                </HiraginoKakuText>
              </View>
            </View>

            <View style={styles.detailLineBreak}></View>

            <View style={styles.detailOuterFrame2}>
              <View style={styles.detailInnerFrame2}>
                <HiraginoKakuText style={styles.sentakuTitleText}>
                  会場
                </HiraginoKakuText>
                <HiraginoKakuText style={styles.sentakuSubTitleText} normal>
                  受付する会場を選択してください。
                </HiraginoKakuText>
              </View>

              {typeof radioErrMsg === "string" && radioErrMsg.length > 0 && (
                <HiraginoKakuText style={styles.errorText} normal>
                  {radioErrMsg}
                </HiraginoKakuText>
              )}

              {venueNames == undefined ? (
                <HiraginoKakuText>
                  イベントIDに対応する会場はありません。
                </HiraginoKakuText>
              ) : (
                venueNames.map((venue, index) => (
                  <RadioPanel
                    key={index}
                    selected={selectedVenueId === venue.venue_id}
                    onPress={() => handleSelectedVenue(venue.venue_id)}
                    radioBtnText={venue.name}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
      <Footer
        rightButtonText="受付開始"
        showNextIcon={false}
        onPressPrevious={handleBack}
        onPressNext={handleNext}
      ></Footer>
      {isPreReceptionModalVisible && (
        <PreReceptionVerification
          eventName={eventDetailParams.eventName}
          eventPeriod={
            eventDetailParams.eventPeriod == "" ||
              eventDetailParams.eventPeriod == null
              ? "指定なし"
              : eventDetailParams.eventPeriod
          }
          venue={selectedVenue}
          eventId={eventDetailParams.eventId}
          venueId={selectedVenueId}
          handleAccept={handleAccept}
          handleCancel={handleCancel}
        />
      )}
    </SafeAreaView>
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
          borderColor: "#000",
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
            backgroundColor: "#346DF4",
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
    <View style={[styles.radioPanel, selected && styles.selectedRadioPanel]}>
      <Pressable onPress={onPress} style={styles.radioPressable}>
        <View style={styles.radioButtonIcon}>
          <RadioButton
            selected={selected}
            style={[styles.radioButton, selected && styles.selectedRadioButton]}
          />
        </View>
        <View style={styles.radioTextContainer}>
          <HiraginoKakuText style={styles.radioText}>
            {radioBtnText}
          </HiraginoKakuText>
        </View>
      </Pressable>
    </View>
  );
};
