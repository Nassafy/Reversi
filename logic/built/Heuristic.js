"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reversi_1 = require("./reversi");
var State;
(function (State) {
    State[State["Empty"] = 0] = "Empty";
    State[State["Black"] = 1] = "Black";
    State[State["White"] = 2] = "White";
})(State || (State = {}));
var Heuristic = /** @class */ (function () {
    function Heuristic() {
        this.NO_MOVES_PENALTY = 20;
        this.CORNERS_WEIGHT = 801.724;
        this.NEAR_CORNERS_WEIGHT = 382.026;
        this.STABILITY_WEIGHT = 10;
        this.PARITY_WEIGHT = 10;
        this.MOBILITY_WEIGHT = 78.922;
        this.staticStabilityMap = [
            [20, -3, 11, 8, 8, 11, -3, 20],
            [-3, -7, -4, 1, 1, -4, -7, -3],
            [11, -4, 2, 2, 2, 2, -4, 11],
            [8, 1, 2, -3, -3, 2, 1, 8],
            [8, 1, 2, -3, -3, 2, 1, 8],
            [11, -4, 2, 2, 2, 2, -4, 11],
            [-3, -7, -4, 1, 1, -4, -7, -3],
            [20, -3, 11, 8, 8, 11, -3, 20]
        ];
    }
    Heuristic.prototype.evaluate = function (board, color) {
        return (this.parity(board, color) +
            this.mobility(board, color) +
            this.stability(board, color) +
            this.countCorners(board, color));
    };
    Heuristic.prototype.noAvailableMovesEvaluation = function (currentBoard, playerColor) {
        return this.evaluate(currentBoard, playerColor);
    };
    Heuristic.prototype.parity = function (board, color) {
        var game = new reversi_1.Reversi(board);
        var cCurr = game.get_score(color);
        var oppColor = color == State.Black ? State.White : State.Black;
        var cOpp = game.get_score(oppColor);
        var score = ((100 * (cCurr - cOpp)) / (cCurr + cOpp)) * this.PARITY_WEIGHT;
        if (cCurr > cOpp) {
            return score;
        }
        return -score;
    };
    Heuristic.prototype.mobility = function (board, color) {
        var game = new reversi_1.Reversi(board);
        var moCurr = game.get_possible_movement(color).length;
        var oppColor = color == State.Black ? State.White : State.Black;
        var moOpp = game.get_possible_movement(oppColor).length;
        if (moCurr + moOpp !== 0)
            return (((100 * (moCurr - moOpp)) / (moCurr + moOpp)) * this.MOBILITY_WEIGHT);
        else
            return 0;
    };
    Heuristic.prototype.countCorners = function (board, color) {
        var c = 0;
        var corCurr = 0;
        var corOpp = 0;
        var size = board.length - 1;
        var corners = [
            { x: 0, y: 0 },
            { x: size, y: 0 },
            { x: 0, y: size },
            { x: size, y: size }
        ];
        corners.forEach(function (corner) {
            var oppColor = color == State.Black ? State.White : State.Black;
            if (board[corner.x][corner.y] == color) {
                corCurr++;
            }
            else if (board[corner.x][corner.y] == oppColor) {
                corOpp++;
            }
        });
        var corCurr1 = 0;
        var corOpp1 = 0;
        var oppColor = color == State.Black ? State.White : State.Black;
        if (board[0][0] == '-') {
            if (board[0][1] == color) {
                corCurr1++;
            }
            else if (board[0][1] == oppColor) {
                corOpp1++;
            }
            else if (board[1][1] == color) {
                corCurr1++;
            }
            else if (board[1][1] == oppColor) {
                corOpp1++;
            }
            else if (board[1][0] == color) {
                corCurr1++;
            }
            else if (board[1][0] == oppColor) {
                corOpp1++;
            }
        }
        if (board[0][size] == '-') {
            if (board[0][size - 1] == color) {
                corCurr1++;
            }
            else if (board[0][size - 1] == oppColor) {
                corOpp1++;
            }
            else if (board[1][size - 1] == color) {
                corCurr1++;
            }
            else if (board[1][size - 1] == oppColor) {
                corOpp1++;
            }
            else if (board[1][size] == color) {
                corCurr1++;
            }
            else if (board[1][size] == oppColor) {
                corOpp1++;
            }
        }
        if (board[size][0] == '-') {
            if (board[size][1] == color) {
                corCurr1++;
            }
            else if (board[size][1] == oppColor) {
                corOpp1++;
            }
            else if (board[size - 1][1] == color) {
                corCurr1++;
            }
            else if (board[size - 1][1] == oppColor) {
                corOpp1++;
            }
            else if (board[size - 1][0] == color) {
                corCurr1++;
            }
            else if (board[size - 1][0] == oppColor) {
                corOpp1++;
            }
        }
        if (board[size][size] == '-') {
            if (board[size - 1][size] == color) {
                corCurr1++;
            }
            else if (board[size - 1][size] == oppColor) {
                corOpp1++;
            }
            else if (board[size - 1][size - 1] == color) {
                corCurr1++;
            }
            else if (board[size - 1][size - 1] == oppColor) {
                corOpp1++;
            }
            else if (board[size][size - 1] == color) {
                corCurr1++;
            }
            else if (board[size][size - 1] == oppColor) {
                corOpp1++;
            }
        }
        var l = (-12.5) * (corCurr1 - corOpp1);
        var score = 0;
        c = 25 * (corCurr - corOpp);
        if (corCurr + corOpp !== 0) {
            score = c * this.CORNERS_WEIGHT + l * this.NEAR_CORNERS_WEIGHT;
        }
        // console.log(score)
        return score;
    };
    Heuristic.prototype.stability = function (board, color) {
        var result = 0;
        var row = 0;
        var col = 0;
        for (var i = 0; i < board.length; i++) {
            {
                for (var j = 0; j < board.length; j++) {
                    {
                        if (board[i][j] != null) {
                            col = i;
                            row = j;
                            var temp = this.staticStabilityMap[i][j];
                            result += (board[i][j] === color ? 1 : -1) * temp;
                        }
                    }
                }
            }
        }
        return result * this.STABILITY_WEIGHT;
    };
    return Heuristic;
}());
exports.Heuristic = Heuristic;
// let game = new Reversi(8);
// let h = new Heuristic();
// console.log(h.evaluate(game.board, State.Black));
