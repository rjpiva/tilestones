import { Player } from '../src/Game/Player'

describe(`${Player.name}`, () => {
    it(`#${Player.prototype._hasScoredThreePoints.name} Should return "true" if the player's score equals 3`, () => {
        const player = new Player('Player1');

        player.score = 1;
        expect(player._hasScoredThreePoints()).toBeFalse();
        player.score = 3;
        expect(player._hasScoredThreePoints()).toBeTrue();
    })
})
