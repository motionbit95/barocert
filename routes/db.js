const admin = require("firebase-admin");
var express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "ehan-database",
    private_key_id: "ac89c5968767b89ada73b44557906bb4492da5a8",
    private_key: process.env.PRIVATE_KEY,
    client_email:
      "firebase-adminsdk-3xkzl@ehan-database.iam.gserviceaccount.com",
    client_id: "113111989841147388494",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3xkzl%40ehan-database.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  }),
  storageBucket: "https://ehan-database-default-rtdb.firebaseio.com",
});

module.exports = db;
