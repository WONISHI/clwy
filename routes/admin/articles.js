const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.json({ message: "这儿是后台的文章列表接口约～" });
});

module.exports = router;