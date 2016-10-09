var Ball = function (_mass, _rad, _pos, _vel) {
    RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
    this.radius = _rad;
};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function (dt) {
    RigidBody.prototype.setGravity.call(this);
    RigidBody.prototype.update.call(this, dt);

    //change and watch
    if (this.pos.x > window.innerWidth + this.radius * 2 || this.pos.x < 0 - this.radius * 2 || this.pos.y + this.radius * 2 > window.innerHeight + this.rad * 2) {
        this.reset();
    }

};

//change and watch
Ball.prototype.reset = function () {
    this.pos = new Vector2(window.innerWidth / 2 - 100 + 200 * Math.random(), -this.radius * 2 - 400 * Math.random());
    this.vel = new Vector2();
};


Ball.prototype.getClosestPoints = function(rBody){
    var contacts = [];
    var ballA = this;

    if(rBody instanceof  Ball){
        var ballB = rBody;

        var delta = new Vector2(ballB.pos.x - ballA.pos.x, ballB.pos.y - ballA.pos.y);

        var n;

        if(delta.getLength()){
            n = delta.getNormal();
        }
        else {
            n = new Vector2(1, 0);
        }

        var pa = new Vector2();
        pa.x = ballA.pos.x + n.x * ballA.radius;
        pa.y = ballA.pos.y + n.y * ballA.radius;

        var pb = new Vector2();
        pb.x = ballB.pos.x - n.x * ballA.radius;
        pb.y = ballB.pos.y - n.y * ballA.radius;

        var dist = delta.getLength() - (ballA.radius + ballB.radius);

        contacts.push(new Contact(ballA, ballB, pa, pb, n, dist));

    }
    else if(rBody instanceof Floor){
        var rectangleB = rBody;

        contacts = rectangleB.getClosestPoints(this);
        utils.flipContacts(contacts);

    } else {
        console.error("===== NO getClosestPoints IN Ball =====");
    }

    return contacts;
};