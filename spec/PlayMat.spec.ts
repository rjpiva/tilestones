import { PlayMat } from '../src/Game/PlayMat';
import { TilesPool } from '../src/Game/TilesPool';

describe(`${PlayMat.name}`, () => {

    let playMat: PlayMat;
    let tilesPool: TilesPool;

    beforeEach(() => {
        playMat = new PlayMat();
        tilesPool = new TilesPool();
    });

    it(`#${PlayMat.prototype.addTile.name} Should add the provided tile to the playmat`, () => {
        const swordTile = tilesPool.pickTile("sword");

        playMat.addTile(swordTile, 0);
        expect(playMat.spots[0]).toBe(swordTile);
    });
 
    it(`#${PlayMat.prototype.addTile.name} Should throw an error when the spot is already occupied by another tile`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const crownTile = tilesPool.pickTile("crown");
        
        playMat.addTile(swordTile, 0);
        expect(() => playMat.addTile(crownTile, 0)).toThrow();
    });

    it(`#${PlayMat.prototype.addTile.name} Should throw an error when a tile is not provided`, () => {
        const notTiles: any[] = [null, undefined, false, 0, 'string', true];
        notTiles.forEach((notTile) => {
            expect(() => playMat.addTile(notTile, 0)).withContext(`Failed for ${notTile}`).toThrow();

        });
    });

    it(`#${PlayMat.prototype.addTile.name} Should throw an error when spotPosition is not a number`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const notNumberIndexes: any[] = ["a", null, undefined, false];
       
        notNumberIndexes.forEach((nnIndex) => {
            expect(() => playMat.addTile(swordTile, nnIndex)).withContext(`Failed for ${nnIndex}`).toThrow();
        });
        
    });

    it(`#${PlayMat.prototype.addTile.name} Should throw an error when spotPosition is out of bounds. Default acceptable is [0,6]`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const outOfBoundsIndexes: number[] = [-1, playMat.spots.length]
       
        outOfBoundsIndexes.forEach((oobIndex) => {
            expect(() => playMat.addTile(swordTile, oobIndex)).withContext(`Failed for ${oobIndex}`).toThrow();
        });
        
    });

    it(`#${PlayMat.prototype.hideTile.name} Should set the 'hidden' property of the tile to true`, () => {
        const swordTile = tilesPool.pickTile("sword");
        
        playMat.addTile(swordTile, 0);
        
        expect(playMat.spots[0].hidden).toBeFalse();
        playMat.hideTile(0);
        expect(playMat.spots[0].hidden).toBeTrue();
    });

    it(`#${PlayMat.prototype.hideTile.name} Should throw an error when spotPosition is not a number`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const notNumberIndexes: any[] = ["string", null, undefined, false];
        
        playMat.addTile(swordTile, 0);
        notNumberIndexes.forEach((nnIndex) => {
            expect(() => playMat.hideTile(nnIndex)).withContext(`Failed for ${nnIndex}`).toThrow();
        });
    });

    it(`#${PlayMat.prototype.hideTile.name} Should throw an error when spotPosition is out of bounds. Default acceptable is [0,6]`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const outOfBoundsIndexes: number[] = [-1, playMat.spots.length];
        
        playMat.addTile(swordTile, 0);
        outOfBoundsIndexes.forEach((oobIndex) => {
            expect(() => playMat.hideTile(oobIndex)).withContext(`Failed for ${oobIndex}`).toThrow();
        });
    });

    it(`#${PlayMat.prototype.hideTile.name} Should throw an error when the spot is not occupied by a tile`, () => {
        expect(() => playMat.hideTile(0)).toThrow();
    });

    it(`#${PlayMat.prototype.hideTile.name} Should throw an error when the tile is already hidden`, () => {
        const swordTile = tilesPool.pickTile("sword");
        
        playMat.addTile(swordTile, 0);
        playMat.hideTile(0);

        expect(() => playMat.hideTile(0)).toThrow();
    });

    it(`#${PlayMat.prototype.swapTiles.name} Should swap two tiles that are placed on the playmat`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const crownTile = tilesPool.pickTile("crown");
        
        playMat.addTile(swordTile, 0);
        playMat.addTile(crownTile, 1);
        
        playMat.swapTiles(0, 1);
        expect(playMat.spots[0]).toBe(crownTile);
        expect(playMat.spots[1]).toBe(swordTile);
    });

    it(`#${PlayMat.prototype.swapTiles.name} Should throw an error when any spotPosition is not a number`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const crownTile = tilesPool.pickTile("crown");
        const notNumberIndexes: any[] = ["string", null, undefined, false];
        
        playMat.addTile(swordTile, 0);
        playMat.addTile(crownTile, 1);

        notNumberIndexes.forEach((nnIndex) => {
            expect(() => playMat.swapTiles(nnIndex, 0)).withContext(`Failed for ${nnIndex}`).toThrow();
            expect(() => playMat.swapTiles(0, nnIndex)).withContext(`Failed for ${nnIndex}`).toThrow();
        });
    });

    it(`#${PlayMat.prototype.swapTiles.name} Should throw an error when any spotPosition is out of bounds`, () => {
        const swordTile = tilesPool.pickTile("sword");
        const crownTile = tilesPool.pickTile("crown");
        const outOfBoundsIndexes: number[] = [-1, playMat.spots.length];
        
        playMat.addTile(swordTile, 0);
        playMat.addTile(crownTile, 1);

        outOfBoundsIndexes.forEach((oobIndex) => {
            expect(() => playMat.swapTiles(oobIndex, 0)).withContext(`Failed for ${oobIndex}`).toThrow();
            expect(() => playMat.swapTiles(0, oobIndex)).withContext(`Failed for ${oobIndex}`).toThrow();
        });
    });

    it(`#${PlayMat.prototype.swapTiles.name} Should throw an error when any of the provided spots is not occupied by a tile`, () => {
        const swordTile = tilesPool.pickTile("sword");
        
        playMat.addTile(swordTile, 0);

        expect(() => playMat.swapTiles(0, 1)).toThrow();
        expect(() => playMat.swapTiles(1, 0)).toThrow();
        expect(() => playMat.swapTiles(1, 2)).toThrow();
    });

})