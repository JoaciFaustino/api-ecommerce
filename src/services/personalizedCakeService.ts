import { CustomizablesParts, ICake, Size } from "../@types/Cake";
import { ICakeType } from "../@types/CakeType";
import { IPersonalizedCake } from "../@types/Cart";
import { IFilling } from "../@types/Filling";
import { IFrosting } from "../@types/Frosting";
import { FillingRepository } from "../repositories/fillingRepository";
import { areStringArraysEqual } from "../utils/arrayUtils";
import { CakeService } from "./cakeService";
import { CakeTypeService } from "./cakeTypeService";
import { FrostingService } from "./frostingService";

type ValidResult<T> = {
  isValid: true;
  data: T;
};

type InvalidResult = {
  isValid: false;
  errorMessage: string;
  status: number;
};

type CakePartsValidationResult<T> = Promise<ValidResult<T> | InvalidResult>;

export class PersonalizedCakeService {
  constructor(
    private cakeService = new CakeService(),
    private cakeTypeService = new CakeTypeService(),
    private fillingRepository = new FillingRepository(),
    private frostingService = new FrostingService()
  ) {}

  async validateItemCart(
    cake: ICake,
    quantity: number = 1,
    typePersonalized?: string,
    frostingPersonalized?: string,
    fillingsPersonalized?: string[],
    sizePersonalized?: Size
  ): CakePartsValidationResult<IPersonalizedCake> {
    const {
      _id: cakeId,
      type: cakeTypeDefault,
      fillings: fillingsDefault,
      frosting: frostingDefault,
      size: sizeDefault,
      pricePerSize,
      sizesPossibles,
      customizableParts
    } = cake;

    const sizeIsValid = sizesPossibles.includes(
      sizePersonalized || sizeDefault
    );
    const pricingWithoutFillingAndFrosting =
      pricePerSize[sizePersonalized || sizeDefault];

    if (!pricingWithoutFillingAndFrosting || !sizeIsValid) {
      return {
        isValid: false,
        errorMessage:
          // prettier-ignore
          "the cake with id " + cake._id + " can't have the size " + sizePersonalized || sizeDefault,
        status: 400
      };
    }

    const totalPricing =
      quantity *
      this.cakeService.calculateTotalPricing(
        (fillingsDefault || []) as IFilling[],
        pricingWithoutFillingAndFrosting,
        frostingDefault as IFrosting | undefined
      );

    if (totalPricing < 0) {
      return {
        isValid: false,
        errorMessage: `no one item can't have negative totalPricing`,
        status: 400
      };
    }

    const [typeValidation, fillingsValidation, frostingValidation] =
      await Promise.all([
        this.verifyIfTypeCakeExists(
          typePersonalized,
          cakeTypeDefault as string,
          customizableParts,
          cakeId!.toString()
        ),
        this.verifyIfFillingsOfCakeExists(
          fillingsPersonalized,
          fillingsDefault as IFilling[],
          customizableParts,
          cakeId!.toString()
        ),
        this.verifyIfFrostingOfCakeExists(
          frostingPersonalized,
          frostingDefault as IFrosting,
          customizableParts,
          cakeId!.toString()
        )
      ]);

    if (!typeValidation.isValid) {
      return typeValidation;
    }

    if (!fillingsValidation.isValid) {
      return fillingsValidation;
    }

    if (!frostingValidation.isValid) {
      return frostingValidation;
    }

    const { data: typeValidated } = typeValidation;
    const { data: fillingsValidated } = fillingsValidation;
    const { data: frostingValidated } = frostingValidation;

    return {
      isValid: true,
      data: {
        cakeId: cake._id!,
        name: cake.name,
        type: typeValidated,
        fillings: fillingsValidated,
        frosting: frostingValidated,
        size: sizePersonalized || sizeDefault,
        imageUrl: cake.imageUrl,
        totalPricing,
        quantity
      }
    };
  }

  private async verifyIfTypeCakeExists(
    type: string | undefined,
    defaultType: string,
    customizableParts: CustomizablesParts[],
    cakeId: string
  ): CakePartsValidationResult<string> {
    if (!type || type === defaultType) {
      return { isValid: true, data: defaultType };
    }

    if (type && !customizableParts.includes("type")) {
      return {
        isValid: false,
        status: 400,
        errorMessage: `the type of the cake with id "${cakeId}" can't be changed`
      };
    }

    const typeInDb: ICakeType | undefined = await this.cakeTypeService.getOne([
      type
    ]);

    if (!typeInDb) {
      return {
        isValid: false,
        status: 404,
        errorMessage: `the cake type "${type}" in the cake with id ${cakeId} isn't registered in the database`
      };
    }

    return { isValid: true, data: typeInDb.type };
  }

  private async verifyIfFillingsOfCakeExists(
    fillings: string[] = [],
    defaultFillings: IFilling[] | undefined = [],
    customizableParts: CustomizablesParts[],
    cakeId: string
  ): CakePartsValidationResult<string[]> {
    const defaultFillingsNames = defaultFillings.map((filling) => filling.name);

    if (areStringArraysEqual(fillings, defaultFillingsNames)) {
      return { isValid: true, data: defaultFillingsNames };
    }

    //depois você precisa corrigir esse erro de gramatica que tem no customizableParts, esta com "fillings" ao inves de "fillings", depois dessa mudança vai precisar updatar todos os dados do banco de dados e os refazer
    if (
      !areStringArraysEqual(fillings, defaultFillingsNames) &&
      !customizableParts.includes("fillings")
    ) {
      return {
        isValid: false,
        errorMessage: `the fillings of the cake with id "${cakeId}" can't be changed`,
        status: 400
      };
    }

    const fillingsNotDefaults = fillings.filter(
      (filling) => !defaultFillingsNames.includes(filling)
    );

    const limit = 9999;
    const page = 1;

    const fillingsInDB: IFilling[] | undefined =
      await this.fillingRepository.getAll(limit, page, fillingsNotDefaults);

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
          errorMessage: `the filling "${fillingsNotDefaults[0]}" in the cake with id "${cakeId}" isn't registered in the database`,
          status: 404
        };
      }
    }

    return { isValid: true, data: fillings };
  }

  private async verifyIfFrostingOfCakeExists(
    frosting: string | undefined,
    defaultFrosting: IFrosting | undefined,
    customizableParts: CustomizablesParts[],
    cakeId: string
  ): CakePartsValidationResult<string | undefined> {
    if (!frosting || frosting === defaultFrosting?.name) {
      return { isValid: true, data: defaultFrosting?.name };
    }

    if (frosting && !customizableParts.includes("frosting")) {
      return {
        isValid: false,
        errorMessage: `the frosting of the cake with id ${cakeId} can't be changed`,
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

    return { isValid: true, data: frostingInDB.name };
  }
}
