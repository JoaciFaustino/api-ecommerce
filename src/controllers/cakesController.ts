import { Request, Response } from "express";

export class CakesController {
  constructor() {}

  async getById(req: Request, res: Response) {
    res.status(200).send({ message: "passed through the middleware" });
  }
}
