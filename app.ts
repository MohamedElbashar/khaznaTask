/** @format */
import express from "express";

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listing on port 3000"));

// import mysql from "mysql";
// import express from 'express';
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "",
// });
// connection.connect((error) => {
//   console.log(error ? "connected" : "Error");
//   connection.query("CREATE DATABASE ", (err, res) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Database created");
//     }
//   });
// });
