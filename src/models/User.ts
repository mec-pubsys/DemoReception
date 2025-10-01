export interface Params {
  getAllValuesAsString(): string;
}

export class User implements Params {
  private _userId: string = "";

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  clone(): User {
    const cloneUser = new User();
    cloneUser.userId = this._userId;
    return cloneUser;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=User';
    paramsString += ',_userId=' + this._userId;
    paramsString += ']';
    return paramsString;
  }
}