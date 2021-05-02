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
});

router.post(
  "/",
  celebrate({ body: validate }),
  async (req: Request, res: Response) => {
    let user = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (!user) return res.status(400).send("Invalid username or password");

    const comparison = await bcrypt.compare(req.body.password, user.password);
    if (!comparison) res.status(400).send("Invalid username or password");

    const privateKey = process.env.PRIVATE_KEY!;
    const token = jwt.sign({ id: user.id }, privateKey);
    res.send(token);
  }
);
export default router;
