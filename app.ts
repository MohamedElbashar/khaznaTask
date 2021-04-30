/** @format */

import express from "express";
const app = express();
//Routes
app.use("/", (req, res) => {
  res.send("welcome");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port ${port}...`));
