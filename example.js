/* 

Speculative Contacts – a continuous collision engine

Adapted from a C# tutorial by Paul Firth
  http://www.wildbunny.co.uk/blog/2011/03/25/speculative-contacts-an-continuous-collision-engine-approach-part-1/
 
*/

! function() {
  "use strict";
  
	var screen = ge1doot.screen.init("screen", function () {
		PHY2D.deleteStatic();
		PHY2D.rectangle(screen.width / 2, screen.height + 10, screen.width, 30, 0, 0);
	}, false);
	var ctx = screen.ctx, rec;
	var pointer = screen.pointer.init({
		down: function () {
			rec = {x0: pointer.pos.x, y0: pointer.pos.y, x1: pointer.pos.x, y1: pointer.pos.y}
		},
		move: function () {
			if (rec) {
				rec.x1 = pointer.pos.x;
				rec.y1 = pointer.pos.y;
			}
		},
		up: function () {
			PHY2D.up();
			if (rec) {
				var w = Math.abs(rec.x1 - rec.x0);
				var h = Math.abs(rec.y1 - rec.y0)
				if (w > 0 && h > 0) {
					PHY2D.rectangle(Math.min(rec.x0, rec.x1) + w / 2, Math.min(rec.y0, rec.y1) + h / 2, w, h, Math.sqrt(w * h) / 10, 0);
					rec = null;
				}
			}
		}
	});
	
	// vectors 2D prototype (does not create/return new objects at runtime)
	
	function Vector (x, y) {
		this.x = x || 0.0;
		this.y = y || 0.0;
	}
	
	Vector.prototype = {
	
		set: function (x, y) {
			this.x = x;
			this.y = y;
			return this;
		},
		
		dot: function (v) {
			return this.x * v.x + this.y * v.y;
		},
		
		lenSqr: function () {
			return this.x * this.x + this.y * this.y;
		},
		
		transform: function (v, m) {
			this.x = m.cos * v.x - m.sin * v.y + m.pos.x;
			this.y = m.sin * v.x + m.cos * v.y + m.pos.y;
			return this;
		},
		
		rotate: function (v, m) {
			this.x = m.cos * v.x - m.sin * v.y;
			this.y = m.sin * v.x + m.cos * v.y;
			return this;
		},
		
		normal: function (a, b) {
			var x = a.x - b.x,
				y = a.y - b.y,
				len = Math.sqrt(x * x + y * y);
			this.x = -y / len;
			this.y = x / len;
			return this;
		},
		
		project: function (a, b, n) {
			var x = a.x - b.x,
				y = a.y - b.y,
				len = Math.sqrt(x * x + y * y);
			return (-y / len) * n.x + (x / len) * n.y;
		},
		
		addScale: function (v1, v2, s) {
			this.x = v1.x + (v2.x * s);
			this.y = v1.y + (v2.y * s);
			return this;
		},
		
		subScale: function (v1, v2, s) {
			this.x = v1.x - (v2.x * s);
			this.y = v1.y - (v2.y * s);
			return this;
		},
		
		add: function (v1, v2) {
			this.x = v1.x + v2.x;
			this.y = v1.y + v2.y;
			return this;
		},
		
		sub: function (v1, v2) {
			this.x = v1.x - v2.x;
			this.y = v1.y - v2.y;
			return this;
		},
		
		scale: function (v1, s) {
			this.x = v1.x * s;
			this.y = v1.y * s;
			return this;
		},
		
		perp: function () {
			var x = this.x;
			this.x = -this.y;
			this.y = x;
			return this;
		},
		
		inv: function (v1) {
			this.x = -v1.x;
			this.y = -v1.y;
			return this;
		},
		
		clamp: function (v, min, max) {
			if (v > max) v = max; else if (v < min) v = min;
			return v;
		},
		
		rotateIntoSpaceOf: function (a, m) {
			var dx = -a.x, dy = -a.y;
			this.x = dx *  m.cos + dy * m.sin;
			this.y = dx * -m.sin + dy * m.cos;
			return this;
		},
		
		// SIMD array vectors
		
		array: function (n, values) {
			
			var array = new Array(n);
			array.min = new Vector();
			array.max = new Vector();
			
			for (var i = 0; i < n; i++) {
				array[i] = new Vector(
					values ? values[i * 2 + 0] : 0.0,
					values ? values[i * 2 + 1] : 0.0
				);
			}
			
			array.transform = function (v, m) {
				
				for (var i = 0, len = this.length; i < len; i++) {
					
					var vi = v[i], elem = this[i];
					var x = m.cos * vi.x - m.sin * vi.y + m.pos.x;
					var y = m.sin * vi.x + m.cos * vi.y + m.pos.y;
					
					if (x < this.min.x) this.min.x = x;
					if (y < this.min.y) this.min.y = y;
					if (x > this.max.x) this.max.x = x;
					if (y > this.max.y) this.max.y = y;
					
					elem.x = x;
					elem.y = y;
				}
				
				return this;
			}
			
			array.rotate = function (v, m) {
				
				for (var i = 0, len = this.length; i < len; i++) {
					var vi = v[i], elem = this[i];
					elem.x = m.cos * vi.x - m.sin * vi.y;
					elem.y = m.sin * vi.x + m.cos * vi.y;
				}
				
				return this;
			}
			
			array.resetMinmax = function () {
				this.min.x =  100000.0;
				this.min.y =  100000.0;
				this.max.x = -100000.0;
				this.max.y = -100000.0;
			}
			
			array.normal = function (points) {
				
				for (var i = 0; i < this.length; i++ ) {
					this[i].normal(
						points[(i + 1) % this.length],
						points[i]
					);	
				}
				
				return this;
			}
			
			return array;
		}
	}
	
	// Matrix container
	
	function Matrix () {
		this.cos = 0.0;
		this.sin = 0.0;
		this.pos = new Vector();
		this.ang = 0.0;
	}
	
	Matrix.prototype = {
	
		set: function (a, x, y) {
			this.cos = Math.cos(a);
			this.sin = Math.sin(a);
			this.ang = a;
			this.pos.x = x;
			this.pos.y = y;
			return this;
		},
		
		copy: function (matrix) {
			this.cos = matrix.cos;
			this.sin = matrix.sin;
			this.ang = matrix.ang;
			this.pos.x = matrix.pos.x;
			this.pos.y = matrix.pos.y;
			return this;
		},
		
		integrate: function (va, vx, vy, kTimeStep) {
			this.pos.x += vx * kTimeStep;
			this.pos.y += vy * kTimeStep;
			this.ang   += va * kTimeStep;
			this.cos = Math.cos(this.ang);
			this.sin = Math.sin(this.ang);
			return this;
		}
		
	}
	
	// Main PHY2D code
	
	var PHY2D = function (ctx, pointer, Vector, Matrix) {
		
		var kGravity = 5;
		var kTimeStep = 1 / 60;
		var kFriction = 0.3;
		
		var objects = [];
		var drag = false;
		
		// temporary working vectors (TODO: need to get this managed by the vector module)
		var v0 = new Vector();
		var v1 = new Vector();
		var v2 = new Vector();
		var v3 = new Vector();
		var v4 = new Vector();
		var v5 = new Vector();
		
		// contacts list
		var contacts = [];
		contacts.index = 0;
		contacts.create = function (A, B, pa, pb, nx, ny) {
			if (!this[this.index]) this[this.index] = new Contact();
			this[this.index++].set(A, B, pa, pb, nx, ny);
		}
		
		// AABB container constructor
		function AABB () {
			this.x = 0.0;
			this.y = 0.0;
			this.w = 0.0;
			this.h = 0.0;
		}
		
		// Polygon constructor
		function Polygon (x, y, w, h, vertices, invMass, angle) {
		
			this.vel               = new Vector();
			this.angularVel        = 0.0;
			this.invMass           = invMass;
			this.matrix            = new Matrix().set(angle,x,y);
			this.matrixNextFrame   = new Matrix();
			this.aabb              = new AABB();
			this.drag              = false;
			this.static            = false;
			this.length            = (vertices.length / 2) | 0;
			
			// vertices
			this.localSpacePoints  = new Vector().array(this.length, vertices);
			this.localSpaceNormals = new Vector().array(this.length).normal(this.localSpacePoints);
			this.worldSpaceNormals = new Vector().array(this.length);
			this.worldSpacePoints  = new Vector().array(this.length);
			
			// calculate inverse inertia tensor
			this.invI = (invMass > 0) ? 1 / ((1 / invMass) * (w * w + h * h) / 3) : 0
			
			// contact points
			this.c1 = new Vector();
			this.c0 = new Vector();
			
			// add rigid body
			objects.push(this);
			
		}
		
		Polygon.prototype = {
		
			// aabb motion box
			
			motionAABB: function () {
				
				this.worldSpacePoints.resetMinmax();
				this.worldSpacePoints.transform(this.localSpacePoints, this.matrixNextFrame);
				this.worldSpacePoints.transform(this.localSpacePoints, this.matrix);
				this.worldSpaceNormals.rotate(this.localSpaceNormals, this.matrix);
				var min = this.worldSpacePoints.min;
				var max = this.worldSpacePoints.max;
				this.aabb.x = (min.x + max.x) * 0.5;
				this.aabb.y = (min.y + max.y) * 0.5;
				this.aabb.w = (max.x - min.x) * 0.5;
				this.aabb.h = (max.y - min.y) * 0.5;
				
			},
			
			// contact points
			
			contact: function (that) {
				var face, vertex, vertexRect, faceRect, fp, va, vb, vc, nx, ny, wsN, wdV0, wdV1, wsV0, wsV1;
				
				// generate contacts for this pair
				mostSeparated.set(100000, -1, -1, 0, 100000);
				mostPenetrating.set(-100000, -1, -1, 0, 100000);
				
				// face of A, vertices of B
				this.featurePairJudgement(that, 2);
				
				// faces of B, vertices of A
				that.featurePairJudgement(this, 1);
				
				if (mostSeparated.dist > 0 && mostSeparated.fpc !== 0) {
					
					// objects are separated
					face = mostSeparated.edge;
					vertex = mostSeparated.closestI;
					fp = mostSeparated.fpc;
					
				} else if (mostPenetrating.dist <= 0) {
					
					// objects are penetrating
					face = mostPenetrating.edge;
					vertex = mostPenetrating.closestI;
					fp = mostPenetrating.fpc;
					
				}
				
				if (fp === 1) vertexRect = this, faceRect = that; else vertexRect = that, faceRect = this;
				
				// world space vertex
				wsN = faceRect.worldSpaceNormals[face];
				
				// other vertex adjacent which makes most parallel normal with the collision normal
				va = vertexRect.worldSpacePoints[(vertex - 1 + vertexRect.length) % vertexRect.length];
				vb = vertexRect.worldSpacePoints[vertex];
				vc = vertexRect.worldSpacePoints[(vertex + 1) % vertexRect.length];
				
				if (v0.project(vb, va, wsN) < v1.project(vc, vb, wsN)) {
					wdV0 = va;
					wdV1 = vb;
				} else {
					wdV0 = vb;
					wdV1 = vc;
				}
				
				// world space edge
				wsV0 = faceRect.worldSpacePoints[face];
				wsV1 = faceRect.worldSpacePoints[(face + 1) % faceRect.length];
				
				// form contact
				if (fp === 1) {
					
					// project vertex onto edge
					this.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
					that.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
					// normal is negated because it always needs to point from A->B
					nx = -wsN.x;
					ny = -wsN.y;
					
				} else {
					
					this.projectPointOntoEdge(wdV1, wdV0, wsV0, wsV1);
					that.projectPointOntoEdge(wsV0, wsV1, wdV0, wdV1);
					nx = wsN.x;
					ny = wsN.y;
					
				}
				
				// create contacts
				contacts.create(this, that, this.c0, that.c0, nx, ny);
				contacts.create(this, that, this.c1, that.c1, nx, ny);
				
			},
			
			featurePairJudgement: function (that, fpc) {
				
				var wsN, closestI, closest, dist;
				
				for (var edge = 0; edge < this.length; edge++) {
					
					// get support vertices
					wsN = this.worldSpaceNormals[edge];

					// rotate into RigidBody space
					v5.rotateIntoSpaceOf(wsN, that.matrix);

					var closestI = -1, closestD = -100000;
					
					// Get the vertex most in the direction of the given vector
					for (var i = 0; i < that.length; i++) {
						
						var d = v5.dot(that.localSpacePoints[i]);
						
						if (d > closestD) {
							
							closestD = d;
							closestI = i;
							
						}
						
					}
					
					var closest = that.worldSpacePoints[closestI];
					v0.sub(closest, this.worldSpacePoints[edge]); 			
					
					// distance from origin to face	
					var dist = v0.dot(wsN);
					
					if (dist > 0) {
						
						// recompute distance to clamped edge
						v1.sub(closest, this.worldSpacePoints[(edge + 1) % this.length]);
						
						// project onto minkowski edge
						dist = this.projectPointOntoEdgeZero(v0, v1).lenSqr();
						
						// track separation
						if (dist < mostSeparated.dist) {
							mostSeparated.set(dist, closestI, edge, fpc);
						}
						
					} else {
						
						// track penetration
						if (dist > mostPenetrating.dist) {
							mostPenetrating.set(dist, closestI, edge, fpc);
						}
						
					}
					
				}
				
				return true;
				
			},
			
			projectPointOntoEdge: function (p0, p1, e0, e1) {
				var l = v2.sub(e1, e0).lenSqr() + 0.0000001;
				this.c0.addScale(e0, v2, v3.clamp(v3.sub(p0, e0).dot(v2) / l, 0, 1));
				this.c1.addScale(e0, v2, v3.clamp(v3.sub(p1, e0).dot(v2) / l, 0, 1));
			},
			
			projectPointOntoEdgeZero: function (e0, e1) {
				var l = v2.sub(e1, e0).lenSqr() + 0.0000001;
				return this.c0.addScale(e0, v2, v3.clamp(v3.inv(e0).dot(v2) / l, 0, 1));
			},
			
			// integration
			
			integrate: function () {
				
				if (this.drag) {
					// dragging object
					this.vel.x = (pointer.pos.x - this.matrix.pos.x) * 10;
					this.vel.y = (pointer.pos.y - this.matrix.pos.y) * 10;
				} else {
					// gravity
					if (this.invMass > 0) this.vel.y += kGravity;
				}
				
				// update position
				this.matrix.integrate(this.angularVel, this.vel.x, this.vel.y, kTimeStep);
				this.matrixNextFrame.copy(this.matrix).integrate(this.angularVel, this.vel.x, this.vel.y, kTimeStep);
				
				// compute motion AABB
				if (!this.static) this.motionAABB();
				else {
					if (this.invMass === 0) {
						this.static = true;
						this.motionAABB();
					}
				}
				
			},
			
			draw: function() {
				ctx.beginPath();
				for (var j = 0; j < this.length; j++ ) {
					var a = this.worldSpacePoints[j];
					ctx.lineTo(a.x, a.y);
				}
				ctx.closePath();
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.fill();
				/*if (pointer.active && !drag && this.invMass) {
					if (ctx.isPointInPath(pointer.pos.x, pointer.pos.y)) {
						this.drag = true;
						drag = true;
					}
				}*/
			}
		}
		
		// feature pair container
		
		function FeaturePair () {
			this.dist       = 0;
			this.closestI   = 0;
			this.edge       = 0;
			this.fpc        = 0;
		}
		FeaturePair.prototype.set = function (dist, closestI, edge, fpc) {
			this.dist       = dist;
			this.closestI   = closestI;
			this.edge       = edge;
			this.fpc        = fpc;
		}
		var mostSeparated   = new FeaturePair();
		var mostPenetrating = new FeaturePair();

		// contacts constructor
		
		function Contact () {
		
			this.a           = null;
			this.b           = null;
			this.normal      = new Vector();
			this.normalPerp  = new Vector();
			this.ra          = new Vector();
			this.rb          = new Vector();
			this.dist        = 0;
			this.impulseN    = 0;
			this.impulseT    = 0;
			this.invDenom    = 0;
			this.invDenomTan = 0;
			
		}
		Contact.prototype = {
		
			// reusing existing contact objects
			
			set: function (A, B, pa, pb, nx, ny) {
				
				var ran, rbn;
				
				this.a = A;
				this.b = B;
				this.normal.set(nx, ny);
				this.normalPerp.set(-ny, nx);
				this.dist = v1.sub(pb, pa).dot(this.normal);
				this.impulseN = 0;
				this.impulseT = 0;
				
				// calculate radius arms
				this.ra.sub(pa, A.matrix.pos).perp();
				this.rb.sub(pb, B.matrix.pos).perp();
				
				// compute denominator in impulse equation
				ran = this.ra.dot(this.normal);
				rbn = this.rb.dot(this.normal);
				this.invDenom  = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
				ran = this.ra.dot(this.normalPerp);
				rbn = this.rb.dot(this.normalPerp);
				this.invDenomTan = 1 / (A.invMass + B.invMass + (ran * ran * A.invI) + (rbn * rbn * B.invI));
			},		
			
			applyImpulse: function (imp) {
				// linear
				this.a.vel.addScale(this.a.vel, imp, this.a.invMass);
				this.b.vel.subScale(this.b.vel, imp, this.b.invMass);
				// angular
				this.a.angularVel += imp.dot(this.ra) * this.a.invI;
				this.b.angularVel -= imp.dot(this.rb) * this.b.invI;
			},
			
			// speculative contact solver

			solve: function () {
			
				var newImpulse, absMag, dv = v1;
				
				// get all of relative normal velocity
				dv.sub(
					v2.addScale(this.b.vel, this.rb, this.b.angularVel),
					v3.addScale(this.a.vel, this.ra, this.a.angularVel)
				);
				
				// accumulated impulse
				newImpulse = (dv.dot(this.normal) + this.dist / kTimeStep) * this.invDenom + this.impulseN;
				
				// push only
				if (newImpulse > 0) newImpulse = 0;
				
				// apply impulse
				this.applyImpulse(v2.scale(this.normal, newImpulse - this.impulseN));
				this.impulseN = newImpulse;
				
				// friction
				absMag = Math.abs(this.impulseN) * kFriction;
				newImpulse = v2.clamp(dv.dot(this.normalPerp) * this.invDenomTan + this.impulseT, -absMag, absMag);
				
				// apply friction impulse
				this.applyImpulse(v3.scale(this.normalPerp, newImpulse - this.impulseT));
				this.impulseT = newImpulse;
				
			}
		}
		
		
		// main render loop
		
		function render () {
		
			// brute force aabb broadphase
			contacts.index = 0;
			for (var i = 0, len = objects.length; i < len - 1; i++) {
				
				var A = objects[i];
				
				for (var j = i + 1; j < len; j++) {
					
					var B = objects[j];
					
					if (A.invMass || B.invMass) {
						
						var a = A.aabb, b = B.aabb;
						if (
							Math.abs(b.x - a.x) - (a.w + b.w) < 0 &&
							Math.abs(b.y - a.y) - (a.h + b.h) < 0
						) A.contact(B);
						
					}
					
				}
				
			}
			
			// solver loop
			var len = contacts.index;
			for (var j = 0; j < 5; j++) {
				for (var i = 0; i < len; i++) {
					contacts[i].solve();
				}
			}
			
			// integration loop
			for (var i = 0, len = objects.length; i < len; i++) {
				objects[i].integrate();
			}
			
			// draw
			for (var i = 0; i < len; i++) {
				var rb = objects[i];
				rb.draw();
				// delete lost bodies
				if (rb.matrix.pos.y > screen.height * 2) {
					objects.splice(i, 1);
					len--;
					i--;
				}
			}
			
		}
		
		
		return {
			// public interface
			
			render: render,
			
			up: function () {
				for (var i = 0; i < objects.length; i++) objects[i].drag = false;
				drag = false;
			},
			
			// create new rectangles
			
			rectangle : function (x, y, w, h, mass, angle) {
				var vertices = [
					 w/2, -h/2,
					-w/2, -h/2,
					-w/2,  h/2,
					 w/2,  h/2
				];
				var invMass  = mass ? 1 / mass : 0;
				return new Polygon(x, y, w, h, vertices, invMass, angle);
			},
			
			// delete static objects
			
			deleteStatic: function () {
				var k = objects.length;
				while (k--) {
					var p = objects[k];
					if (!p.invMass) {
						objects.splice(k, 1);
					}
				}
			}
			
		}
		
	} (ctx, pointer, Vector, Matrix); // injection

	// create the pile 'O boxes
	screen.resize();
	var w = screen.width / 20;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			PHY2D.rectangle(0.5 * w + w * 5 + i * w, j * w, w * 0.75, w * 0.75, 1, 0);
		}
	}

	// ==== main loop ====
	function run() {
	
		requestAnimationFrame(run);
		ctx.clearRect(0, 0, screen.width, screen.height);
		if (rec) {
			ctx.beginPath();
			ctx.moveTo(rec.x0, rec.y0);
			ctx.lineTo(rec.x1, rec.y0);
			ctx.lineTo(rec.x1, rec.y1);
			ctx.lineTo(rec.x0, rec.y1);
			ctx.closePath();
			ctx.fillStyle = "rgb(128,128,128)";
			ctx.fill();
		}

		PHY2D.render();
	}

	// ==== start animation ====
	requestAnimationFrame(run);

}();