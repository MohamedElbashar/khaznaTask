/** @format */

import auth from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { celebrate, Joi } from "celebrate";

const router = Router();
const db = new PrismaClient();

const validate = Joi.object().keys({
  name: Joi.string().min(4).required(),
});
