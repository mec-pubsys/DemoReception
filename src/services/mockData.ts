import { Event } from '../models/Event';

// Mock user data
export const mockUser = {
  userId: 'admin',
  password: 'password123'
};

// Mock events data
export const mockEvents: Event[] = [
  {
    eventId: 1,
    name: '令和6年度 市民健康診断',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    venueNames: '市民会館大ホール、保健センター',
    modificationTimestamp: '2024-01-20T10:30:00Z'
  },
  {
    eventId: 2,
    name: '春の花見イベント',
    startDate: '2024-04-01',
    endDate: '2024-04-07',
    venueNames: '中央公園',
    modificationTimestamp: '2024-01-18T14:45:00Z'
  },
  {
    eventId: 3,
    name: '市民スポーツ大会',
    startDate: '2024-05-10',
    endDate: '2024-05-12',
    venueNames: '総合体育館、運動公園',
    modificationTimestamp: '2024-01-15T09:15:00Z'
  },
  {
    eventId: 4,
    name: '夏祭りイベント',
    startDate: '2024-07-15',
    endDate: '2024-07-16',
    venueNames: '駅前広場',
    modificationTimestamp: '2024-01-10T16:20:00Z'
  },
  {
    eventId: 5,
    name: '市民文化祭',
    startDate: '2024-10-05',
    endDate: '2024-10-07',
    venueNames: '文化会館大ホール、展示室',
    modificationTimestamp: '2024-01-08T11:00:00Z'
  }
];

// Mock login function
export const mockLogin = async (userId: string, password: string): Promise<{ success: boolean; error?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (userId === mockUser.userId && password === mockUser.password) {
    return { success: true };
  } else {
    return { success: false, error: 'ユーザーIDまたはパスワードが間違っています。' };
  }
};

// Mock events fetch function
export const mockFetchEvents = async (): Promise<Event[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockEvents;
};

// Mock search events function
export const mockSearchEvents = async (
  eventName?: string,
  venue?: string,
  startDate?: string,
  endDate?: string
): Promise<Event[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredEvents = mockEvents;
  
  if (eventName) {
    filteredEvents = filteredEvents.filter(event => 
      event.name.toLowerCase().includes(eventName.toLowerCase())
    );
  }
  
  if (venue) {
    filteredEvents = filteredEvents.filter(event => 
      event.venueNames.toLowerCase().includes(venue.toLowerCase())
    );
  }
  
  if (startDate) {
    filteredEvents = filteredEvents.filter(event => 
      event.startDate >= startDate
    );
  }
  
  if (endDate) {
    filteredEvents = filteredEvents.filter(event => 
      event.endDate <= endDate
    );
  }
  
  return filteredEvents;
};

// Mock QR scan result
export const mockQRScanResult = {
  lgapId: 'LGAP123456789',
  userData: {
    lastName: '山田',
    firstName: '太郎',
    lastNameKana: 'ヤマダ',
    firstNameKana: 'タロウ',
    dateOfBirth: '1985-03-15',
    gender: '男性',
    postalCode: '123-4567',
    address: '東京都渋谷区sample1-2-3',
    relationship: '本人'
  }
};

// Mock participant data
export interface ParticipantData {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  dateOfBirth: string;
  gender: string;
  postalCode: string;
  address: string;
  relationship: string;
}

// Mock reception completion
export const mockCompleteReception = async (_participantData: ParticipantData): Promise<{ success: boolean; receptionId?: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    receptionId: `REC${Date.now()}`
  };
};