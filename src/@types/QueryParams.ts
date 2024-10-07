import * as core from "express-serve-static-core";

export interface IQueryParamsGetAllCakes extends core.Query {
  limit?: string | string[];
  page?: string | string[];
  sortBy?: string | string[];
  type?: string | string[];
  category?: string | string[];
  filling?: string | string[];
  frosting?: string | string[];
  size?: string | string[];
  search?: string | string[];
}

export interface IQueryParamsGetAllCakeTypes extends core.Query {
  limit?: string | string[];
  page?: string | string[];
  search?: string | string[];
}
