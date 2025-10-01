import { EntrantRecord } from "./EntrantRecord";

export class EntrantRecordList implements Params {
  private _entrantRecordList: EntrantRecord[];

  constructor(entrantRecordList: EntrantRecord[] = []) {
    this._entrantRecordList = entrantRecordList;
  }

  get entrantRecordList(): EntrantRecord[] {
    return this._entrantRecordList;
  }

  set entrantRecordList(value: EntrantRecord[]) {
    this._entrantRecordList = value;
  }

  // Additional methods for manipulating the list can be added here if necessary
  addEntrantRecord(entrantRecord: EntrantRecord): void {
    this._entrantRecordList.push(entrantRecord);
  }

  removeEntrantRecord(index: number): void {
    if (index >= 0 && index < this._entrantRecordList.length) {
      this._entrantRecordList.splice(index, 1);
    }
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=EntrantRecordList';

    paramsString += ',_entrantRecordList=[';
    for (let i = 0; i < this._entrantRecordList.length; i++) {
      paramsString += '(' + i + ')=';
      paramsString += this._entrantRecordList[i].getAllValuesAsString();
    }
    paramsString += ']';

    paramsString += ']';
    return paramsString
  }
}
