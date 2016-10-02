// what is this numineraction??
var numInteraction = 2;

//Care should be taken to not confuse the terms
// "vector norm" (length of vector), "normal vector"
// (perpendicular vector) and "normalized vector" (unit-length vector)
// .

//https://en.wikipedia.org/wiki/Relative_velocity

var solver = function (contacts) {
    for(var jj=0; jj < numInteraction; jj++){
        for(var ii = 0; ii < contacts.length; ii++){
            var con = contacts[ii];
            var n = con.mNormal;

            var relNv = con.mB.vel.copy().subtract(con.mA.vel.copy()).dotProduct(n);

            speculativeSolver(con, n ,relNv);

        }
    }

};

//http://www.euclideanspace.com/physics/dynamics/collision/
//http://www.euclideanspace.com/physics/dynamics/collision/oned/index.htm
//https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
function speculativeSolver(con, n, relNv){
    var remove = relNv + con.mDist / CONSTANTS.timeStep;

    if(remove < 0){
        var mag = remove/(con.mA.invMass + con.mB.invMass);
        var imp = con.mNormal.copy().multiply(mag);

        con.applyImpluses(imp);
    }
}


