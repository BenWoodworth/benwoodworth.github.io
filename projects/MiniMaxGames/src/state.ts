import {GameManager} from "./game-manager";

export abstract class State {

    constructor(private gameManager: GameManager) { }

    /**
     * Get this state's GameManager
     */
    public getGameManager() {
        return this.gameManager;
    }

    /**
     * Get a list of available actions.
     */
    public abstract getActions(): number[];

    /**
     * Execute a numbered action.
     * @param action The action number.
     * @param isFromUser True if a user sent this action.
     */
    public abstract act(action: number, isFromUser: boolean): void;

    /**
     * Create this GameState within the provided container.
     */
    public abstract create(container: HTMLElement): void;

    /**
     * Create a button that will execute an action when clicked.
     * The button fills its container's width and height.
     */
    public createActionButton(action: number) {
        var button = document.createElement("button");
        if (action == null) {
            button.disabled = true;
        } else {
            button.disabled = this.getActions().indexOf(action) < 0;
            button.onclick = e => this.act(action, true);
        }
        return button;
    }
}
