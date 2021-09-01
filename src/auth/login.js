const bcrypt = require("bcrypt");
const client = require("../db/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await client.query("SELECT * From users where email=$1", [
      email,
    ]);
    if (bcrypt.compareSync(password, result.rows[0].password)) {
      const token = jwt.sign(
        { email: email, user_id: result.rows[0].user_id },
        process.env.JWT_SECRETKEY,
        {
          expiresIn: "1hr",
        }
      );
      const refreshToken = jwt.sign(
        { email: email, user_id: result.rows[0].user_id },
        process.env.JWT_REFRESHTOKEN
      );
      return res.status(200).json({ token: token, refreshToken: refreshToken });
    } else {
      return res.status(200).send({ message: "Incorrect user" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Error occured ${err}` });
  }
};

module.exports = login;
