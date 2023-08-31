import { Env } from "../..";
import { CreditAdd } from "../models/CreditModel";
import { LogsCreditCreate, LogsMoneyCreate } from "../models/LogsModel";
import { CreditDbAdd } from "../repositories/creditRepo";
import { userGet } from "./userService";
import { utilFailedResponse } from "./utilService";

export async function creditAdd(params: CreditAdd, env: Env) {
  const user = await userGet({ userId: params.userId }, env);
  user.credits += params.credits;

  const logsCredit: LogsCreditCreate = {
    userId: params.userId,
    amount: params.amount,
    title: "Credit Add",
    details: `Credit Add ${params.credits}`,
  };

  const logsMoney: LogsMoneyCreate = {
    userId: params.userId,
    amount: params.amount,
    title: "Credit Add",
    details: `Credit Add ${params.credits}`,
    currency: params.currency,
    credits: params.credits,
  };

  const query = await CreditDbAdd(
    {
      user,
      logsCredit,
      logsMoney,
    },
    env
  );
  if (!query) {
    throw utilFailedResponse("Credit add failed", 400);
  }

  return true;
}
