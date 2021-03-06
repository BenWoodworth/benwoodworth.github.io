var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("src/state", ["require", "exports"], function (require, exports) {
    "use strict";
    var State = (function () {
        function State(gameManager) {
            this.gameManager = gameManager;
        }
        State.prototype.getGameManager = function () {
            return this.gameManager;
        };
        State.prototype.createActionButton = function (action) {
            var _this = this;
            var button = document.createElement("button");
            if (action == null) {
                button.disabled = true;
            }
            else {
                button.disabled = this.getActions().indexOf(action) < 0;
                button.onclick = function (e) { return _this.act(action, true); };
            }
            return button;
        };
        return State;
    }());
    exports.State = State;
});
define("src/board-evaluator", ["require", "exports", "src/game"], function (require, exports, game_1) {
    "use strict";
    var BoardEvaluator = (function () {
        function BoardEvaluator() {
        }
        BoardEvaluator.getBestMove = function (board, depth, callback) {
            var move;
            if (depth == 0) {
                var moves = board.getAvailableMoves();
                move = moves[Math.floor(Math.random() * moves.length)];
            }
            else {
                var forPlayer = board.getTurn();
                if (depth < 0) {
                    depth = -depth;
                    var p1 = game_1.Player.Player1, p2 = game_1.Player.Player2;
                    forPlayer = forPlayer == p1 ? p2 : p1;
                }
                move = this.minimax(board, forPlayer, depth, -Infinity, Infinity, callback).move;
            }
            callback && callback(1);
            return move;
        };
        BoardEvaluator.minimax = function (board, forPlayer, depth, alpha, beta, callback) {
            if (depth == 0 || board.isGameOver()) {
                return { move: null, score: board.getBoardValue(forPlayer) };
            }
            var bestMove = { move: null, score: null };
            var turn = board.getTurn();
            var moves = board.getAvailableMoves();
            if (turn == forPlayer) {
                bestMove.score = -Infinity;
                for (var i = 0; i < moves.length; i++) {
                    callback && callback(i / moves.length);
                    var moveScore = this.minimax(board.move(moves[i]), forPlayer, depth - 1, alpha, beta, null);
                    if (bestMove.score < moveScore.score) {
                        bestMove.score = moveScore.score;
                        bestMove.move = moves[i];
                        alpha = bestMove.score;
                    }
                    if (alpha >= beta)
                        break;
                }
                ;
            }
            else {
                bestMove.score = Infinity;
                for (var i = 0; i < moves.length; i++) {
                    callback && callback(i / moves.length);
                    var moveScore = this.minimax(board.move(moves[i]), forPlayer, depth - 1, alpha, beta, null);
                    if (bestMove.score > moveScore.score) {
                        bestMove.score = moveScore.score;
                        bestMove.move = moves[i];
                        beta = bestMove.score;
                    }
                    if (alpha >= beta)
                        break;
                }
                ;
            }
            return bestMove;
        };
        return BoardEvaluator;
    }());
    exports.BoardEvaluator = BoardEvaluator;
});
define("src/game", ["require", "exports", "src/state", "src/board-evaluator"], function (require, exports, state_1, board_evaluator_1) {
    "use strict";
    (function (Player) {
        Player[Player["Player1"] = 0] = "Player1";
        Player[Player["Player2"] = 1] = "Player2";
    })(exports.Player || (exports.Player = {}));
    var Player = exports.Player;
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game(gameManager) {
            _super.call(this, gameManager);
            this.board = this.createBoard(Player.Player1);
            this.depth = 13;
            this.createBoard(Player.Player1);
        }
        Game.prototype.isPlayerHuman = function (player) {
            return player == Player.Player1;
        };
        Game.prototype.getBoard = function () {
            return this.board;
        };
        Game.prototype.create = function (container) {
            this.getBoard().createBoard(container);
        };
        Game.prototype.getActions = function () {
            return this.getBoard().getAvailableMoves();
        };
        Game.prototype.act = function (action, isFromPlayer) {
            if (this.getBoard().isGameOver()) {
                alert("You can't move after the game has ended.");
                return;
            }
            if (isFromPlayer != this.isPlayerHuman(this.board.getTurn())) {
                if (isFromPlayer) {
                    alert("Please wait for the computer to move.");
                }
                else {
                    alert("The computer tried to move for you!?");
                }
                return;
            }
            this.board = this.board.move(action);
            this.getGameManager().render();
            if (this.board.isGameOver()) {
                var winner = this.board.getWinner();
                var msg_1 = "The game has ended in a tie!";
                if (winner != null) {
                    msg_1 = "Player " + (winner == Player.Player1 ? 1 : 2) + " is the winner!";
                }
                setTimeout(function () { return alert(msg_1); }, 1);
            }
            else if (!this.isPlayerHuman(this.board.getTurn())) {
                this.cpuMove();
            }
        };
        Game.prototype.cpuMove = function () {
            var _this = this;
            setTimeout(function () {
                _this.act(board_evaluator_1.BoardEvaluator.getBestMove(_this.board, _this.depth, _this.cpuProgress), false);
            }, 1);
        };
        Game.prototype.cpuProgress = function (progress) {
            document.title = "CPU Progress: " + Math.floor(progress * 100) + "%";
        };
        return Game;
    }(state_1.State));
    exports.Game = Game;
    var GameBoard = (function () {
        function GameBoard(game, turn) {
            this.game = game;
            this.turn = turn;
        }
        GameBoard.prototype.getGame = function () {
            return this.game;
        };
        GameBoard.prototype.getTurn = function () {
            return this.turn;
        };
        GameBoard.prototype.setTurn = function (player) {
            this.turn = player;
        };
        GameBoard.prototype.isTie = function () {
            return this.isGameOver() && this.getWinner() == null;
        };
        return GameBoard;
    }());
    exports.GameBoard = GameBoard;
});
define("src/games/tic-tac-toe", ["require", "exports", "src/game"], function (require, exports, game_2) {
    "use strict";
    var GameTicTacToe = (function (_super) {
        __extends(GameTicTacToe, _super);
        function GameTicTacToe() {
            _super.apply(this, arguments);
        }
        GameTicTacToe.prototype.createBoard = function (firstMove) {
            return new GameBoardTicTacToe(this, firstMove);
        };
        GameTicTacToe.prototype.getName = function () {
            return "Tic-Tac-Toe";
        };
        GameTicTacToe.prototype.getDesc = function () {
            return "The classic game of X's and O's";
        };
        return GameTicTacToe;
    }(game_2.Game));
    exports.GameTicTacToe = GameTicTacToe;
    var GameBoardTicTacToe = (function (_super) {
        __extends(GameBoardTicTacToe, _super);
        function GameBoardTicTacToe() {
            _super.apply(this, arguments);
            this.board = [];
        }
        GameBoardTicTacToe.prototype.getAvailableMoves = function () {
            var moves = [];
            for (var i = 0; i < 9; i++) {
                if (this.board[i] == null)
                    moves.push(i);
            }
            return moves;
        };
        GameBoardTicTacToe.prototype.move = function (move) {
            if (this.board[move] != null || this.isGameOver())
                return null;
            var result = new GameBoardTicTacToe(this.getGame(), this.getTurn() === game_2.Player.Player1
                ? game_2.Player.Player2
                : game_2.Player.Player1);
            result.board = this.board.slice(0);
            result.board[move] = this.getTurn();
            return result;
        };
        GameBoardTicTacToe.prototype.getBoardValue = function (forPlayer) {
            var gameOver = this.isGameOver();
            var winner = this.getWinner();
            var score = 0;
            this.board.forEach(function (value) {
                if (value != null)
                    score++;
            });
            if (gameOver && !this.isTie()) {
                score += winner == forPlayer ? 20 : -20;
            }
            return score;
        };
        GameBoardTicTacToe.prototype.isGameOver = function () {
            if (this.getWinner() != null)
                return true;
            for (var i = 0; i < 9; i++) {
                if (this.board[i] == null)
                    return false;
            }
            return true;
        };
        GameBoardTicTacToe.prototype.getWinner = function () {
            var b = this.board;
            for (var i = 0; i < 3; i++) {
                var r = i * 3;
                if ((b[r] == b[r + 1] && b[r] == b[r + 2]) ||
                    (b[i] == b[i + 3] && b[i] == b[i + 6])) {
                    var sp = 4 * i;
                    if (b[sp] != null)
                        return b[sp];
                }
            }
            if ((b[0] == b[4] && b[0] == b[8]) ||
                (b[2] == b[4] && b[2] == b[6])) {
                if (b[4] != null)
                    return b[4];
            }
            return null;
        };
        GameBoardTicTacToe.prototype.createBoard = function (container) {
            var board = document.createElement("div");
            board.style.position = "relative";
            board.style.width = "100%";
            board.style.height = "100%";
            container.appendChild(board);
            var bDivs = [];
            for (var i = 0; i < 9; i++) {
                bDivs[i] = document.createElement("div");
                bDivs[i].style.position = "absolute";
                bDivs[i].style.padding = "1px";
                bDivs[i].style.boxSizing = "border-box";
                var button = this.getGame().createActionButton(i);
                button.style.width = button.style.height = "100%";
                button.style.fontSize = "1in";
                if (this.board[i] != null) {
                    button.textContent = this.board[i] == game_2.Player.Player1 ? "X" : "O";
                }
                board.appendChild(bDivs[i]).appendChild(button);
            }
            var third = "33%";
            for (var i = 0; i < 3; i++) {
                bDivs[i].style.top = "0";
                bDivs[i].style.height = third;
                bDivs[i * 3].style.left = "0";
                bDivs[i * 3].style.width = third;
                bDivs[i + 3].style.top = third;
                bDivs[i + 3].style.bottom = third;
                bDivs[i * 3 + 1].style.left = third;
                bDivs[i * 3 + 1].style.right = third;
                bDivs[i + 6].style.bottom = "0";
                bDivs[i + 6].style.height = third;
                bDivs[i * 3 + 2].style.right = "0";
                bDivs[i * 3 + 2].style.width = third;
            }
        };
        return GameBoardTicTacToe;
    }(game_2.GameBoard));
    exports.GameBoardTicTacToe = GameBoardTicTacToe;
});
define("src/games/mancala", ["require", "exports", "src/game"], function (require, exports, game_3) {
    "use strict";
    var GameMancala = (function (_super) {
        __extends(GameMancala, _super);
        function GameMancala() {
            _super.apply(this, arguments);
        }
        GameMancala.prototype.createBoard = function (firstMove) {
            return new GameBoardMancala(this, firstMove);
        };
        GameMancala.prototype.getName = function () {
            return "Mancala";
        };
        GameMancala.prototype.getDesc = function () {
            return "The Kalah variant of Mancala.";
        };
        return GameMancala;
    }(game_3.Game));
    exports.GameMancala = GameMancala;
    var GameBoardMancala = (function (_super) {
        __extends(GameBoardMancala, _super);
        function GameBoardMancala(game, turn) {
            _super.call(this, game, turn);
            this.board = [];
            this.board[6] = this.board[13] = 0;
            for (var i = 0; i < 6; i++) {
                this.board[i] = this.board[i + 7] = 4;
            }
        }
        GameBoardMancala.prototype.getAvailableMoves = function () {
            var moves = [];
            var turnOffset = this.getTurn() == game_3.Player.Player1 ? 0 : 7;
            for (var i = turnOffset; i < turnOffset + 6; i++) {
                if (this.board[i] != 0)
                    moves.push(i);
            }
            return moves;
        };
        GameBoardMancala.prototype.move = function (move) {
            var newBoard = this.board.slice();
            var newTurn = this.getTurn();
            var skipSpace = this.getTurn() == game_3.Player.Player1 ? 13 : 6;
            var stones = newBoard[move];
            newBoard[move] = 0;
            var curSpace = move;
            while (stones > 0) {
                curSpace = (curSpace + 1) % 14;
                if (curSpace == skipSpace)
                    continue;
                newBoard[curSpace]++;
                stones--;
            }
            var sideStart = this.getTurn() == game_3.Player.Player1 ? 0 : 7;
            if (curSpace >= sideStart && curSpace <= sideStart + 5) {
                var oppositeSpace = 12 - curSpace;
                if (newBoard[curSpace] == 1 && newBoard[oppositeSpace] != 0) {
                    newBoard[sideStart + 6] += newBoard[oppositeSpace] + 1;
                    newBoard[oppositeSpace] = 0;
                    newBoard[curSpace] = 0;
                }
            }
            if (curSpace != sideStart + 6) {
                newTurn = this.getTurn() == game_3.Player.Player1 ? game_3.Player.Player2 : game_3.Player.Player1;
            }
            var hasPieces1 = false, hasPieces2 = false;
            for (var i = 0; i < 6; i++) {
                hasPieces1 = hasPieces1 || newBoard[i] != 0;
                hasPieces2 = hasPieces2 || newBoard[i + 7] != 0;
            }
            if (!hasPieces1 || !hasPieces2) {
                var nonEmptySideStart = hasPieces1 ? 0 : 7;
                var kalah = (nonEmptySideStart + 13) % 14;
                for (var i = nonEmptySideStart; i < nonEmptySideStart + 6; i++) {
                    newBoard[kalah] += newBoard[i];
                    newBoard[i] = 0;
                }
                newTurn = null;
            }
            var result = new GameBoardMancala(this.getGame(), newTurn);
            result.board = newBoard;
            return result;
        };
        GameBoardMancala.prototype.getBoardValue = function (forPlayer) {
            var score = this.board[6] - this.board[13];
            if (this.isGameOver() && this.getWinner() != null) {
                var winner = this.getWinner();
                if (winner == game_3.Player.Player1) {
                    score += 100;
                }
                else if (winner != forPlayer) {
                    score -= 100;
                }
            }
            if (forPlayer == game_3.Player.Player2) {
                score *= -1;
            }
            return score;
        };
        GameBoardMancala.prototype.isGameOver = function () {
            return this.getTurn() == null;
        };
        GameBoardMancala.prototype.getWinner = function () {
            var p1 = this.board[6];
            var p2 = this.board[13];
            if (p1 > p2) {
                return game_3.Player.Player1;
            }
            else if (p1 < p2) {
                return game_3.Player.Player2;
            }
            return null;
        };
        GameBoardMancala.prototype.createBoard = function (container) {
            var board = document.createElement("div");
            board.style.width = "100%";
            board.style.height = "0";
            board.style.paddingBottom = "25%";
            board.style.position = "relative";
            var bDivs = [];
            for (var i = 0; i < 14; i++) {
                bDivs[i] = document.createElement("div");
                bDivs[i].style.position = "absolute";
                bDivs[i].style.width = "12.5%";
                bDivs[i].style.height = (i % 7 == 6) ? "100%" : "50%";
                bDivs[i].style.padding = "1px";
                bDivs[i].style.boxSizing = "border-box";
            }
            bDivs[13].style.left = "0";
            bDivs[0].style.left = bDivs[12].style.left = "12.5%";
            bDivs[1].style.left = bDivs[11].style.left = "25%";
            bDivs[2].style.left = bDivs[10].style.left = "37.5%";
            bDivs[3].style.right = bDivs[9].style.right = "37.5%";
            bDivs[4].style.right = bDivs[8].style.right = "25%";
            bDivs[5].style.right = bDivs[7].style.right = "12.5%";
            bDivs[6].style.right = "0";
            for (var i = 0; i < 6; i++) {
                bDivs[i].style.bottom = "0";
                bDivs[i + 7].style.top = "0";
            }
            for (var i = 0; i < 14; i++) {
                var button = this.getGame().createActionButton(i);
                button.style.width = button.style.height = "100%";
                var amount = this.board[i];
                button.innerText = amount == 0 ? "" : amount.toString();
                board.appendChild(bDivs[i]).appendChild(button);
            }
            container.appendChild(board);
        };
        return GameBoardMancala;
    }(game_3.GameBoard));
    exports.GameBoardMancala = GameBoardMancala;
});
define("src/game-manager", ["require", "exports", "src/state", "src/games/tic-tac-toe", "src/games/mancala"], function (require, exports, state_2, TicTacToe, Mancala) {
    "use strict";
    var GameManager = (function () {
        function GameManager(container) {
            this.container = container;
            this.menu = new MenuState(this);
            this.state = this.menu;
        }
        GameManager.prototype.getContainer = function () {
            return this.container;
        };
        GameManager.prototype.loadMenu = function () {
            this.setState(this.menu);
        };
        GameManager.prototype.setState = function (state) {
            this.state = state;
            this.render();
        };
        GameManager.prototype.getState = function () {
            return this.state;
        };
        GameManager.prototype.render = function () {
            this.container.innerHTML = null;
            this.state.create(this.container);
        };
        return GameManager;
    }());
    exports.GameManager = GameManager;
    var MenuState = (function (_super) {
        __extends(MenuState, _super);
        function MenuState() {
            _super.apply(this, arguments);
            this.games = [
                new TicTacToe.GameTicTacToe(this.getGameManager()),
                new Mancala.GameMancala(this.getGameManager())
            ];
        }
        MenuState.prototype.getActions = function () {
            var result = [];
            this.games.forEach(function (g) { return result.push(result.length); });
            return result;
        };
        MenuState.prototype.act = function (action) {
            var game = this.games[action];
            this.getGameManager().setState(game);
        };
        MenuState.prototype.create = function (container) {
            var table = document.createElement("table");
            table.style.width = "100%";
            container.appendChild(table);
            var headRow = document.createElement("tr");
            var header = document.createElement("th");
            header.innerText = "Select a game";
            table.appendChild(headRow).appendChild(header);
            var actions = this.getActions();
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var i = actions_1[_i];
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                tr.style.height = "30pt";
                table.appendChild(tr).appendChild(td);
                var game = this.games[actions[i]];
                var button = this.createActionButton(actions[i]);
                button.textContent = game.getName() + " - " + game.getDesc();
                button.style.width = button.style.height = "100%";
                td.appendChild(button);
            }
        };
        return MenuState;
    }(state_2.State));
});
define("index", ["require", "exports", "src/game-manager"], function (require, exports, game_manager_1) {
    "use strict";
    var container = document.getElementById("content");
    var manager = new game_manager_1.GameManager(container);
    manager.render();
});
