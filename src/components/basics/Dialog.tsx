import React from 'react';
import { HiraginoKakuText } from '../common/StyledText';
import { Button } from './Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

interface DialogProps {
  isVisible: boolean;
  title?: string;
  content?: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose?: () => void;
  maxHeight?: string;
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isVisible,
  title,
  content,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  maxHeight = '400px',
  showCloseButton = true,
}) => {
  if (!isVisible) return null;

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

  const dialogStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    borderRadius: '12px',
    padding: '24px',
    minWidth: '320px',
    maxWidth: '500px',
    maxHeight,
    boxShadow: `0 8px 32px ${colors.dropdownShadowColor}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: title ? '16px' : '0',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.HeadingSmallBold,
    color: colors.textColor,
    margin: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '16px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: colors.greyTextColor,
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={e => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div style={headerStyle}>
            {title && (
              <HiraginoKakuText style={titleStyle}>
                {title}
              </HiraginoKakuText>
            )}
            {showCloseButton && (
              <button style={closeButtonStyle} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}
        
        {content && (
          <div style={contentStyle}>
            {content}
          </div>
        )}
        
        {(primaryButtonText || secondaryButtonText) && (
          <div style={buttonContainerStyle}>
            {secondaryButtonText && (
              <Button
                text={secondaryButtonText}
                type="ButtonMGray"
                onPress={onSecondaryPress}
              />
            )}
            {primaryButtonText && (
              <Button
                text={primaryButtonText}
                type="ButtonMPrimary"
                onPress={onPrimaryPress}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};