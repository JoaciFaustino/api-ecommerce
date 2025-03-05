import { CustomizablesParts, PricePerSize, Size } from "./Cake";
import { IFilling } from "./Filling";
import { ContactDetails, DeliveryAddress, TypeOfReceiptOptions } from "./Order";

export interface TokenDecodedByAuthMiddleware {
  decodedUserId: string;
  role: string;
}

export interface ReqBodySignUp {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ReqBodyLogin {
  email: string;
  password: string;
}

export interface ReqBodyCreateCake {
  name: string;
  type: string;
  categories?: string[];
  frosting?: string;
  fillings?: string[];
  size: Size;
  sizesPossibles: Size[];
  pricePerSize: PricePerSize;
  customizableParts?: CustomizablesParts[];
}

export type ReqBodyUpdateCake = Partial<Omit<ReqBodyCreateCake, "frosting">> & {
  frosting?: string | null;
};

export type ReqBodyUpdateCakeType = {
  type: string;
};

export type ReqBodyUpdateCategory = {
  category: string;
};

export type ReqBodyUpdateFilling = Partial<Omit<IFilling, "_id">>;

export type ReqBodyUpdateFrosting = Partial<Omit<IFilling, "_id">>;

export interface ReqBodyAddItemInCart extends TokenDecodedByAuthMiddleware {
  cakeId: string;
  type?: string;
  frosting?: string | null;
  fillings?: string[];
  size?: Size;
  quantity?: number;
}

export interface ReqBodyCreateOrder extends TokenDecodedByAuthMiddleware {
  cartId: string;
  typeOfReceipt: TypeOfReceiptOptions;
  contactDetails: ContactDetails;
  observations?: string;
  deliveryAddress?: DeliveryAddress;
}

export interface ReqBodyUpdateOrder {
  state?: string;
  dateAndTimeDelivery?: string;
}
