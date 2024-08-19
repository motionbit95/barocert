const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const firebase = require("./db");
const { default: axios } = require("axios");
const db = firebase.firestore();

var router = express.Router();

const merchantKey =
  "0KHf4qt04B6LEBwZ8M8z5bN/p/I0VQaaMy/SiQfjmVyYFpv6R+OB9toybcTYoOak09rVE4ytGLuvEs5wUEt3pA=="; // 상점키
const merchantID = "DMGS00001m"; // 상점아이디

// Function to get current date and time in yyyyMMddHHmmss format
function getyyyyMMddHHmmss() {
  const now = new Date();
  const yyyyMMddHHmmss =
    now.getFullYear() +
    "" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "" +
    now.getDate().toString().padStart(2, "0") +
    "" +
    now.getHours().toString().padStart(2, "0") +
    "" +
    now.getMinutes().toString().padStart(2, "0") +
    "" +
    now.getSeconds().toString().padStart(2, "0");
  return yyyyMMddHHmmss;
}

// Function to encrypt data using SHA-256
function encryptSHA256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

router.get("/", (req, res) => {
  console.log("PG Sample page");

  console.log(req.query.order_id);
  console.log(req.query.amount);

  // 주문 정보를 가지고 오기

  const ediDate = getyyyyMMddHHmmss();
  const goodsAmt = req.query.amount; // 결제상품금액
  const encData = encryptSHA256(merchantID + ediDate + goodsAmt + merchantKey);

  console.log("encData : " + encData);

  res.render("pg", {
    merchantID,
    goodsNm: "레드스위치",
    goodsAmt,
    ordNm: "레드스위치",
    ordTel: "01000000000",
    ordNo: req.query.order_id,
    returnUrl:
      "https://port-0-barocert-lxwmkqxz2d25ae69.sel5.cloudtype.app/payment/payResult",
    ediDate,
    encData,
  });
});

router.post("/payResult", (req, res) => {
  // Handle the payment result here
  // window.location.href =
  //   "http://localhost:3000/result?orderId=" + req.query.orderId;

  // console.log(
  //   'http://localhost:3000/result?data={"paidAt":"' +
  //     getyyyyMMddHHmmss() +
  //     '","resultCode":"0000","orderId":"' +
  //     req.params.orderId +
  //     '"}'
  // );
  // res.redirect(
  //   'http://localhost:3000/result?data={"paidAt":"' +
  //     getyyyyMMddHHmmss() +
  //     '","resultCode":"0000","orderId":"' +
  //     req.params.orderId +
  //     '"}'
  // );

  // 결과를 받습니다.

  // 건너받은 파라미터 -> 이걸 프론트에 search query로 보낸다.
  // tid: 'DMGS00001m01012408141747250304',
  // payMethod: 'CARD',
  // ediDate: '20240814174723',
  // goodsAmt: '15000',
  // mid: 'DMGS00001m',
  // ordNo: 'b5bf0a16',
  // mbsReserved: 'MallReserved',
  // charSet: 'UTF-8',
  // signData:
  // resultCode: '0000',
  // resultMsg: 'Success'

  console.log(req.body);

  // 승인을 요청합니다. - 현재 모든 카드사 승인 X - 9999 결제실패 에러 발생함.(주석)
  axios
    .post(
      "https://api.payster.co.kr/payment.do",
      {
        tid: req.body.tid,
        ediDate: req.body.ediDate,
        mid: req.body.mid,
        goodsAmt: req.body.goodsAmt,
        charSet: "utf-8",
        encData: req.body.encData,
        signData: req.body.signData,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
      }
    )
    .then((response) => {
      console.log("응답결과:", response.data);

      // 파이어베이스 문서에 저장하자
      db.collection("PAYMENT")
        .doc(req.body.ordNo)
        .set({ ...req.body, ...response.data }, { merge: true })
        .then(() => {
          console.log("Document successfully written!");
          res.redirect(
            "http://redswitch.kr/result?data={" +
              '"paidAt":"' +
              getyyyyMMddHHmmss() +
              '","resultCode":"0000","orderId":"' +
              req.body.ordNo +
              '"}'
          );
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/payCancel", (req, res) => {
  axios
    .post(
      "https://api.payster.co.kr/payment.cancel",
      {
        tid: req.body.tid,
        ordNo: req.body.ordNo,
        canAmt: req.body.canAmt,
        canMsg: "지점사정", // 취소사유
        partCanFlg: "0",
        encData: req.body.encData,
        ediDate: req.body.ediDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Charset: "UTF-8",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      // 환불 결과를 저장합니다.
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
