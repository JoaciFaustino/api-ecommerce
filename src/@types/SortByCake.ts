export const SORT_BY_CAKES_OPTIONS = [
  "popularity",
  "latest",
  "price_high_to_low",
  "price_low_to_high"
] as const;

export type TypeKeysSortByCakes = (typeof SORT_BY_CAKES_OPTIONS)[number];

export type typeSortByCakesObj =
  | { boughts: "descending" | "ascending"; _id: 1 }
  | { createdAt: "descending" | "ascending"; _id: 1 }
  | { totalPricing: "descending" | "ascending"; _id: 1 };

export type typeSortByCakesOptions = {
  [key in TypeKeysSortByCakes]: typeSortByCakesObj;
};

export const SORT_BY_CAKES_OBJS: typeSortByCakesOptions = {
  popularity: { boughts: "descending", _id: 1 },
  latest: { createdAt: "descending", _id: 1 },
  price_high_to_low: { totalPricing: "descending", _id: 1 },
  price_low_to_high: { totalPricing: "ascending", _id: 1 }
};
