var Ball = function (_mass, _rad, _pos, _vel) {
    RigidBody.call(this, _mass, _rad, _rad, _pos, _vel)
    this.radius = _rad;
};

Ball.prototype = Object.create(Ball.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function (dt) {
    RigidBody.prototype.setGravity.call(this);
    RigidBody.prototype.update.call(this, dt);

};
