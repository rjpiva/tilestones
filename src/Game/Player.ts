import { EventEmitter } from 'events';

export class Player {
    private _name: string;
    private _score: number;
    private _events: EventEmitter;

    constructor(name: string) {
        this._name = name;
        this._score = 1;
        this._events = new EventEmitter();
    }

    get name(): string {
        return this._name;
    }

    get score(): number {
        return this._score;
    }

    set score(newScore: number) {
        this._score = newScore;
        if (this._hasScoredThreePoints())
            this.events.emit("win");
    }

    get events(): EventEmitter {
        return this._events;
    }

    _hasScoredThreePoints(): boolean {
        if(this.score == 3)
            return true
        return false
    }
}