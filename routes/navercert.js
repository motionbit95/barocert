/*
 * Barocert NAVER API Node SDK Example
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
var navercert = require("barocert");

navercert.config({
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
 * Navercert API 서비스 클래스 생성
 */
var navercertService = navercert.NavercertService();

/*********** 이한홀딩스 ***********/
router.get(
  "/RequestIdentity/:name/:phone/:birthday",
  function (req, res, next) {
    // 이용기관코드, 파트너 사이트에서 확인
    var clientCode = "024080000006";

    // 본인인증 요청정보 객체
    var identity = {
      // 수신자 휴대폰번호 - 11자 (하이픈 제외)
      receiverHP: navercertService._encrypt(req.params.phone),
      // 수신자 성명 - 80자
      receiverName: navercertService._encrypt(req.params.name),
      // 수신자 생년월일 - 8자 (yyyyMMdd)
      receiverBirthday: navercertService._encrypt(req.params.birthday),

      // 고객센터 연락처 - 최대 12자
      callCenterNum: "1600-9854",

      // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
      expireIn: 1000,

      // AppToApp 인증요청 여부
      // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
      appUseYN: false,
      // AppToApp 인증방식에서 사용
      // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
      // deviceOSType: 'ANDROID',
      // AppToApp 방식 이용시, 호출할 URL
      // "http", "https"등의 웹프로토콜 사용 불가
      // returnURL: 'navercert://Identity'
    };

    navercertService.requestIdentity(
      clientCode,
      identity,
      function (result) {
        // res.render("navercert/requestIdentity", {
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
  }
);

router.get("/GetIdentityStatus/:receiptID", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "024080000006";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = req.params.receiptID;

  navercertService.getIdentityStatus(
    clientCode,
    receiptID,
    function (result) {
      // res.render("navercert/getIdentityStatus", {
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
  var clientCode = "024080000006";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = req.params.receiptID;

  navercertService.verifyIdentity(
    clientCode,
    receiptID,
    function (result) {
      // res.render("navercert/verifyIdentity", {
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
 * 네이버 이용자에게 본인인증을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#RequestIdentity
 */
router.get("/RequestIdentity", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 본인인증 요청정보 객체
  var identity = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt("19700101"),

    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",

    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',
    // AppToApp 방식 이용시, 호출할 URL
    // "http", "https"등의 웹프로토콜 사용 불가
    // returnURL: 'navercert://Identity'
  };

  navercertService.requestIdentity(
    clientCode,
    identity,
    function (result) {
      res.render("navercert/requestIdentity", {
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
 * 본인인증 요청 후 반환받은 접수아이디로 본인인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#GetIdentityStatus
 */
router.get("/GetIdentityStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000010";

  navercertService.getIdentityStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/getIdentityStatus", {
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
 * 반환받은 전자서명값(signedData)과 [1. RequestIdentity] 함수 호출에 입력한 Token의 동일 여부를 확인하여 이용자의 본인인증 검증을 완료합니다.
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#VerifyIdentity
 */
router.get("/VerifyIdentity", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000010";

  navercertService.verifyIdentity(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/verifyIdentity", {
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
 * 네이버 이용자에게 단건(1건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-single#RequestSign
 */
router.get("/RequestSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청정보 객체
  var sign = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "전자서명(단건) 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: navercertService._encrypt("전자서명(단건) 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: "TEXT",
    // 서명 원문 - 원문 2,800자 까지 입력가능
    token: navercertService._encrypt("전자서명(단건) 요청 원문"),
    // 서명 원문 유형
    // tokenType: 'HASH',
    // 서명 원문 유형이 HASH인 경우, 원문은 SHA-256, Base64 URL Safe No Padding을 사용
    // token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문')),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',
    // AppToApp 방식 이용시, 호출할 URL
    // "http", "https"등의 웹프로토콜 사용 불가
    // returnURL: 'navercert://Sign'
  };

  navercertService.requestSign(
    clientCode,
    sign,
    function (result) {
      res.render("navercert/requestSign", { path: req.path, result: result });
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
 * https://developers.barocert.com/reference/naver/node/sign/api-single#GetSignStatus
 */
router.get("/GetSignStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000012";

  navercertService.getSignStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/getSignStatus", { path: req.path, result: result });
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
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-single#VerifySign
 */
router.get("/VerifySign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000012";

  navercertService.verifySign(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/verifySign", { path: req.path, result: result });
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
 * 네이버 이용자에게 복수(최대 50건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#RequestMultiSign
 */
router.get("/RequestMultiSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청정보 객체
  var multiSign = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "전자서명(복수) 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: navercertService._encrypt("전자서명(복수) 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 개별문서 등록 - 최대 50 건
    // 개별 요청 정보 객체
    tokens: [
      {
        // 서명 원문 유형
        // 'TEXT' - 일반 텍스트, 'HASH' - HASH 데이터
        tokenType: "TEXT",
        // 서명 원문 - 원문 2,800자 까지 입력가능
        token: navercertService._encrypt("전자서명(복수) 요청 원문 1"),
        // 서명 원문 유형
        // tokenType: 'HASH',
        // 서명 원문 유형이 HASH인 경우, 원문은 SHA-256, Base64 URL Safe No Padding을 사용
        // token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문 1')),
      },
      {
        // 서명 원문 유형
        // 'TEXT' - 일반 텍스트, 'HASH' - HASH 데이터
        tokenType: "TEXT",
        // 서명 원문 - 원문 2,800자 까지 입력가능
        token: navercertService._encrypt("전자서명(복수) 요청 원문 2"),
        // 서명 원문 유형
        // tokenType: 'HASH',
        // 서명 원문 유형이 HASH인 경우, 원문은 SHA-256, Base64 URL Safe No Padding을 사용
        // token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문 2')),
      },
    ],

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',
    // AppToApp 방식 이용시, 호출할 URL
    // "http", "https"등의 웹프로토콜 사용 불가
    // returnURL: 'navercert://Sign'
  };

  navercertService.requestMultiSign(
    clientCode,
    multiSign,
    function (result) {
      res.render("navercert/requestMultiSign", {
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
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#GetMultiSignStatus
 */
router.get("/GetMultiSignStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000015";

  navercertService.getMultiSignStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/getMultiSignStatus", {
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
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#VerifyMultiSign
 */
router.get("/VerifyMultiSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000015";

  navercertService.verifyMultiSign(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/verifyMultiSign", {
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
 * 네이버 이용자에게 자동이체 출금동의를 요청합니다.
 * https://developers.barocert.com/reference/naver/node/cms/api#RequestCMS
 */
router.get("/RequestCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 출금동의 요청정보 객체
  var cms = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt("19700101"),

    // 인증요청 메시지 제목
    reqTitle: "출금동의 요청 메시지 제목",
    // 인증요청 메시지
    reqMessage: navercertService._encrypt("출금동의 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 청구기관명
    requestCorp: navercertService._encrypt("청구기관"),
    // 출금은행명
    bankName: navercertService._encrypt("출금은행"),
    // 출금계좌번호
    bankAccountNum: navercertService._encrypt("123-456-7890"),
    // 출금계좌 예금주명
    bankAccountName: navercertService._encrypt("홍길동"),
    // 출금계좌 예금주 생년월일
    bankAccountBirthday: navercertService._encrypt("19700101"),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',
    // AppToApp 방식 이용시, 호출할 URL
    // "http", "https"등의 웹프로토콜 사용 불가
    // returnURL: 'navercert://cms'
  };

  navercertService.requestCMS(
    clientCode,
    cms,
    function (result) {
      res.render("navercert/requestCMS", { path: req.path, result: result });
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
 * https://developers.barocert.com/reference/naver/node/cms/api#GetCMSStatus
 */
router.get("/GetCMSStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000010";

  navercertService.getCMSStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/getCMSStatus", { path: req.path, result: result });
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
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * 전자서명 만료일시 이후에 검증 API를 호출하면 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/cms/api#VerifyCMS
 */
router.get("/VerifyCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023090000021";

  // 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02309070230900000210000000000010";

  navercertService.verifyCMS(
    clientCode,
    receiptID,
    function (result) {
      res.render("navercert/verifyCMS", { path: req.path, result: result });
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
