import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { Dialog } from '../../components/basics/Dialog';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { mockQRScanResult } from '../../services/mockData';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { Scanner } from '@yudiel/react-qr-scanner';

export const SelfqrScanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event } = location.state as { user: User; event: Event };

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerPaused, setScannerPaused] = useState(false);
  const [isMockScanning, setIsMockScanning] = useState(false);

  useEffect(() => {
    // Check camera availability and permissions
    const checkCameraAvailability = async () => {
      try {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn('getUserMedia is not supported in this browser');
          setHasPermission(false);
          return;
        }

        // Try to enumerate devices to check if camera exists
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        
        if (!hasVideoDevice) {
          console.warn('No camera device found');
          setHasPermission(false);
        } else {
          console.log('Camera device available, scanner will auto-start');
          setHasPermission(true);
        }
      } catch (error) {
        console.warn('Error checking camera availability:', error);
        setHasPermission(false);
      }
    };

    checkCameraAvailability();
  }, []);



  // Handle QR scan success
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0 && !scannerPaused) {
      const qrCode = detectedCodes[0];
      console.log('QR Code detected:', qrCode.rawValue);
      setScanResult(qrCode.rawValue);
      setShowResultDialog(true);
      setScannerPaused(true); // Pause scanning while showing dialog
    }
  };

  // Handle scanner errors
  const handleError = (error: unknown) => {
    console.warn('QR Scanner error:', error);
    if (error instanceof Error && error.message.includes('Permission')) {
      setHasPermission(false);
    }
  };

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
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  };

  const scannerContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: '12px',
    padding: '32px',
    margin: '24px 0',
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
    position: 'relative',
  };

  const scanAreaStyle: React.CSSProperties = {
    width: '300px',
    height: '300px',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: hasPermission ? colors.blueLightColor : colors.greyContainerColor,
    transition: 'all 0.3s ease',
  };

  const scanLineStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '3px',
    backgroundColor: colors.primary,
    animation: isMockScanning ? 'scanAnimation 2s linear infinite' : 'none',
  };

  const instructionStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.textColor,
    textAlign: 'center',
    marginBottom: '32px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '24px',
  };

  const mockScanQR = () => {
    setIsMockScanning(true);
    setScannerPaused(true); // Pause the real scanner during mock scan
    
    // Simulate scanning delay
    setTimeout(() => {
      setIsMockScanning(false);
      setScanResult(mockQRScanResult.lgapId);
      setShowResultDialog(true);
    }, 3000);
  };

  const handleScanSuccess = () => {
    setShowResultDialog(false);
    
    // Navigate to check-in confirmation with scanned data
    navigate('/check-in-confirmation', {
      state: { 
        user, 
        event,
        participantData: mockQRScanResult.userData
      }
    });
  };

  const handleBackToDescription = () => {
    navigate('/selfqr-description', {
      state: { user, event }
    });
  };

  const handleBackToSelection = () => {
    navigate('/select-reception-method', {
      state: { user, event }
    });
  };

  if (!user || !event) {
    navigate('/login');
    return null;
  }

  const resultContent = scanResult ? (
    <div>
      <HiraginoKakuText style={{
        ...typography.BodyTextLarge,
        color: colors.textColor,
        textAlign: 'center',
        marginBottom: '16px',
        display: 'block'
      }}>
        QRコードの読み取りが完了しました！
      </HiraginoKakuText>
      
      <div style={{
        backgroundColor: colors.blueLightColor,
        padding: '16px',
        borderRadius: '8px',
        border: `1px solid ${colors.primary}`,
      }}>
        <HiraginoKakuText style={{
          ...typography.BodyTextNormal,
          color: colors.textColor,
          display: 'block'
        }}>
          <strong>参加者情報:</strong><br />
          {mockQRScanResult.userData.lastName} {mockQRScanResult.userData.firstName}<br />
          ({mockQRScanResult.userData.lastNameKana} {mockQRScanResult.userData.firstNameKana})
        </HiraginoKakuText>
      </div>
    </div>
  ) : null;

  return (
    <div style={containerStyle}>
      {/* Add CSS animation */}
      <style>
        {`
          @keyframes scanAnimation {
            0% { top: 0; }
            50% { top: calc(100% - 3px); }
            100% { top: 0; }
          }
          

        `}
      </style>

      <Header 
        titleName="自己QRをかざしてください"
        buttonName="受付をやめる"
        hasButton={true}
        onPress={handleBackToSelection}
      />
      
      <div style={bodyStyle}>
        {/* Scanner Area */}
        <div style={scannerContainerStyle}>
          <HiraginoKakuText style={instructionStyle}>
            {isMockScanning 
              ? 'QRコードを読み取り中...' 
              : hasPermission 
                ? 'QRコードをスキャンエリアにかざしてください'
                : 'カメラが利用できません'
            }
          </HiraginoKakuText>
          
          <div style={scanAreaStyle}>
            {hasPermission ? (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                paused={scannerPaused}
                styles={{
                  container: { width: '100%', height: '100%' },
                  video: { width: '100%', height: '100%', objectFit: 'cover' }
                }}
                formats={['qr_code']}
                components={{
                  finder: true,
                  torch: true,
                  zoom: false,
                  onOff: false
                }}
              />
            ) : (
              <>
                {isMockScanning && <div style={scanLineStyle} />}
                <div style={{
                  fontSize: '64px',
                  color: colors.greyTextColor,
                  transition: 'color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  📱
                </div>
              </>
            )}
          </div>
          
          <div style={buttonContainerStyle}>
            <Button
              text="戻る"
              type="ButtonMGray"
              onPress={handleBackToDescription}
            />
            {hasPermission && !isMockScanning && (
              <Button
                text={scannerPaused ? "スキャン再開" : "スキャン一時停止"}
                type="ButtonMPrimary"
                onPress={() => setScannerPaused(!scannerPaused)}
              />
            )}
            <Button
              text="デモスキャン"
              type="ButtonMGray"
              onPress={mockScanQR}
              disabled={isMockScanning}
            />
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          backgroundColor: colors.blueLightColor,
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${colors.primary}`,
        }}>
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.primary,
            textAlign: 'center',
            display: 'block'
          }}>
            {hasPermission === false 
              ? '⚠️ カメラが利用できません。ブラウザの設定でカメラへのアクセスを許可してください'
              : '自治体アプリで表示された自己QRコードを\nスキャンエリア内にかざしてください。\nQRコードが検出されると自動的に読み取ります。'
            }
            <br />
            <br />
            <small>※ デモ版では「デモスキャン」ボタンでテストできます</small>
          </HiraginoKakuText>
        </div>
      </div>

      {/* Scan Result Dialog */}
      <Dialog
        isVisible={showResultDialog}
        title="QR読み取り完了"
        content={resultContent}
        primaryButtonText="受付確認へ進む"
        secondaryButtonText="再スキャン"
        onPrimaryPress={handleScanSuccess}
        onSecondaryPress={() => {
          setShowResultDialog(false);
          setScanResult(null);
          // Resume scanning after closing dialog
          setScannerPaused(false);
        }}
        onClose={() => {
          setShowResultDialog(false);
          setScanResult(null);
          // Resume scanning after closing dialog
          setScannerPaused(false);
        }}
      />
    </div>
  );
};