import { User } from "../../models/User";
import { EntrantRecord } from "../../models/EntrantRecord";

export class CheckInConfirmationParams implements Params {
  private _user: User = new User();
  private _eventId: number = 0;
  private _venueId: number = 0;
  private _isScanner: boolean = false;
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

  get isScanner(): boolean {
    return this._isScanner;
  }

  set isScanner(value: boolean) {
    this._isScanner = value;
  }

  get entrantRecord(): EntrantRecord {
    return this._entrantRecord;
  }

  set entrantRecord(value: EntrantRecord) {
    this._entrantRecord = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=CheckInConfirmationParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ',_eventId=' + this._eventId;
    paramsString += ',_venueId=' + this._venueId;
    paramsString += ',_entrantRecord=' + this._entrantRecord.getAllValuesAsString();
    paramsString += ']';
    return paramsString
  }
}
