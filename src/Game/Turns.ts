import { Player } from "./Player";
import { Turn } from "./Turn";

export class Turns {
    
    private _turns: Turn[];
    
    constructor() {
        this._turns = [];
    }

    get turns(): Turn[] {
        return this._turns;
    }

    oponentHasScoredInTheLastTwoTurns(reactivePlayer: Player): boolean {
        let lastThreeTurns = this._turns.slice(this._turns.length - 3, this._turns.length);
        
        //The 3rd turn is ongoing, so no one has scored so far.
        if (lastThreeTurns.length < 3)
            return false;

        let lastReactivePlayerScores = lastThreeTurns.map(
            (turn) =>
                turn.activePlayer.name == reactivePlayer.name ?
                    turn.activePlayer.score : turn.reactivePlayer.score
        );

        if (lastReactivePlayerScores[2] != lastReactivePlayerScores[1] ||
            lastReactivePlayerScores[1] != lastReactivePlayerScores[0])
            return true
        else
            return false
    }

    log(turn: Turn): void {
        let activePlayerCopy        = new Player(turn.activePlayer.name);
        activePlayerCopy.score      = turn.activePlayer.score;
        let actionCopy              = turn.action;
        let reactivePlayerCopy      = new Player(turn.reactivePlayer.name);
        reactivePlayerCopy.score    = turn.reactivePlayer.score;
        let scoreCopy               = JSON.parse(JSON.stringify(turn.score));
        let turnCopy                = new Turn(activePlayerCopy, actionCopy, reactivePlayerCopy, scoreCopy);
        
        this._turns.push(turnCopy);
    }

}