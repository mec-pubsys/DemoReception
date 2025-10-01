import React, { useEffect, useState } from "react";
import Dialog from "../../components/basics/Dialog";
import { View, ScrollView } from "react-native";
import { HiraginoKakuText } from "../../components/StyledText";
import styles from "./PreReceptionVerificationStyles";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type PreVerificationProps = {
  eventName: string;
  eventPeriod: string;
  venue: string;
  eventId: number;
  venueId: number;
  handleAccept?: () => void;
  handleCancel?: () => void;
};

export const PreReceptionVerification = (props: PreVerificationProps) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'PreReceptionVerification', 'useEffect', 'screen open');
  }, []);
  
  var textHeight = 0;

  const onEventLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    if (height > 27) {
      setScrollEnabled(true);
      textHeight = textHeight + height;
    } else {
      setScrollEnabled(false);
    }
  };
  const onVenueLayoutHandler = (e: any) => {
    var { height } = e.nativeEvent.layout;
    if (height > 27 || textHeight > 0) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  };

  return (
    <Dialog
      dialogTitle="受付を開始しますか？"
      text="ログアウトしますか？"
      firstButtonText="受付開始"
      iconVisible={false}
      secondButtonVisible={true}
      secondButtonText="キャンセル"
      containerHeight={493}
      containerGap={32}
      dialogBodyGap={40}
      btnContainerHeight={120}
      onFirstButtonPress={props.handleAccept}
      onSecondButtonPress={props.handleCancel}
    >
      <ScrollView scrollEnabled={scrollEnabled} style={styles.scrollContainer}>
        <View style={styles.ListContainter}>
          <HiraginoKakuText
            style={styles.subTitleText}
            onLayout={onEventLayoutHandler}
          >
            {props.eventName ? props.eventName : ""}
          </HiraginoKakuText>
          <View style={styles.upperContainer}>
            <HiraginoKakuText style={styles.innerLabel}>会場</HiraginoKakuText>
            <HiraginoKakuText
              style={styles.innerText}
              normal
              onLayout={onVenueLayoutHandler}
            >
              {props.venue ? props.venue : ""}
            </HiraginoKakuText>
          </View>
          <View style={styles.LowerContainer}>
            <HiraginoKakuText style={styles.innerLabel}>
              イベント期間
            </HiraginoKakuText>
            <HiraginoKakuText style={styles.innerText} normal>
              {props.eventPeriod ? props.eventPeriod : ""}
            </HiraginoKakuText>
          </View>
        </View>
      </ScrollView>
    </Dialog>
  );
};
