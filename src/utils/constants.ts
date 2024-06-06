import { Size } from "../@types/Cake";
import { typeSortByOptions } from "../@types/SortBy";

type MaxLayerOfFillings = {
  [size in Size]: number;
};

export const MAX_LAYER_OF_FILLINGS: MaxLayerOfFillings = {
  pequeno: 1,
  medio: 2,
  grande: 3,
  "extra-grande": 3
};

export const SORT_BY_OBJS: typeSortByOptions = {
  popularity: { boughts: "descending" },
  latest: { created_at: "descending" },
  price_high_to_low: { totalPricing: "descending" },
  price_low_to_high: { totalPricing: "ascending" }
};
