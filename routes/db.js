const admin = require("firebase-admin");

var serviceAccount = require("../ehanServiceAccountKey.json");

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "https://ehan-database-default-rtdb.firebaseio.com",
});

module.exports = db;
