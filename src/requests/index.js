const express = require("express");
const { sendRequest, updateRequest } = require("./request");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/sendrequest", isAuthenticated, (req, res) =>
  sendRequest(req, res)
);

router.post("/updaterequest", isAuthenticated, (req, res) =>
  updateRequest(req, res)
);

module.exports = router;
