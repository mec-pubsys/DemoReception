import { Entrant } from "./Entrant";
import { ModifiedFlags } from "./ModifiedFlags";

export class EntrantRecord implements Params {
  private _originalEntrant: Entrant = new Entrant();
  private _modifiedEntrant: Entrant = new Entrant();
  private _modifiedFlags: ModifiedFlags = new ModifiedFlags();

  get originalEntrant(): Entrant {
    return this._originalEntrant;
  }

  set originalEntrant(value: Entrant) {
    this._originalEntrant = value;
  }
  get modifiedEntrant(): Entrant {
    return this._modifiedEntrant;
  }

  set modifiedEntrant(value: Entrant) {
    this._modifiedEntrant = value;
  }

  get modifiedFlags(): ModifiedFlags {
    return this._modifiedFlags;
  }

  set modifiedFlags(value: ModifiedFlags) {
    this._modifiedFlags = value;
  }

  getAllValuesAsString(): string {
    let paramsString = '[ClassName=EntrantRecord';
    paramsString += ',_originalEntrant=' + this._originalEntrant.getAllValuesAsString();
    paramsString += ',_modifiedEntrant=' + this._modifiedEntrant.getAllValuesAsString();
    paramsString += ',_modifiedFlags=' + this._modifiedFlags.getAllValuesAsString();
    paramsString += ']';
    return paramsString
  }
}
