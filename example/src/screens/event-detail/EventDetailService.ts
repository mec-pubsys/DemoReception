import { executeQuery } from "../../aws/db/dbOperation";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

// GET VenueName
export const getVenueNameAndId = async (eventDetailId: number) => {
  const method = "POST";
  const queryString =
    "SELECT name, venue_id FROM venue where event_id = " + eventDetailId + ";";
  ActivityLogger.insertInfoLogEntry(new User(), 'EventDetail', 'getVenueNameAndId', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};
