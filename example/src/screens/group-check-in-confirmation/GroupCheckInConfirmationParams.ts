import { User } from "../../models//User"; // Adjust the path as necessary
import { EntrantRecordList } from "../../models/EntrantRecordList"; // Ensure the import path is correct

export class GroupCheckInConfirmationParams implements Params {
  private _user: User = new User();
  private _eventId: number = 0;
  private _venueId: number = 0;
  private _isScanner: boolean = false;
  private _receptionTypeCode: string = "";
  private _entrantRecordList: EntrantRecordList = new EntrantRecordList();
  private _selectedEntrantIndex: number = 0;

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

  get receptionTypeCode(): string {
    return this._receptionTypeCode;
  }

  set receptionTypeCode(value: string) {
    this._receptionTypeCode = value;
  }

  get entrantRecordList(): EntrantRecordList {
    return this._entrantRecordList;
  }

  set entrantRecordList(value: EntrantRecordList) {
    this._entrantRecordList = value;
  }
  get selectedEntrantIndex(): number {
    return this._selectedEntrantIndex;
  }

  set selectedEntrantIndex(value: number) {
    this._selectedEntrantIndex = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=GroupCheckInConfirmationParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ',_eventId=' + this._eventId;
    paramsString += ',_venueId=' + this._venueId;
    paramsString += ',_receptionTypeCode=' + this._receptionTypeCode;
    paramsString += ',_entrantRecordList=' + this._entrantRecordList.getAllValuesAsString();
    paramsString += ',_selectedEntrantIndex=' + this._selectedEntrantIndex;
    paramsString += ']';
    return paramsString
  }
}
