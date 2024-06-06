import * as core from "express-serve-static-core";

export interface IQueryParamsGetAll extends core.Query {
  limit?: string | string[];
  page?: string | string[];
  sortBy?: string | string[];
  typeId?: string | string[];
  categoryId?: string | string[];
  fillingId?: string | string[];
  frostingId?: string | string[];
  size?: string | string[];
}
