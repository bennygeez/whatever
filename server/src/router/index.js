const auth = require("./auth");
const profile = require("./profile");
const chat = require("./chat");
const attachment = require("./attachment");
const review = require("./review");
const blockuser = require("./blockuser");
const express = require("express");
let router = express.Router();
router.use("/auth", auth);
router.use("/me", profile);
router.use("/chat", chat);
router.use("/review", review);
router.use("/attachment", attachment);
router.use("/block", blockuser);

module.exports = router;
