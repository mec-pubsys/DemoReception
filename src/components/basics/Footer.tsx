import React from 'react';
import { colors } from '../../styles/colors';

export const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: colors.secondary,
    borderTop: `1px solid ${colors.borderColor}`,
    boxShadow: `0 -2px 4px ${colors.headerFooterShadowColor}`,
    marginTop: 'auto',
  };

  return (
    <footer style={footerStyle}>
      {/* Footer content can be added here if needed */}
    </footer>
  );
};