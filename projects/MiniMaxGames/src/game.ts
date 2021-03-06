﻿import {State} from "./state";
import {GameManager} from "./game-manager";
import {BoardEvaluator} from "./board-evaluator"

/**
 * A player that will play a game.
 */
export enum Player {
    Player1,
    Player2
}

/**
 * A game that provides access to a new game board.
 */
export abstract class Game extends State {
    private board = this.createBoard(Player.Player1);
    private depth = 13;

    constructor(gameManager: GameManager) {
        super(gameManager);
        this.createBoard(Player.Player1);
    }

    public isPlayerHuman(player: Player) {
        return player == Player.Player1;
    }

    /**
     * Create a new board with the specified player
     * having the first move.
     */
    protected abstract createBoard(firstMove: Player): GameBoard;

    /**
     * Get the current game board.
     */
    protected getBoard(): GameBoard {
        return this.board;
    }

    public create(container: HTMLElement) {
        this.getBoard().createBoard(container);
    }

    public getActions() {
        return this.getBoard().getAvailableMoves();
    }

    public act(action: number, isFromPlayer: boolean) {
        if (this.getBoard().isGameOver()) {
            alert("You can't move after the game has ended.");
            return;
        }
        
        if (isFromPlayer != this.isPlayerHuman(this.board.getTurn())) {
            if (isFromPlayer) {
                alert("Please wait for the computer to move.");
            } else {
                alert("The computer tried to move for you!?");
            }
            return;
        }

        this.board = this.board.move(action);
        this.getGameManager().render();

        if (this.board.isGameOver()) {
            let winner = this.board.getWinner();
            let msg = "The game has ended in a tie!";
            if (winner != null) {
                msg = `Player ${winner == Player.Player1 ? 1 : 2} is the winner!`;
            }
            setTimeout(() => alert(msg), 1);
        } else if (!this.isPlayerHuman(this.board.getTurn())) {
            this.cpuMove(); // Tell the CPU to move on its turn
        }
    }

    /**
     * Let the CPU calculate the next move.
     */
    private cpuMove() {
        setTimeout(() => {
            this.act(BoardEvaluator.getBestMove(this.board, this.depth, this.cpuProgress), false);
        }, 1);
    }

    private cpuProgress(progress: number) {
        document.title = `CPU Progress: ${Math.round(progress * 100)}%`;
    }

    /**
     * Get the name of this game.
     */
    abstract getName(): string;

    /**
     * Get a description of this game.
     */
    abstract getDesc(): string;
}

/**
 * A board that a game can be played on.
 */
export abstract class GameBoard {

    /**
     * Create a new instance of the GameBoard.
     * @param turn The first player to move.
     */
    constructor(private game: Game, private turn: Player) {}

    /**
     * Get the game this GameBoard is for
     */
    protected getGame(): Game {
        return this.game;
    }

    /**
     * Get whose turn it is, or null if the game has ended.
     */
    public getTurn(): Player {
        return this.turn;
    }

    /**
     * Set whole turn it is.
     * @param player The player whose turn it will be, or null to end the game.
     */
    private setTurn(player: Player): void {
        this.turn = player;
    }

    /**
     * Get the winning player, or null.
     */
    public abstract getWinner(): Player;

    /**
     * See if the game has ended..
     */
    public abstract isGameOver(): boolean;

    /**
     * See if the game has ended without a winner.
     */
    public isTie(): boolean {
        return this.isGameOver() && this.getWinner() == null;
    }

    /**
     * Get a list of available moves for the current player.
     */
    abstract getAvailableMoves(): number[];

    /**
     * Move as the current player on a copy of the current game board.
     * @param move The move the current player wants to make.
     */
    abstract move(move: number): GameBoard;

    /**
     * Get a rating of the current board for a player.
     * Used for MiniMax to determine how good the player's position is.
     * @param forPlayer The player whose board position should be rated.
     */
    abstract getBoardValue(forPlayer: Player): number;

    /**
     * Create a board within the provided container
     */
    abstract createBoard(container: HTMLElement): void;
}
