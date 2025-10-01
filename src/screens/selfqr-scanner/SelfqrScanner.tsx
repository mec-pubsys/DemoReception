import React, { useState, useEffect, useRef } from 'react';
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
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export const SelfqrScanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event } = location.state as { user: User; event: Event };

  const [isScanning, setIsScanning] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScannerReady, setIsScannerReady] = useState(false);
  
  const qrCodeScannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Request camera permission and start video preview
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
        setIsScannerReady(true);
        // Show video preview immediately on screen load
        setShowVideoPreview(true);
      })
      .catch(() => {
        setHasPermission(false);
      });

    return () => {
      // Cleanup scanner on unmount
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (isScannerReady && (isScanning || showVideoPreview)) {
      startScanner();
    } else if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear();
      qrCodeScannerRef.current = null;
    }
  }, [isScannerReady, isScanning, showVideoPreview]);

  const startScanner = () => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    const qrCodeSuccessCallback = (decodedText: string) => {
      // Only process QR results when actively scanning, not just previewing
      if (isScanning) {
        console.log('QR Code detected:', decodedText);
        setIsScanning(false);
        setShowVideoPreview(false);
        setScanResult(decodedText);
        setShowResultDialog(true);
        
        // Clean up scanner
        if (qrCodeScannerRef.current) {
          qrCodeScannerRef.current.clear();
          qrCodeScannerRef.current = null;
        }
      }
    };

    const qrCodeErrorCallback = (error: string) => {
      // Ignore errors during scanning - this is normal
      console.debug('QR scanning error:', error);
    };

    try {
      qrCodeScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      );
      
      qrCodeScannerRef.current.render(qrCodeSuccessCallback, qrCodeErrorCallback);
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      setShowVideoPreview(false);
    }
  };

  const stopScanner = () => {
    setIsScanning(false);
    setShowVideoPreview(false);
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current.clear();
      qrCodeScannerRef.current = null;
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (isScanning || showVideoPreview) ? colors.blueLightColor : colors.greyContainerColor,
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  };

  const scanLineStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '3px',
    backgroundColor: colors.primary,
    animation: isScanning ? 'scanAnimation 2s linear infinite' : 'none',
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
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setShowVideoPreview(false);
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
          
          /* html5-qrcode styling */
          #qr-reader {
            border: none !important;
          }
          
          #qr-reader__camera_selection_container {
            display: none !important;
          }
          
          #qr-reader__header_message {
            display: none !important;
          }
          
          #qr-reader__camera_permission_button {
            display: none !important;
          }
          
          #qr-reader__dashboard_section {
            display: none !important;
          }
          
          #qr-reader__dashboard_section_csr {
            display: none !important;
          }
          
          #qr-reader video {
            border-radius: 8px !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          
          #qr-reader__scan_region {
            border: none !important;
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
            {isScanning ? 'QRコードを読み取り中...' : 'QRコードをスキャンエリアに合わせてください'}
          </HiraginoKakuText>
          
          <div style={scanAreaStyle}>
            {(isScanning || showVideoPreview) ? (
              <div id="qr-reader" style={{ width: '100%', height: '100%' }}></div>
            ) : (
              <>
                {scanLineStyle && <div style={scanLineStyle} />}
                <div style={{
                  fontSize: '64px',
                  color: colors.greyTextColor,
                  transition: 'color 0.3s ease'
                }}>
                  📱
                </div>
              </>
            )}
          </div>
          
          <div style={buttonContainerStyle}>
            {!isScanning && (
              <>
                <Button
                  text="戻る"
                  type="ButtonMGray"
                  onPress={handleBackToDescription}
                />
                <Button
                  text="デモスキャン"
                  type="ButtonMGray"
                  onPress={mockScanQR}
                />
              </>
            )}
            
            {isScanning && (
              <Button
                text="スキャン中止"
                type="ButtonMGray"
                onPress={stopScanner}
              />
            )}
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
              ? '⚠️ カメラへのアクセス許可が必要です'
              : '自治体アプリで表示された自己QRコードを\nスキャンエリア内にかざしてください'
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
          // Resume video preview after closing dialog
          if (hasPermission) {
            setShowVideoPreview(true);
          }
        }}
        onClose={() => {
          setShowResultDialog(false);
          setScanResult(null);
          // Resume video preview after closing dialog
          if (hasPermission) {
            setShowVideoPreview(true);
          }
        }}
      />
    </div>
  );
};