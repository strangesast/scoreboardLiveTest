var method = "getScoreboards";

$(document).ready(function() {
	var obj = {};
	ajaxy('/', obj, function(t) {
		console.log(t);
	});
});


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
}
