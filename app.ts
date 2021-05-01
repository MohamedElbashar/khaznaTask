/** @format */

import express from "express";
import login from "./routes/login";
import register from "./routes/register";
const app = express();

//Routes
app.use(express.json());
app.use("/api/login", login);
app.use("/api/register", register);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port ${port}...`));
