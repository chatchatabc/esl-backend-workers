import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";
import { enc, HmacSHA256 } from "crypto-js";
import { ScheduleCreate } from "../models/ScheduleModel";

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

export function utilGetTimestampTimeOnly(timestamp: number) {
  const hour = new Date(timestamp).getUTCHours();
  const minute = new Date(timestamp).getUTCMinutes();
  const timestampTimeOnly = hour * 60 * 60 * 1000 + minute * 60 * 1000;

  return timestampTimeOnly;
}

export function utilGetScheduleTimeAndDay(startTime: number, endTime: number) {
  const day = new Date(startTime).getUTCDay();
  const diff = endTime - startTime;
  const startTimeOfDay =
    utilGetTimestampTimeOnly(startTime) + day * 24 * 60 * 60 * 1000;
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

export function utilCheckScheduleOverlap(schedules: ScheduleCreate[]) {
  let overlapped = false;
  // Fix the day and convert the time to timestamp
  const newSchedules = schedules.map((schedule, index) => {
    return {
      ...schedule,
      id: index,
    };
  });

  newSchedules.forEach((old) => {
    const overlap = newSchedules.find((schedule) => {
      return (
        schedule.id !== old.id &&
        ((schedule.startTime >= old.startTime &&
          schedule.startTime < old.endTime) ||
          (schedule.endTime > old.startTime && schedule.endTime <= old.endTime))
      );
    });

    if (overlap) {
      overlapped = true;
    }
  });

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

export function utilDateFormatter(locale: string, date: Date) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);
}

export function utilTimeFormatter(locale: string, date: Date) {
  return new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
  }).format(date);
}
