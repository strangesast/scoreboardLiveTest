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
	//ctx.fillRect(0, 0, width, height);
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

	init("canvas", pixelSize)
}


var initialOrder = 0;
var colorArray = ['#002F7F', '#4C8EFF', '#005Eff', '#002F7F', '#004VCC'];

function Shape(x,y,w,h,fill,kind,text) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || "#AAAAAA";
	this.kind = kind || "seconds";
	this.text = text || null;
	this.order = initialOrder;
	initialOrder++;
};

Shape.prototype.draw = function(ctx) {
	color = this.fill;
	var width = this.w;
	var height = this.h;

	function drawPixel(x,y,color) {
		ctx.fillStyle=color;
		ctx.fillRect(x,y,pixelSize,pixelSize);
		ctx.save();
	};

	function drawChar(x,y,_char,_charWidth,_charHeight) {
		_charWidth = typeof _charWidth !== 'undefined' ? _charWidth : 5;
		_charHeight = typeof _charHeight !== 'undefined' ? _charHeight : 7;

		for (var i=0; i<_charWidth*_charHeight; i++) {
			var _x = i % _charWidth;
			var _y = Math.floor(i / _charWidth);
			var _val = _char.charAt(i);
			if (_val == '1') {
				drawPixel(x+_x*pixelSize,y+_y*pixelSize, color);
			} else {
				drawPixel(x+_x*pixelSize,y+_y*pixelSize, "white");
			};
		};
	};
	
	function buildtext(x,y,text) {
		if (text == null) {
			ctx.clearRect(x,y,width,height);
			width = 0;
			height = 0;
		} else { 
			var index = 0;
			var spacing = 6;
			width = 0;
			height = pixelSize*7;
			for (var i = 0; i < text.length; i++) {
				var c = text.charAt(i);
				drawChar(index*spacing*pixelSize+x,y,lower[c]);
				index += 1;
				width += spacing*pixelSize;
			};
		};
	};

	function buildtime(x,y,spacing, _time, length) {
		val = ("0" + _time).slice(-length);	
		str = String(val)
		drawChar(x,y,nums[str[0]]);
		drawChar(spacing*pixelSize+x,y,nums[str[1]]);
	};

	function drawSquare(x, y, w, h) {
		ctx.fillRect(x, y, w, h);
		ctx.save();
	}

	var time = new Date();

	if (this.kind == "millis") {
		buildtime(this.x,this.y,6,time.getMilliseconds(),3);
	} else if (this.kind == "seconds"){
		buildtime(this.x,this.y,6,time.getSeconds(),2);
	} else if (this.kind == "minutes"){
		buildtime(this.x,this.y,6,time.getMinutes(),2);
	} else if (this.kind == "hours"){
		buildtime(this.x,this.y,6,time.getHours(),2);
	} else if (this.kind == "text") {
		buildtext(this.x,this.y,document.getElementById(this.text).value);
	} else if (this.kind == "col") {
		drawChar(this.x,this.y,col);
	} else if (this.kind == "dot") {
		drawChar(this.x,this.y,dot);
	} else if (this.kind == "square") {
		drawSquare(this.x, this.y, this.w, this.h);
	};

	this.w = width;
	this.h = height;
	//console.log(this.w/pixelSize,this.h/pixelSize);

};

Shape.prototype.contains = function(mx,my) {
	// check that mouse x,y in shape
	return (this.x <= mx) && (this.x + this.w >= mx) &&
		(this.y <= my) && (this.y + this.h >= my);
};

function CanvasState(canvas, backgroundcolor) {
	this.backgroundcolor = backgroundcolor;
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');

	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft =
			parseInt(document.defaultView.getComputedStyle(canvas,null)['paddingLeft'], 10) || 0;
		this.stylePaddingTop =
			parseInt(document.defaultView.getComputedStyle(canvas,null)['paddingTop'], 10) || 0;
		this.styleBorderLeft =
			parseInt(document.defaultView.getComputedStyle(canvas,null)['borderLeftWidth'], 10) || 0;
		this.styleBorderLeft =
			parseInt(document.defaultView.getComputedStyle(canvas,null)['borderTopWidth'], 10) || 0;
	}

	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	this.valid = false;
	this.shapes = [];
	this.dragging = false;
	this.selection = null;
	this.dragoffx = 0;
	this.dragoffy = 0;

	var myState = this;

	function selectShape(e) {
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var shapes = myState.shapes;
		var l = shapes.length;
		for (var i = l-1; i >= 0; i--) {
			// if mouse within bounds of shape, do this once
			if (shapes[i].contains(mx,my)) {
				var mySel = shapes[i];

				myState.dragoffx = mx - mySel.x;
				myState.dragoffy = my - mySel.y;
				myState.dragging = true;
				myState.selection = mySel;
				myState.valid = false;

				for (var i = 0; i < myState.shapes.length; i++) {
					if (myState.shapes[i].order < myState.selection.order) {
						myState.shapes[i].order++;	
					};
				}
				myState.selection.order = 0;
				return;
			}
		}
		// if unselected, do this
		if (myState.selection) {
			myState.selection = null;
			myState.valid = false;
		}
	};

	function dragShape(e) {
		if (myState.dragging) {
			var mouse = myState.getMouse(e);
			myState.selection.x = mouse.x - myState.dragoffx;
			myState.selection.y = mouse.y - myState.dragoffy;
			// keep selection in bounds of canvas
			if (myState.selection.x < 0) {
				myState.selection.x = 0;
			};
			if (myState.selection.y < 0) {
				myState.selection.y = 0;
			};
			if (myState.selection.w + myState.selection.x > canvas.width) {
				myState.selection.x = canvas.width - myState.selection.w;
			};
			if (myState.selection.h + myState.selection.y > canvas.height) {
				myState.selection.y = canvas.height - myState.selection.h;
			};
			myState.valid = false;
		}
	};

	canvas.addEventListener('touchstart', function(e) {
		selectShape(e);
	}, true);

	canvas.addEventListener('touchend', function(e) {
		selectShape(e);
	}, true);


	canvas.addEventListener('selectstart', function(e) {e.preventDefault(); return false; }, false);
	canvas.addEventListener('mousedown', function(e) {
		selectShape(e);
	}, true);

	canvas.addEventListener('mousemove', function(e) {
		dragShape(e);
	},true);

	canvas.addEventListener('mouseup', function(e) {
		if(myState.selection) {
			// round to nearest pixel position
			myState.selection.x = Math.round(myState.selection.x / pixelSize) * pixelSize;
			myState.selection.y = Math.round(myState.selection.y / pixelSize) * pixelSize;
			myState.valid= false;
		};

		myState.dragging = false;
	}, true);

	canvas.addEventListener('dblclick', function(e) {
		selectShape(e);
	}, true);

//			var mouse = myState.getMouse(e);
//			myState.addShape(new Shape(mouse.x - this.w,mouse.y-this.h,11*pixelSize, 7*pixelSize,"#DDDDDD","seconds"));
//			myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0, 255, 0,.6)'));
//		}, true);


	this.selectionColor = 'rgba(0,24,100,.5)';
	this.selectionWidth = 2;
	this.interval = 10;
	setInterval(function() { myState.draw(); }, myState.interval);
};

CanvasState.prototype.addShape = function(shape) {
	console.log(shape);
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0,0,this.width, this.height);
}

CanvasState.prototype.draw = function() {
	if (!this.valid) {
	// sort function
	  function compare(a,b) {
	  	if (a.order < b.order)
	  		return 1;
	  	if (a.order > b.order)
	  		return -1;
	  	return 0;
	  };
	  
	  var ctx = this.ctx;
	  var shapes = this.shapes;
	  this.clear();

	  ctx.fillStyle = this.backgroundcolor;
	  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	  // background permanent
	  //
	  shapes.sort(compare);
	  var l = shapes.length;
	  for (var i = 0; i < l; i++) {
		  sendShape(shapes[i]);
	  	var shape = shapes[i];
	  	if (shape.x > this.width || shape.y > this.height ||
	  			shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
	  	shapes[i].draw(ctx);
	  }

	  if (this.selection != null) {
	  	ctx.fillStyle = this.selectionColor;
	  	var mySel = this.selection;
	  	ctx.fillRect(mySel.x,mySel.y,mySel.w,mySel.h);
	  }

	// top permanent

	}
	this.valid = true;
};

CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

	if (element.offsetParent !== 'undefined') {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.htmlTop; // + this.styleBorderTop 

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;


	return {x: mx, y: my};
};


function init(_canvasName, pixelSize) {
	scoreboard = document.getElementById(_canvasName);
	//scoreboard.width = x*pixelSize;
	//scoreboard.height = y*pixelSize;
	var s = new CanvasState(scoreboard, "white");
	acolor = "black"
	////s.addShape(new Shape(1*pixelSize, 1*pixelSize, 3*pixelSize, 3*pixelSize, "#7F7F7F", "square"));
	s.addShape(new Shape(1*pixelSize,1*pixelSize,11*pixelSize,7*pixelSize,acolor,"hours"));
	//s.addShape(new Shape(12*pixelSize,1*pixelSize,5*pixelSize,7*pixelSize,"#7F7F7F","col"));
	//s.addShape(new Shape(17*pixelSize,1*pixelSize,11*pixelSize,7*pixelSize,acolor,"minutes"));
	//s.addShape(new Shape(28*pixelSize,1*pixelSize,5*pixelSize,7*pixelSize,"#7F7F7F","col"));
	//s.addShape(new Shape(33*pixelSize,1*pixelSize,11*pixelSize,7*pixelSize,acolor,"seconds"));
	//s.addShape(new Shape(44*pixelSize,1*pixelSize,5*pixelSize,7*pixelSize,"#7F7F7F","dot"));
	//s.addShape(new Shape(49*pixelSize,1*pixelSize,11*pixelSize,7*pixelSize,acolor,"millis"));
	//s.addShape(new Shape(0*pixelSize,8*pixelSize,11*pixelSize,7*pixelSize,"#002EFF","text","canvas-input"));
}



var timeoutObject;

function sendShape(_shape) {
	// shape x, y, w, h properties need to be changed to pixel dimensions
	var s = {};
	s.x = _shape.x/pixelSize;
	s.y = _shape.y/pixelSize;
	s.w = _shape.w/pixelSize;
	s.h = _shape.h/pixelSize;
	s.fill = _shape.fill;
	s.text = _shape.text;
	s.kind = _shape.kind;
	var obj = {'method':'update', 'shape':s, 'address': details.address};
	clearTimeout(timeoutObject);
	timeoutObject = setTimeout(function() {
		ajaxy("/api", JSON.stringify(obj), function(_obj) {console.log(_obj);});
	}, 1000);
}
