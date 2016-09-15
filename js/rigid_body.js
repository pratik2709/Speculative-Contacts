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
