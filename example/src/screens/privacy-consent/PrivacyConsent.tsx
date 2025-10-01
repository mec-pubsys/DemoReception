import React, { useEffect, useState } from "react";
import Dialog from "../../components/basics/Dialog";
import { ScrollView, View, LayoutChangeEvent } from "react-native";
import { HiraginoKakuText } from "../../components/StyledText";
import styles from "./PrivacyConsentStyles";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  onHandleAgree?: () => void;
  onHandleDisagree?: () => void;
};

export const PravicyConsent = (props: Props) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'PrivacyConsent', 'useEffect', 'screen open');
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 327) {
      setScrollEnabled(true);
    }
  };

  return (
    <Dialog
      dialogTitle={
        <HiraginoKakuText style={styles.titleText}>
          以下の内容に同意して{"\n"}受付を開始してください
        </HiraginoKakuText>
      }
      firstButtonText="同意する"
      iconVisible={false}
      secondButtonVisible={true}
      secondButtonText="同意しない"
      onFirstButtonPress={props.onHandleAgree}
      onSecondButtonPress={props.onHandleDisagree}
      containerHeight={696}
      containerWidth={545}
      containerGap={32}
      dialogBodyGap={40}
      btnContainerHeight={120}
      dialogItemWidth={433}
      dialogBodyHeight={456}
    >
      <View style={styles.contentContainter}>
        <ScrollView
          style={{ flexGrow: 1, width: "100%" }}
          scrollEnabled={scrollEnabled}
        >
          <HiraginoKakuText
            style={styles.contentText}
            normal
            onLayout={onLayout}
          >
            個人情報の取得および利用{"\n"}
            ・等サイトにおける個人情報の取得は、当サイト上で提供するサービスの充実ならびに円滑な提供（提供事業者によるサービスの提供を含む）および当サイトの円滑な運用を目的とし、その目的の達成に必要な範囲内で行います。
            {"\n"}
            ・取得した個人情報は、取得目的の範囲内で利用し、これらの目的以外で利用する場合には、利用者に対し事前に確認または同意を求めます。・取得した個人情報は、取得目的の範囲内で利用し、これらの目的以外で利用する場合には、利用者に対し事前に確認または同意を求めます。・取得した個人情報は、取得目的の範囲内で利用
            ・取得した個人情報は、取得目的の範囲内で利用し、これらの目的以外で利用する場合には、利用者に対し事前に確認または同意を求めます。・取得した個人情報は、取得目的の範囲内で利用し、これらの目的以外で利用する場合には、利用者に対し事前に確認または同意を求めます。・取得した個人情報は、取得目的の範囲内で利用
          </HiraginoKakuText>
        </ScrollView>
      </View>
    </Dialog>
  );
};
