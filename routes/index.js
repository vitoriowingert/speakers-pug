var express = require("express");
var router = express.Router();

var speakersData = require("../public/data/speakers.json");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Speakers test",
    speakers: speakersData.speakers,
  });
});

module.exports = router;
