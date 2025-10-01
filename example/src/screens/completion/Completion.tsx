import React, { useEffect, useState } from "react";
import styles from "./CompletionStyles";
import { HiraginoKakuText } from "../../components/StyledText";
import Dialog from "../../components/basics/Dialog";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";
 
interface ModalPopupProps {
  closeModal?: () => void;
}
 
const Completion: React.FC<ModalPopupProps> = ({ closeModal }) => {
  const [seconds, setSeconds] = useState(10);
  
  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(new User(), 'Completion', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      if(seconds > 0) {
        setSeconds(seconds - 1);
      }
      if(seconds == 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  });
  return (    
    <Dialog
      dialogTitle="受付が完了しました"
      text= {<HiraginoKakuText style={styles.modalText} normal>
              {seconds}秒後に、自動で最初の画面に戻ります。
            </HiraginoKakuText>}
      firstButtonText="最初の画面に戻る"
      iconVisible={true}
      iconColor="green"
      secondButtonVisible={false}
      containerHeight={402}
      headerHeight={112}
      headerPaddingTop={40}
      containerGap={32}
      dialogBodyGap={40}
      btnContainerHeight={52}      
      onFirstButtonPress={closeModal}
    />      
  );
};
 
export default Completion;