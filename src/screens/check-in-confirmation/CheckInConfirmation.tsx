import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { Dialog } from '../../components/basics/Dialog';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { mockCompleteReception, ParticipantData } from '../../services/mockData';
import { User } from '../../models/User';
import { Event } from '../../models/Event';

export const CheckInConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event, participantData } = location.state as { 
    user: User; 
    event: Event; 
    participantData: ParticipantData;
  };

  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  };

  const confirmationStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    padding: '24px',
    borderRadius: '12px',
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
    marginBottom: '24px',
  };

  const eventInfoStyle: React.CSSProperties = {
    backgroundColor: colors.blueLightColor,
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: `1px solid ${colors.primary}`,
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.borderColor}`,
  };

  const lastInfoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.textColor,
  };

  const valueStyle: React.CSSProperties = {
    ...typography.BodyTextLarge,
    color: colors.textColor,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  };

  const handleEdit = () => {
    navigate('/check-in', {
      state: { user, event, participantData }
    });
  };

  const handleConfirm = () => {
    setConfirmModalVisible(true);
  };

  const handleFinalConfirm = async () => {
    setIsProcessing(true);
    setConfirmModalVisible(false);

    try {
      const result = await mockCompleteReception(participantData);
      
      if (result.success) {
        navigate('/completion', {
          state: { 
            user, 
            event, 
            receptionId: result.receptionId,
            participantData 
          }
        });
      }
    } catch (error) {
      console.error('Reception completion failed:', error);
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user || !event || !participantData) {
    navigate('/login');
    return null;
  }

  const confirmContent = (
    <div>
      <HiraginoKakuText style={{
        ...typography.BodyTextLarge,
        color: colors.textColor,
        textAlign: 'center',
        marginBottom: '16px',
        display: 'block'
      }}>
        以下の内容で受付を完了しますか？
      </HiraginoKakuText>
      
      <div style={{
        backgroundColor: colors.greyContainerColor,
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${colors.borderColor}`,
      }}>
        <HiraginoKakuText style={{
          ...typography.BodyTextNormal,
          color: colors.textColor,
          display: 'block'
        }}>
          <strong>参加者:</strong> {participantData.lastName} {participantData.firstName}<br />
          <strong>イベント:</strong> {event.name}
        </HiraginoKakuText>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <Header 
        titleName="受付内容確認"
        buttonName="編集に戻る"
        hasButton={true}
        onPress={handleEdit}
      />
      
      <div style={bodyStyle}>
        {/* Event Information */}
        <div style={eventInfoStyle}>
          <HiraginoKakuText style={{
            ...typography.LabelLargeBold,
            color: colors.primary,
            marginBottom: '8px',
            display: 'block'
          }}>
            📅 {event.name}
          </HiraginoKakuText>
          
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.primary,
            display: 'block'
          }}>
            {formatDate(event.startDate)} ～ {formatDate(event.endDate)}<br />
            📍 {event.venueNames}
          </HiraginoKakuText>
        </div>

        {/* Participant Information */}
        <div style={confirmationStyle}>
          <HiraginoKakuText style={{
            ...typography.HeadingSmallBold,
            color: colors.textColor,
            marginBottom: '16px',
            display: 'block'
          }}>
            参加者情報
          </HiraginoKakuText>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>氏名</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.lastName} {participantData.firstName}
            </HiraginoKakuText>
          </div>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>氏名（カナ）</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.lastNameKana} {participantData.firstNameKana}
            </HiraginoKakuText>
          </div>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>生年月日</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {formatDate(participantData.dateOfBirth)}
            </HiraginoKakuText>
          </div>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>性別</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.gender}
            </HiraginoKakuText>
          </div>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>郵便番号</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.postalCode}
            </HiraginoKakuText>
          </div>

          <div style={infoRowStyle}>
            <HiraginoKakuText style={labelStyle}>住所</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.address}
            </HiraginoKakuText>
          </div>

          <div style={lastInfoRowStyle}>
            <HiraginoKakuText style={labelStyle}>続柄</HiraginoKakuText>
            <HiraginoKakuText style={valueStyle}>
              {participantData.relationship}
            </HiraginoKakuText>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <Button
            text="編集する"
            type="ButtonMGray"
            onPress={handleEdit}
          />
          <Button
            text={isProcessing ? '受付処理中...' : '受付する'}
            type={isProcessing ? 'ButtonMDisable' : 'ButtonLPrimary'}
            onPress={handleConfirm}
            disabled={isProcessing}
          />
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: colors.greyContainerColor,
          padding: '16px',
          borderRadius: '8px',
          marginTop: '24px',
          border: `1px solid ${colors.borderColor}`,
        }}>
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.textColor,
            textAlign: 'center',
            display: 'block'
          }}>
            内容をご確認の上、「受付する」ボタンを押してください。<br />
            修正がある場合は「編集する」ボタンから修正できます。
          </HiraginoKakuText>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        isVisible={isConfirmModalVisible}
        title="受付確認"
        content={confirmContent}
        primaryButtonText="受付する"
        secondaryButtonText="キャンセル"
        onPrimaryPress={handleFinalConfirm}
        onSecondaryPress={() => setConfirmModalVisible(false)}
        onClose={() => setConfirmModalVisible(false)}
      />
    </div>
  );
};