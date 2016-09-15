var ctx;

var mObjects = [];

window.onload = function () {
    var canvas = document.getElementById('c');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');

    var wid = window.innerHeight / 5;
    var hig = 30;

    for (var ii = 0; ii < 60; ii++) {
        var ballRad = 5 + 20 * Math.random() | 0;
        var posX = window.innerWidth / 2 - wid * 2 + Math.random() * wid * 4;
        var posY = -400 * Math.random() - ballRad * 2;

        var ball = new Ball(ballRad * ballRad, ballRad, new Vector2(posX, posY), new Vector2(0, 0));
        mObjects.push(ball);
    }

    var floor0 = new Floor(window.innerWidth / 2 - wid / 2, window.innerHeight / 5 * 1.5 - hig / 2 - 30, wid, hig);
    floor0.setVelTheta(1 / 30 * Math.PI);

    var floor1 = new Floor(window.innerWidth / 2 - wid / 2 + wid, window.innerHeight / 5 * 2.5 - hig / 2, wid, hig);
    floor1.setVelTheta(-1 / 60 * Math.PI);

    var floor3 = new Floor(window.innerWidth / 2 - wid / 2 - wid, window.innerHeight / 5 * 2.5 - hig / 2, wid, hig);
    floor3.setVelTheta(1 / 60 * Math.PI);

    var floor2 = new Floor(window.innerWidth / 2 - wid / 2, window.innerHeight / 5 * 3. - hig / 2 + 30, wid, hig);
    floor2.setVelTheta(1 / 30 * Math.PI);


    mObjects.push(floor0);
    mObjects.push(floor1);
    mObjects.push(floor2);
    mObjects.push(floor3);


    loop();
}

function loop() {
    for (var ii in mObjects) {
        mObjects[ii].update(CONSTANTS.timeStep);
    }

    var contacts = collide();
    solver(contacts);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (var ii in mObjects) {
        mObjects[ii].draw(ctx);
    }


    requestAnimationFrame(loop);
}

function collide() {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        for (var jj = ii + 1; jj < this.mObjects.length; jj++) {
            if (mObjects[ii].mass != 0 || mObjects[jj].mass != 0) {
                var _contacts = mObjects[ii].getClosestPoints(mObjects[jj]);
                contacts = contacts.concat(_contacts);
            }
        }
    }

    return contacts;
}

// --------------------------------

var CONSTANTS = {
    gravity: 10,
    timeStep: 1 / 30,
};

// --------------------------------

/**
 * Constructor
 */
var Vector2 = function (xx, yy) {
    this.x = xx || 0;
    this.y = yy || 0;
};

Vector2.prototype.copy = function () {
    var vec = new Vector2(this.x, this.y);

    return vec;
};

Vector2.prototype.subtract = function (vec) {
    this.x = this.x - vec.x;
    this.y = this.y - vec.y;

    return this;
};

Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;

    return this;
}

Vector2.prototype.subtractMultipledVector = function (value, vector) {
    this.x -= value * vector.x;
    this.y -= value * vector.y;

    return this;
}

Vector2.prototype.addMultipledVector = function (value, vector) {
    this.x += value * vector.x;
    this.y += value * vector.y;

    return this;
}

Vector2.prototype.multiply = function (value) {

    this.x = this.x * value;
    this.y = this.y * value;

    return this;
};


/**
 * @function
 * @desc add vector
 *
 * @param {Vector2} vec
 */

Vector2.prototype.add = function (vec) {

    this.x = this.x + vec.x;
    this.y = this.y + vec.y;

    return this;
};

// =============================

/**
 * @function
 * @desc get the length of the vector
 *
 * @return {Number}
 */

Vector2.prototype.getLength = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

/**
 * @function
 * @desc get the normalized vector
 *
 * @return {Vector2}
 */

Vector2.prototype.getNormal = function () {
    var length = this.getLength();
    return new Vector2(this.x / length, this.y / length);
}

/**
 * @function
 * @desc get the vector compare with vector of minVec to see which is smaller
 *
 * @param {Vector2} minVec
 * @return {Vector2}
 */

Vector2.prototype.min = function (minVec) {
    if (this.x > minVec.x) this.x = minVec.x;
    if (this.y > minVec.y) this.y = minVec.y;

    return this;
}

/**
 * @function
 * @desc get the vector compared with the vector of maxVector to see which is bigger
 *
 * @param {Vector2} maxVec
 * @return {Vector2}
 */

Vector2.prototype.max = function (maxVec) {
    if (this.x < maxVec.x) this.x = maxVec.x;
    if (this.y < maxVec.y) this.y = maxVec.y;

    return this;
}

/**
 * @function
 * @desc get the vector compare with vector between minVec and maxVec
 *
 * @param {Vector2} minVec
 * @param {Vector2} maxVec
 */
Vector2.prototype.clamp = function (minVec, maxVec) {
    return this.max(minVec).min(maxVec);
}

/**
 * @function
 * @desc
 * @see http://mathworld.wolfram.com/RotationMatrix.html
 *
 * @param {Number} theta
 */

//clockwise rotation
Vector2.prototype.rotate = function (theta) {
    var rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    var rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);

    return this.set(rotatedX, rotatedY)
};


/**
 * @function
 * @see http://en.wikipedia.org/wiki/Dot_product
 *
 * @param  {Vector2} vec
 * @return {Vector2}
 */

Vector2.prototype.dotProduct = function (vec) {
    return this.x * vec.x + this.y * vec.y;
}

// =============================

function Matrix() {
    this.cos = 0.0;
    this.sin = 0.0;
    this.pos = new Vector2();
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
    }
}

// =============================

// no deformation to the body
var RigidBody = function (mass, width, height, pos, vel) {
    //if(!instanceOf velVector) this.velVector =
    this.mass = mass;
    if (this.mass == 0) this.invMass = 0;
    else               this.invMass = 1 / mass;

    this.width = width;
    this.height = height;
    this.pos = pos;
    this.vel = vel;

    this.force = new Vector2(0, 0);
}

// force is mass into acceleration
// should'nt velocity be acceleration?
/*
 It you apply a constant force (over time) to a mass, you get a constant acceleration. This is a pretty intuitive result, most feel.

 The whole "with respect of time" is ignored unless you have a force that varies over time, which you don't in most simple solutions of kinematics.

 Now, if you are looking at the velocity, that DOES change over time. A constant force is going to produce a growing velocity. This is obvious if you start an object with zero velocity and start applying a force. In fact, how else are you going to get the velocity to change? Force applied over time is the only way that velocity can change, and it will do so over the same time the force is applied.
 */

RigidBody.prototype.update = function (dt) {

    // --------------------

    this.vel.x += this.force.x * this.invMass;
    this.vel.y += this.force.y * this.invMass;

    // ====================

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // ====================

    this.force.set(0, 0);
};

RigidBody.prototype.setForce = function (xx, yy) {
    this.force.x += xx;
    this.force.x += xx;
};

RigidBody.prototype.setGravity = function () {
    this.force.y += this.mass * CONSTANTS.gravity;
};

RigidBody.prototype.getClosestPoints = function (rb) {
    console.error("===== NO getClosestPoints IN RigidBody =====");
}

// ===============================

var Floor = function (x, y, wid, hig) {
    RigidBody.call(this, 0, wid, hig, new Vector2(x + wid / 2, y + hig / 2), new Vector2(0, 0));


    this.thetaVelocity = 0;
    this.theta = 0;
    this.matrix = new Matrix();
    this.matrix.set(this.theta, 0, 0);
    this.halfExtendMinus = new Vector2(-wid / 2, -hig / 2);
    this.halfExtendPlus = new Vector2(wid / 2, hig / 2);
}

Floor.prototype = Object.create(RigidBody.prototype);
Floor.prototype.constructor = Floor;

Floor.prototype.setVelTheta = function (val) {
    this.thetaVelocity = val;
}

Floor.prototype.update = function () {
    this.theta += this.thetaVelocity;
    this.matrix.set(this.theta, 0, 0);
}

Floor.prototype.draw = function (ctx) {

    ctx.save();

    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.theta);
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();


    //this.debugDraw(ctx);
};

Floor.prototype.debugDraw = function (ctx) {

    ctx.fillStyle = "#ff0000";
    ctx.beginPath();

    ctx.arc(this.clamedP.x, this.clamedP.y, 2, 0, 2 * Math.PI);
    ctx.fill()

    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.clamedP.x, this.clamedP.y);
    ctx.lineTo(this.clamedP.x + this.d.x, this.clamedP.y + this.d.y);
    ctx.stroke();

    ctx.fillStyle = "#00ff00";
    ctx.beginPath();

    ctx.arc(this.pb.x, this.pb.y, 2, 0, 2 * Math.PI);
    ctx.fill();

}

// Rotation vector:
// r(theta) = [cos(theta) -sin(theta)/ sin(theta) cos(theta)]
// r(-theta) = [cos(theta) sin(theta)/ -sin(theta) cos(theta)]
//https://www.google.co.in/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=closest+points+rotating+rectangle+circle
//http://www.wildbunny.co.uk/blog/vector-maths-a-primer-for-games-programmers/matrices/#TransformPointInto
//http://gamedev.stackexchange.com/questions/47261/confusing-with-an-articles-wording-on-clamping-a-vector2
//http://answers.unity3d.com/questions/31169/explanation-local-vs-global-space.html
//http://www.wildbunny.co.uk/blog/2011/04/20/collision-detection-for-dummies/
//http://www.wildbunny.co.uk/blog/vector-maths-a-primer-for-games-programmers/rotation/
// 3D Primer book: contains intutive explaination for converting from object to world space
Floor.prototype.getClosestPoints = function (rBody) {
    var contacts = [];

    if (rBody instanceof Ball) {
        var rectangelA = this;
        var ballB = rBody;

        // find the vector
        //between the circle and the rectangle
        var xPos = ballB.pos.x - rectangelA.pos.x;
        var yPos = ballB.pos.y - rectangelA.pos.y;
        var delta = new Vector2();
        delta.set(xPos, yPos);
        //console.log(delta.x + ", " + delta.y);

        // why rotate??
        //convert the circle center (point to a vector) and rotate (you cannot rotate a point)
        //this is called converting the circle to the space of the rotated rectangle
        //so we actually rotate the circle point instead of the rectangle
        this.matrix.set(this.theta, 0, 0);
        var rotatedDeltaX = delta.x * this.matrix.cos + delta.y * this.matrix.sin;
        var rotatedDeltaY = -delta.x * this.matrix.sin + delta.y * this.matrix.cos;

        //create a vector from the rotated point vector object
        var rotatedVector = new Vector2();
        rotatedVector.set(rotatedDeltaX, rotatedDeltaY);
        //console.log(rotatedVector.x + ', ' + rotatedVector.y);

        //clamp: to constrain to a set of values
        //clamp: get a point on the rectangle or inside it (if overlap exists)
        // why do we clamp ?
        //how does clamp work ?

        //clamp limits the value in the range of min ... max

        //This helps to center another imaginary circle at the box center passing through clamped point
        //thus we can find distance between 2 circles
        var dClamped = rotatedVector.clamp(this.halfExtendMinus, this.halfExtendPlus);

        //why rotate again?
        // it was first rotated counter clockwise then clockwise
        // is getting back to the world space from object space ?
        var clamped = dClamped.rotate(this.theta);

        // why add clamped vector to position of rectangle?
        // again is this a part of getting back to the world space ?
        //http://www.wildbunny.co.uk/blog/vector-maths-a-primer-for-games-programmers/matrices/#TransformPointInto

        /*
         http://gamedev.stackexchange.com/questions/79765/how-do-i-convert-from-the-global-coordinate-space-to-a-local-space
         You need to know the pose of Entity A in the global space (x1,y1,θ), where θ is the orientation relative to the x axis.

         To convert the EntityB location from a global coordinate (x2,y2) to a local coordinate (x2',y2'):

         Using expressions
         Global to Local

         x2' = (x2-x1)cosθ + (y2-y1)sinθ

         y2' = -(x2-x1)sinθ + (y2-y1)cosθ
         Local to Global

         x2 = x2'cosθ - y2'sinθ + x1

         y2 = x2'sinθ + y2'cosθ + y1

         */

        //assuming this means finding the point on the OBB
        var clamedP = this.pos.copy().add(clamped);


        var d = new Vector2();
        d.set(ballB.pos.x - clamedP.x, ballB.pos.y - clamedP.y);

        // n is a new vector with magnitude 1 and in direction from the point on OBB to the ball
        var n = d.getNormal();

        //pa is the final point on the OBB
        var pa = clamedP;

        //pb is a vector (between OBB and the contact point of the ball)
        var pb = ballB.pos.copy().subtractMultipledVector(ballB.radius, n);
        //console.log(pb.x + ", " + pb.y);

        //from OBB to center of circle length minus the radius will give us the distance between the 2 colliding objects
        var dist = d.getLength() - ballB.radius;


        this.clamedP = clamedP;
        this.d = d;
        this.pb = pb;

        contacts.push(new Contact(rectangelA, ballB, pa, pb, n, dist));
    }

    return contacts;
};


// -------------------------------------

var Ball = function (_mass, _rad, _pos, _vel) {
    RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
    this.radius = _rad;

};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;


Ball.prototype.update = function (dt) {

    RigidBody.prototype.setGravity.call(this);
    RigidBody.prototype.update.call(this, dt);

}

Ball.prototype.draw = function (ctx) {

    ctx.fillStyle = "#000000"
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();


    if (this.pos.x > window.innerWidth + this.radius * 2 || this.pos.x < 0 - this.radius * 2 || this.pos.y + this.radius * 2 > window.innerHeight + this.rad * 2) {
        this.reset();
    }
};

Ball.prototype.reset = function () {
    this.pos = new Vector2(window.innerWidth / 2 - 100 + 200 * Math.random(), -this.radius * 2 - 400 * Math.random());
    this.vel = new Vector2();
}

//http://math.stackexchange.com/questions/127613/closest-point-on-circle-edge-from-point-outside-inside-the-circle
Ball.prototype.getClosestPoints = function (rBody) {
    var contacts = [];
    var ballA = this;

    if (rBody instanceof Ball) {

        var ballB = rBody;

        var delata = new Vector2(ballB.pos.x - ballA.pos.x, ballB.pos.y - ballA.pos.y);
        var n;

        if (delata.getLength()) {
            n = delata.getNormal();
        } else {
            n = new Vector2(1, 0);
        }

        // generate closes points
        var pa = new Vector2();
        pa.x = ballA.pos.x + n.x * ballA.radius;
        pa.y = ballA.pos.y + n.y * ballA.radius;

        var pb = new Vector2();
        pb.x = ballB.pos.x - n.x * ballB.radius;
        pb.y = ballB.pos.y - n.y * ballB.radius;

        // getdistance
        var dist = delata.getLength() - (ballA.radius + ballB.radius);

        contacts.push(new Contact(ballA, ballB, pa, pb, n, dist));

    } else if (rBody instanceof Floor) {
        var rectangleB = rBody;

        contacts = rectangleB.getClosestPoints(this);
        utils.flipContacts(contacts);

    } else {
        console.error("===== NO getClosestPoints IN Ball =====");
    }

    return contacts;
}

// ================================

var utils = {
    /**
     *
     * @param {Contact[]} contacts
     */
    flipContacts: function (contacts) {
        for (var ii = 0; ii < contacts.length; ii++) {

            var tempMB = contacts[ii].mB
            contacts[ii].mB = contacts[ii].mA;
            contacts[ii].mA = tempMB;

            var tempMPb = contacts[ii].mPb;
            contacts[ii].mPb = contacts[ii].mPa;
            contacts[ii].mPa = tempMPb;

            contacts[ii].mNormal.x *= -1;
            contacts[ii].mNormal.y *= -1;
        }
    }
};

// ================================

/**
 *   @desc
 *
 *   @param {RigidBody} A
 *   @param {RigidBody} B
 *   @param {Vector2} pa
 *   @param {Vector2} pb
 *   @param {Vector2} n
 *   @param {Number} dist
 */
var Contact = function (A, B, pa, pb, n, dist) {
    this.mA = A;
    this.mB = B;
    this.mPa = pa;
    this.mPb = pb;
    this.mNormal = n;
    this.mDist = dist;
    this.mImpulse = 0;
};

Contact.prototype = {
    /**
     * @param {Vector2} imp
     */
    applyImpulses: function (imp) {
        this.mA.vel.addMultipledVector(this.mA.invMass, imp);
        this.mB.vel.subtractMultipledVector(this.mB.invMass, imp);
    },

};

// ================================

var numInteraction = 2;
var solveType;

//what is relative normal velocity?
//
var solver = function (contacts) {
    for (var jj = 0; jj < numInteraction; jj++) {
        for (var ii = 0; ii < contacts.length; ii++) {
            var con = contacts[ii];
            var n = con.mNormal;

            var relNv = con.mB.vel.copy().subtract(con.mA.vel.copy()).dotProduct(n);

            speculativeSolver(con, n, relNv);

        }
    }
}

function speculativeSolver(con, n, relNv) {
    var remove = relNv + con.mDist / CONSTANTS.timeStep;

    if (remove < 0) {
        var mag = remove / (con.mA.invMass + con.mB.invMass);
        var imp = con.mNormal.copy().multiply(mag);

        con.applyImpulses(imp);
    }
}

/**
 */
function discreteSolver(con, n, relNv) {
    var remove = relNv + 1.1 * (con.mDist + 1) / CONSTANTS.timeStep;

    if (remove < 0) {
        var mag = remove / (con.mA.invMass + con.mB.invMass);
        var imp = con.mNormal.copy().multiply(mag);

        con.applyImpulses(imp);
    }
}