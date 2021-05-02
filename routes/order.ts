/** @format */

import auth from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { celebrate, Joi } from "celebrate";

const router = Router();
const db = new PrismaClient();

const validate = Joi.object().keys({
  products: Joi.array()
    .items(
      Joi.object().keys({
        id: Joi.number().required(),
        quantity: Joi.number().required(),
      })
    )
    .required(),
});
router.get("/", auth, async (req, res) => {
  const order = await db.order.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      OrderItems: true,
    },
  });
  res.send(order);
});

router.get("/:id", auth, async (req, res) => {
  const valid_id = parseInt(req.params.id);
  const order = await db.order.findUnique({
    where: {
      id: valid_id,
    },
  });
  if (!order)
    return res.status(404).send("The order with the given ID was not found.");
  res.send(order);
});

router.post(
  "/",
  [auth, celebrate({ body: validate })],
  async (req: any, res: Response) => {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!user) return res.status(400).send("Invalid User.");
    let cost = 0;
    const products = await db.product.findMany({
      where: {
        id: {
          in: req.body.products.map((product: any) => product.id),
        },
      },
    });
    products.forEach((product) => {
      const quantity =
        req.body.products.find((p: any) => p.id === product.id)?.quantity || 0;
      cost += quantity * product.price;
    });

    const balance = user.allowed_balance;
    const available_balance = balance - cost;
    if (available_balance >= 0) {
      const user = await db.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          allowed_balance: available_balance,
        },
      });
    } else {
      res
        .status(400)
        .send("the allowed balance is not enough to make the order ");
    }

    const order = await db.order.create({
      data: {
        cost: cost,
        User: {
          connect: { id: user.id },
        },
        OrderItems: {
          createMany: {
            data: req.body.products.map((product: any) => ({
              product_id: product.id,
              quantity: product.quantity,
            })),
          },
        },
      },
    });
    res.send(order);
  }
);

router.post(
  "/:id/accept",
  [auth, celebrate({ params: { id: Joi.number() } })],
  async (req: any, res: Response) => {
    const valid_id = parseInt(req.params.id);
    const order = await db.order.update({
      where: {
        id: valid_id,
      },
      data: {
        status: "ACCEPTTED",
      },
    });
    if (!order)
      return res.status(404).send("The order with the given ID was not found.");
    res.send(order);
  }
);

router.post(
  "/:id/decline",
  [auth, celebrate({ params: { id: Joi.number() } })],
  async (req: any, res: Response) => {
    const valid_id = parseInt(req.params.id);
    const order = await db.order.update({
      where: {
        id: valid_id,
      },
      data: {
        status: "DECLINED",
      },
    });
    if (!order)
      return res.status(404).send("The order with the given ID was not found.");
    res.send(order);
  }
);

export default router;
