import React from 'react';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

interface StyledTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  large?: boolean;
  bold?: boolean;
  small?: boolean;
  onClick?: () => void;
}

export const HiraginoKakuText: React.FC<StyledTextProps> = ({
  children,
  style = {},
  className = '',
  large = false,
  bold = false,
  small = false,
  onClick,
}) => {
  let textStyle = typography.BodyTextNormal;

  if (large && bold) {
    textStyle = typography.HeadingLargeBold;
  } else if (large) {
    textStyle = typography.BodyTextLarge;
  } else if (bold) {
    textStyle = typography.LabelLargeBold;
  } else if (small) {
    textStyle = typography.LabelSmallBold;
  }

  const combinedStyle = {
    ...textStyle,
    color: colors.textColor,
    ...style,
  };

  return (
    <span
      className={className}
      style={combinedStyle}
      onClick={onClick}
    >
      {children}
    </span>
  );
};