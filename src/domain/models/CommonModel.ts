import { Input } from "valibot";
import { CommonPaginationInput } from "../schemas/CommonSchema";

export type CommonPagination = {
  page: number;
  size: number;
};

export type CommonPaginationInput = Input<typeof CommonPaginationInput>;

export type CommonContent<T = any> = {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
};
