export type typeSortByObj =
  | { boughts: "descending" | "ascending" }
  | { created_at: "descending" | "ascending" }
  | { totalPricing: "descending" | "ascending" };

export const SORT_BY_OPTIONS = [
  "popularity",
  "latest",
  "price_high_to_low",
  "price_low_to_high"
] as const;

export type TypeKeysSortBy = (typeof SORT_BY_OPTIONS)[number];

export type typeSortByOptions = {
  [key in TypeKeysSortBy]: typeSortByObj;
};
