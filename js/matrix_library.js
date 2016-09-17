function Matrix() {
    this.cos = 0.0;
    this.sin = 0.0;
    this.pos = new Vector2();
    this.ang = 0.0;
}

Matrix.prototype = {
    set: function(a, x, y){
        this.cos = Math.cos(a);
        this.sin = Math.sin(a);
        this.ang = a;
        this.pos.x = x;
        this.pos.y = y;

        return this;
    }
};