var speculativeContacts = (function (run) {

    run.main = (function(){

        var canvas = document.getElementById('c');
        var context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var CONSTANTS = {
            gravity: 10,
            timeStep: 1 / 30
        };

        return {
            CONSTANTS: CONSTANTS
        }

    })();


    return run

})(speculativeContacts || {});