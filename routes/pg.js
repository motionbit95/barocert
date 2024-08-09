const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");

var router = express.Router();

const merchantKey =
  "0KHf4qt04B6LEBwZ8M8z5bN/p/I0VQaaMy/SiQfjmVyYFpv6R+OB9toybcTYoOak09rVE4ytGLuvEs5wUEt3pA=="; // 상점키
const merchantID = "DMGS00001m"; // 상점아이디

// Function to get current date and time in yyyyMMddHHmmss format
function getyyyyMMddHHmmss() {
  const now = new Date();
  const yyyyMMddHHmmss = now
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  return yyyyMMddHHmmss;
}

// Function to encrypt data using SHA-256
function encryptSHA256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

router.get("/", (req, res) => {
  console.log("PG Sample page");
  const ediDate = getyyyyMMddHHmmss();
  const goodsAmt = "1004"; // 결제상품금액
  const encData = encryptSHA256(merchantID + ediDate + goodsAmt + merchantKey);

  console.log("encData : " + encData);

  res.render("pg", {
    merchantID,
    goodsNm: "테스트상품",
    goodsAmt,
    ordNm: "PGTEST",
    ordTel: "01000000000",
    ordEmail: "abcd@zxcv.com",
    ordNo: "test1234567890",
    returnUrl: "/payResultSample",
    ediDate,
    encData,
  });
});

router.post("/payResultSample", (req, res) => {
  // Handle the payment result here
  res.send("Payment result received");
});

module.exports = router;
