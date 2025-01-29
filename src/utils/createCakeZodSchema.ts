import { z } from "zod";
import {
  errorArrayString,
  errorEnum,
  errorNumberPositive,
  errorObj,
  errorString
} from "./zod";
import { capitalize } from "./capitalizeString";
import { CUSTOMIZABLE_PARTS_ENUM, SIZES_POSSIBLES_ENUM } from "../@types/Cake";

export const createCakeZodSchema = z.object(
  {
    name: z
      .string({ message: errorString("name", true) })
      .trim()
      .transform((name) => capitalize(name)),
    type: z.string({ message: errorString("type", true) }).trim(),
    categories: z
      .array(z.string({ message: errorString("category") }).trim(), {
        message: errorArrayString("categories")
      })
      .optional(),
    frosting: z
      .string({ message: errorString("frosting") })
      .trim()
      .optional(),
    fillings: z
      .array(z.string({ message: errorString("fillings") }).trim(), {
        message: errorArrayString("fillings")
      })
      .optional(),
    size: z.enum(SIZES_POSSIBLES_ENUM, { message: errorEnum("size") }),
    sizesPossibles: z.array(
      z.enum(SIZES_POSSIBLES_ENUM, { message: errorEnum("sizesPossibles") })
    ),
    pricePerSize: z.object(
      {
        pequeno: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        medio: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        grande: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        "extra-grande": z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional()
      },
      { message: errorObj("pricePerSize") }
    ),
    customizableParts: z.array(
      z.enum(CUSTOMIZABLE_PARTS_ENUM, {
        message: errorEnum("customizableParts")
      }),
      { message: errorEnum("customizableParts") }
    )
  },
  { message: "cake is not valid" }
);
