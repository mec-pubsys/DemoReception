import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { ParticipantData } from '../../services/mockData';

export const Completion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event, receptionId, participantData } = location.state as {
    user: User;
    event: Event;
    receptionId: string;
    participantData: ParticipantData;
  };

  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlayColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    borderRadius: '12px',
    padding: '40px',
    minWidth: '400px',
    maxWidth: '500px',
    boxShadow: `0 8px 32px ${colors.dropdownShadowColor}`,
    textAlign: 'center',
    position: 'relative',
  };

  const successIconStyle: React.CSSProperties = {
    fontSize: '64px',
    marginBottom: '24px',
    animation: 'bounceIn 0.5s ease-out',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.HeadingLargeBold,
    color: colors.textColor,
    marginBottom: '24px',
  };

  const messageStyle: React.CSSProperties = {
    ...typography.BodyTextLarge,
    color: colors.textColor,
    marginBottom: '32px',
    lineHeight: '1.6',
  };

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: colors.blueLightColor,
    padding: '20px',
    borderRadius: '8px',
    border: `1px solid ${colors.primary}`,
    marginBottom: '32px',
  };

  const countdownStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.primary,
    fontSize: '24px',
    marginBottom: '24px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleNewReception = () => {
    navigate('/select-reception-method', { state: { user, event } });
  };

  if (!user || !event || !receptionId) {
    navigate('/login');
    return null;
  }

  return (
    <div style={containerStyle}>
      {/* Add CSS animation */}
      <style>
        {`
          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .pulse {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>

      <Header titleName="受付完了" />
      
      <div style={overlayStyle}>
        <div style={modalStyle}>
          {/* Success Icon */}
          <div style={successIconStyle}>
            ✅
          </div>
          
          {/* Title */}
          <HiraginoKakuText style={titleStyle}>
            受付が完了しました
          </HiraginoKakuText>
          
          {/* Message */}
          <HiraginoKakuText style={messageStyle}>
            ご参加ありがとうございます。<br />
            受付処理が正常に完了いたしました。
          </HiraginoKakuText>
          
          {/* Reception Info */}
          <div style={infoBoxStyle}>
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.primary,
              display: 'block',
              marginBottom: '8px'
            }}>
              <strong>受付ID:</strong> {receptionId}
            </HiraginoKakuText>
            
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.primary,
              display: 'block',
              marginBottom: '8px'
            }}>
              <strong>参加者:</strong> {participantData.lastName} {participantData.firstName}
            </HiraginoKakuText>
            
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.primary,
              display: 'block'
            }}>
              <strong>イベント:</strong> {event.name}
            </HiraginoKakuText>
          </div>
          
          {/* Countdown */}
          <div className="pulse">
            <HiraginoKakuText style={countdownStyle}>
              {seconds}秒後に最初の画面に戻ります
            </HiraginoKakuText>
          </div>
          
          {/* Action Buttons */}
          <div style={buttonContainerStyle}>
            <Button
              text="最初の画面に戻る"
              type="ButtonMGray"
              onPress={handleBackToLogin}
            />
            <Button
              text="続けて受付"
              type="ButtonMPrimary"
              onPress={handleNewReception}
            />
          </div>
          
          {/* Additional Info */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: `1px solid ${colors.borderColor}`,
          }}>
            <HiraginoKakuText style={{
              ...typography.BodyTextNormal,
              color: colors.greyTextColor,
              fontSize: '12px',
              display: 'block'
            }}>
              受付完了時刻: {new Date().toLocaleString('ja-JP')}
            </HiraginoKakuText>
          </div>
        </div>
      </div>
    </div>
  );
};