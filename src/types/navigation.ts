import { User } from '../models/User';
import { Event } from '../models/Event';
import { ParticipantData } from '../services/mockData';

export interface LoginParams {
  // No parameters needed for login
}

export interface EventListParams {
  user: User;
}

export interface SelectReceptionMethodParams {
  user: User;
  event: Event;
}

export interface PrivacyConsentParams {
  user: User;
  event: Event;
  receptionMethod: 'qr' | 'manual';
}

export interface SelfqrDescriptionParams {
  user: User;
  event: Event;
}

export interface SelfqrScannerParams {
  user: User;
  event: Event;
}

export interface CheckInParams {
  user: User;
  event: Event;
  participantData?: ParticipantData;
}

export interface CheckInConfirmationParams {
  user: User;
  event: Event;
  participantData: ParticipantData;
}

export interface CompletionParams {
  user: User;
  event: Event;
  receptionId: string;
}

export type RouteParams = {
  '/': LoginParams;
  '/login': LoginParams;
  '/event-list': EventListParams;
  '/select-reception-method': SelectReceptionMethodParams;
  '/privacy-consent': PrivacyConsentParams;
  '/selfqr-description': SelfqrDescriptionParams;
  '/selfqr-scanner': SelfqrScannerParams;
  '/check-in': CheckInParams;
  '/check-in-confirmation': CheckInConfirmationParams;
  '/completion': CompletionParams;
};