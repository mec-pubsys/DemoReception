import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { User } from '../../models/User';
import { Event } from '../../models/Event';

interface SlideData {
  id: string;
  text: string;
  image: string;
}

const slides: SlideData[] = [
  {
    id: "1",
    text: "[自治体アプリ]を起動して、自己QRをタップ",
    image: "/images/firstCarousel.png", // Placeholder image path
  },
  {
    id: "2", 
    text: "受付する人を選んで、自己QRを表示するをタップ",
    image: "/images/secondCarousel.png", // Placeholder image path
  },
  {
    id: "3",
    text: "自己QRが表示されます。読み取りへ進んでください",
    image: "/images/thirdCarousel.png", // Placeholder image path
  },
];

export const SelfqrDescription: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, event } = location.state as { user: User; event: Event };

  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  const carouselContainerStyle: React.CSSProperties = {
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
  };

  const slideContentStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '400px',
  };

  const imageStyle: React.CSSProperties = {
    width: '280px',
    height: '200px',
    backgroundColor: colors.greyContainerColor,
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    border: `2px dashed ${colors.borderColor}`,
  };

  const textStyle: React.CSSProperties = {
    ...typography.LabelLargeBold,
    color: colors.textColor,
    marginBottom: '32px',
    lineHeight: '1.6',
  };

  const indicatorContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const indicatorStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: colors.greyContainerColor,
    transition: 'all 0.2s ease',
  };

  const activeIndicatorStyle: React.CSSProperties = {
    ...indicatorStyle,
    backgroundColor: colors.primary,
  };

  const navigationStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: 'auto',
  };

  const handleBackToSelection = () => {
    navigate('/select-reception-method', {
      state: { user, event }
    });
  };

  const handleProceedToScanner = () => {
    navigate('/selfqr-scanner', {
      state: { user, event }
    });
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (!user || !event) {
    navigate('/login');
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div style={containerStyle}>
      <Header 
        titleName="自己QRで受付"
        buttonName="受付をやめる"
        hasButton={true}
        onPress={handleBackToSelection}
      />
      
      <div style={bodyStyle}>
        {/* Carousel */}
        <div style={carouselContainerStyle}>
          <div style={slideContentStyle}>
            {/* Image placeholder */}
            <div style={imageStyle}>
              📱
            </div>
            
            {/* Text */}
            <HiraginoKakuText style={textStyle}>
              {currentSlide.text}
            </HiraginoKakuText>
            
            {/* Page indicators */}
            <div style={indicatorContainerStyle}>
              {slides.map((_, index) => (
                <div
                  key={index}
                  style={index === currentIndex ? activeIndicatorStyle : indicatorStyle}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
            
            {/* Navigation arrows */}
            <div style={navigationStyle}>
              <Button
                text="前へ"
                type="ButtonSGray"
                onPress={scrollToPrevious}
                disabled={currentIndex === 0}
              />
              <Button
                text="次へ"
                type="ButtonSPrimary"
                onPress={scrollToNext}
                disabled={currentIndex === slides.length - 1}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={buttonContainerStyle}>
          <Button
            text="読み取りへ進む"
            type="ButtonLPrimary"
            onPress={handleProceedToScanner}
          />
        </div>
        
        {/* Instructions */}
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
            textAlign: 'center',
            display: 'block'
          }}>
            自治体アプリで自己QRを表示してから<br />
            「読み取りへ進む」をタップしてください
          </HiraginoKakuText>
        </div>
      </div>
    </div>
  );
};