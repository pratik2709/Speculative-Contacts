var ge1doot = ge1doot || {
	/*
	         \|||/
	         (o o)
	+~~~~ooO~~(_)~~~~~~~~+
	| Please             |
	| don't feed the     |
	| TROLLS !           |
	+~~~~~~~~~~~~~~Ooo~~~+
	        |__|__|
	         || ||
	        ooO Ooo
	*/
	
	screen: {
		elem:     null,
		callback: null,
		ctx:      null,
		width:    0,
		height:   0,
		left:     0,
		top:      0,
		init: function (id, callback, initRes) {
			this.elem = document.getElementById(id);
			this.callback = callback || null;
			if (this.elem.tagName == "CANVAS") this.ctx = this.elem.getContext("2d");
			window.addEventListener('resize', function () {
				this.resize();
			}.bind(this), false);
			this.elem.onselectstart = function () { return false; }
			this.elem.ondrag        = function () { return false; }
			initRes && this.resize();
			return this;
		},
		resize: function () {
			var o = this.elem;
			this.width  = o.offsetWidth;
			this.height = o.offsetHeight;
			for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
				this.left += o.offsetLeft;
				this.top  += o.offsetTop;
			}
			if (this.ctx) {
				this.elem.width  = this.width;
				this.elem.height = this.height;
			}
			this.callback && this.callback();
		},
		pointer: {
			screen:   null,
			elem:     null,
			callback: null,
			pos:   {x:0, y:0},
			mov:   {x:0, y:0},
			drag:  {x:0, y:0},
			start: {x:0, y:0},
			end:   {x:0, y:0},
			active: false,
			touch: false,
			down: function (e, touch) {
				this.touch = touch;
				e.preventDefault();
				var pointer = touch ? e.touches[0] : e;
				(!touch && document.setCapture) && document.setCapture();
				this.pos.x = this.start.x = pointer.clientX - this.screen.left;
				this.pos.y = this.start.y = pointer.clientY - this.screen.top;
				this.active = true;
				this.callback.down && this.callback.down();
			},
			up: function (e, touch) {
				this.touch = touch;
				e.preventDefault();
				(!touch && document.releaseCapture) && document.releaseCapture();
				this.end.x = this.drag.x;
				this.end.y = this.drag.y;
				this.active = false;
				this.callback.up && this.callback.up();
			},
			move: function (e, touch) {
				this.touch = touch;
				e.preventDefault();
				var pointer = touch ? e.touches[0] : e;
				this.mov.x = pointer.clientX - this.screen.left;
				this.mov.y = pointer.clientY - this.screen.top;
				if (this.active) {
					this.pos.x = this.mov.x;
					this.pos.y = this.mov.y;
					this.drag.x = this.end.x - (this.pos.x - this.start.x);
					this.drag.y = this.end.y - (this.pos.y - this.start.y);
					this.callback.move && this.callback.move();
				}
			},
			init: function (callback) {
				this.screen = ge1doot.screen;
				this.elem = this.screen.elem;
				this.callback = callback || {};
				if ('ontouchstart' in window) {
					// touch
					this.elem.ontouchstart  = function (e) { this.down(e, true); }.bind(this);
					this.elem.ontouchmove   = function (e) { this.move(e, true); }.bind(this);
					this.elem.ontouchend    = function (e) { this.up(e, true);   }.bind(this);
					this.elem.ontouchcancel = function (e) { this.up(e, true);   }.bind(this);
				}
				// mouse
				document.addEventListener("mousedown", function (e) { this.down(e, false); }.bind(this), true);
				document.addEventListener("mousemove", function (e) { this.move(e, false); }.bind(this), true);
				document.addEventListener("mouseup",   function (e) { this.up  (e, false); }.bind(this), true);
				return this;
			}
		},
		loadImages: function (container) {
			var elem = document.getElementById(container),
			canvas = document.createElement('canvas'), ctx,
			init = false, complete = false,
			n = document.images.length;
			function arc(color, val, r) {
				ctx.beginPath();
				ctx.moveTo(50,50);
				ctx.arc(50, 50, r, 0, val);
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();
			}
			function load () {
				if (complete) {
					canvas.style.display = "none";
					return;
				}
				var m = 0, timer = 32;
				for(var i = 0; i < n; i++) m += (document.images[i].complete)?1:0;
				if (m < n) {
					if (!init) {
						init = true;
						canvas.style.width = canvas.style.height = "100px";
						canvas.width = canvas.height = 100;
						canvas.style.position = "fixed";
						canvas.style.left = canvas.style.top = "50%";
						canvas.style.marginTop = canvas.style.marginLeft = "-50px";
						canvas.style.zIndex = 10000;
						ctx = canvas.getContext("2d");
						arc('rgb(64,64,64)', Math.PI*2, 48);
						elem.appendChild(canvas);
					}
					arc('rgb(255,255,255)', (m / n) * 2 * Math.PI, 50);
				} else {
					if (init) {
						arc('rgb(255,255,255)', 2 * Math.PI, 50);
						timer = 300;
					}
					complete = true;
				}
				setTimeout(load, timer);
			}
			setTimeout(load, 32);
		}
	}
}