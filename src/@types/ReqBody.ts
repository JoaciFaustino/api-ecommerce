import { CustomizablesParts, PricePerSize, Size } from "./Cake";
import { ContactDetails, TypeOfReceiptOptions } from "./Order";

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

export interface ReqBodyCreateCart extends TokenDecodedByAuthMiddleware {
  cakeId: string;
  type?: string;
  frosting?: string;
  fillings?: string[];
  size?: Size;
  quantity?: number;
}

export interface ReqBodyCreateOrder extends TokenDecodedByAuthMiddleware {
  userId: string;
  cartId: string;
  typeOfReceipt: TypeOfReceiptOptions;
  contactDetails: ContactDetails;
  observations?: string;
}
