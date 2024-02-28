import { HydratedDocument } from "mongoose";
import { IUser } from "../models/User";

export type userResponseDB = HydratedDocument<IUser> | undefined | null;
