var Floor = function (x, y, width, height) {
    RigidBody.call(this, 0, width, height, new Vector2(x + width/2, y + height/2), new Vector2(0, 0));

    this.thetaVelocity = 0;
    this.theta = 0;
    this.matrix = new Matrix();
    this.matrix.set(this.theta, 0, 0);

    this.halfExtendMinus = new Vector2(-width/2, -height/2);
    this.halfExtendPlus = new Vector2(width/2, height/2);

};

Floor.prototype = Object.create(RigidBody.prototype);

Floor.prototype.setVelTheta = function (val) {
    this.thetaVelocity = val;
};

Floor.prototype.update = function(){
    this.theta += this.thetaVelocity;  
    this.matrix.set(this.theta, 0, 0);
};

Floor.prototype.draw = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "#000000";
    ctx.beginPath();

    //change position and rotate
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.theta);

    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
};

Floor.prototype.getClosestPoints = function (rBody) {

    var contacts = [];

    if(rBody instanceof  Ball){
        var rectangleA = this;
        var ballB = rBody;

        var xPos = ballB.pos.x - rectangleA.pos.x;
        var yPos = ballB.pos.y - rectangleA.pos.y;

        var delta = new Vector2();
        delta.set(xPos, yPos);

        this.matrix.set(this.theta, 0, 0);
        var rotatedDeltaX = delta.x*this.matrix.cos + delta.y*this.matrix.sin;
        var rotatedDeltaY = -delta.x*this.matrix.sin + delta.y*this.matrix.cos;

        var rotatedVector = new Vector2();
        rotatedVector.set(rotatedDeltaX, rotatedDeltaY);

        var dClamped = rotatedVector.clamp(this.halfExtendMinus, this.halfExtendPlus);

        //getting back to worldspace
        var clamped = dClamped.rotate(this.theta);
        var clampedP = this.pos.copy().add(clamped);

        var pa = clampedP;









    }

};


