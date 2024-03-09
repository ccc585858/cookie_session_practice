require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser(process.env.MYCOOKIESECRETKEY));
app.use(
  session({
    secret: process.env.MYSESSIONSECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // 在 loaclhost 上面跑，沒有 https
  })
);
app.use(flash());

const checkUser = (req, res, next) => {
  if (!req.session.isVerified) {
    return res.send("請先登入系統，才能看到秘密。");
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  req.flash("message", "歡迎來到網頁...");
  res.send("這是首頁，" + req.flash("message"));
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

// 設定 session
app.get("/setSessionData", (req, res) => {
  // console.log(req.session);
  req.session.example = "something not important...";
  return res.send(
    "在伺服器上設置 session 資料，在瀏覽器上設置簽名後的 session id"
  );
});

// 取的 session 的資料
app.get("/seeSessionData", (req, res) => {
  console.log(req.session);
  return res.send("看一下已經設定好的 Session 資料");
});

app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true;
  return res.send("驗證成功...");
});

// 模擬登入的狀態
// 不管是 secret 還是 secret2 這個 route，都會執行 checkUser middleware。
app.get("/secret", checkUser, (req, res) => {
  return res.send("秘密是，Momo");
});

app.get("/secret2", checkUser, (req, res) => {
  return res.send("秘密2，Kazuha");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
