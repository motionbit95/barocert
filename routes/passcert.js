/*
 * Barocert PASS API Node SDK Example
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
var passcert = require("barocert");

passcert.config({
  // 링크아이디
  // LinkID: 'TESTER',
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
 * Passcert API 서비스 클래스 생성
 */
var passcertService = passcert.PasscertService();

/*********** 이한홀딩스 ***********/
router.get(
  "/RequestIdentity/:name/:phone/:birthday",
  function (req, res, next) {
    // 이용기관코드, 파트너 사이트에서 확인
    var clientCode = "024080000007";

    // 본인인증 요청정보 객체
    var identity = {
      // 수신자 휴대폰번호 - 11자 (하이픈 제외)
      receiverHP: passcertService._encrypt(req.params.phone),
      // 수신자 성명 - 80자
      receiverName: passcertService._encrypt(req.params.name),
      // 수신자 생년월일 - 8자 (yyyyMMdd)
      receiverBirthday: passcertService._encrypt(req.params.birthday),

      // 인증요청 메시지 제목 - 최대 40자
      reqTitle: "인증 요청이 도착했습니다.",
      // 인증요청 메시지 - 최대 500자
      reqMessage: passcertService._encrypt(
        "레드스위치에서는 성인인증 이외에 개인정보를 활용하지 않습니다."
      ),
      // 고객센터 연락처 - 최대 12자
      callCenterNum: "1600-9854",
      // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
      expireIn: 1000,
      // 서명 원문 - 최대 2,800자 까지 입력가능
      token: passcertService._encrypt("본인인증 요청 원문"),

      // 사용자 동의 필요 여부
      userAgreementYN: true,
      // 사용자 정보 포함 여부
      receiverInfoYN: true,

      // AppToApp 인증요청 여부
      // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
      appUseYN: false,
      // ApptoApp 인증방식에서 사용
      // 통신사 유형('SKT', 'KT', 'LGU'), 대문자 입력(대소문자 구분)
      // telcoType: 'SKT'
      // ApptoApp 인증방식에서 사용
      // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
      // deviceOSType: 'IOS'
    };

    passcertService.requestIdentity(
      clientCode,
      identity,
      function (result) {
        // res.render("passcert/requestIdentity", {
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
  var clientCode = "024080000007";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = req.params.receiptID;

  passcertService.getIdentityStatus(
    clientCode,
    receiptID,
    function (result) {
      // res.render("passcert/getIdentityStatus", {
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

router.get(
  "/VerifyIdentity/:receiptID/:name/:phone",
  function (req, res, next) {
    // 이용기관코드, 파트너 사이트에서 확인
    var clientCode = "024080000007";

    // 본인인증 요청시 반환받은 접수아이디
    var receiptID = req.params.receiptID;

    var IdentityVerify = {
      // 수신자 휴대폰번호 - 11자 (하이픈 제외)
      receiverHP: passcertService._encrypt(req.params.phone),
      // 수신자 성명 - 80자
      receiverName: passcertService._encrypt(req.params.name),
    };

    passcertService.verifyIdentity(
      clientCode,
      receiptID,
      IdentityVerify,
      function (result) {
        // res.render("passcert/verifyIdentity", {
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

/*
 * 패스 이용자에게 본인인증을 요청합니다.
 * https://developers.barocert.com/reference/pass/node/identity/api#RequestIdentity
 */
router.get("/RequestIdentity", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 본인인증 요청정보 객체
  var identity = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: passcertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "본인인증 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: passcertService._encrypt("본인인증 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 최대 2,800자 까지 입력가능
    token: passcertService._encrypt("본인인증 요청 원문"),

    // 사용자 동의 필요 여부
    userAgreementYN: true,
    // 사용자 정보 포함 여부
    receiverInfoYN: true,

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // ApptoApp 인증방식에서 사용
    // 통신사 유형('SKT', 'KT', 'LGU'), 대문자 입력(대소문자 구분)
    // telcoType: 'SKT'
    // ApptoApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'IOS'
  };

  passcertService.requestIdentity(
    clientCode,
    identity,
    function (result) {
      res.render("passcert/requestIdentity", {
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
 * 상태확인 함수는 본인인증 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 본인인증 요청 함수를 호출한 당일 23시 59분 59초 이후 상태확인 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/identity/api#GetIdentityStatus
 */
router.get("/GetIdentityStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000012";

  passcertService.getIdentityStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("passcert/getIdentityStatus", {
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
 * 검증 함수는 본인인증 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 본인인증 요청 함수를 호출한 당일 23시 59분 59초 이후 검증 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/identity/api#VerifyIdentity
 */
router.get("/VerifyIdentity", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 본인인증 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000012";

  var IdentityVerify = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
  };

  passcertService.verifyIdentity(
    clientCode,
    receiptID,
    IdentityVerify,
    function (result) {
      res.render("passcert/verifyIdentity", { path: req.path, result: result });
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
 * 패스 이용자에게 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/pass/node/sign/api#RequestSign
 */
router.get("/RequestSign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 전자서명 요청정보 객체
  var sign = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: passcertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "전자서명 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: passcertService._encrypt("전자서명 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 원문 2,800자 까지 입력가능
    token: passcertService._encrypt("전자서명 요청 원문"),
    // 서명 원문 유형
    // 'TEXT' - 일반 텍스트, 'HASH' - HASH 데이터, 'URL' - URL 데이터
    // 원본데이터(originalTypeCode, originalURL, originalFormatCode) 입력시 'TEXT'사용 불가
    tokenType: "URL",

    // 사용자 동의 필요 여부
    userAgreementYN: true,
    // 사용자 정보 포함 여부
    receiverInfoYN: true,

    // 원본유형코드
    // 'AG' - 동의서, 'AP' - 신청서, 'CT' - 계약서, 'GD' - 안내서, 'NT' - 통지서, 'TR' - 약관
    originalTypeCode: "TR",
    // 원본조회URL
    originalURL: "https://www.passcert.co.kr",
    // 원본형태코드
    // ('TEXT', 'HTML', 'DOWNLOAD_IMAGE', 'DOWNLOAD_DOCUMENT')
    originalFormatCode: "HTML",

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // ApptoApp 인증방식에서 사용
    // 통신사 유형('SKT', 'KT', 'LGU'), 대문자 입력(대소문자 구분)
    // telcoType: 'SKT'
    // ApptoApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'IOS'
  };

  passcertService.requestSign(
    clientCode,
    sign,
    function (result) {
      res.render("passcert/requestSign", { path: req.path, result: result });
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
 * 전자서명 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * 상태확인 함수는 전자서명 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 전자서명 요청 함수를 호출한 당일 23시 59분 59초 이후 상태확인 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/sign/api#GetSignStatus
 */
router.get("/GetSignStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000013";

  passcertService.getSignStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("passcert/getSignStatus", { path: req.path, result: result });
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
 * 검증 함수는 전자서명 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 전자서명 요청 함수를 호출한 당일 23시 59분 59초 이후 검증 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/sign/api#VerifySign
 */
router.get("/VerifySign", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 전자서명 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000013";

  var SignVerify = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
  };

  passcertService.verifySign(
    clientCode,
    receiptID,
    SignVerify,
    function (result) {
      res.render("passcert/verifySign", { path: req.path, result: result });
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
 * 패스 이용자에게 자동이체 출금동의를 요청합니다.
 * https://developers.barocert.com/reference/pass/node/cms/api#RequestCMS
 */
router.get("/RequestCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청정보 객체
  var CMS = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: passcertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "출금동의 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: passcertService._encrypt("출금동의 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 사용자 동의 필요 여부
    userAgreementYN: true,
    // 사용자 정보 포함 여부
    receiverInfoYN: true,

    // 출금은행명 - 최대 100자
    bankName: passcertService._encrypt("국민은행"),
    // 출금계좌번호 - 최대 31자
    bankAccountNum: passcertService._encrypt("9-****-5117-58"),
    // 출금계좌 예금주명 - 최대 100자
    bankAccountName: passcertService._encrypt("홍길동"),
    // 출금유형
    // CMS - 출금동의, OPEN_BANK - 오픈뱅킹
    bankServiceType: passcertService._encrypt("CMS"),
    // 출금액
    bankWithdraw: passcertService._encrypt("1,000,000원"),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // ApptoApp 인증방식에서 사용
    // 통신사 유형('SKT', 'KT', 'LGU'), 대문자 입력(대소문자 구분)
    // telcoType: 'SKT'
    // ApptoApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'IOS'
  };

  passcertService.requestCMS(
    clientCode,
    CMS,
    function (result) {
      res.render("passcert/requestCMS", { path: req.path, result: result });
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
 * 상태확인 함수는 자동이체 출금동의 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 자동이체 출금동의 요청 함수를 호출한 당일 23시 59분 59초 이후 상태확인 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/cms/api#GetCMSStatus
 */
router.get("/GetCMSStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000014";

  passcertService.getCMSStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("passcert/getCMSStatus", { path: req.path, result: result });
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
 * 검증 함수는 자동이체 출금동의 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 자동이체 출금동의 요청 함수를 호출한 당일 23시 59분 59초 이후 검증 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/cms/api#VerifyCMS
 */
router.get("/VerifyCMS", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000014";

  var CMSVerify = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
  };

  passcertService.verifyCMS(
    clientCode,
    receiptID,
    CMSVerify,
    function (response) {
      res.render("passcert/verifyCMS", { path: req.path, result: response });
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
 * 패스 이용자에게 간편로그인을 요청합니다.
 * https://developers.barocert.com/reference/pass/node/login/api#RequestLogin
 */
router.get("/RequestLogin", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청정보 객체
  var Login = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: passcertService._encrypt("19700101"),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: "간편로그인 요청 메시지 제목",
    // 인증요청 메시지 - 최대 500자
    reqMessage: passcertService._encrypt("간편로그인 요청 메시지"),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: "1600-9854",
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 최대 2,800자 까지 입력가능
    token: passcertService._encrypt("간편로그인 요청 원문"),

    // 사용자 동의 필요 여부
    userAgreementYN: true,
    // 사용자 정보 포함 여부
    receiverInfoYN: true,

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - 푸시(Push) 인증방식
    appUseYN: false,
    // ApptoApp 인증방식에서 사용
    // 통신사 유형('SKT', 'KT', 'LGU'), 대문자 입력(대소문자 구분)
    // telcoType: 'SKT'
    // ApptoApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'IOS'
  };

  passcertService.requestLogin(
    clientCode,
    Login,
    function (result) {
      res.render("passcert/requestLogin", { path: req.path, result: result });
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
 * 간편로그인 요청 후 반환받은 접수아이디로 진행 상태를 확인합니다.
 * 상태확인 함수는 간편로그인 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 간편로그인 요청 함수를 호출한 당일 23시 59분 59초 이후 상태확인 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/login/api#GetLoginStatus
 */
router.get("/GetLoginStatus", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000015";

  passcertService.getLoginStatus(
    clientCode,
    receiptID,
    function (result) {
      res.render("passcert/getLoginStatus", { path: req.path, result: result });
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
 * 검증 함수는 간편로그인 요청 함수를 호출한 당일 23시 59분 59초까지만 호출 가능합니다.
 * 간편로그인 요청 함수를 호출한 당일 23시 59분 59초 이후 검증 함수를 호출할 경우 오류가 반환됩니다.
 * https://developers.barocert.com/reference/pass/node/login/api#VerifyLogin
 */
router.get("/VerifyLogin", function (req, res, next) {
  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = "023070000014";

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptID = "02308170230700000140000000000015";

  var LoginVerify = {
    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: passcertService._encrypt("01012341234"),
    // 수신자 성명 - 80자
    receiverName: passcertService._encrypt("홍길동"),
  };

  passcertService.verifyLogin(
    clientCode,
    receiptID,
    LoginVerify,
    function (response) {
      res.render("passcert/verifyLogin", { path: req.path, result: response });
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
