var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var config = require('../config');
var mongoUrl = config.mongoUrl;
var maxWait = config.wait;

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


function count(callback, data) {
	get(function(_data) {
    var response =  [];
		for(var i=0; i<_data.length; i++) {
			response[i] = _data[i].length;
		}
		callback(response);
	}, data);
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
	// 'ids' : ['1243']
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
		var scoreboardIds = data.ids;
	  console.log(scoreboardIds)
		collection.find({_id: {$in: scoreboardIds}}).toArray(function(err, returnObject) {
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
	//   'lps' : 120
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
		console.log('retu');
		console.log(returnObject);
		callback([err, returnObject]);
	});
}


//var routing = {'count': count, 'get': get, 'remove': remove, 'add': add};
var routing = {'get' : get, 'add': add, 'remove': remove};

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
