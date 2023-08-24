import { utilFailedResponse } from "./utilService";
import {
  logsDbGetAllCredit,
  logsDbGetTotalCredit,
} from "../repositories/logsRepo";
import { Env } from "../..";
import { LogsCredit } from "../models/LogsModel";

export async function logsGetAllCredit(
  params: { userId: number; page: number; size: number },
  env: Env
) {
  const { userId, page, size } = params;
  const logs = await logsDbGetAllCredit(params, env);
  if (!logs) {
    throw utilFailedResponse("Failed to get logs", 500);
  }

  const totalElements = await logsDbGetTotalCredit({ userId }, env);
  if (totalElements === null) {
    throw utilFailedResponse("Failed to get total elements", 500);
  }

  return {
    content: logs.results as LogsCredit[],
    page,
    size,
    totalElements,
  };
}

// export async function logsRequestCredit(
//   params: { amount: number; userId: number },
//   bindings: Env
// ) {
//   const logsCredit = {
//     receiverId: params.userId,
//     senderId: 1,
//     amount: params.amount,
//     title: "Credits from Admin",
//     status: 0,
//   };

//   const create = await logsDbCreateCredit(logsCredit, bindings);
//   if (!create) {
//     throw utilFailedResponse("Cannot create request credit", 500);
//   }

//   return true;
// }

// export async function logsRejectCredit(
//   params: { logId: number },
//   bindings: Env
// ) {
//   const logsCredit = await logsDbGetCredit(params, bindings);
//   if (!logsCredit) {
//     throw utilFailedResponse("Cannot get the log credit.", 500);
//   }

//   logsCredit.status = 2;

//   const success = logsDbUpdateCredit(logsCredit, bindings);
//   if (!success) {
//     throw utilFailedResponse("Failed to reject credit", 500);
//   }

//   return true;
// }

// export async function logsApproveCredit(
//   params: { logId: number },
//   bindings: Env
// ) {
//   const logsCredit = await logsDbGetCredit(params, bindings);
//   if (!logsCredit) {
//     throw utilFailedResponse("Cannot get the log credit.", 500);
//   }

//   const sender = await userGet({ userId: logsCredit.senderId ?? 0 }, bindings);
//   if (!sender) {
//     throw utilFailedResponse("Cannot get sender", 500);
//   }

//   const receiver = await userGet(
//     { userId: logsCredit.receiverId ?? 0 },
//     bindings
//   );
//   if (!receiver) {
//     throw utilFailedResponse("Cannot get receiver", 500);
//   }

//   logsCredit.status = 1;
//   sender.credit -= logsCredit.amount;
//   receiver.credit += logsCredit.amount;

//   const success = await logsDbApproveCredit(
//     logsCredit,
//     sender,
//     receiver,
//     bindings
//   );

//   if (!success) {
//     throw utilFailedResponse("Cannot approve credit log", 500);
//   }

//   return true;
// }
