const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUserFromToken = (token) => {
  const data = jwt.verify(token.split(" ")[1], process.env.JWT_SECRETKEY);
  return data;
};

module.exports = getUserFromToken;
