const { Storage } = require("@google-cloud/storage");
const getUserFromToken = require("../utils/userFromToken");
require("dotenv").config();

const getUserImageURL = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req.headers["authorization"]);
    const userEmail = userInfo.email;
    const storage = new Storage();
    const files = await storage
      .bucket(process.env.FIREBASE_STORAGE_BUCKET)
      .getFiles();
    console.log(files);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Couldn't generate image url" });
  }
};

module.exports = getUserImageURL;
