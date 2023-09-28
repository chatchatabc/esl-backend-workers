import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";
import { enc, HmacSHA256 } from "crypto-js";
import { Schedule, ScheduleCreate } from "../models/ScheduleModel";
import { v4 } from "uuid";
import { BookingCreate } from "../models/BookingModel";

export function utilFailedResponse(message: string, status: number = 500) {
  let code: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR";
  switch (status) {
    case 400:
      code = "BAD_REQUEST";
      break;
    case 401:
      code = "UNAUTHORIZED";
      break;
    case 403:
      code = "FORBIDDEN";
      break;
    case 404:
      code = "NOT_FOUND";
      break;
    case 501:
      code = "NOT_IMPLEMENTED";
      break;
  }

  return new TRPCError({
    code,
    message,
  });
}

export function utilValidateOrigin(origin: string) {
  const allowedOrigins = [
    "https://esl-cca.pages.dev",
    "http://localhost:3000",
    "https://esl-admin.pages.dev",
    "https://revamp.esl-admin.pages.dev",
  ];
  return allowedOrigins.includes(origin);
}

export function utilEncodeBase64(input: string) {
  return enc.Base64.stringify(enc.Utf8.parse(input));
}

export function utilDecodeBase64(input: string) {
  return enc.Base64.parse(input).toString(enc.Utf8);
}

export function utilHashHmac256(input: string) {
  const secret = "I)0Don't!1Care@2";
  return HmacSHA256(input, secret).toString();
}

export function utilGetScheduleTimeAndDay(startTime: number, endTime: number) {
  const day = new Date(startTime).getUTCDay();
  const diff = endTime - startTime;
  const startTimeOfDay =
    (startTime % (24 * 60 * 60 * 1000)) + day * 24 * 60 * 60 * 1000;
  const endTimeOfDay = startTimeOfDay + diff;

  return [startTimeOfDay, endTimeOfDay, day];
}

export function utilGetTimestampDateOnly(timestamp: number) {
  const day = new Date(timestamp).getUTCDay();

  const date = new Date(0);
  date.setUTCMonth(1);
  date.setUTCDate(day + 1);

  return date.getTime();
}

export function utilCheckBookingTimeValid(
  schedules: Schedule[],
  booking: BookingCreate
) {
  const bookingStart = new Date(booking.start);
  const bookingWeekDay = bookingStart.getUTCDay();
  let bookingEndTime = new Date(booking.end).getTime();
  let bookingStartTime = bookingStart.getTime();
  const bookingDiff = bookingEndTime - bookingStartTime;
  bookingStartTime = (bookingStartTime % 86400000) + bookingWeekDay * 86400000;
  bookingEndTime = bookingStartTime + bookingDiff;

  let validAcrossSchedule = false;

  for (const schedule of schedules) {
    if (schedule.weekDay === bookingWeekDay) {
      if (
        schedule.startTime <= bookingStartTime &&
        bookingStartTime < schedule.endTime
      ) {
        if (
          schedule.startTime < bookingEndTime &&
          bookingEndTime <= schedule.endTime
        ) {
          return true;
        } else {
          validAcrossSchedule = true;
        }
      } else if (
        schedule.startTime < bookingEndTime &&
        bookingEndTime <= schedule.endTime
      ) {
        validAcrossSchedule = true;
      }
    }
  }

  return validAcrossSchedule;
}

export function utilCheckScheduleOverlap(schedules: ScheduleCreate[]) {
  let overlapped = false;
  // Fix the day and convert the time to timestamp
  const newSchedules = schedules.map((schedule, index) => {
    return {
      ...schedule,
      id: index,
    };
  });

  let loops = 0;
  while (loops < newSchedules.length && !overlapped) {
    const schedule = newSchedules[loops];
    const overlappedSchedule = newSchedules.find((s) => {
      return (
        s.id !== schedule.id &&
        s.weekDay === schedule.weekDay &&
        ((s.startTime >= schedule.startTime &&
          s.startTime < schedule.endTime) ||
          (s.endTime > schedule.startTime && s.endTime <= schedule.endTime))
      );
    });

    loops++;
    overlapped = overlappedSchedule ? true : false;
  }

  return overlapped;
}

export function utilValidateChineseMobileNumber(mobile: string) {
  return /^1(?:3(?:4[^9\D]|[5-9]\d)|5[^3-6\D]\d|7[28]\d|8[23478]\d|9[578]\d)\d{7}$/.test(
    mobile
  );
}

export function utilGenerateRandomCode(length = 6) {
  const characters = "0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}

export function utilDateFormatter(
  locale: string,
  date: Date,
  timeZone: string = "Asia/Shanghai"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone,
  }).format(date);
}

export function utilTimeFormatter(
  locale: string,
  date: Date,
  timeZone: string = "Asia/Shanghai"
) {
  return new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export function utilQueryAddWhere(query: string, where: string) {
  if (!query.includes("WHERE")) {
    query += " WHERE";
  }

  if (query.endsWith("WHERE")) {
    query += ` (${where})`;
  } else {
    query += ` AND (${where})`;
  }

  return query;
}

export function utilGenerateUuid() {
  return v4();
}

export function utilQueryCreate(
  data: Record<string, string | null | number>,
  table: string
) {
  let fields = "";
  let values = "";
  const queryParams: (string | null | number)[] = [];

  Object.keys(data).forEach((key) => {
    fields += fields ? ", " : "";
    fields += key;

    values += values ? ", " : "";
    values += "?";

    queryParams.push(data[key]);
  });

  if (!fields) {
    throw utilFailedResponse(`No data for ${table}`, 400);
  }

  return { fields, values, queryParams };
}

export function utilQueryUpdate(
  data: Record<string, string | number | null>,
  table: string
) {
  let querySet = "";
  const queryParams: (string | null | number)[] = [];

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined) {
      querySet += querySet ? ", " : "";
      querySet += `${key} = ?`;

      queryParams.push(value);
    }
  });

  if (!querySet) {
    throw utilFailedResponse(`No data for ${table}`, 400);
  }

  return { querySet, queryParams };
}

export function utilQuerySelect(tables: Record<string, string[]>) {
  let querySelect = "";
  Object.keys(tables).forEach((table) => {
    tables[table as keyof typeof tables].forEach((column) => {
      querySelect += querySelect ? ", " : "";
      querySelect += `${table}.${column} AS ${table}_${column}`;
    });
  });

  return querySelect;
}
