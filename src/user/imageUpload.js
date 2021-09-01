const getUserFromToken = require("../utils/userFromToken");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

const userImageUpload = async (req, res) => {
  try {
    const userInfo = getUserFromToken(req.headers["authorization"]);

    const storage = new Storage();

    await storage
      .bucket(process.env.FIREBASE_STORAGE_BUCKET)
      .upload(`${req.file.path}`, {
        destination: `${userInfo.email}/${req.file.filename}`,
      });

    return res.status(200).send({ message: "Uploaded to Bucket" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = userImageUpload;
