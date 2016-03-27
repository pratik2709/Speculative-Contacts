var speculativeContacts = (function (run) {

    run.floor = (function(){

        var rigidBody = function(mass, width, height, position, velocity){
            this.mass = mass;
            if(mass === 0 ){
                this.inverseMass = 0;
            }
            else{
                this.inverseMass = 1/mass;
            }
            this.width = width;
            this.height = height;
            this.position = position;
            this.velocity = velocity;
            this.force = new run.vectorlib.vector(0, 0);
        };

        rigidBody.prototype.update = function(dt){
            this.velocity.x += this.force.x * this.inverseMass;
            this.velocity.y += this.force.y * this.inverseMass;

            this.position.x = this.velocity.x * dt;
            this.position.y = this.velocity.y * dt;

            this.force.set(0,0)

        };

        rigidBody.prototype.setGravity = function () {
            this.force.y += this.mass * run.main.CONSTANTS.gravity;
        };

        RigidBody.prototype.getClosestPoints = function (rb) {
            console.error("===== NO getClosestPoints IN RigidBody =====");
        };

        return {
            rigidBody: rigidBody
        }

    })();


    return run

})(speculativeContacts || {});