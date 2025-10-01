import { format } from "date-fns";
import { executeQuery } from "../../aws/db/dbOperation";
import { getCurrentJapanTime } from "../../environments/TimeUtils";
import { ActivityLogger } from "../../log/ActivityLogger";
import { User } from "../../models/User";

// get Data from gender name
export const fetchGenderName = async (genderCode: string) => {
  const method = "POST";
  const queryString =
    "SELECT name FROM gender WHERE gender_code ='" + genderCode + "';";
  ActivityLogger.insertInfoLogEntry(new User(), 'CheckInConfirmation', 'fetchGenderName', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};

//insert reception
export const insertReceptionData = async (
  eventId: number,
  venueId: number,
  modifierId: string,
  acceptedTerminalId: string,
  lgapId: string,
  userRank: string,
  lastName: string,
  firstName: string,
  lastNameKana: string,
  firstNameKana: string,
  dateOfBirth: Date | null,
  genderCode: string,
  postalCode: string,
  address: string,
  receptionTypeCode: string
) => {
  const currentJapanTime = getCurrentJapanTime();
  let formattedDateOfBirth: string;
  if (dateOfBirth) {
    formattedDateOfBirth = format(dateOfBirth, "yyyy-MM-dd");
  } else {
    formattedDateOfBirth = "";
  }

  const method = "POST";
  const queryString = `
  INSERT 
  INTO reception (
    city_code, 
    event_id, venue_id, 
    member_id, 
    history_number, 
    accepted_terminal_id, 
    accepted_timestamp, 
    modifier_id, 
    modification_timestamp, 
    is_deleted, 
    lgap_id, 
    user_rank, 
    lastname, firstname, 
    lastname_kana, firstname_kana, 
    date_of_birth, 
    gender_code, 
    postal_code, 
    address, 
    relationship, 
    reception_type_code, 
    family_order_number
)
VALUES (
    '242152',
    ${eventId},
    ${venueId}, 
    0, 
    0,
    CASE
      WHEN '${acceptedTerminalId}' ='' THEN NULL
      ELSE '${acceptedTerminalId}'
    END, 
    '${currentJapanTime}', 
    '${modifierId}', 
    '${currentJapanTime}', 
    false,
    CASE
      WHEN '${lgapId}' ='' THEN NULL
      ELSE '${lgapId}'
    END,
    CASE
    WHEN '${userRank}' ='' THEN NULL
    ELSE '${userRank}'
  END,
    '${lastName}',
    '${firstName}', 
    '${lastNameKana}',
    '${firstNameKana}',
    '${formattedDateOfBirth}',
    '${genderCode}',
    '${postalCode}', 
    '${address}', 
    '本人', 
    '${receptionTypeCode}', 
    0 );`;
  ActivityLogger.insertInfoLogEntry(new User(), 'CheckInConfirmation', 'insertReceptionData', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};

// GET Count of Received Items
export const getCountOfReceivedItems = async (
  eventId: number,
  lgapId: string
) => {
  const method = "POST";
  const queryString = `
  SELECT
    COUNT(*)
  FROM
    reception
  WHERE
    city_code = '242152'
    AND event_id = ${eventId}
    AND NOT is_deleted
    AND lgap_id = '${lgapId}';
`;
  return executeQuery(method, queryString);
};

// GET ReceptionID
export const getReceptionId = async (eventId: number, lgapId: string) => {
  const method = "POST";
  const queryString = `
  SELECT
    reception_id
  FROM
    reception
  WHERE
    city_code = '242152'
    AND event_id = ${eventId}
    AND lgap_id = '${lgapId}';
`;
  return executeQuery(method, queryString);
};

// INSERT Into Reception History
export const insertIntoReceptionHistory = async (
  eventId: number,
  receptionData: { reception_id: number }[]
) => {
  const method = "POST";
  const receptionIds = receptionData.map((entry) => entry.reception_id);
  const receptionIdString = receptionIds.join(", ");

  const queryString = `
  INSERT INTO
    reception_history
  SELECT
    *
  FROM
    reception
  WHERE
    city_code = '242152'
    AND event_id = ${eventId}
    AND reception_id IN (${receptionIdString});
  `;
  return executeQuery(method, queryString);
};

// DELETE Data from Reception
export const deleteDataFromReception = async (
  eventId: number,
  receptionData: { reception_id: number }[]
) => {
  const method = "POST";
  const receptionIds = receptionData.map((entry) => entry.reception_id);
  const receptionIdString = receptionIds.join(", ");

  const queryString = `
  DELETE
  FROM
    reception
  WHERE
    city_code = '242152'
    AND event_id = ${eventId}
    AND reception_id IN (${receptionIdString});
  `;
  return executeQuery(method, queryString);
};
