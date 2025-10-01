export interface Event {
  eventId: number;
  name: string;
  startDate: string;
  endDate: string;
  venueNames: string;
  modificationTimestamp: string;
}

export interface EventParams {
  user: any;
  eventId: number;
  eventName: string;
  eventStartDate: string;
  eventEndDate: string;
  venueNames: string;
}