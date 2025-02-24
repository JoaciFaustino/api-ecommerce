import * as core from "express-serve-static-core";

export interface BaseQueryParams extends core.Query {
  limit?: string | string[];
  page?: string | string[];
  search?: string | string[];
}

export interface IQueryParamsGetAllCakes extends BaseQueryParams {
  sortBy?: string | string[];
  type?: string | string[];
  category?: string | string[];
  filling?: string | string[];
  frosting?: string | string[];
  size?: string | string[];
}

export interface IQueryParamsGetAllOrders extends BaseQueryParams {
  sortBy?: string | string[];
  filters?: string | string[];
}
