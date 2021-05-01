/** @format */

import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) res.status(401).send("Access Denied. No token provided");

  try {
    const privateKey = process.env.PRIVATE_KEY!;
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}
