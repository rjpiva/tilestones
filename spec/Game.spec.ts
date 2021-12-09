import { Game } from '../src/Game/Game'
import { PlayMat } from '../src/Game/PlayMat';
import { Print } from '../src/Console/Print'
import { TilesPool } from '../src/Game/TilesPool';

//https://extrajs.com/blog/tutorial/learn-basic-testing-tutorial-for-jasmine-and-typescript/

describe(Game.name, () => {

    let game: Game;
    let gamePlayMatGetter: string = (Object.getOwnPropertyDescriptors(Game.prototype).playMat.get as any).name;
    let gameTilesPoolGetter :string = (Object.getOwnPropertyDescriptors(Game.prototype).tilesPool.get as any).name;
    
    beforeEach(() => {
        game = new Game('p1', 'p2');
    });
    
    it(`#${Game.prototype.place.name} Should place a tile on the playmat`, () => {
        game.place('crown', 2);
        game.place('sword', 3);
        
        expect(game.playMat.spots[2].name).toBe('crown');
        expect(game.playMat.spots[3].name).toBe('sword');

    });

    it(`#${Game.prototype.swap.name} Should swap two tiles on the playmat`, () => {
        game.place('crown', 2);
        game.place('sword', 3);
        game.swap(2,3);

        expect(game.playMat.spots[2].name).toBe('sword');
        expect(game.playMat.spots[3].name).toBe('crown');
    });

    it(`#${gamePlayMatGetter} Should return an instance of the playmat`, () => {
        expect(game.playMat instanceof PlayMat).toBeTrue();
    });

    it(`#${Print.printActivePlayer.name} Should print the active player`, () =>{
        let playerName = "player1";
        spyOn(Print, 'printActivePlayer');
        Print.printActivePlayer("Player 1");
        expect(Print.printActivePlayer).toHaveBeenCalled()
    });
    
    it(`#${gameTilesPoolGetter} Should return an instance of the tiles pool`, () =>{
        expect(game.tilesPool instanceof TilesPool).toBeTrue();
    });

});