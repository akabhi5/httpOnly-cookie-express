const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const SECRET = "somesecretkey";

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("tiny"));

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log("TOKEN:", req.cookies.token);
  res.status(200).json({
    message: "welcome",
  });
});

app.post("/", (req, res) => {
  const { email, password } = req.body;
  if (email == "abhi" && password == "12345") {
    const token = jwt.sign({ email: email }, SECRET);
    res.cookie("token", token, { expire: new Date() + 9999, httpOnly: true });
    return res.json({ token });
  } else {
    return res.status(401).json({
      error: "Email and password doesn't match",
    });
  }
});

app.get("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "user signout successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
