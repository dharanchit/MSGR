const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const userImageUpload = require("./imageUpload");
const multer = require("multer");
const getUserImageURL = require("./getUserImage");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/imageupload",
  upload.single("avatar"),
  isAuthenticated,
  (req, res) => userImageUpload(req, res)
);

router.get("/userImage", isAuthenticated, (req, res) =>
  getUserImageURL(req, res)
);

module.exports = router;
