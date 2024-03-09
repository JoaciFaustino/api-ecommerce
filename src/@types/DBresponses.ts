import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";
import { ICake } from "../models/Cake";

export type UserResponseDB = HydratedDocument<IUser> | undefined | null | void;

export type CakeResponseDB = HydratedDocument<ICake> | undefined | null | void;
