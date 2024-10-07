import { Size } from "../@types/Cake";

type MaxLayerOfFillings = {
  [size in Size]: number;
};

export const MAX_LAYER_OF_FILLINGS: MaxLayerOfFillings = {
  pequeno: 1,
  medio: 2,
  grande: 3,
  "extra-grande": 3
};
