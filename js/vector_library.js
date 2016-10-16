var Vector2 = function(x,y){
    this.x = x || 0;
    this.y =y || 0;
};

Vector2.prototype.copy = function () {
    return new Vector2(this.x, this.y);
};

Vector2.prototype.subtract = function (vec) {
    this.x = this.x - vec.x;
    this.y = this.y - vec.y;

    return this;
};

Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;

    return this;
};

Vector2.prototype.subtractMultipledVector = function (value, vector) {
    this.x -= value * vector.x;
    this.y -= value * vector.y;

    return this;
};

Vector2.prototype.addMultipledVector = function (value, vector) {
    this.x += value * vector.x;
    this.y += value * vector.y;

    return this;
};

Vector2.prototype.multiply = function (value) {

    this.x = this.x * value;
    this.y = this.y * value;

    return this;
};

Vector2.prototype.add = function (vec) {

    this.x = this.x + vec.x;
    this.y = this.y + vec.y;

    return this;
};

Vector2.prototype.getLength = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2.prototype.getNormal = function () {
    var length = this.getLength();
    return new Vector2(this.x / length, this.y / length);
};



Vector2.prototype.min = function (minVec) {
    if (this.x > minVec.x) this.x = minVec.x;
    if (this.y > minVec.y) this.y = minVec.y;

    return this;
};


Vector2.prototype.max = function (maxVec) {
    if (this.x < maxVec.x) this.x = maxVec.x;
    if (this.y < maxVec.y) this.y = maxVec.y;

    return this;
};

Vector2.prototype.clamp = function (minVec, maxVec) {
    return this.max(minVec).min(maxVec);
};

Vector2.prototype.rotate = function (theta) {
    var rotatedX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    var rotatedY = this.x * Math.sin(theta) + this.y * Math.cos(theta);

    return this.set(rotatedX, rotatedY)
};

Vector2.prototype.dotProduct = function (vec) {
    return this.x * vec.x + this.y * vec.y;
};






