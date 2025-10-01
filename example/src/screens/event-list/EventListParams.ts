import { User } from "../../models/User";

export class EventListParams implements Params {
  private _user: User = new User();

  get user(): User {
    return this._user.clone();
  }

  set user(value: User) {
    this._user = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=EventListParams';
    paramsString += ',_user=' + this._user.getAllValuesAsString();
    paramsString += ']';
    return paramsString
  }
}
