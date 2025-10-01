import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/basics/Header';
import { Button } from '../../components/basics/Button';
import { HiraginoKakuText } from '../../components/common/StyledText';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { mockFetchEvents, mockSearchEvents } from '../../services/mockData';
import { Event } from '../../models/Event';
import { User } from '../../models/User';

export const EventList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user as User;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const [searchParams, setSearchParams] = useState({
    eventName: '',
    venue: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEvents();
  }, [user, navigate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventData = await mockFetchEvents();
      setEvents(eventData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filteredEvents = await mockSearchEvents(
        searchParams.eventName,
        searchParams.venue,
        searchParams.startDate,
        searchParams.endDate
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to search events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (event: Event) => {
    navigate('/select-reception-method', {
      state: { user, event }
    });
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.bodyBackgroundColor,
    display: 'flex',
    flexDirection: 'column',
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  };

  const searchSectionStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: `0 2px 8px ${colors.shadowColor}`,
  };

  const searchRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };

  const inputStyle: React.CSSProperties = {
    ...typography.BodyTextNormal,
    padding: '8px 12px',
    border: `1px solid ${colors.borderColor}`,
    borderRadius: '6px',
    backgroundColor: colors.secondary,
    color: colors.textColor,
    outline: 'none',
    flex: 1,
    minWidth: '150px',
  };

  const eventListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const eventItemStyle: React.CSSProperties = {
    backgroundColor: colors.secondary,
    padding: '20px',
    borderRadius: '8px',
    border: `1px solid ${colors.borderColor}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const eventItemHoverStyle: React.CSSProperties = {
    ...eventItemStyle,
    boxShadow: `0 4px 12px ${colors.shadowColor}`,
    borderColor: colors.primary,
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    ...typography.BodyTextLarge,
    color: colors.greyTextColor,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={containerStyle}>
      <Header 
        titleName="受付するイベントを選んでください"
        buttonName="ログアウト"
        hasButton={true}
        onPress={handleLogout}
      />
      
      <div style={bodyStyle}>
        {/* Search Section */}
        <div style={searchSectionStyle}>
          <div style={{ marginBottom: '16px' }}>
            <Button
              text={showInputs ? '検索を閉じる' : '検索'}
              type="ButtonSPrimary"
              onPress={() => setShowInputs(!showInputs)}
            />
          </div>

          {showInputs && (
            <>
              <div style={searchRowStyle}>
                <input
                  type="text"
                  placeholder="イベント名"
                  style={inputStyle}
                  value={searchParams.eventName}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, eventName: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="会場名"
                  style={inputStyle}
                  value={searchParams.venue}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, venue: e.target.value }))}
                />
              </div>
              <div style={searchRowStyle}>
                <input
                  type="date"
                  placeholder="開始日"
                  style={inputStyle}
                  value={searchParams.startDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <input
                  type="date"
                  placeholder="終了日"
                  style={inputStyle}
                  value={searchParams.endDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  text="リセット"
                  type="ButtonSGray"
                  onPress={() => {
                    setSearchParams({ eventName: '', venue: '', startDate: '', endDate: '' });
                    loadEvents();
                  }}
                />
                <Button
                  text="検索"
                  type="ButtonSPrimary"
                  onPress={handleSearch}
                />
              </div>
            </>
          )}
        </div>

        {/* Events List */}
        {loading ? (
          <div style={loadingStyle}>
            イベントを読み込み中...
          </div>
        ) : events.length === 0 ? (
          <div style={loadingStyle}>
            イベントが見つかりませんでした
          </div>
        ) : (
          <div style={eventListStyle}>
            {events.map((event) => (
              <div
                key={event.eventId}
                style={eventItemStyle}
                onClick={() => handleEventSelect(event)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, eventItemHoverStyle);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, eventItemStyle);
                }}
              >
                <HiraginoKakuText style={{
                  ...typography.LabelLargeBold,
                  color: colors.textColor,
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  {event.name}
                </HiraginoKakuText>
                
                <HiraginoKakuText style={{
                  ...typography.BodyTextNormal,
                  color: colors.greyTextColor,
                  marginBottom: '4px',
                  display: 'block'
                }}>
                  📅 {formatDate(event.startDate)} ～ {formatDate(event.endDate)}
                </HiraginoKakuText>
                
                <HiraginoKakuText style={{
                  ...typography.BodyTextNormal,
                  color: colors.greyTextColor,
                  display: 'block'
                }}>
                  📍 {event.venueNames}
                </HiraginoKakuText>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};