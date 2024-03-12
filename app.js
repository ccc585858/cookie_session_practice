require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const Student = require("./models/student");
const bcrypt = require("bcrypt");
const saltRounds = 12; // 通常常見的是 8, 10, 12, 14

mongoose
  .connect("mongodb://127.0.0.1:27017/exampleDB")
  .then(() => {
    console.log("成功連結 mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(
  session({
    secret: process.env.MYSESSIONSECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // 在 loaclhost 上面跑，沒有 https
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/students", async (req, res) => {
  let foundStudent = await Student.find({}).exec();
  return res.send(foundStudent);
});

app.post("/students", async (req, res) => {
  try {
    let { username, password } = req.body;
    let hashValue = await bcrypt.hash(password, saltRounds);
    console.log(hashValue);
    let newStudent = new Student({ username, password: hashValue });
    let savedStudent = await newStudent.save();
    return res.send({ message: "成功新增學生", savedStudent });
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
