var ctx;

var mObjects = [];

window.onload = function () {
    var canvas = document.getElementById('c');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx = canvas.getContext('2d');

    var wid = window.innerHeight / 5;
    var hig = 30;

    for (var ii = 0; ii < 60; ii++) {
        var ballRad = 5 + 20 * Math.random() | 0;
        var posX = window.innerWidth / 2 - wid * 2 + Math.random() * wid * 4;
        var posY = -400 * Math.random() - ballRad * 2;

        var ball = new Ball(ballRad * ballRad, ballRad, new Vector2(posX, posY), new Vector2(0, 0));
        mObjects.push(ball);
    }


    var floor1 = new Floor(window.innerWidth / 2 - wid / 2 + wid, window.innerHeight / 5 * 2.5 - hig / 2, wid, hig);
    floor1.setVelTheta(-5 / 60 * Math.PI);

    var floor3 = new Floor(window.innerWidth / 2 - wid / 2 - wid, window.innerHeight / 5 * 2.5 - hig / 2, wid, hig);
    floor3.setVelTheta(5 / 60 * Math.PI);

    //var floor2 = new Floor(window.innerWidth / 2 - wid / 2, window.innerHeight / 5 * 3. - hig / 2 + 30, wid, hig);
    //floor2.setVelTheta(1 / 30 * Math.PI);


    //mObjects.push(floor0);
    mObjects.push(floor1);
    //mObjects.push(floor2);
    mObjects.push(floor3);


    loop();
};

function loop() {
    for (var ii in mObjects) {
        if (mObjects[ii].hasOwnProperty('thetaVelocity')) { //recognize its a bok
            if (KEY_STATUS.space) { // check if right control is pres
                mObjects[ii].update(CONSTANTS.timeStep);
            }

        }
        else {
            mObjects[ii].update(CONSTANTS.timeStep);
        }

    }

    var contacts = collide();
    solver(contacts);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    for (var ii in mObjects) {
        mObjects[ii].draw(ctx);
    }


    requestAnimationFrame(loop);
}

function collide() {
    var contacts = [];

    for (var ii = 0; ii < this.mObjects.length - 1; ii++) {
        for (var jj = ii + 1; jj < this.mObjects.length; jj++) {
            if (mObjects[ii].mass != 0 || mObjects[jj].mass != 0) {
                var _contacts = mObjects[ii].getClosestPoints(mObjects[jj]);
                contacts = contacts.concat(_contacts);
            }
        }
    }

    return contacts;
}

// --------------------------------

var CONSTANTS = {
    gravity: 10,
    timeStep: 1 / 30
};