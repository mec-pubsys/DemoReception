export class Entrant implements Params {
  private _lastName: string = "";
  private _firstName: string = "";
  private _lastNameKana: string = "";
  private _firstNameKana: string = "";
  private _dateOfBirth: Date | null = null;
  private _genderCode: string = "";
  private _postalCode: string = "";
  private _address: string = "";
  private _receptionTypeCode: string = "";
  private _familyOrderNumber: number = 0;
  private _relationship: string = "";
  private _lgapId: string = "";
  private _userRank: string = "";

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastNameKana(): string {
    return this._lastNameKana;
  }

  set lastNameKana(value: string) {
    this._lastNameKana = value;
  }

  get firstNameKana(): string {
    return this._firstNameKana;
  }

  set firstNameKana(value: string) {
    this._firstNameKana = value;
  }

  get dateOfBirth(): Date | null {
    return this._dateOfBirth;
  }

  set dateOfBirth(value: Date | null) {
    this._dateOfBirth = value;
  }

  get genderCode(): string {
    return this._genderCode;
  }

  set genderCode(value: string) {
    this._genderCode = value;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  set postalCode(value: string) {
    this._postalCode = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get receptionTypeCode(): string {
    return this._receptionTypeCode;
  }

  set receptionTypeCode(value: string) {
    this._receptionTypeCode = value;
  }

  get familyOrderNumber(): number {
    return this._familyOrderNumber;
  }

  set familyOrderNumber(value: number) {
    this._familyOrderNumber = value;
  }

  get relationship(): string {
    return this._relationship;
  }

  set relationship(value: string) {
    this._relationship = value;
  }

  get lgapId(): string {
    return this._lgapId;
  }

  set lgapId(value: string) {
    this._lgapId = value;
  }

  get userRank(): string {
    return this._userRank;
  }

  set userRank(value: string) {
    this._userRank = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=Entrant';
    paramsString += ',_lastName=' + this._lastName;
    paramsString += ',_firstName=' + this._firstName;
    paramsString += ',_lastNameKana=' + this._lastNameKana;
    paramsString += ',_firstNameKana=' + this._firstNameKana;
    paramsString += ',_dateOfBirth=' + this._dateOfBirth;
    paramsString += ',_genderCode=' + this._genderCode;
    paramsString += ',_postalCode=' + this._postalCode;
    paramsString += ',_address=' + this._address;
    paramsString += ',_receptionTypeCode=' + this._receptionTypeCode;
    paramsString += ',_familyOrderNumber=' + this._familyOrderNumber;
    paramsString += ',_relationship=' + this._relationship;
    paramsString += ',_lgapId=' + this._lgapId;
    paramsString += ',_userRank=' + this._userRank;
    paramsString += ']';
    return paramsString
  }
}
