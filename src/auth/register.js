const bcrypt = require("bcrypt");
const client = require("../db/db");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
require("dotenv").config();

const checkUniqueEmail = async (userEmail) => {
  const userData = await client.query(
    "select exists(select 1 from users where email=$1)",
    [userEmail]
  );
  return userData.rows[0].exists;
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name.length === 0)
      return res.status(400).send({ message: "Name is incorrect" });
    if (email.length === 0)
      return res.status(400).send({ message: "Email is incorrect" });
    if (password.length === 0)
      return res.status(400).send({ message: "Password too small" });
    const emailExists = await checkUniqueEmail(email);
    if (emailExists) {
      return res.status(501).send({ message: "User Email already exists" });
    }
    if (true) {
      const saltRounds = Number(process.env.SALT_ROUNDS);
      bcrypt.hash(password, saltRounds, async (err, hashedCode) => {
        if (err) throw err;
        const currentTime = new Date().getTime().toString();
        const uuid = v4();
        const query = {
          text: "INSERT INTO users(user_id,name,email,created_at,updated_at,password) VALUES($1,$2,$3,$4,$5,$6)",
          values: [uuid, name, email, currentTime, currentTime, hashedCode],
        };
        await client.query(query);
        const token = jwt.sign(
          { email: email, user_id: uuid },
          process.env.JWT_SECRETKEY,
          {
            expiresIn: "1hr",
          }
        );
        const refreshToken = jwt.sign(
          { email: email, user_id: uuid },
          process.env.JWT_REFRESHTOKEN
        );
        return res
          .status(200)
          .json({ token: token, refreshToken: refreshToken });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: `Error occured ${err}` });
  }
};

module.exports = registerUser;
