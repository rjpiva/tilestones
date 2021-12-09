import { IScore } from "./Game";
import { Player } from "./Player";

export class Turn {
    private _activePlayer: Player;
    private _action: string;
    private _reactivePlayer: Player;
    private _score: IScore;

    constructor(activePlayer: Player, action: string, reactivePlayer: Player, score: IScore) {
        this._activePlayer = activePlayer;
        this._action = action;
        this._reactivePlayer = reactivePlayer;
        this._score = score;
    }

    get activePlayer(): Player {
        return this._activePlayer;
    }

    set activePlayer(activePlayer: Player) {
        this._activePlayer = activePlayer;
    }

    get action(): string {
        return this._action;
    }

    set action(action: string) {
        this._action = action;
    }

    get reactivePlayer(): Player {
        return this._reactivePlayer;
    }

    set reactivePlayer(reactivePlayer: Player) {
        this._reactivePlayer = reactivePlayer;
    }
    
    get score(): IScore {
        return this._score;
    }

    set score(score: IScore) {
        this._score = score;
    }
}