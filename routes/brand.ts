/** @format */

import auth from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { Response, Router } from "express";
import { celebrate, Joi } from "celebrate";

const router = Router();
const db = new PrismaClient();

const validate = Joi.object().keys({
  name: Joi.string().min(3).required(),
});

router.get("/", auth, async (req, res) => {
  const brand = await db.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });
  res.send(brand);
});

router.get("/:id", auth, async (req: any, res) => {
  const brand = await db.brand.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!brand)
    return res.status(404).send("The Brand with the given ID was not found.");

  res.send(brand);
});

router.post(
  "/",
  [auth, celebrate({ body: validate })],
  async (req: any, res: Response) => {
    const brand = await db.brand.create({
      data: {
        name: req.body.name,
      },
    });
    res.send(brand);
  }
);

router.put(
  "/:id",
  [(celebrate({ body: validate }), auth)],
  async (req: any, res: Response) => {
    const brand = await db.brand.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
      },
    });
    if (!brand)
      return res.status(404).send("The Brand with the given ID was not found.");
    res.send(brand);
  }
);

router.delete("/:id", auth, async (req: any, res) => {
  const brand = await db.brand.delete({
    where: {
      id: req.params.id,
    },
  });
  if (!brand)
    return res.status(404).send("The Brand with the given ID was not found.");

  res.send(brand);
});
export default router;
