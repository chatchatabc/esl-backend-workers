import { Env } from "../..";
import { CreditAdd } from "../models/CreditModel";
import { FundCreate } from "../models/FundModel";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import { CreditDbAdd } from "../repositories/creditRepo";
import { fundDbCreate } from "../repositories/fundRepo";
import { logsDbCreateCredit } from "../repositories/logsRepo";
import { userDbUpdate } from "../repositories/userRepo";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function creditAdd(
  params: CreditAdd,
  env: Env,
  createdById: number
) {
  const user = await userGet({ userId: params.userId }, env);
  user.credits += params.credits;

  const logsCredit: LogsCreditCreate = {
    userId: params.userId,
    amount: params.credits,
    title: "Credit Add",
    details: `Credit Add ${params.credits}`,
  };

  const fundCreate: FundCreate = {
    userId: params.userId,
    amount: params.amount,
    title: "Credit Add",
    details: `Credit Add ${params.credits}`,
    currency: params.currency,
    credits: params.credits,
  };

  const userStmt = userDbUpdate(user, env);
  const logsCreditStmt = logsDbCreateCredit(logsCredit, env, createdById);
  const fundStmt = fundDbCreate(fundCreate, env, createdById);

  try {
    await env.DB.batch([userStmt, logsCreditStmt, fundStmt]);
    return true;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to add credit", 500);
  }
}
