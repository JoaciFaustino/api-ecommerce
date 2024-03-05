import mongoose, { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId | string;
  name: string;
  username: string;
  email: string;
  password?: string; //precisa não ser obrigatorio se não quando o banco de dados retornar o usuario sem a senha não vai dar erro
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, unique: true },
    role: { type: String, required: false, select: false, default: "user" }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
