var _id = document.getElementById('main').getAttribute("name");
var source;
var template;


$(document).ready(function() {
	var obj = {'method': 'get'}
	obj.what = "byid";
	obj.id = _id;
	source = $('#detailsTemplate').html();
  template = Handlebars.compile(source);

	ajaxy('/api', JSON.stringify(obj), buildPage);
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

function buildPage(objectDetails) {
	console.log(objectDetails);
	if(objectDetails.length < 1) {
		$('#main').html("<h1>" + _id + " does not exist.</h1><h4>Sorry</h4>");
	} else {
		$('#main').html(template(objectDetails[0]));
		beginCanvas();
	}
}


function beginCanvas() {

}
