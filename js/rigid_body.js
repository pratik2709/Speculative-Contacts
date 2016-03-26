var speculativeContacts = (function (run) {

    run.rigid_body = (function(){

        var rigidBody = function(mass, width, height, position, velocity){
            this.mass = mass;
            if(mass === 0 ){
                this.invMass = 0;
            }
            else{
                this.invMass = 1/mass;
            }
            this.width = width;
            this.height = height;
            this.position = position;
            this.velocity = velocity;
            this.force = new run.vectorlib.vector(0, 0);
        };

        return {
            rigidBody: rigidBody
        }

    })();


    return run

})(speculativeContacts || {});