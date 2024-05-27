import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";
import { ICake } from "./Cake";
import { ICakeType } from "./CakeType";
import { ICategory } from "./Category";
import { IFilling } from "./Filling";
import { IFrosting } from "./Frosting";

export type UserResponseDB = HydratedDocument<IUser> | undefined | null;

export type CakeResponseDB = HydratedDocument<ICake> | undefined | null;

export type CakeTypeResponseDB = HydratedDocument<ICakeType> | undefined | null;

export type FillingResponseDB = HydratedDocument<IFilling> | undefined | null;

export type CategoryResponseDB = HydratedDocument<ICategory> | undefined | null;

export type FrostingResponseDB = HydratedDocument<IFrosting> | undefined | null;
