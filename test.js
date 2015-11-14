var gol = require('./gol.js'),
    http = require('http');

(function BoardGetSet() {
    var board = new gol.Board();
    board.set(0, 0, true);

    var value = board.get(0, 0);
    if (!value) {
        throw new Exception();
    }
}());

(function testNext() {
    var board = new gol.Board();
    board.set(1,2, true);
    board.set(2,2, true);
    board.set(1,0, true);

    var game = new gol.Game(board);

    game.next();

    var value11 = board.get(1,1);
    if (value11) {
        throw new Exception();
    }
}());

(function testNext() {
    var board = new gol.Board();
    board.set(1,2, true);
    board.set(2,2, true);
    board.set(1,0, true);
    board.set(1,1, true);

    var game = new gol.Game(board);

    game.next();

    var value11 = game.board.get(1,1);
    if (!value11) {
        throw new Exception();
    }
}());

function requestMock(callback) {
    var _data;

    return {
        write: function (data) {
            _data = data;
        },
        end: function () {
            callback(_data);
        }
    };
}

var httpMock = {
    callback: null,
    request: function (options, callback) {
        return requestMock(callback);
    }
};
//
//(function testPublish() {
//    var board = new gol.Board();
//    board.set(0,1, true);
//    board.set(1,0, true);
//    board.set(2,1, true);
//    board.set(1,2, true);
//
//    var publisher = new gol.Publisher(httpMock);
//    publisher.publish(board);
//}());

(function testPublish() {
    var init = function () {
        var board = new gol.Board();

        for (var i = 0; i < 50; i++) {
            for (var j = 0; j < 50; j++) {
                if (Math.random() > 0.5) {
                    board.set(i, j, true);
                }
            }
        }

        return board;
    };

    var board = init();

    //board.set(45, 20, true);
    //board.set(46, 20, true);
    //board.set(47, 20, true);
    //board.set(47, 19, true);
    //board.set(46, 18, true);

    //board.set(0,1, true);
    //board.set(1,0, true);
    //board.set(2,1, true);
    //board.set(1,2, true);

    var game = new gol.Game(board);
    var publisher = new gol.Publisher(http);
    var i = 0;

    var next = function () {
        i++;

        if (i === 500) {
            i = 0;
            game.board = init();
        }
        publisher.publish(game.board);
        game.next();

        console.log(i);
        setTimeout(next, 100);
    };
    setTimeout(next, 100);
}());