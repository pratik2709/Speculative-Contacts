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







