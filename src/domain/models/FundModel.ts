import { Input } from "valibot";
import { FundCreateSchema } from "../schemas/FundSchema";

export type FundCreate = Input<typeof FundCreateSchema>;
