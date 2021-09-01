const express = require("express");
const user = require("./src/auth");
const request = require("./src/requests");
const profile = require("./src/user");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", user);
app.use("/api", request);
app.use("/api", profile);

app.listen(3100, () => console.log("App listening on 3100"));
