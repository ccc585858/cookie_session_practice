const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("Kazuha"));

app.get("/", (req, res) => {
  res.send("這是首頁");
});

app.get("/setCookie", (req, res) => {
  //   res.cookie("yourCookie", "Oreo");
  res.cookie("yourCookie", "Oreo", { signed: true });
  return res.send("已經設置 Cookie...");
});

app.get("/seeCookie", (req, res) => {
  console.log(req.signedCookies);
  return res.send(
    "看一下已經設定好的 Cookie..." + req.signedCookies.yourCookie
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
