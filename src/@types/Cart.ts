import { Types } from "mongoose";
import { Size } from "./Cake";

export interface IPersonalizedCake {
  cakeId: Types.ObjectId | string;
  type: string; //quando o valor for undefined, ele vai pegar o valor padrão do bolo
  frosting?: string;
  fillings?: string[];
  size: Size; //quando o valor for undefined, ele vai pegar o valor padrão do bolo
  totalPricing: number;
  quantity: number;
}

export interface ICart {
  _id?: Types.ObjectId | string;

  //lembrar de criar o cartId na model de Usuer e colocar o _id lá
  cakes: IPersonalizedCake[];
}
