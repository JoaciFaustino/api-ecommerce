import fs from "fs/promises";
import { connectDatabase } from "./db";
import { ICake } from "../@types/Cake";
import { ICakeType } from "../@types/CakeType";
import { ICategory } from "../@types/Category";
import { IFilling } from "../@types/Filling";
import { IUser, User } from "../models/User";
import { IFrosting } from "../@types/Frosting";
import "dotenv/config";
import { initCloudinary } from "../config/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { Cake } from "../models/Cake";
import { FilesService } from "../services/filesService";
import { CakeType } from "../models/CakeType";
import { Category } from "../models/Category";
import { Filling } from "../models/Filling";
import { Frosting } from "../models/Frosting";
import { isValidUrl } from "../utils/isValidUrl";
import { Cart } from "../models/Cart";

type Data = {
  cakes: Omit<ICake, "imageUrl" | "_id">[];
  caketypes: Omit<ICakeType, "_id">[];
  categories: Omit<ICategory, "_id">[];
  fillings: Omit<IFilling, "_id">[];
  users: Omit<IUser, "_id" | "cartId">[];
  frostings: Omit<IFrosting, "_id">[];
};

const seed = async () => {
  await connectDatabase();
  await mongoose.connection.dropDatabase();

  const data = await fs.readFile("src/db/seed.json", "utf8");

  const { cakes, caketypes, categories, fillings, frostings, users }: Data =
    JSON.parse(data);

  if (process.env.DESTINATION_STORAGE_IMAGES === "cloudinary") {
    await new FilesService().deleteAllImages();
  }

  await Promise.all([
    seedCakes(cakes),
    seedCakeTypes(caketypes),
    seedCategories(categories),
    seedFillings(fillings),
    seedFrosting(frostings),
    seedUsers(users)
  ]);

  await mongoose.disconnect();
  console.log("database seeding complected sucessfully!");
};

const seedCakeWithImageUrl = async (cake: Omit<ICake, "_id" | "imageUrl">) => {
  const filePath = `public/uploads/${cake.name}.jpeg`;

  if (process.env.DESTINATION_STORAGE_IMAGES !== "cloudinary") {
    const apiUrl =
      `${process.env.API_PROTOCOL}://` +
      process.env.API_HOST +
      `${process.env.PORT ? ":" + process.env.PORT : ""}/api/`;

    if (!isValidUrl(apiUrl)) {
      throw new Error(
        `The URL "${apiUrl}" isn't valid. Check the .env values or create a .env file based on .env-example file`
      );
    }

    await Cake.create({
      ...cake,
      imageUrl: `${apiUrl}images/${cake.name}.jpeg`
    });

    return;
  }

  const data = await fs.readFile(filePath, "base64");

  const dataUri = `data:image/jpeg;base64,${data}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    resource_type: "auto"
  });

  await Cake.create({ ...cake, imageUrl: result.secure_url });
};

const seedCakes = async (cakes: Omit<ICake, "_id" | "imageUrl">[]) => {
  await Promise.all(cakes.map((cake) => seedCakeWithImageUrl(cake)));
};

const seedCakeTypes = async (cakeTypes: Omit<ICakeType, "_id">[]) => {
  await Promise.all(cakeTypes.map(({ type }) => CakeType.create({ type })));
};

const seedCategories = async (categories: Omit<ICategory, "_id">[]) => {
  await Promise.all(
    categories.map(({ category }) => Category.create({ category }))
  );
};

const seedFillings = async (fillings: Omit<IFilling, "_id">[]) => {
  await Promise.all(
    fillings.map(({ name, price }) => Filling.create({ name, price }))
  );
};

const seedFrosting = async (frostings: Omit<IFrosting, "_id">[]) => {
  await Promise.all(
    frostings.map(({ name, price }) => Frosting.create({ name, price }))
  );
};

const createUserWithCart = async (user: Omit<IUser, "_id" | "cartId">) => {
  const cart = await Cart.create({ cakes: [] });

  if (!cart?._id) {
    throw new Error("failed to create cart of user: " + user.username);
  }

  await User.create({ ...user, cartId: cart._id });
};

const seedUsers = async (users: Omit<IUser, "_id" | "cartId">[]) => {
  await Promise.all(users.map((user) => createUserWithCart(user)));
};

initCloudinary();
seed();
