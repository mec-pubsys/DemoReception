import { User } from "../../models/User";

export class SelfqrDescriptionParams implements Params {
  private _user: User = new User();
  private _eventId: number = 0;
  private _venueId: number = 0;
  private _receptionTypeCode: string = "";

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

  get venueId(): number {
    return this._venueId;
  }

  set venueId(value: number) {
    this._venueId = value;
  }

  get receptionTypeCode(): string {
    return this._receptionTypeCode;
  }

  set receptionTypeCode(value: string) {
    this._receptionTypeCode = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=SelfqrDescriptionParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ',_eventId=' + this._eventId;
    paramsString += ',_venueId=' + this._venueId;
    paramsString += ',_receptionTypeCode=' + this._receptionTypeCode;
    paramsString += ']';
    return paramsString
  }
}
