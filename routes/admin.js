const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const path = require("path");
const firebase = require("./db");
const { default: axios } = require("axios");
const db = firebase.firestore();

var router = express.Router();

router.get("/", (req, res) => {
  console.log("admin");
  res.send("admin");
});

const getShopInfo = async (shopId) => {
  const docRef = await db.collection("SHOP").doc(shopId);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.log("No such document!");
    return null;
  } else {
    // console.log("Document data:", doc.data());
    return doc.data();
  }
};

// shop id로 shop 정보 가지고 오기
router.get("/shop", (req, res) => {
  const { shopId } = req.query;
  getShopInfo(shopId)
    .then((shop) => {
      res.send(shop);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 관리자 가지고 오기
router.get("/account", async (req, res) => {
  try {
    // Query parameters from request
    const { page = 1, limit = 10, permission } = req.query;
    // const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Firestore query based on condition and pagination
    let query = db.collection("ACCOUNT").orderBy("createAt", "desc"); // assuming documents have a 'createdAt' field

    // Firestore는 기본적으로 오프셋 기반 페이지네이션을 지원하지 않으므로 startAt() 또는 startAfter()를 사용할 수 있습니다.
    const snapshot = await query.get();

    // Check if documents exist
    if (snapshot.empty) {
      return res.status(404).json({ message: "No documents found" });
    }

    // Prepare documents to return
    const documents = [];

    const promises = snapshot.docs.map(async (doc, index) => {
      const docData = doc.data();

      // Permission 필터링
      if (
        docData.permission === permission ||
        permission === "ALL" ||
        permission === undefined
      ) {
        console.log(index, docData.createAt);
        // shop_id가 있을 경우 비동기 작업 수행
        if (docData.shop_id) {
          try {
            const shop = await getShopInfo(docData.shop_id);
            documents[index] = { id: doc.id, ...docData, shop };
            console.log(index, docData.createAt);
          } catch (error) {
            console.log("Error fetching shop info:", error);
          }
        } else {
          // 지점이 없는 경우
          documents[index] = { id: doc.id, ...docData };
        }
      }

      console.log(documents);
    });

    // 모든 비동기 작업이 완료될 때까지 기다림
    await Promise.all(promises);

    // 페이지네이션 처리
    // const startIndex = (pageNumber - 1) * pageSize;
    // const paginatedDocuments = documents.slice(startIndex, startIndex + pageSize);

    // Return paginated data
    res.status(200).json({
      totalDocuments: documents.length,
      // currentPage: pageNumber,
      totalPages: Math.ceil(documents.length / pageSize),
      documents: documents,
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// 상점 검색
router.get("/search/shop", async (req, res) => {
  // Query parameters from request
  const { depth1 = "전체", depth2 = "전체", keyword = "" } = req.query;

  try {
    // Firestore query based on condition and pagination
    let query = db.collection("SHOP").orderBy("createAt", "desc"); // assuming documents have a 'createdAt' field

    // Firestore는 기본적으로 오프셋 기반 페이지네이션을 지원하지 않으므로 startAt() 또는 startAfter()를 사용할 수 있습니다.
    const snapshot = await query.get();

    // Check if documents exist
    if (snapshot.empty) {
      return res.status(404).json({ message: "No documents found" });
    }

    // Prepare documents to return
    const documents = [];

    const promises = snapshot.docs.map(async (doc, index) => {
      const docData = doc.data();

      // local & keyword 필터링
      if (
        (docData.shop_depth1 === depth1 || depth1 === "전체") &&
        (docData.shop_depth2 === depth2 || depth2 === "전체") &&
        docData.shop_name.includes(keyword)
      ) {
        documents.push({ id: doc.id, ...docData });
      } else {
        // 조건이 일치하지 않음
      }
    });

    // 모든 비동기 작업이 완료될 때까지 기다림
    await Promise.all(promises);

    res.status(200).json({
      totalDocuments: documents.length,
      documents: documents,
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.get("/search/account", async (req, res) => {
  try {
    // Query parameters from request
    const { depth1, depth2, permission = "ALL" } = req.query;

    console.log(depth1, depth2, permission);

    // Firestore query based on condition and pagination
    let query = db.collection("ACCOUNT").orderBy("createAt", "desc"); // assuming documents have a 'createdAt' field

    // Firestore는 기본적으로 오프셋 기반 페이지네이션을 지원하지 않으므로 startAt() 또는 startAfter()를 사용할 수 있습니다.
    const snapshot = await query.get();

    // Check if documents exist
    if (snapshot.empty) {
      return res.status(404).json({ message: "No documents found" });
    }

    // Prepare documents to return
    const documents = [];

    const promises = snapshot.docs.map(async (doc, index) => {
      const docData = doc.data();

      // Permission 필터링
      if (docData.permission === permission || permission === "ALL") {
        // shop_id가 있을 경우 비동기 작업 수행
        if (docData.shop_id) {
          try {
            const shop = await getShopInfo(docData.shop_id);
            if (shop) {
              if (
                (shop.shop_depth1 === depth1 || depth1 === "전체") &&
                (shop.shop_depth2 === depth2 || depth2 === "전체")
              ) {
                documents[index] = { id: doc.id, ...docData, shop };
              }
            }
          } catch (error) {
            console.log("Error fetching shop info:", error);
          }
        } else {
          // 지점이 없는 경우 지역을 비교할 수 없으므로, 유저가 설정한 조건에 따라 반환
          if (depth1 === "전체" && depth2 === "전체") {
            documents[index] = { id: doc.id, ...docData };
          }
        }
      }
    });

    // 모든 비동기 작업이 완료될 때까지 기다림
    await Promise.all(promises);

    // Return paginated data
    res.status(200).json({
      totalDocuments: documents.length,
      documents: documents.filter((doc) => doc !== undefined && doc !== null),
    });
  } catch (error) {
    console.error("Error fetching documents: ", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

module.exports = router;
