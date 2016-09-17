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

