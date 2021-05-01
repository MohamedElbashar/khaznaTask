/** @format */

import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { celebrate, Joi } from "celebrate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const db = new PrismaClient();

const validate = Joi.object().keys({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(4).required(),
  allowed_balance: Joi.number().min(0).required(),
});

router.post(
  "/",
  celebrate({ body: validate }),
  async (req: Request, res: Response) => {
    const userExist = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (userExist) return res.status(400).send("user Already registered");

    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const user = await db.user.create({
      data,
    });

    const privateKey = process.env.PRIVATE_KEY!;
    const token = jwt.sign({ id: user.id }, privateKey);
    res.header("x-auth-token", token).send(user);
  }
);
export default router;
