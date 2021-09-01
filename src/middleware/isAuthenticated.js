const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).send({ message: "User not authenticated" });

  jwt.verify(token, process.env.JWT_SECRETKEY, (err, res) => {
    if (err) return res.status(403).send({ message: "Token is invalid" });
    req.email = res.email;
    req.user_id = res.user_id;
    next();
  });
};

module.exports = isAuthenticated;
