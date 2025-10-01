import React from 'react';
import { HiraginoKakuText } from '../common/StyledText';
import { Button } from './Button';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';

interface HeaderProps {
  titleName: string;
  buttonName?: string;
  buttonWidth?: number;
  icon?: React.ReactNode;
  iconPosition?: string;
  onPress?: () => void;
  hasButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  titleName,
  buttonName = '',
  buttonWidth,
  icon,
  iconPosition = 'front',
  onPress,
  hasButton = false,
}) => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: colors.secondary,
    borderBottom: `1px solid ${colors.borderColor}`,
    boxShadow: `0 2px 4px ${colors.headerFooterShadowColor}`,
    minHeight: '60px',
  };

  const titleStyle: React.CSSProperties = {
    ...typography.HeadingSmallBold,
    color: colors.textColor,
    margin: 0,
  };

  return (
    <header style={headerStyle}>
      <HiraginoKakuText style={titleStyle}>
        {titleName}
      </HiraginoKakuText>
      
      {hasButton && buttonName && (
        <Button
          text={buttonName}
          type="ButtonSPrimary"
          onPress={onPress}
          icon={icon}
          iconPosition={iconPosition as any}
          buttonWidth={buttonWidth}
        />
      )}
    </header>
  );
};