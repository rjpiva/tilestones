import { ITile, ITiles, TILES } from '../Constants/TILES';

export class TilesPool {
    
    private _tiles;
    
    constructor() {
        this._tiles = JSON.parse(JSON.stringify(TILES));
    }
    
    get tiles() : ITiles {
        return this._tiles;
    }

    pickTile(tileName: string): ITile {
        let chosenTile: ITile;

        if (!this._tiles.hasOwnProperty(tileName)) {
            throw new Error("Invalid tile name. Provide a valid tile name instead.");
        }

        chosenTile = this._tiles[tileName];
        delete this._tiles[tileName];
        return chosenTile;
    }

}