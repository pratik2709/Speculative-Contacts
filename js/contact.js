var Contact = function (A, B, pa, pb, n, dist) {

    this.mA = A;
    this.mB = B;
    this.mPa = pa;
    this.mPb = pb;
    this.mNormal = n;
    this.mDist = dist;

    this.mImpulse = 0; //impulse initialized!
};

//explained: http://teaching.shu.ac.uk/hwb/sport/websites/jumpsite/impulse.htm
//still unclear why subtract ??
Contact.prototype = {

    applyImpluses: function(imp){
        this.mA.vel.addMultipledVector(this.mA.invMass, imp);
        this.mB.vel.subtractMultipledVector(this.mB.invMass, imp);
    }
};
