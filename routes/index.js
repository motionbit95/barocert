var express = require("express");
var router = express.Router();

const nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {});
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "motionbit.dev@gmail.com",
    pass: "ctwb eqcs oekk pnix",
  },
});

router.post("/sendEmail", async (req, res, next) => {
  // 계정 확인용 이메일을 전송합니다.
  const email = req.body.email;
  const content = req.body.content;
  console.log(content);

  try {
    const mailOptions = {
      from: `레드스위치`,
      to: email,
      subject: "가맹점 신청",
      // html: content,
      html: `<p>가맹점 신청 정보</p>
      <p>가맹점명 : ${content.shop_name}</p>
      <p>담당자 이름 : ${content.user_name}</p>
      <p>담당자 연락처 : ${content.user_tel}</p>
      <p>담당자 이메일 : ${content.user_email}</p>
      <p>가맹점 주소 : ${content.shop_address}</p>
      <p>객실 수 : ${content.room_cnt}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send("email sent");
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
