var _id = document.getElementById('main').getAttribute("name");
var source;
var template;
var details;
var maxpx = 14;
var minpx = 2;
var pixelSize;
var ctx;
var canvasElement;


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
	if(objectDetails.length < 1) {
		$('#main').html("<h1>" + _id + " does not exist.</h1><h4>Sorry</h4>");
	} else {
		$('#main').html(template(objectDetails[0]));
		details = objectDetails[0];
	  pixelSize = $('#pixelSize').val();
		beginCanvas();
		startListeners();
	}
}

function beginCanvas() {
	if(ctx=== undefined) {
		canvasElement = document.getElementById('canvas');
		ctx = canvasElement.getContext('2d');
	}
	var width = pixelSize*details.hpc;
	var height = pixelSize*details.vpc;
	canvasElement.width = width;
	canvasElement.height = height;
	ctx.fillRect(0, 0, width, height);
}

function applyPixelSize(size) {
	if(size <= maxpx && size >= minpx) {
	  pixelSize = $('#pixelSize').val();
		beginCanvas();
	}
}

function startListeners() {
  $('#pixelSize').on('input', function() {
  	var val = $(this).val();
		if(val != "") {
			applyPixelSize(val);
		};
  });
}
