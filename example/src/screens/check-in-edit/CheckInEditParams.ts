import { EntrantRecord } from "../../models/EntrantRecord";
import { User } from "../../models/User";

export class CheckInEditParams implements Params {
  private _user: User = new User();
  private _eventId: number = 0;
  private _venueId: number = 0;
  private _entrantRecord: EntrantRecord = new EntrantRecord();

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

  get entrantRecord(): EntrantRecord {
    return this._entrantRecord;
  }

  set entrantRecord(value: EntrantRecord) {
    this._entrantRecord = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=CheckInEditParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ',_eventId=' + this._eventId;
    paramsString += ',_venueId=' + this._venueId;
    paramsString += ',_entrantRecord=' + this._entrantRecord.getAllValuesAsString();
    paramsString += ']';
    return paramsString
  }
}
