var http = require('http');

function Board() {
    this.board = {};

    this.set = function (x, y, state) {
        this.board[x + ';' + y] = state;
    };

    this.get = function (x, y) {
        return !!this.board[x + ';' + y];
    };

    this.dim = function () {
        var i, coords, x, y,
            minX = 0, maxX = 0, minY = 0, maxY = 0;

        for (i in this.board) {
            if (this.board.hasOwnProperty(i)) {
                coords = i.split(';');

                x = parseInt(coords[0], 10);
                y = parseInt(coords[1], 10);


                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
        return [minX - 1, maxY + 1, maxX + 1, minY - 1];
    };
}


function getCountAliveNeighboors(board, x, y) {
    var aliveNeighboors = 0;
    for (var c = -1; c <= 1; c++) {
        for (var r = -1; r <= 1; r++) {
            var stateNeighboor = board.get(x + c, y + r);
            if (stateNeighboor) {
                aliveNeighboors++;
            }
        }
    }

    if (board.get(x, y)) {
        aliveNeighboors--;
    }

    return aliveNeighboors;
}

function updateState(newBoard, board, x, y) {
    var currentState = board.get(x, y);
    var countAliveNeighboors = getCountAliveNeighboors(board, x, y);

    if (countAliveNeighboors == 2 && currentState) {
        newBoard.set(x, y, true);
    } else if (countAliveNeighboors == 3) {
        newBoard.set(x, y, true);
    }
}

function Game(board) {
    this.board = board;

    this.next = function () {
        var x, y,
            dim = this.board.dim();

        var newBoard = new Board();

        // TODO: only run over living cells and collect
	// their dead neighbors and restrict further updates to those
        for (x = dim[0]; x <= dim[2]; x++) {
            for (y = dim[3]; y <= dim[1]; y++) {
                updateState(newBoard, this.board, x, y);
            }
        }

        this.board = newBoard;
    };
}

function Publisher(http) {
    this.http = http;

    this.publish = function (board) {
        var result = Object.keys(board.board)
            .map(function (v) { return v.split(';')
                .map(function (v) { return parseInt(v, 10); })});


        var data = JSON.stringify({
            living: result
        });

        var req = this.http.request({
            method: "PUT",
            host: "10.10.101.28",
            port: "10555",
            path: "/board"
        }, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
            res.on('end', function() {
                console.log('No more data in response.')
            })
        });
        console.log(data);
        req.write(data);
        req.end();
    };
}

module.exports = {
    Board: Board,
    Game: Game,
    Publisher: Publisher
};
