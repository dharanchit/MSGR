const express = require("express");
const client = require("../db/db");
const login = require("./login");
const registerUser = require("./register");

const router = express.Router();

router.post("/register", (req, res) => {
  registerUser(req, res);
});

router.post("/login", (req, res) => login(req, res));

module.exports = router;
