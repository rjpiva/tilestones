import { TilesPool } from '../src/Game/TilesPool'
import { ITile } from '../src/Constants/TILES'


describe(TilesPool.name, () => {
    let tilesPool: TilesPool;
    let tilesPoolTilesGetter: string = (Object.getOwnPropertyDescriptors(TilesPool.prototype).tiles.get as any).name;

    beforeEach(() => {
        tilesPool = new TilesPool();
    });

    it(`#${tilesPoolTilesGetter} Should return the tiles that are in the tiles pool`, () => {
        const tiles = tilesPool.tiles;
        
        for(let tile in tiles){
            expect(isTile(tiles[tile])).withContext(`{Failed for ${tile}}`).toBeTrue();
        };

    });

    it(`#${TilesPool.prototype.pickTile.name} Should return the requested tile`, () => {
        const swordTile: ITile = tilesPool.pickTile("sword");

        expect(swordTile.name).toBe("sword");
    });

    it(`#${TilesPool.prototype.pickTile.name} Should throw an error when the tile isn't in tiles the pool`, () => {
        const swordTile: ITile = tilesPool.pickTile("sword");

        expect(() => tilesPool.pickTile("sword")).toThrow();
        expect(() => tilesPool.pickTile("")).toThrow();
    });

});

//consider refactoring this data structure into an array of objects or adding a property for logical deletion

//Helpers
function isTile(tile: ITile | null): tile is ITile {
    if(tile == null){
        return false
    };
    return (tile as ITile).name != undefined
}