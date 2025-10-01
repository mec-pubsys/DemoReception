import React, { useEffect } from "react";
import Dialog from "../../components/basics/Dialog";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

type LogoutProps = {
  dialogHeight?: Int32;
  iconVisible?: boolean;
  dialogTitle?: string;
  text?: string;
  firstButtonText?: string;
  secondButtonText?: string;
  secondButtonVisible?: boolean;
  onLogOutButtonPress?: () => void;
  onCancelButtonPress?: () => void;
};

export const Logout = (props: LogoutProps) => {
  const defaultOnPress = () => {};
  
  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Logout', 'useEffect', 'screen open');
  }, []);

  return (
    <Dialog
      dialogTitle="ログアウト"
      text="ログアウトしますか？"
      onFirstButtonPress={props.onLogOutButtonPress || defaultOnPress}
      firstButtonText="ログアウト"
      iconVisible={false}
      secondButtonVisible={true}
      secondButtonText="キャンセル"
      onSecondButtonPress={props.onCancelButtonPress || defaultOnPress}
      containerHeight={332}
      containerGap={40}
      btnContainerHeight={120}
    />
  );
};
