import { Request, Response } from "express";
import { IOrder } from "../@types/Order";
import { Order } from "../models/Order";
import { ReqBodyCreateOrder } from "../@types/ReqBody";

export class OrderController {
  constructor() {}

  async create(req: Request<{}, {}, ReqBodyCreateOrder>, res: Response) {
    //*==AÇÕES==*
    //*
    //====
    //====ISSO VAI SER NO SERVICE DE ADD TO CART
    //- Verificação de tipos

    //- (depois coloque o cartId na modelUser e depois faça uma limpa na
    //colection no database) Verificar se id do cart pertence mesmo ao usuario
    //fornecido

    //- Verificar se o cakeId de todos os bolos existe

    //- Verificar se os valores de frosting, filling, type, size de um bolo forem diferentes
    //dos padrões do bolo, vai precisar fazer a verificação se o bolo tem aquela
    //opção de customização nas propriedades de "customizableParts" e "sizesPossible"

    //- Verificar se os valores de frosting, filling, type, size de um bolo forem
    //undefined ele vai usar os valores padrão do bolo

    //- Verificar se a quantidade de todos os bolos é maior ou igual a 1

    //- Verificar se todas os valores passados para frosting, filling, type
    //existem no banco de dados

    //====
    //====

    //====
    //====ISSO VAI SER NO SERVICE DE ORDER
    //- Verificação de tipos

    //- Verificar se userId existe

    //- Tomar cuidado para não deixar o cliente modificar o valor de nenhum
    //preço, ou seja, tudo precisa vir sempre do banco de dados. As alterações
    //de preço precisam ser feitas nas rotas de admin

    //- Se o typeOfReceipt for "pick-up", o deliveryAddress vai precisar ser
    //automaticamente undefined, se o cliente mandar precisa ser ignorado

    //- Depois que terminar de fazer o pedido precisa apagar todos os bolos do
    //carrinho do cliente

    //- Depois que terminar de fazer o pedido precisa aumentar a quantidade de
    //"broughts" de todos os bolos que foram comprados conforme a quantidade que
    //foi comprada de cada um

    //- Remover todos os bolos comprados do cart do usuário

    const order: IOrder = {
      userId: "6633939f91ffeadfa3c4a7c3",
      cakes: [
        {
          cakeId: "665b5a00fae06e351e3e0a9e",
          size: "extra-grande",
          quantity: 1,
          type: "chocolate",
          fillings: ["chocolate", "morango"],
          frosting: "chocolate",
          totalPricing: 20 //CLIENTE NÃO VAI MANDAR
        },
        {
          cakeId: "665b5afdfae06e351e3e0aa4",
          size: "extra-grande",
          quantity: 1,
          type: "cenoura",
          fillings: ["chocolate", "morango"],
          frosting: "chocolate",
          totalPricing: 20 //CLIENTE NÃO VAI MANDAR
        }
      ],
      contactDetails: {
        email: "reiDoSuco@gmail.com",
        name: "João Batista",
        phoneNumber: "999999999999"
      },
      typeOfReceipt: "delivery",
      observations: "can i put my balls in your jaws",
      dateAndTimeDelivery: new Date(), //CLIENTE NÃO VAI MANDAR
      deliveryAddress: {
        street: "João Batista Rei do Suco",
        neighborhood: "Centro",
        number: 777,
        adicionalInfo: "perto de acolá"
      },
      state: "pending", //CLIENTE NÃO VAI MANDAR
      totalPricing: 20 //CLIENTE NÃO VAI MANDAR
    };

    const data = await Order.create(order);

    console.log(data);
  }
}
