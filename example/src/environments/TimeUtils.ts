import { format, toZonedTime } from "date-fns-tz";

/**
 * Get the current date and time in Japan Time (JST, UTC+9)
 */
export const getCurrentJapanTime = (): string => {
  const japanTimeZone = "Asia/Tokyo";
  const now = new Date();
  const zonedDate = toZonedTime(now, japanTimeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ss.SSS", {
    timeZone: japanTimeZone,
  });
};
