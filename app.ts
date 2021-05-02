/** @format */

import express from "express";
import login from "./routes/login";
import register from "./routes/register";
import product from "./routes/product";
import brand from "./routes/brand";
import category from "./routes/category";
const app = express();

//Routes
app.use(express.json());
app.use("/api/login", login);
app.use("/api/register", register);
app.use("/api/product", product);
app.use("/api/brand", brand);
app.use("/api/brand", category);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port ${port}...`));
