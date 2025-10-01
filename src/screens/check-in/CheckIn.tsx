import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { User } from '../../models/User';
import { Event } from '../../models/Event';
import { ParticipantData } from '../../services/mockData';

export const CheckIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event } = location.state as { user: User; event: Event };

  const [formData, setFormData] = useState<ParticipantData>({
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    dateOfBirth: '',
    gender: '',
    postalCode: '',
    address: '',
    relationship: '本人'
  });

  const [errors, setErrors] = useState<Partial<ParticipantData>>({});

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '75px', // Add padding to account for fixed header
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
  };

  const formStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    padding: '24px',
    borderRadius: '12px',
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
  };

  const fieldGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  };

  const fieldRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  };

  const labelStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.textColor,
  };

  const inputStyle: React.CSSProperties = {
    ...typography.BodyTextNormal,
    padding: '12px 16px',
    border: `1px solid ${colors.borderColor}`,
    borderRadius: '8px',
    backgroundColor: colors.secondary,
    color: colors.textColor,
    outline: 'none',
    fontFamily: 'inherit',
  };

  const errorInputStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: colors.danger,
    backgroundColor: colors.errorBgColor,
  };

  const errorStyle: React.CSSProperties = {
    ...typography.BodyTextNormal,
    color: colors.danger,
    fontSize: '12px',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '24px',
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ParticipantData> = {};

    if (!formData.lastName.trim()) newErrors.lastName = '姓を入力してください';
    if (!formData.firstName.trim()) newErrors.firstName = '名を入力してください';
    if (!formData.lastNameKana.trim()) newErrors.lastNameKana = '姓（カナ）を入力してください';
    if (!formData.firstNameKana.trim()) newErrors.firstNameKana = '名（カナ）を入力してください';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = '生年月日を選択してください';
    if (!formData.gender) newErrors.gender = '性別を選択してください';
    if (!formData.postalCode.trim()) newErrors.postalCode = '郵便番号を入力してください';
    if (!formData.address.trim()) newErrors.address = '住所を入力してください';

    // Validate postal code format
    if (formData.postalCode && !/^\d{3}-\d{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = '郵便番号は123-4567の形式で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ParticipantData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePostalCodeChange = (value: string) => {
    // Auto-format postal code
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + '-' + formatted.slice(3, 7);
    }
    
    handleInputChange('postalCode', formatted);
    
    // Mock address lookup
    if (formatted === '123-4567') {
      handleInputChange('address', '東京都渋谷区sample1-2-3');
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      navigate('/check-in-confirmation', {
        state: { user, event, participantData: formData }
      });
    }
  };

  const handleBack = () => {
    navigate('/select-reception-method', {
      state: { user, event }
    });
  };

  if (!user || !event) {
    navigate('/login');
    return null;
  }

  return (
    <div style={containerStyle}>
      <Header 
        titleName="参加者情報入力"
        buttonName="戻る"
        hasButton={true}
        onPress={handleBack}
      />
      
      <div style={bodyStyle}>
        <div style={formStyle}>
          <div style={fieldGroupStyle}>
            <HiraginoKakuText style={{
              ...typography.HeadingSmallBold,
              color: colors.textColor,
              marginBottom: '8px'
            }}>
              基本情報
            </HiraginoKakuText>

            <div style={fieldRowStyle}>
              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>姓 *</HiraginoKakuText>
                <input
                  type="text"
                  style={errors.lastName ? errorInputStyle : inputStyle}
                  placeholder="山田"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
                {errors.lastName && (
                  <HiraginoKakuText style={errorStyle}>{errors.lastName}</HiraginoKakuText>
                )}
              </div>

              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>名 *</HiraginoKakuText>
                <input
                  type="text"
                  style={errors.firstName ? errorInputStyle : inputStyle}
                  placeholder="太郎"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                {errors.firstName && (
                  <HiraginoKakuText style={errorStyle}>{errors.firstName}</HiraginoKakuText>
                )}
              </div>
            </div>

            <div style={fieldRowStyle}>
              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>姓（カナ） *</HiraginoKakuText>
                <input
                  type="text"
                  style={errors.lastNameKana ? errorInputStyle : inputStyle}
                  placeholder="ヤマダ"
                  value={formData.lastNameKana}
                  onChange={(e) => handleInputChange('lastNameKana', e.target.value)}
                />
                {errors.lastNameKana && (
                  <HiraginoKakuText style={errorStyle}>{errors.lastNameKana}</HiraginoKakuText>
                )}
              </div>

              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>名（カナ） *</HiraginoKakuText>
                <input
                  type="text"
                  style={errors.firstNameKana ? errorInputStyle : inputStyle}
                  placeholder="タロウ"
                  value={formData.firstNameKana}
                  onChange={(e) => handleInputChange('firstNameKana', e.target.value)}
                />
                {errors.firstNameKana && (
                  <HiraginoKakuText style={errorStyle}>{errors.firstNameKana}</HiraginoKakuText>
                )}
              </div>
            </div>

            <div style={fieldRowStyle}>
              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>生年月日 *</HiraginoKakuText>
                <input
                  type="date"
                  style={errors.dateOfBirth ? errorInputStyle : inputStyle}
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
                {errors.dateOfBirth && (
                  <HiraginoKakuText style={errorStyle}>{errors.dateOfBirth}</HiraginoKakuText>
                )}
              </div>

              <div style={fieldStyle}>
                <HiraginoKakuText style={labelStyle}>性別 *</HiraginoKakuText>
                <select
                  style={errors.gender ? errorInputStyle : selectStyle}
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="">選択してください</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="その他">その他</option>
                </select>
                {errors.gender && (
                  <HiraginoKakuText style={errorStyle}>{errors.gender}</HiraginoKakuText>
                )}
              </div>
            </div>

            <div style={fieldStyle}>
              <HiraginoKakuText style={labelStyle}>郵便番号 *</HiraginoKakuText>
              <input
                type="text"
                style={errors.postalCode ? errorInputStyle : inputStyle}
                placeholder="123-4567"
                value={formData.postalCode}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                maxLength={8}
              />
              {errors.postalCode && (
                <HiraginoKakuText style={errorStyle}>{errors.postalCode}</HiraginoKakuText>
              )}
            </div>

            <div style={fieldStyle}>
              <HiraginoKakuText style={labelStyle}>住所 *</HiraginoKakuText>
              <input
                type="text"
                style={errors.address ? errorInputStyle : inputStyle}
                placeholder="東京都渋谷区..."
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              {errors.address && (
                <HiraginoKakuText style={errorStyle}>{errors.address}</HiraginoKakuText>
              )}
            </div>

            <div style={fieldStyle}>
              <HiraginoKakuText style={labelStyle}>続柄</HiraginoKakuText>
              <select
                style={selectStyle}
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
              >
                <option value="本人">本人</option>
                <option value="配偶者">配偶者</option>
                <option value="子">子</option>
                <option value="親">親</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <Button
              text="確認画面へ"
              type="ButtonLPrimary"
              onPress={handleNext}
            />
          </div>
        </div>

        {/* Demo hint */}
        <div style={{
          backgroundColor: colors.blueLightColor,
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px',
          border: `1px solid ${colors.primary}`,
        }}>
          <HiraginoKakuText style={{
            ...typography.BodyTextNormal,
            color: colors.primary,
            display: 'block'
          }}>
            <strong>デモ用自動入力ヒント:</strong><br />
            郵便番号に「123-4567」と入力すると住所が自動入力されます
          </HiraginoKakuText>
        </div>
      </div>
    </div>
  );
};