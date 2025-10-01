import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { mockLogin } from '../../services/mockData';
import { User } from '../../models/User';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 24px',
    maxWidth: '400px',
    margin: '0 auto',
    width: '100%',
  };

  const formStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.textColor,
  };

  const inputStyle: React.CSSProperties = {
    ...typography.BodyTextLarge,
    padding: '12px 16px',
    border: `1px solid ${colors.borderColor}`,
    borderRadius: '8px',
    backgroundColor: colors.secondary,
    color: colors.textColor,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const passwordContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.greyTextColor,
    fontSize: '16px',
    padding: '4px',
  };

  const errorStyle: React.CSSProperties = {
    ...typography.BodyTextNormal,
    color: colors.danger,
    backgroundColor: colors.errorBgColor,
    padding: '8px 12px',
    borderRadius: '4px',
    border: `1px solid ${colors.danger}`,
  };

  const handleLogin = async () => {
    if (!userid.trim() || !password.trim()) {
      setErrorMessage('ユーザーIDとパスワードを入力してください。');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await mockLogin(userid, password);
      
      if (result.success) {
        const user = new User();
        user.userId = userid;
        
        navigate('/event-list', { 
          state: { user } 
        });
      } else {
        setErrorMessage(result.error || 'ログインに失敗しました。');
      }
    } catch (error) {
      setErrorMessage('ログイン処理中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const inputNotEmpty = userid.trim().length > 0 && password.trim().length > 0;

  return (
    <div style={containerStyle}>
      <Header titleName="受付システム" />
      
      <div style={bodyStyle}>
        <form style={formStyle} onSubmit={e => e.preventDefault()}>
          <div style={inputContainerStyle}>
            <HiraginoKakuText style={labelStyle}>ID</HiraginoKakuText>
            <input
              type="text"
              style={inputStyle}
              placeholder="ID"
              value={userid}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="username"
            />
          </div>

          <div style={inputContainerStyle}>
            <HiraginoKakuText style={labelStyle}>パスワード</HiraginoKakuText>
            <div style={passwordContainerStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                style={inputStyle}
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
              />
              <button
                type="button"
                style={toggleButtonStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {errorMessage && (
            <HiraginoKakuText style={errorStyle}>
              {errorMessage}
            </HiraginoKakuText>
          )}

          <Button
            text={loading ? 'ログイン中...' : 'ログイン'}
            type={inputNotEmpty && !loading ? 'ButtonLPrimary' : 'ButtonMDisable'}
            onPress={handleLogin}
            disabled={!inputNotEmpty || loading}
          />
        </form>

        {/* Demo hint */}
        <div style={{ 
          marginTop: '32px', 
          padding: '16px', 
          backgroundColor: colors.blueLightColor,
          borderRadius: '8px',
          border: `1px solid ${colors.primary}`,
          width: '100%',
        }}>
          <HiraginoKakuText style={{ ...typography.BodyTextNormal, color: colors.primary }}>
            デモ用ログイン情報:<br />
            ID: admin<br />
            パスワード: password123
          </HiraginoKakuText>
        </div>
      </div>
    </div>
  );
};