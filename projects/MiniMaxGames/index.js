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
        State.prototype.createActionButton = function (action, text) {
            var _this = this;
            var button = document.createElement("button");
            button.disabled = this.getActions().indexOf(action) < 0;
            button.style.padding = "0";
            button.style.width = "100%";
            button.style.height = "100%";
            button.textContent = text;
            button.onclick = function (e) { return _this.act(action); };
            return button;
        };
        return State;
    }());
    exports.State = State;
});
define("src/game", ["require", "exports", "src/state"], function (require, exports, state_1) {
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
            this.createBoard(Player.Player1);
        }
        Game.prototype.getBoard = function () {
            return this.board;
        };
        Game.prototype.create = function (container) {
            this.getBoard().createBoard(container);
        };
        Game.prototype.getActions = function () {
            return this.getBoard().getAvailableMoves();
        };
        Game.prototype.act = function (action) {
            this.getBoard().move(action);
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
        GameBoard.prototype.isGameOver = function () {
            return this.turn === null;
        };
        GameBoard.prototype.endGame = function () {
            this.turn = null;
        };
        return GameBoard;
    }());
    exports.GameBoard = GameBoard;
});
define("src/games/tic-tac-toe", ["require", "exports", "src/game"], function (require, exports, game_1) {
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
    }(game_1.Game));
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
            var result = new GameBoardTicTacToe(this.getGame(), this.getTurn() === game_1.Player.Player1
                ? game_1.Player.Player2
                : game_1.Player.Player1);
            result.board = this.board.slice(0);
            result.board[move] = this.getTurn();
            return result;
        };
        GameBoardTicTacToe.prototype.getScore = function (forPlayer) {
            return this.getWinner() === forPlayer ? 1 : 0;
        };
        GameBoardTicTacToe.prototype.getBoardValue = function (forPlayer) {
            var winner = this.getWinner();
            if (winner === null) {
                var score_1 = 0;
                this.board.forEach(function (value) {
                    if (value !== null)
                        score_1++;
                });
            }
            return winner === forPlayer
                ? Number.POSITIVE_INFINITY
                : Number.NEGATIVE_INFINITY;
        };
        GameBoardTicTacToe.prototype.getWinner = function () {
            var b = this.board;
            for (var i = 0; i < 3; i++) {
                if ((b[i] === b[i + 1] && b[i] === b[i + 2]) ||
                    (b[i] === b[i + 3] && b[i] === b[i + 6])) {
                    if (b[i] !== null)
                        return b[i];
                }
            }
            if ((b[0] === b[4] && b[0] === b[8]) ||
                (b[2] === b[4] && b[2] === b[6])) {
                if (b[4] !== null)
                    return b[4];
            }
            return null;
        };
        GameBoardTicTacToe.prototype.createBoard = function (container) {
            var table = document.createElement("table");
            container.appendChild(table);
            table.style.width = "100%";
            table.style.height = "100%";
            for (var row = 0; row < 9; row += 3) {
                var tr = document.createElement("tr");
                table.appendChild(tr);
                for (var col = 0; col < 3; col++) {
                    var i = row + col;
                    var text = "";
                    if (this.board[i] != null) {
                        text = this.board[i] == game_1.Player.Player1 ? "X" : "O";
                    }
                    var td = document.createElement("td");
                    td.textContent = text;
                    td.style.padding = "0";
                    var button = this.getGame().createActionButton(row + col, text);
                    tr.appendChild(td).appendChild(button);
                }
            }
        };
        return GameBoardTicTacToe;
    }(game_1.GameBoard));
    exports.GameBoardTicTacToe = GameBoardTicTacToe;
});
define("src/game-manager", ["require", "exports", "src/state", "src/games/tic-tac-toe"], function (require, exports, state_2, TicTacToe) {
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
                new TicTacToe.GameTicTacToe(this.getGameManager())
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
                var text = game.getName() + " - " + game.getDesc();
                var button = this.createActionButton(actions[i], text);
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
