var RigidBody = function(mass, width, height, pos, vel){

    this.mass = mass;
    if(this.mass == 0){
        this.mass = 0;
    }
    else{
        this.invMass = 1/this.mass;
    }

    this.width = width;
    this.height = height;
    this.pos = pos;
    this.vel = vel;

    this.force = new Vector2(0, 0);

};

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
    this.force.y += yy;
};

RigidBody.prototype.setGravity = function () {
    this.force.y += this.mass * CONSTANTS.gravity;
};

RigidBody.prototype.getClosestPoints = function (rb) {
    console.error("===== NO getClosestPoints IN RigidBody =====");
};