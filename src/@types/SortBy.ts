export type typeSortByObj =
  | { boughts: "descending" | "ascending"; _id: 1 }
  | { created_at: "descending" | "ascending"; _id: 1 }
  | { totalPricing: "descending" | "ascending"; _id: 1 };

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
