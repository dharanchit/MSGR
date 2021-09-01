const RequestStatus = require("../common/enum");
const client = require("../db/db");
const getUserFromToken = require("../utils/userFromToken");

const retrieveSendeeInfo = async (id) => {
  return await client.query("SELECT * FROM users where user_id=$1", [id]);
};

const checkIfRequest = async (requestId) => {
  return await client.query(
    "SELECT EXISTS(SELECT 1 FROM requests WHERE id=$1)",
    [requestId]
  );
};

const sendRequest = async (req, res) => {
  try {
    const { senteeUId } = req.body;
    const sendeeInfo = await retrieveSendeeInfo(senteeUId);
    const userInfo = getUserFromToken(req.headers["authorization"]);
    const textId = sendeeInfo.rows[0].email + userInfo.email;
    let exists = await checkIfRequest(textId);
    if (!exists.rows[0].exists) {
      const result = await client.query(
        "INSERT INTO requests(sender_id,reciever_id,created_at,updated_at,status,id) VALUES($1,$2,$3,$4,$5,$6)",
        [
          userInfo.user_id,
          sendeeInfo.rows[0].user_id,
          new Date().getTime().toString(),
          new Date().getTime().toString(),
          RequestStatus.PENDING,
          textId,
        ]
      );
      return res.status(200).json({ requestId: result.rows[0].id });
    } else {
      return res.status(400).send({ message: "Request ID EXISTS" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something bad happended" });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    await client.query("UPDATE requests SET status=$1 WHERE id=$2", [
      status,
      requestId,
    ]);
    return res.status(200).send({ message: "Request updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = { sendRequest, updateRequest };
