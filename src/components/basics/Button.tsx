import React from 'react';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

export type ButtonType = 
  | "ButtonMPrimary"
  | "ButtonMDisable"
  | "ButtonSDisable"
  | "ButtonLPrimary"
  | "ButtonSPrimary"
  | "ButtonLGray"
  | "ButtonMediumGray"
  | "ButtonSGray"
  | "ButtonLText"
  | "ButtonMGray"
  | "ButtonMSecondary";

interface ButtonProps {
  onPress?: () => void;
  text: string;
  type?: ButtonType;
  style?: React.CSSProperties;
  textSize?: number;
  icon?: React.ReactNode;
  iconPosition?: "front" | "behind" | "center";
  buttonWidth?: number;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  text,
  type = "ButtonMPrimary",
  style = {},
  textSize,
  icon,
  iconPosition = "front",
  buttonWidth,
  disabled = false,
}) => {
  const getButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '12px 24px',
      gap: '8px',
      transition: 'all 0.2s ease',
      ...typography.ButtonMediumBold,
      width: buttonWidth ? `${buttonWidth}px` : 'auto',
    };

    switch (type) {
      case "ButtonMPrimary":
      case "ButtonLPrimary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray : colors.primary,
          color: colors.secondary,
          padding: type === "ButtonLPrimary" ? '16px 32px' : '12px 24px',
        };
      case "ButtonSPrimary":
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.gray : colors.primary,
          color: colors.secondary,
          padding: '8px 16px',
          ...typography.ButtonSmallBold,
        };
      case "ButtonLGray":
      case "ButtonMediumGray":
      case "ButtonMGray":
        return {
          ...baseStyle,
          backgroundColor: colors.greyContainerColor,
          color: colors.textColor,
          padding: type === "ButtonLGray" ? '16px 32px' : '12px 24px',
        };
      case "ButtonSGray":
        return {
          ...baseStyle,
          backgroundColor: colors.greyContainerColor,
          color: colors.textColor,
          padding: '8px 16px',
          ...typography.ButtonSmallBold,
        };
      case "ButtonMDisable":
      case "ButtonSDisable":
        return {
          ...baseStyle,
          backgroundColor: colors.gray,
          color: colors.greyTextColor,
          cursor: 'not-allowed',
          padding: type === "ButtonSDisable" ? '8px 16px' : '12px 24px',
        };
      case "ButtonLText":
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `1px solid ${colors.borderColor}`,
          padding: '16px 32px',
        };
      case "ButtonMSecondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          color: colors.primary,
          border: `1px solid ${colors.primary}`,
        };
      default:
        return baseStyle;
    }
  };

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const buttonStyle = {
    ...getButtonStyle(),
    ...style,
  };

  const textStyle = textSize ? { fontSize: `${textSize}px` } : {};

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && iconPosition === "front" && icon}
      {icon && iconPosition === "center" && !text ? icon : (
        <span style={textStyle}>{text}</span>
      )}
      {icon && iconPosition === "behind" && icon}
    </button>
  );
};