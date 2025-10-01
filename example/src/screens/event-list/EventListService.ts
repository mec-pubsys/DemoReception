import { executeQuery } from "../../aws/db/dbOperation";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

// get Data
export const fetchInitialEventData = async () => {
  const method = "POST";

  const queryString = `SELECT
      a.event_id,
      a.modification_timestamp,
      a.name AS event_name,
      a.start_date,
      a.end_date,
      b.name AS venue_names
      FROM
      (
          SELECT
          event_id,
          modification_timestamp,
          name,
          start_date,
          end_date,
          event_status_code
          FROM
          event
          WHERE
          city_code = '242152'
          AND NOT is_deleted
      ) AS a
      INNER JOIN (
          SELECT
          event_id,
          string_agg(
              name,
              '、'
              ORDER BY
              venue_id
          ) AS name
          FROM
          venue
          WHERE
          city_code = '242152'
          AND NOT is_deleted
          GROUP BY
          event_id
      ) AS b ON a.event_id = b.event_id
      INNER JOIN (
          SELECT
          event_status_code
          FROM
          event_status
          WHERE
          is_accept
      ) AS c ON a.event_status_code = c.event_status_code
      ORDER BY
      a.modification_timestamp desc,
      b.event_id`;
  ActivityLogger.insertInfoLogEntry(new User(), 'EventList', 'fetchInitialEventData', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};

// SEARCH Event
export const fetchSearchEventData = async (
  eventName: string,
  venue: string,
  fromStartDate: string,
  toStartDate: string,
  fromEndDate: string,
  toEndDate: string,
  selectedOption: string
) => {
  const method = "POST";
  let eventNameCondition = "";
  let venueCondition = "";
  let startCondition = "";
  let endCondition = "";
  let sortOrderCondition = "";
  // 1. Event name conditions
  if (eventName) {
    eventNameCondition = `AND name LIKE CONCAT('%', '${eventName}', '%')`;
  }

  // 2. Venue conditions
  if (venue) {
    venueCondition = `AND name LIKE CONCAT('%', '${venue}', '%')`;
  }

  // 3. Start date conditions
  if (fromStartDate && toStartDate) {
    startCondition = `AND (start_date IS NULL OR ('%${fromStartDate}%' <= start_date AND start_date <= '%${toStartDate}%'))`;
  } else if (fromStartDate && !toStartDate) {
    startCondition = `AND (start_date IS NULL OR ('%${fromStartDate}%' <= start_date))`;
  } else if (!fromStartDate && toStartDate) {
    startCondition = `AND (start_date IS NULL OR (start_date <= '%${toStartDate}%'))`;
  }

  // 4. End date conditions
  if (fromEndDate && toEndDate) {
    endCondition = `AND (end_date IS NULL OR ('%${fromEndDate}%' <= end_date AND end_date <= '%${toEndDate}%'))`;
  } else if (fromEndDate && !toEndDate) {
    endCondition = `AND (end_date IS NULL OR ('%${fromEndDate}%' <= end_date))`;
  } else if (!fromEndDate && toEndDate) {
    endCondition = `AND (end_date IS NULL OR (end_date <= '%${toEndDate}%'))`;
  }

  // 5. Sort order conditions
  if (selectedOption === "最終更新日が新しい") {
    sortOrderCondition = `a.modification_timestamp DESC,`;
  } else if (selectedOption === "最終更新日が古い") {
    sortOrderCondition = `a.modification_timestamp ASC,`;
  }

  const queryString = `SELECT
        a.event_id,
        a.modification_timestamp,
        a.name AS event_name,
        a.start_date,
        a.end_date,
        b.name AS venue_names
    FROM
        (
        SELECT
            event_id,
            modification_timestamp,
            name,
            start_date,
            end_date,
            event_status_code
        FROM
            event
        WHERE
            city_code = '242152'
            AND NOT is_deleted
            ${eventNameCondition}
            ${startCondition}
            ${endCondition}
        ) AS a
        INNER JOIN (
        SELECT
            c.event_id,
            d.name
        FROM
            (
            SELECT
                event_id
            FROM
                venue
            WHERE
                city_code = '242152'
                AND NOT is_deleted
                ${venueCondition}
            GROUP BY
                event_id
            ) AS c
            INNER JOIN (
            SELECT
                event_id,
                string_agg(
                name,
                '、'
                ORDER BY
                    venue_id
                ) AS name
            FROM
                venue
            WHERE
                city_code = '242152'
                AND NOT is_deleted
            GROUP BY
                event_id
            ) AS d ON c.event_id = d.event_id
        ) AS b ON a.event_id = b.event_id
        INNER JOIN (
        SELECT
            event_status_code
        FROM
            event_status
        WHERE
            is_accept
        ) AS c ON a.event_status_code = c.event_status_code
    ORDER BY
    ${sortOrderCondition}
        b.event_id;`;

  ActivityLogger.insertInfoLogEntry(new User(), 'EventList', 'fetchSearchEventData', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};
