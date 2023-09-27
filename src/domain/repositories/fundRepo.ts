import { safeParse } from "valibot";
import { Env } from "../..";
import { FundCreate } from "../models/FundModel";
import { FundCreateSchema } from "../schemas/FundSchema";
import { utilFailedResponse, utilQueryCreate } from "../services/utilService";

export function fundDbCreate(
  params: FundCreate,
  env: Env,
  createdById: number
) {
  const parse = safeParse(FundCreateSchema, params);
  if (!parse.success) {
    throw utilFailedResponse("Invalid fund create repo params", 400);
  }

  const dateNow = Date.now();
  let { fields, values, queryParams } = utilQueryCreate(
    parse.data,
    "FundCreate"
  );

  fields += ", createdAt, updatedAt, createdById";
  values += ", ?, ?, ?";
  queryParams.push(dateNow, dateNow, createdById);

  const query = `INSERT INTO funds (${fields}) VALUES (${values})`;
  console.log(fields, values, queryParams);
  console.log(query);
  try {
    const stmt = env.DB.prepare(query).bind(...queryParams);
    return stmt;
  } catch (e) {
    console.log(e);
    throw utilFailedResponse("Unable to create fund", 500);
  }
}
