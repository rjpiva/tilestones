import { PlayMat } from './PlayMat';
import { Player } from './Player';
import { TilesPool } from './TilesPool';
import { Turn } from './Turn';
import { Turns } from './Turns';
import { EventEmitter } from 'events';
import { ITile } from '../Constants/TILES';


export class Game {

    private _tilesPool: TilesPool;
    private _playMat: PlayMat;
    private _player1: Player;
    private _player2: Player;
    private _score: IScore;
    private _turn: Turn;
    private _turns: Turns;
    private _events: EventEmitter;
    private _winner: null|Player;

    constructor(player1: string, player2: string){
        this._tilesPool = new TilesPool();  
        this._playMat = new PlayMat();
        this._player1 = new Player("Player1"); 
        this._player2 = new Player("Player2");
        this._score = {"player1": this._player1.score, "player2": this._player2.score};
        this._turn = new Turn(this._player1, "First Place", this._player2, this._score);
        this._turns = new Turns();
        this._events = new EventEmitter();
        this._winner = null;

        //Define event listeners to set the winner when that takes place.
        this._player1.events.on('win', () => this._winner = this._player1);
        this._player2.events.on('win', () => this._winner = this._player2);
    }

    get tilesPool(): TilesPool {
        return this._tilesPool;
    }

    get playMat(): PlayMat {
        return this._playMat;
    }

    get score(): IScore {
        this._updateScore();
        return this._score;
    }

    get turns(): Turns {
        return this._turns;
    }

    get currentTurn(): Turn {
        return this._turn;
    }

    get events(): EventEmitter {
        return this._events;
    }

    /***************************/
    /**   GAME FLOW METHODS   **/
    /***************************/
    _endTurn(): void {
        this._updateScore();
        this._turns.log(this._turn);
        this._nextTurn();
    }

    _updateScore(): void {
        this._score.player1 = this._player1.score; 
        this._score.player2 = this._player2.score;
    }

    _nextTurn(): void {
        //Check if there is a winner. End the game, if so.
        if (this._winner)
            this._gameOver(this._winner.name)

        //update players' roles
        let formerActivePlayer = this._turn.activePlayer;
        this._turn.activePlayer = this._turn.reactivePlayer;
        this._turn.reactivePlayer = formerActivePlayer;

        //reset action
        this._turn.action = "";
    }

    /**************************/
    /**    EVENT TRIGGERS    **/
    /**************************/
    _gameOver(winnerName: string) {
        this.events.emit('game-over', [winnerName]);
    }

    /******************************/
    /**   GAME ACTIONS METHODS   **/
    /******************************/
    place(tileName: string, spotPosition: number): void{
        let chosenTile = this._tilesPool.pickTile(tileName); 
        this._playMat.addTile(chosenTile, spotPosition);

        this._turn.action = "place";
        this._endTurn();
    }

    hide(spotPosition: number): void {
        this._playMat.hideTile(spotPosition);

        this._turn.action = "hide";
        this._endTurn();
    }

    swap(spotPosition1: number, spotPosition2: number): void {
        this._playMat.swapTiles(spotPosition1, spotPosition2);

        this._turn.action = "swap";
        this._endTurn();
    }

    challenge(spotPosition: number, tileName: string, endTurn: boolean): boolean {
        let isChallengeCorrect: boolean = false;

        if (endTurn) {
            this._turn.action = "challenge"
            this._endTurn();
            return false;
        }

        //displays the tile that has been challenged
        this._playMat.spots[spotPosition].hidden = false;

        isChallengeCorrect = this._playMat.spots[spotPosition].name == tileName ? true : false;

        if (isChallengeCorrect)
            this._turn.reactivePlayer.score++;
        else
            this._turn.activePlayer.score++;

        return isChallengeCorrect;
    }

    peek(spotPosition: number, peekNTimes: number): ITile {
        if (peekNTimes == 1) {
            this._turn.action = "peek";
            this._endTurn();
        }

        return this._playMat.spots[spotPosition];
    }

    boast(action: string, proveItResult?: boolean): void {

        switch (action) {
            case 'believe':
                //other player believes
                //call player scores one point
                this._turn.activePlayer.score++;
                this._turn.action = "boast_believe";
                this._endTurn();

                break;

            case 'prove':
                //other player wants you to prove it
                //tell which tile is each one
                //if you got it right: active player wins the game
                //else, reactive player wins the game
                if (proveItResult)
                    this._turn.activePlayer.score = 3;
                else
                    this._turn.reactivePlayer.score = 3;

                this._turn.action = "boast_prove"
                this._endTurn();

                break;

            case 'steal-believe':
                //reactive player stole the boast and active player believed
                this._turn.reactivePlayer.score++;
                this._turn.action = "boast_steal_believe";
                this._endTurn();

                break;

            case 'steal-prove':
                //reactive player stole the boast and active player wants they to prove it
                if (proveItResult)
                    this._turn.reactivePlayer.score = 3;
                else
                    this._turn.activePlayer.score = 3;

                this._turn.action = "boast_steal_prove";
                this._endTurn();

                break;
        };
    }

}

export interface IScore {
    [key: string]: number
}