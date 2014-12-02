var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var config = require('../config');
var mongoUrl = config.mongoUrl;
var maxWait = config.wait;
var request = require('request');

var Db;

function connect(firstCallback, secondCallback, secondParameters) {
	if (Db === undefined) {
		mongodb.MongoClient.connect(mongoUrl, function(err, db) {
			var string = 'mongo connection to ' + mongoUrl;
			if(err) {console.log(string + ' unsuccessful');}
			Db = db;
			console.log(string + ' successfull');
		  firstCallback(secondCallback, secondParameters);
		});
	} else {
		firstCallback(secondCallback, secondParameters);
	}
}


function get(callback, data) {
	// GET
	// data = {
	// 'method' : 'get',
	// 'what' : 'all'
	// }
	//
	// data = {
	// 'method' : 'get',
	// 'what' : 'byid',
	// 'id' : '1243'
	// }

	var collection = Db.collection(config.scoreboardCollectionName);
	var what = data.what;
	
	// return scoreboard ids
	if(what == "all") {
		collection.find({}).toArray(function(err, returnObject) {
      callback(returnObject);
		});

  // return ids corresponding to list of ids
	} else if(what == "byid") {
		var scoreboardId = data.id;
		collection.find({'_id': mongodb.ObjectID(scoreboardId)}).toArray(function(err, returnObject) {
			
			// convert to date object
			if('createdon' in returnObject[0]) {
				returnObject[0].createdon = Date(returnObject[0].createdon);
			}

			callback(returnObject);
		});

  // invalid
	} else {
		callback('invalid');
	}

}



function add(callback, data) {
	console.log('add');
	
	// ADD
	// data = {
	// 'method' : 'add',
	// 'what' : {
	//   'name' : 'test',
	//   'address' : 'http://127.0.0.1:3000',
	//   'hpc': 120,
	//   'vpc' : 60,
	//   'lps' : 120,
	//   'createdon' : 
	//   }
	// }

  var collection = Db.collection(config.scoreboardCollectionName);
	var what = data.what;

	collection.insert(what, function(err, returnObject) {
		console.log('log');
		console.log(returnObject);
		callback(returnObject);
	});

}


function remove(callback, data) {
	console.log(data);
	// remove by id
	var what = data.what;
	var response = [];

	var id = what;

  var collection = Db.collection(config.scoreboardCollectionName);
	collection.remove({_id: new mongodb.ObjectID(id)}, function(err, returnObject) {
		callback([err, returnObject]);
	});
}


var items = ['000000', '0000FF', 'FFFFFF'];
var i = 1;
function test(callback, data) {
	if(i<2) {i+=1} else {i=0}
	var address = data.what;
	request.post({
		url: address,
	  form: { 'method': 'test', 'what':items[i]}},
		function(err, response, body) {
		  if(err) {
		 	 callback({'status' : 'error', 'detail' : err});
		  } else {
		 	 callback({'status' : 'success', 'detail' : response.body});
		  }
		}
	);
}

var intervalObject;

function update(callback, data) {
	// also needs to update database, scoreboard "objects"
	clearTimeout(intervalObject);
	intervalObject = setTimeout(function() {sendShape(data);}, 10);
	callback(data);
}

function sendShape(data) {
  var obj = {'method': data.method, 'what': data.shape};
	request.post({
		url: data.address,
		body: obj,
		json: true
	}, function(err, response, body) {
		console.log(err);
	});
}

//var routing = {'count': count, 'get': get, 'remove': remove, 'add': add};

var routing = {'get' : get, 'add': add, 'remove': remove, 'test': test, 'update': update};

// update needs to be changed to actually add it to the database, with some delay prior

router.post('/', handle);
router.get('/', handle);

function handle(req, res) {
	var data = req.body;
	var method = routing[data.method];

	if(method === undefined) {
		res.send('invalid');
	} else {
		connect(method, function(obj) {res.send(obj);}, data);
	}
}

module.exports = router;
