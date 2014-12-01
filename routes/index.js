var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
  res.render('each', {'_id': id});
});


module.exports = router;
