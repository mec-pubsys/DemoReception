import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { Dialog } from '../../components/basics/Dialog';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { User } from '../../models/User';
import { Event } from '../../models/Event';

export const SelectReceptionMethod: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event } = location.state as { user: User; event: Event };

  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'manual' | null>(null);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '75px', // Add padding to account for fixed header
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 24px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  };

  const eventInfoStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '32px',
    width: '100%',
    textAlign: 'center',
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
  };

  const methodContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '400px',
  };

  const methodButtonStyle: React.CSSProperties = {
    padding: '24px',
    borderRadius: '12px',
    border: `2px solid ${colors.borderColor}`,
    backgroundColor: colors.secondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  };

  const methodButtonHoverStyle: React.CSSProperties = {
    ...methodButtonStyle,
    borderColor: colors.primary,
    boxShadow: `0 4px 12px ${colors.shadowColor}`,
  };

  const handleMethodSelect = (method: 'qr' | 'manual') => {
    setSelectedMethod(method);
    setPrivacyModalVisible(true);
  };

  const handlePrivacyConsent = () => {
    setPrivacyModalVisible(false);
    
    if (selectedMethod === 'qr') {
      navigate('/selfqr-description', {
        state: { user, event }
      });
    } else {
      navigate('/check-in', {
        state: { user, event }
      });
    }
  };

  const handleBackToEventList = () => {
    navigate('/event-list', { state: { user } });
  };

  const privacyContent = (
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <HiraginoKakuText style={{
        ...typography.BodyTextNormal,
        color: colors.textColor,
        lineHeight: '1.6',
        display: 'block'
      }}>
        以下の内容に同意して受付を開始してください。
        <br /><br />
        <strong>個人情報の取り扱いについて</strong>
        <br /><br />
        1. 収集する個人情報<br />
        氏名、生年月日、住所、連絡先等の受付に必要な情報を収集いたします。
        <br /><br />
        2. 利用目的<br />
        収集した個人情報は、イベント受付管理および緊急時の連絡のためにのみ使用いたします。
        <br /><br />
        3. 第三者提供<br />
        法令に基づく場合を除き、ご本人の同意なく第三者に提供することはありません。
        <br /><br />
        4. 保管期間<br />
        個人情報は、利用目的達成後、適切に廃棄いたします。
        <br /><br />
        5. お問い合わせ<br />
        個人情報の取り扱いに関するお問い合わせは、受付窓口までご連絡ください。
      </HiraginoKakuText>
    </div>
  );

  if (!user || !event) {
    navigate('/login');
    return null;
  }

  return (
    <div style={containerStyle}>
      <Header 
        titleName="受付"
        buttonName="イベント選択に戻る"
        hasButton={true}
        onPress={handleBackToEventList}
      />
      
      <div style={bodyStyle}>
        {/* Event Information */}
        <div style={eventInfoStyle}>
          <HiraginoKakuText style={{
            ...typography.HeadingSmallBold,
            color: colors.textColor,
            marginBottom: '12px',
            display: 'block'
          }}>
            {event.name}
          </HiraginoKakuText>
          
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.greyTextColor,
            marginBottom: '8px',
            display: 'block'
          }}>
            📅 {new Date(event.startDate).toLocaleDateString('ja-JP')} ～ {new Date(event.endDate).toLocaleDateString('ja-JP')}
          </HiraginoKakuText>
          
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.greyTextColor,
            display: 'block'
          }}>
            📍 {event.venueNames}
          </HiraginoKakuText>
        </div>

        {/* Reception Method Selection */}
        <div style={methodContainerStyle}>
          <HiraginoKakuText style={{
            ...typography.LabelLargeBold,
            color: colors.textColor,
            textAlign: 'center',
            marginBottom: '16px',
            display: 'block'
          }}>
            受付方法を選択してください
          </HiraginoKakuText>

          <div
            style={methodButtonStyle}
            onClick={() => handleMethodSelect('qr')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, methodButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, methodButtonStyle)}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
            <HiraginoKakuText style={{
              ...typography.LabelLargeBold,
              color: colors.textColor,
              marginBottom: '8px',
              display: 'block'
            }}>
              QRコード受付
            </HiraginoKakuText>
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.greyTextColor,
              display: 'block'
            }}>
              自治体アプリの自己QRを読み取って受付
            </HiraginoKakuText>
          </div>

          <div
            style={methodButtonStyle}
            onClick={() => handleMethodSelect('manual')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, methodButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, methodButtonStyle)}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✏️</div>
            <HiraginoKakuText style={{
              ...typography.LabelLargeBold,
              color: colors.textColor,
              marginBottom: '8px',
              display: 'block'
            }}>
              手動入力受付
            </HiraginoKakuText>
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.greyTextColor,
              display: 'block'
            }}>
              参加者情報を手動で入力して受付
            </HiraginoKakuText>
          </div>
        </div>
      </div>

      {/* Privacy Consent Dialog */}
      <Dialog
        isVisible={isPrivacyModalVisible}
        title="プライバシー同意"
        content={privacyContent}
        primaryButtonText="同意する"
        secondaryButtonText="同意しない"
        onPrimaryPress={handlePrivacyConsent}
        onSecondaryPress={() => setPrivacyModalVisible(false)}
        onClose={() => setPrivacyModalVisible(false)}
        maxHeight="500px"
      />
    </div>
  );
};