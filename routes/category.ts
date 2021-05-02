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
  const category = await db.category.findMany({
    orderBy: {
      id: "asc",
    },
  });
  res.send(category);
});

router.get("/:id", auth, async (req: any, res) => {
  const valid_id = parseInt(req.params.id);
  const category = await db.category.findUnique({
    where: {
      id: valid_id,
    },
  });
  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});

router.post(
  "/",
  [auth, celebrate({ body: validate })],
  async (req: any, res: Response) => {
    const category = await db.category.create({
      data: {
        name: req.body.name,
      },
    });
    res.send(category);
  }
);

router.put(
  "/:id",
  [(celebrate({ body: validate }), auth)],
  async (req: any, res: Response) => {
    const valid_id = parseInt(req.params.id);
    const category = await db.category.update({
      where: {
        id: valid_id,
      },
      data: {
        name: req.body.name,
      },
    });
    if (!category)
      return res
        .status(404)
        .send("The category with the given ID was not found.");
    res.send(category);
  }
);

router.delete("/:id", auth, async (req: any, res) => {
  const valid_id = parseInt(req.params.id);
  const category = await db.category.delete({
    where: {
      id: valid_id,
    },
  });
  if (!category)
    return res
      .status(404)
      .send("The category with the given ID was not found.");

  res.send(category);
});
export default router;
