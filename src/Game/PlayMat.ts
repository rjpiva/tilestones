import { ITile } from '../Constants/TILES';

export class PlayMat {

    private _spots: ITile[];

    constructor() {
        this._spots = Array(7).fill(null);
    }

    get spots(): ITile[] {
        return this._spots
    }

    addTile(tile: ITile, spotPosition: number): void {

        if (!this._isTile(tile)) {
            throw new Error('Argument is not a tile. Provide a tile instead.')
        };

        if (typeof spotPosition != "number") {
            throw new Error('Invalid spotPosition. Provide a valid index instead.')
        };

        if (spotPosition < 0 || spotPosition >= this._spots.length) {
            throw new Error('Out of bounds index. Provide a valid index instead.')
        };

        if (this._spots[spotPosition]) {
            throw new Error('Spot is already in use. Choose an empty spot instead.')
        };

        this._spots[spotPosition] = tile;
    }

    hideTile(spotPosition: number): void {

        if (typeof spotPosition != "number") {
            throw new Error('Invalid spotPosition. Provide a valid index instead.');
        };

        if (spotPosition < 0 || spotPosition >= this._spots.length) {
            throw new Error('Out of bounds index. Provide a valid index instead.');
        };

        if (!this._isTile(this._spots[spotPosition])) {
            throw new Error('Cannot hide tile because spot is empty.')
        };

        if (this._spots[spotPosition].hidden) {
            throw new Error('Cannot hide tile because it is already hidden.')
        };

        this._spots[spotPosition].hidden = true;
    }

    swapTiles(spotPosition1: number, spotPosition2: number): void {
        let helper: ITile;

        if (typeof spotPosition1 != "number" || typeof spotPosition2 != "number") {
            throw new Error('Invalid spotPosition. Provide a valid index instead.');
        };

        if (spotPosition1 < 0 || spotPosition1 >= this._spots.length ||
            spotPosition2 < 0 || spotPosition2 >= this._spots.length) {
            throw new Error('Out of bounds index. Provide a valid index instead.');
        };

        if (!this._isTile(this._spots[spotPosition1]) || !this._isTile(this._spots[spotPosition2])) {
            throw new Error('Cannot swap tiles because at least one of the provided spots is empty.')
        };

        helper = this._spots[spotPosition1];
        this._spots[spotPosition1] = this._spots[spotPosition2];
        this._spots[spotPosition2] = helper;
    }


    //Helpers
    _isTile(tile: ITile | null): tile is ITile {
        if (tile == null) {
            return false;
        }
        return (tile as ITile).name != undefined
    }

}
