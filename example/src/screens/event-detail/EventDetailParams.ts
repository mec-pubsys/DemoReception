import { User } from "../../models/User";

export class EventDetailParams implements Params {
  private _user: User = new User();
  private _eventId: number = 0;
  private _eventName: string = "";
  private _eventPeriod: string = "";

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get eventId(): number {
    return this._eventId;
  }

  set eventId(value: number) {
    this._eventId = value;
  }

  get eventName(): string {
    return this._eventName;
  }

  set eventName(value: string) {
    this._eventName = value;
  }

  get eventPeriod(): string {
    return this._eventPeriod;
  }

  set eventPeriod(value: string) {
    this._eventPeriod = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=EventDetailParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ',_eventId=' + this._eventId;
    paramsString += ',_eventName=' + this._eventName;
    paramsString += ',_eventPeriod=' + this._eventPeriod;
    paramsString += ']';
    return paramsString
  }
}
