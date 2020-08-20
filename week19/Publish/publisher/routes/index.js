var express = require('express');
var router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get('/a', function(req, res, next) {
  fs.writeFileSync("../server/public/"+req.query.filename,"Hello world");
  res.render('index', { title: 'Express' });
});

module.exports = router;