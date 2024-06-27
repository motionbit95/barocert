/*
 * Barocert KAKAO API Node SDK Example
 *
 * 업데이트 일자 : 2024-04-17
 * 연동기술지원 연락처 : 1600-9854
 * 연동기술지원 이메일 : code@linkhubcorp.com
 *
 * <테스트 연동개발 준비사항>
 *   1) API Key 변경 (연동신청 시 메일로 전달된 정보)
 *       - LinkID : 링크허브에서 발급한 링크아이디
 *       - SecretKey : 링크허브에서 발급한 비밀키
 *   2) ClientCode 변경 (연동신청 시 메일로 전달된 정보)
 *       - ClientCode : 이용기관코드 (파트너 사이트에서 확인가능)
 *   3) SDK 환경설정 필수 옵션 설정
 *       - IPRestrictOnOff : 인증토큰 IP 검증 설정, true-사용, false-미사용, (기본값:true)
 *       - UseStaticIP : 통신 IP 고정, true-사용, false-미사용, (기본값:false)
 */

var express = require("express");
var router = express.Router();
var kakaocert = require("barocert");

kakaocert.config({
  // 링크아이디
  // LinkID: "TESTER",
  LinkID: "REDSWITCH_BC",

  // 비밀키
  // SecretKey: "SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=",
  SecretKey: "4WYpJ/f8568soYgr7vLOiENksqcEzcbfmVp3mQHOas0=",

  // 인증토큰 IP 검증 설정, true-사용, false-미사용, (기본값:true)
  IPRestrictOnOff: true,

  // 통신 IP 고정, true-사용, false-미사용, (기본값:false)
  UseStaticIP: false,

  defaultErrorHandler: function (Error) {
    console.log("Error Occur : [" + Error.code + "] " + Error.message);
  },
});

/*
 * Kakaocert API 서비스 클래스 생성
 */
var kakaocertService = kakaocert.KakaocertService();

/*********** 이한홀딩스 ***********/
router.get(
  "/RequestIdentity/:name/:phone/:birthday",
  function (req, res, next) {
    // 이용기관코드, 파트너 사이트에서 확인
    var clientCode = "024060000025";

    // 본인인증 요청정보 객체
    var identity = {
      // 수신자 휴대폰번호 - 11자 (하이픈 제외)
      receiverHP: kakaocertService._encrypt(req.params.phone),
      // 수신자 성명 - 80자
      receiverName: kakaocertService._encrypt(req.params.name),
      // 수신자 생년월일 - 8자 (yyyyMMdd)
      receiverBirthday: kakaocertService._encrypt(req.params.birthday),

      // 인증요청 메시지 제목 - 최대 40자
      reqTitle: "본인인증 요청 메시지 제목",
      // 커스텀 메시지 - 최대 500자
      extraMessage: kakaocertService._encrypt("본인인증 커스텀 메시지"),
      // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
      expireIn: 1000,
      // 서명 원문 - 최대 40자 까지 입력가능
      token: kakaocertService._encrypt("본인인증 요청 원문"),

      // AppToApp 인증요청 여부
      // true - AppToApp 인증방식, false - Talk Message 인증방식
      appUseYN: false,
      // App to App 방식 이용시, 호출할 URL
      returnURL: "https://www.kakaocert.com",
    };

    kakaocertService.requestIdentity(
      clientCode,
      identity,
      function (result) {
        console.log(result);
        // res.render("kakaocert/requestIdentity", {
        //   path: req.path,
        //   result: result,
        // });
        res.send(result);
      },
      function (error) {
        console.log(error);
        res.send(error);
        // res.render("response", {
        //   path: req.path,
        //   code: error.code,
        //   message: error.message,
        // });
      }
    );
  }
);

router.get("/GetIdentityStatus/:receiptID", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "024060000025";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = req.params.receiptID;

  kakaocertService.getIdentityStatus(
    clientCode,
    receiptID,
    function (result) {
      // res.render("kakaocert/getIdentityStatus", {
      //   path: req.path,
      //   result: result,
      // });
      res.send(result);
    },
    function (error) {
      // res.render("response", {
      //   path: req.path,
      //   code: error.code,
      //   message: error.message,
      // });
      res.send(error);
    }
  );
});

router.get("/VerifyIdentity/:receiptID", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "024060000025";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = req.params.receiptID;

  kakaocertService.verifyIdentity(
    clientCode,
    receiptID,
    function (result) {
      // res.render("kakaocert/verifyIdentity", {
      //   path: req.path,
      //   result: result,
      // });
      res.send(result);
    },
    function (error) {
      // res.render("response", {
      //   path: req.path,
      //   code: error.code,
      //   message: error.message,
      // });
      res.send(error);
    }
  );
});

/*

/*
 * 카카오톡 이용자에게 본인인증을 요청합니다.
 * https://developers.barocert.com/reference/kakao/node/identity/api#RequestIdentity
 */
// router.get("/RequestIdentity", function (req, res, next) {
//   // 이용기관코드, 파트너 사이트에서 확인
//   var clientCode = "023040000001";

//   // 본인인증 요청정보 객체
//   var identity = {
//     // 수신자 휴대폰번호 - 11자 (하이픈 제외)
//     receiverHP: kakaocertService._encrypt("01012341234"),
//     // 수신자 성명 - 80자
//     receiverName: kakaocertService._encrypt("홍길동"),
//     // 수신자 생년월일 - 8자 (yyyyMMdd)
//     receiverBirthday: kakaocertService._encrypt("19700101"),

//     // 인증요청 메시지 제목 - 최대 40자
//     reqTitle: "본인인증 요청 메시지 제목",
//     // 커스텀 메시지 - 최대 500자
//     extraMessage: kakaocertService._encrypt("본인인증 커스텀 메시지"),
//     // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
//     expireIn: 1000,
//     // 서명 원문 - 최대 40자 까지 입력가능
//     token: kakaocertService._encrypt("본인인증 요청 원문"),

//     // AppToApp 인증요청 여부
//     // true - AppToApp 인증방식, false - Talk Message 인증방식
//     appUseYN: false,
//     // App to App 방식 이용시, 호출할 URL
//     returnURL: "https://www.kakaocert.com",
//   };

//   kakaocertService.requestIdentity(
//     clientCode,
//     identity,
//     function (result) {
//       res.render("kakaocert/requestIdentity", {
//         path: req.path,
//         result: result,
//       });
//     },
//     function (error) {
//       res.render("response", {
//         path: req.path,
//         code: error.code,
//         message: error.message,
//       });
//     }
//   );
// });

/*
 * 본인인증 요청 후 반환받은 접수아이디로 본인인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/kakao/node/identity/api#GetIdentityStatus
 */
// router.get("/GetIdentityStatus", function (req, res, next) {
//   // 이용기관코드, 파트너 사이트에서 확인
//   var clientCode = "023040000001";

//   // 본인인증 요청시 반환받은 접수아이디
//   var receiptID = "02308170230400000010000000000026";

//   kakaocertService.getIdentityStatus(
//     clientCode,
//     receiptID,
//     function (result) {
//       res.render("kakaocert/getIdentityStatus", {
//         path: req.path,
//         result: result,
//       });
//     },
//     function (error) {
//       res.render("response", {
//         path: req.path,
//         code: error.code,
//         message: error.message,
//       });
//     }
//   );
// });

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 반환받은 전자서명값(signedData)과 [1. RequestIdentity] 함수 호출에 입력한 Token의 동일 여부를 확인하여 이용자의 본인인증 검증을 완료합니다.
 * 카카오 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 완료일시로부터 10분 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/kakao/node/identity/api#VerifyIdentity
 */
router.get("/VerifyIdentity", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000026";

  kakaocertService.verifyIdentity(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/verifyIdentity", {
        path: req.path,
        result: result,
      });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 카카오톡 이용자에게 단건(1건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-single#RequestSign
 */
router.get("/RequestSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청정보 객체
  var sign = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: kakaocertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: kakaocertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: kakaocertService._encrypt("19700101"),

    // 서명 요청 제목 - 최대 40자
    signTitle: "전자서명(단건) 서명 요청 제목",
    // 커스텀 메시지 - 최대 500자
    extraMessage: kakaocertService._encrypt("전자서명(단건) 커스텀 메시지"),
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 원문 2,800자 까지 입력가능
    token: kakaocertService._encrypt("전자서명(단건) 요청 원문"),
    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: "TEXT",

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,
    // App to App 방식 이용시, 호출할 URL
    returnURL: "https://www.kakaocert.com",
  };

  kakaocertService.requestSign(
    clientCode,
    sign,
    function (result) {
      res.render("kakaocert/requestSign", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 전자서명(단건) 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-single#GetSignStatus
 */
router.get("/GetSignStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000027";

  kakaocertService.getSignStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/getSignStatus", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 카카오 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 완료일시로부터 10분 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-single#VerifySign
 */
router.get("/VerifySign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000027";

  kakaocertService.verifySign(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/verifySign", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 카카오톡 이용자에게 복수(최대 20건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-multi#RequestMultiSign
 */
router.get("/RequestMultiSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청정보 객체
  var multiSign = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: kakaocertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: kakaocertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: kakaocertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "전자서명(복수) 요청 메시지 제목",
    // 커스텀 메시지 - 최대 500자
    extraMessage: kakaocertService._encrypt("전자서명(복수) 커스텀 메시지"),
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 개별문서 등록 - 최대 20 건
    // 개별 요청 정보 객체
    tokens: [
      {
        // 서명 요청 제목 - 최대 40자
        signTitle: "전자서명(복수) 서명 요청 제목 1",
        // 서명 원문 - 원문 2,800자 까지 입력가능
        token: kakaocertService._encrypt("전자서명(복수) 요청 원문 1"),
      },
      {
        // 서명 요청 제목 - 최대 40자
        signTitle: "전자서명(복수) 서명 요청 제목 2",
        // 서명 원문 - 원문 2,800자 까지 입력가능
        token: kakaocertService._encrypt("전자서명(복수) 요청 원문 2"),
      },
    ],

    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: "TEXT",

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // App to App 방식 이용시, 에러시 호출할 URL
    returnURL: "https://www.kakaocert.com",
  };

  kakaocertService.requestMultiSign(
    clientCode,
    multiSign,
    function (result) {
      res.render("kakaocert/requestMultiSign", {
        path: req.path,
        result: result,
      });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 전자서명(복수) 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-multi#GetMultiSignStatus
 */
router.get("/GetMultiSignStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000028";

  kakaocertService.getMultiSignStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/getMultiSignStatus", {
        path: req.path,
        result: result,
      });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 카카오 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 완료일시로부터 10분 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/kakao/node/sign/api-multi#VerifyMultiSign
 */
router.get("/VerifyMultiSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000028";

  kakaocertService.verifyMultiSign(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/verifyMultiSign", {
        path: req.path,
        result: result,
      });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 카카오톡 이용자에게 자동이체 출금동의를 요청합니다.
 * https://developers.barocert.com/reference/kakao/node/cms/api#RequestCMS
 */
router.get("/RequestCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 자동이체 출금동의 요청정보 객체
  var CMS = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: kakaocertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: kakaocertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: kakaocertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "출금동의 요청 메시지 제목",
    // 커스텀 메시지 - 최대 500자
    extraMessage: kakaocertService._encrypt("출금동의 커스텀 메시지"),
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 청구기관명 - 최대 100자
    requestCorp: kakaocertService._encrypt("청구 기관명란"),
    // 출금은행명 - 최대 100자
    bankName: kakaocertService._encrypt("출금은행명란"),
    // 출금계좌번호 - 최대 32자
    bankAccountNum: kakaocertService._encrypt("9-4324-5117-58"),
    // 출금계좌 예금주명 - 최대 100자
    bankAccountName: kakaocertService._encrypt("예금주명 입력란"),
    // 출금게좌 예금주 생년월일 - 최대 8자
    bankAccountBirthday: kakaocertService._encrypt("19700101"),
    // 출금유형
    // CMS - 출금동의용, FIRM - 펌뱅킹, GIRO - 지로용
    bankServiceType: kakaocertService._encrypt("CMS"),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // App to App 방식 이용시, 호출할 URL
    returnURL: "https://www.kakaocert.com",
  };

  kakaocertService.requestCMS(
    clientCode,
    CMS,
    function (result) {
      res.render("kakaocert/requestCMS", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 자동이체 출금동의 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/kakao/node/cms/api#GetCMSStatus
 */
router.get("/GetCMSStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000029";

  kakaocertService.getCMSStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("kakaocert/getCMSStatus", { path: req.path, result: result });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 카카오 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 완료일시로부터 10분 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/kakao/node/cms/api#VerifyCMS
 */
router.get("/VerifyCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230400000010000000000029";

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  kakaocertService.verifyCMS(
    clientCode,
    receiptID,
    function (response) {
      res.render("kakaocert/verifyCMS", { path: req.path, result: response });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

/*
 * 완료된 전자서명을 검증하고 전자서명 데이터 전문(signedData)을 반환 받습니다.
 * 카카오 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 완료일시로부터 10분 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/kakao/node/login/api#VerifyLogin
 */
router.get("/VerifyLogin", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023040000001";

  // 간편로그인 요청시 반환받은 트랜잭션 아이디
  var txID = "011537db12-a0cd-488c-8a61-522cf9567c11";

  kakaocertService.verifyLogin(
    clientCode,
    txID,
    function (response) {
      res.render("kakaocert/verifyLogin", { path: req.path, result: response });
    },
    function (error) {
      res.render("response", {
        path: req.path,
        code: error.code,
        message: error.message,
      });
    }
  );
});

module.exports = router;
