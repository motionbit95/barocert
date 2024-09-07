const admin = require("firebase-admin");

var serviceAccount = require("../ehan-database-firebase-adminsdk-3xkzl-2a6d6ad30b.json");

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "https://ehan-database-default-rtdb.firebaseio.com",
});

module.exports = db;
