import { CustomizablesParts, ICake, Size } from "../@types/Cake";
import { ICakeType } from "../@types/CakeType";
import { ICart } from "../@types/Cart";
import { IFilling } from "../@types/Filling";
import { IFrosting } from "../@types/Frosting";
import { CartRepository } from "../repositories/cartRepository";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "./cakeService";
import { CakeTypeService } from "./cakeTypeService";
import { FillingService } from "./fillingService";
import { FrostingService } from "./frostingService";

type CakePartsValidationResult<T> =
  | {
      isValid: true;
      data: T;
    }
  | {
      isValid: false;
      errorMessage: string;
      status: number;
    };

export class CartService {
  constructor(
    private userRepository = new UserRepository(),
    private cakeService = new CakeService(),
    private cartRepository = new CartRepository(),
    private fillingService = new FillingService(),
    private cakeTypeService = new CakeTypeService(),
    private frostingService = new FrostingService()
  ) {}

  async addCake(
    cartId: string,
    userId: string,
    cakeId: string,
    quantity: number = 1,
    type?: string,
    frosting?: string,
    fillings?: string[],
    size?: Size
  ): Promise<ICart | undefined> {
    const cartExists: boolean = !!(await this.cartRepository.getById(cartId));

    if (!cartExists) {
      throw new ApiError("This cart doesn't exists", 404);
    }

    const user = await this.userRepository.findById(userId);

    if (user?.cartId.toString() !== cartId) {
      throw new ApiError("This cart doesn't belong to this user", 403);
    }

    const cake: ICake | undefined = await this.cakeService.findById(cakeId);

    if (!cake || !cake._id) {
      throw new ApiError("this cake don't exists", 404);
    }

    const {
      type: cakeResType,
      fillings: cakeResFillings,
      frosting: cakeResFrosting,
      size: cakeResSize,
      pricePerSize,
      sizesPossibles,
      customizableParts
    } = cake;

    const sizeIsValid = sizesPossibles.includes(size || cakeResSize);
    const pricingWithoutFillingAndFrosting = pricePerSize[size || cakeResSize];

    if (!pricingWithoutFillingAndFrosting || !sizeIsValid) {
      throw new ApiError("this cake can't have this size", 400);
    }

    const totalPricing =
      quantity *
      this.cakeService.calculateTotalPricing(
        (cakeResFillings || []) as IFilling[],
        pricingWithoutFillingAndFrosting,
        cakeResFrosting as IFrosting | undefined
      );

    if (totalPricing < 0) {
      throw new ApiError("the item cart can't have negative totalPricing", 400);
    }

    const [typeValidation, fillingsValidation, frostingValidation] =
      await Promise.all([
        this.verifyIfTypeCakeExists(
          type,
          cakeResType as ICakeType,
          customizableParts
        ),
        this.verifyIfFillingsOfCakeExists(
          fillings,
          cakeResFillings as IFilling[],
          customizableParts
        ),
        this.verifyIfFrostingOfCakeExists(
          frosting,
          cakeResFrosting as IFrosting,
          customizableParts
        )
      ]);

    if (!typeValidation.isValid) {
      throw new ApiError(typeValidation.errorMessage, typeValidation.status);
    }

    if (!fillingsValidation.isValid) {
      throw new ApiError(
        fillingsValidation.errorMessage,
        fillingsValidation.status
      );
    }

    if (!frostingValidation.isValid) {
      throw new ApiError(
        frostingValidation.errorMessage,
        frostingValidation.status
      );
    }

    const { data: typeValidated } = typeValidation;
    const { data: fillingsValidated } = fillingsValidation;
    const { data: frostingValidated } = frostingValidation;

    const cart = await this.cartRepository.addCake(cartId, {
      cakeId: cake._id,
      type: typeValidated,
      fillings: fillingsValidated,
      frosting: frostingValidated,
      size: size || cakeResSize,
      totalPricing,
      quantity
    });

    // console.log(cake);
    // console.log(cart?.cakes);

    return cart;
  }

  private async verifyIfTypeCakeExists(
    type: string | undefined,
    defaultType: ICakeType,
    customizableParts: CustomizablesParts[]
  ): Promise<CakePartsValidationResult<string>> {
    if (!type) {
      return {
        isValid: true,
        data: defaultType.type
      };
    }

    if (type && !customizableParts.includes("type")) {
      return {
        isValid: false,
        status: 400,
        errorMessage: "the type of this cake can't be changed"
      };
    }

    const typeInDb: ICakeType | undefined = await this.cakeTypeService.getOne([
      type
    ]);

    if (!typeInDb) {
      return {
        isValid: false,
        status: 404,
        errorMessage: `the cake type "${type}" isn't registered in the database`
      };
    }

    return {
      isValid: true,
      data: typeInDb.type
    };
  }

  private async verifyIfFillingsOfCakeExists(
    fillings: string[] = [],
    defaultFillings: IFilling[] | undefined = [],
    customizableParts: CustomizablesParts[]
  ): Promise<CakePartsValidationResult<string[]>> {
    const defaultFillingsNames = defaultFillings.map((filling) => filling.name);
    const fillingsNotDefaults = fillings.filter(
      (filling) => !defaultFillingsNames.includes(filling)
    );

    if (fillingsNotDefaults.length === 0) {
      return {
        isValid: true,
        data: defaultFillingsNames
      };
    }

    //depois você precisa corrigir esse erro de gramatica que tem no customizableParts, esta com "filing" ao inves de "fillings", depois dessa mudança vai precisar updatar todos os dados do banco de dados e os refazer
    if (
      fillingsNotDefaults.length > 0 &&
      !customizableParts.includes("filing")
    ) {
      return {
        isValid: false,
        errorMessage: "the fillings of this cake can't be changed",
        status: 400
      };
    }

    const fillingsInDB: IFilling[] | undefined =
      await this.fillingService.getAll(fillingsNotDefaults);

    if (!fillingsInDB) {
      return {
        isValid: false,
        errorMessage: "failed to find fillings in database",
        status: 500
      };
    }

    const fillingNames = fillingsInDB.map((filling) => filling.name);

    for (let i = 0; i < fillingsNotDefaults.length; i++) {
      if (!fillingNames.includes(fillingsNotDefaults[0])) {
        return {
          isValid: false,
          errorMessage: `the filling "${fillingsNotDefaults[0]}" isn't registered in the database`,
          status: 404
        };
      }
    }

    return {
      isValid: true,
      data: fillings
    };
  }

  async verifyIfFrostingOfCakeExists(
    frosting: string | undefined,
    defaultFrosting: IFrosting | undefined,
    customizableParts: CustomizablesParts[]
  ): Promise<CakePartsValidationResult<string | undefined>> {
    if (!frosting) {
      return {
        isValid: true,
        data: defaultFrosting?.name
      };
    }

    if (frosting && !customizableParts.includes("frosting")) {
      return {
        isValid: false,
        errorMessage: "the frosting of this cake can't be changed",
        status: 400
      };
    }

    const frostingInDB: IFrosting | undefined =
      await this.frostingService.getOne([frosting]);

    if (!frostingInDB) {
      return {
        isValid: false,
        status: 404,
        errorMessage: `the frosting "${frosting}" isn't registered in the database`
      };
    }

    return {
      isValid: true,
      data: frostingInDB.name
    };
  }
}
