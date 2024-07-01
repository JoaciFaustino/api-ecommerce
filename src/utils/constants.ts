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
  popularity: { boughts: "descending", _id: 1 },
  latest: { created_at: "descending", _id: 1 },
  price_high_to_low: { totalPricing: "descending", _id: 1 },
  price_low_to_high: { totalPricing: "ascending", _id: 1 }
};
