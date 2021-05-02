/** @format */
import auth from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { celebrate, Joi } from "celebrate";

const router = Router();
const db = new PrismaClient();

const validate = Joi.object().keys({
  name: Joi.string().min(4).required(),
  price: Joi.number().min(0).required(),
  brand_id: Joi.number().required(),
  category_id: Joi.number().required(),
});
const validateUpdate = Joi.object().keys({
  name: Joi.string().min(4).required(),
  price: Joi.number().min(0).required(),
});
router.get("/", auth, async (req: any, res: Response) => {
  const products = await db.product.findMany({
    where: {
      price: {
        lte: req.user.allowed_balance,
      },
    },
  });

  res.send(products);
});

router.post(
  "/",
  [auth, celebrate({ body: validate })],
  async (req: any, res: Response) => {
    const brand = await db.brand.findUnique({
      where: {
        id: req.body.brand_id,
      },
    });
    if (!brand) return res.status(400).send("Invalid Brand.");

    const category = await db.category.findUnique({
      where: {
        id: req.body.category_id,
      },
    });
    if (!category) return res.status(400).send("Invalid Category.");

    const product = await db.product.create({
      data: {
        name: req.body.name,
        price: req.body.price,
        Brand: {
          connect: { id: brand.id },
        },
        Category: {
          connect: { id: category.id },
        },
      },
      include: {
        Brand: true,
        Category: true,
      },
    });
    res.send(product);
  }
);

router.get("/:id", auth, async (req: any, res: Response) => {
  const valid_id = parseInt(req.params.id);
  const product = await db.product.findUnique({
    where: {
      id: valid_id,
    },
  });
  if (!product)
    return res.status(404).send("The Product with the given ID was not found.");

  res.send(product);
});

router.put(
  "/:id",
  [celebrate({ body: validateUpdate }), auth],
  async (req: any, res: Response) => {
    const valid_id = parseInt(req.params.id);
    const product = await db.product.update({
      where: {
        id: valid_id,
      },
      data: {
        name: req.body.name,
        price: req.body.price,
      },
    });
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(product);
  }
);

router.delete("/:id", auth, async (req: any, res: Response) => {
  const valid_id = parseInt(req.params.id);
  const product = await db.product.delete({
    where: { id: valid_id },
  });
  if (!product)
    return res.status(404).send("The product with the given ID was not found.");

  res.send(product);
});

export default router;
