export class ModifiedFlags implements Params {
  private _isNameModified: boolean = false;
  private _isKanaNameModified: boolean = false;
  private _isDateOfBirthModified: boolean = false;
  private _isGenderModified: boolean = false;
  private _isPostalCodeModified: boolean = false;
  private _isAddressModified: boolean = false;
  private _isRelationshipModified: boolean = false;

  get isNameModified(): boolean {
    return this._isNameModified;
  }

  set isNameModified(value: boolean) {
    this._isNameModified = value;
  }

  get isKanaNameModified(): boolean {
    return this._isKanaNameModified;
  }

  set isKanaNameModified(value: boolean) {
    this._isKanaNameModified = value;
  }

  get isDateOfBirthModified(): boolean {
    return this._isDateOfBirthModified;
  }

  set isDateOfBirthModified(value: boolean) {
    this._isDateOfBirthModified = value;
  }

  get isGenderModified(): boolean {
    return this._isGenderModified;
  }

  set isGenderModified(value: boolean) {
    this._isGenderModified = value;
  }

  get isPostalCodeModified(): boolean {
    return this._isPostalCodeModified;
  }

  set isPostalCodeModified(value: boolean) {
    this._isPostalCodeModified = value;
  }

  get isAddressModified(): boolean {
    return this._isAddressModified;
  }

  set isAddressModified(value: boolean) {
    this._isAddressModified = value;
  }

  get isRelationshipModified(): boolean {
    return this._isRelationshipModified;
  }

  set isRelationshipModified(value: boolean) {
    this._isRelationshipModified = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=ModifiedFlags';
    paramsString += ',_isNameModified=' + this._isNameModified;
    paramsString += ',_isKanaNameModified=' + this._isKanaNameModified;
    paramsString += ',_isDateOfBirthModified=' + this._isDateOfBirthModified;
    paramsString += ',_isGenderModified=' + this._isGenderModified;
    paramsString += ',_isPostalCodeModified=' + this._isPostalCodeModified;
    paramsString += ',_isAddressModified=' + this._isAddressModified;
    paramsString += ',_isRelationshipModified=' + this._isRelationshipModified;
    paramsString += ']';
    return paramsString
  }
}
