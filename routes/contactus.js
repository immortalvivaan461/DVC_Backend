const express = require("express");
// const { NewMsg } = require("../controllers/contactmsgController");
const {NewMsg} = require("../controller/contactmsgController")
const router = express.Router();

router.post('/', NewMsg);

module.exports = router;