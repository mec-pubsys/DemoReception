import { executeQuery } from "../../aws/db/dbOperation";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

//get event name, to show as title
export const fetchEventNameById = async (eventid: number) => {
  const method = "POST";
  const queryString = "SELECT name FROM event WHERE event_id =" + eventid + ";";

  ActivityLogger.insertInfoLogEntry(new User(), 'SelectReceptionMethod', 'fetchEventNameById', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};
