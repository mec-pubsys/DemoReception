import { User } from "../../models/User";

export class CertificationParams implements Params {
  private _user: User = new User();

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=CertificationParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ']';
    return paramsString
  }
}
