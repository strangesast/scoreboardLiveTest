var scoreboardContainer = "scoreboards"
var source;
var template;



$(document).ready(function() {
	var obj = {};
	obj.method = "get";
	obj.what = "all";

	// get scoreboards
	source = $('#scoreboardTemplate').html();
  template = Handlebars.compile(source);

	ajaxy('/api', JSON.stringify(obj), handleScoreboards)
});


function addScoreboard(data) {
	var obj = $('#newScoreboard').serializeArray();
	var out = new Object();
	var values = [];
	for(var i=0; i<obj.length; i++) {
    out[obj[i].name] = obj[i].value;
		values.push(obj[i].value);
	}
	var keys = Object.keys(out);

	if($.inArray("", values) > -1) {
		alert("missing entry");
	} else {
		out.objects = [];
		out.createdon = new Date();

		var obj = {'method' : 'add',
		           'what' : out};

		ajaxy('/api', JSON.stringify(obj), function(returnObj) {
			$('#newScoreboard')[0].reset();
			var scoreboard = returnObj[0];
		  if('name' in scoreboard) {
		  	$('#scoreboards').append(template(scoreboard));
		  } else {
				alert('error');
			}
			$('#collapse').collapse('hide');
		});
	}
}

function ajaxy(url, obj, callback) {
  var promise = $.ajax({
		url: url,
		contentType:"application/json", // this is essential
		type: 'POST',
		data: obj
	});

	promise.done(function(data, err) {
		callback(data);
	});

	promise.fail(function(err) {
		callback(err);
	});
}

function handleScoreboards(scoreboards) {

	for(var i=0; i<scoreboards.length; i++) {
		var scoreboard = scoreboards[i];
		$('#scoreboards').append(template(scoreboard));
	}
}

function removeScoreboard(domobj) {
	var parent = $(domobj).parent().parent();
	var obj = {};
	obj.method = "remove";
	obj.what = parent[0].id;
	ajaxy('/api', JSON.stringify(obj), function(returnObj) {
		console.log(returnObj);
	  if(returnObj[0] == null && returnObj[1] == 1) {
			parent.animate({'height': '0px'}, 100, function() {parent.remove()});
		}
	});
}


function testConnection(btn) {
	var address = $('input[name="address"]')[0].value;
	if(address.substring(0, 7) != "http://") {
		address = "http://" + address;
	}

	var obj = {'method': 'test'};
	obj.what = address;
	ajaxy('/api', JSON.stringify(obj), function(_obj) {displayAddressTest(_obj, btn);});
}


function displayAddressTest(result, button) {
	if(result.status == "success") {
	  $(button).addClass('btn-success');
	} else if ('detail' in result) {
	  $(button).addClass('btn-danger');
		console.log(result.detail);
	} else {
	  $(button).addClass('btn-danger');
		console.log('error');
	}
}
