import readlineSync from 'readline-sync';
import chalk from 'chalk';

import { MAIN_MENU_OPTIONS, MainMenuOptions } from '../Constants/MAIN_MENU_OPTIONS';
import { LOGO } from '../Constants/LOGO';
import { Player } from '../Game/Player'
import { PlayMat } from '../Game/PlayMat';
import { TilesPool } from '../Game/TilesPool';
import { ITile } from '../Constants/TILES';
import { Turns } from '../Game/Turns';

export class Prompt {

    static promptMainMenu(): number {
        let mainMenuOptions: string[] = [];

        console.clear();
        console.log(chalk.blueBright(LOGO));

        mainMenuOptions = Object.keys(MAIN_MENU_OPTIONS);
        mainMenuOptions.splice(0, mainMenuOptions.length / 2);

        return readlineSync.keyInSelect(mainMenuOptions, 'Choose an option');
    }

    static promptCheckEmojiSupport(): boolean {
        let userInput: string;

        console.log("Can you see the emoji (y/n)? 🕹️");
        userInput = readlineSync.question();

        if (userInput.toLowerCase() == "y")
            return true
        return false
    }

    static promptFirstPlace(tilesPool: TilesPool): string {
        let tiles: string[] = Object.keys(tilesPool.tiles);
        let tileIndex: number = -1;
        let userInput: string;

        while (!tiles[tileIndex]) {
            userInput = readlineSync.question("Place a tile: ");
            tileIndex = parseInt(userInput);

            if (!tiles[tileIndex])
                console.log("Invalid option. Please choose a valid tile index.");
            else
                console.log("You placed: ", tiles[tileIndex]);
        }

        return tiles[tileIndex];
    }

    static promptOption(): string {
        let moves = ["Place", "Hide", "Swap", "Challenge", "Peek", "Boast"];
        let playerMove = readlineSync.keyInSelect(moves, 'Your move');

        return moves[playerMove];
    }

    static promptPlace(tilesPool: TilesPool, playMat: PlayMat): void | IPlaceMoveOptions {
        let tiles = Object.keys(tilesPool.tiles);
        let spots = playMat.spots;
        let tileIndex: number = -1;
        let spotIndex: number = -1;
        let userInput: string;

        if (tiles.length == 0) {
            readlineSync.question("All tiles are already placed. Make another move.");
            return;
        }

        while (!tiles[tileIndex]) {
            userInput = readlineSync.question("Place a tile: ");
            tileIndex = parseInt(userInput);

            if (!tiles[tileIndex] || tileIndex > (tiles.length - 1))
                console.log("Invalid option. Please choose a valid tile index.");
            else {
                while (true) {
                    userInput = readlineSync.question("Pick a play mat spot: ");
                    spotIndex = parseInt(userInput);

                    if (isNaN(spotIndex))
                        console.log("Invalid option. Please choose a valid play mat index.");

                    else if (spots[spotIndex] || spotIndex > (spots.length - 1) || spotIndex < 0)
                        console.log("Invalid option. Please choose an empty play mat spot.");
                    else {
                        console.log(`You placed: ${tiles[tileIndex]} in spot #${spotIndex}`);
                        return { "tileName": tiles[tileIndex], "spotPosition": spotIndex };
                    }
                }
            }
        }
    }

    static promptHide(playMat: PlayMat): number {
        let spots = playMat.spots;
        let spotIndex: number = -1;
        let userInput: string;

        if (spots.every(spot => spot == null || spot && spot.hidden)) {
            readlineSync.question("All tiles are already hidden. Make another move.");
            return -1;
        };

        while (!spots[spotIndex]) {
            userInput = readlineSync.question("Hide a tile: ");
            spotIndex = parseInt(userInput);

            if (!spots[spotIndex])
                console.log("Invalid play mat position. Choose another spot.");

            else if (spots[spotIndex].hidden) {
                console.log("Tile is already hidden, choose another tile.");
                spotIndex = -1;
            } else
                return spotIndex;
        }

        return -1;
    }

    static promptSwap(playMat: PlayMat): number[] {
        let spots = playMat.spots;
        let userInput: string = "";
        let spotsToSwapString: string[];
        let spotsToSwap: number[];

        if (spots.reduce((prev, curr) => curr ? (prev + 1) : (prev + 0), 0) <= 1) {
            readlineSync.question("At least two tiles must be placed so that they can be swapped. Place another tile first.");
            return [];
        };

        while (true) {
            userInput = readlineSync.question("Enter tiles to be swapped separated by a comma.");
            userInput = userInput.trim();
            spotsToSwapString = userInput.split(",");
            spotsToSwap = spotsToSwapString.map(spot => parseInt(spot));

            if (spotsToSwap[0] != spotsToSwap[1] && spots[spotsToSwap[0]] && spots[spotsToSwap[1]]) {
                return spotsToSwap;
            } else {
                console.log("Invalid spots. Spots must be different and they must have a tile.");
            }
        }
    }

    static promptChallenge(playMat: PlayMat): IPromptChallengeReturn {
        let spots = playMat.spots;
        let spotToBeGuessed: number = -1;
        let userInput: string;
        let playerGuess: string = "";

        //!At least one spot is hidden
        if (!spots.some(spot => spot && spot.hidden)) {
            readlineSync.question("There are no valid spots to challenge. Hide a tile first.");
            return { "spotToBeGuessed": -1, "playerGuess": "" }
        };

        while (true) {
            userInput = readlineSync.question("Choose a spot. Your opponent must guess the tile in that spot.");
            spotToBeGuessed = parseInt(userInput);

            //Tile is null, spot is out of range or tile is not hidden
            if (!spots[spotToBeGuessed] || !spots[spotToBeGuessed].hidden)
                console.log("Invalid spot. Choose a hidden tile, so it can be guessed.");
            else {
                playerGuess = readlineSync.question("Your guess: ");
                return { "spotToBeGuessed": spotToBeGuessed, "playerGuess": playerGuess };
            }
        };

    }

    static promptChallengeResult(boolean: boolean): void {
        if (boolean)
            readlineSync.question("Your guess is correct. You scored one point!");
        else
            readlineSync.question("Your guess is incorrect. Your opponent scored one point");
    }

    static promptTryPeek(playMat: PlayMat, turns: Turns, reactivePlayer: Player): number {
        let spots = playMat.spots;
        let peekNTimes = 1;

        //!At least one spot is hidden
        if (!spots.some(spot => spot && spot.hidden)) {
            readlineSync.question("There are no valid spots to peek. Hide a tile first.");
            return 0;
        }

        //Player can peek up to 3 times
        if (turns.oponentHasScoredInTheLastTwoTurns(reactivePlayer)) {
            console.log("Your opponent scored a point in your/their last turn. You can peek up to 3 tiles.");
            peekNTimes = 3;
        }

        readlineSync.question(reactivePlayer.name + " look away...");
        return peekNTimes;
    }

    static promptPeek(playMat: PlayMat): number {
        let spots = playMat.spots;
        let spotIndex: number;
        let userInput: string;

        while (true) {
            userInput = readlineSync.question("Enter the tile to be peeked.");
            spotIndex = parseInt(userInput);

            if (isNaN(spotIndex))
                console.log("Invalid spot. Please enter a valid playmat spot.");

            else if (!spots[spotIndex] || !spots[spotIndex].hidden) {
                console.log("Invalid spot. Spot must have a hidden tile.");
            } else {
                return spotIndex;
            }
        }
    }

    static promptPeekResult(peekedTile: ITile): void {
        readlineSync.question(peekedTile.name);
    }

    static promptBoast(playMat: PlayMat, reactivePlayer: Player, noSteal?: boolean | undefined): number {
        let spots = playMat.spots;
        let choices = ["I believe you", "Prove it", "Steal the boast"];
        let userInput: string;
        let playerChoice: number;

        //Disables steal option if the reactive player has already stolen it.
        if (noSteal)
            choices.pop();

        //!At least one spot is hidden
        if (!spots.some(spot => spot && spot.hidden)) {
            readlineSync.question("At least one tile must be hidden before you can boast. Hide a tile first.");
            return -1
        };

        while (true) {
            console.log("\n" + reactivePlayer.name + ", choose an option")
            choices.forEach((c, index) => console.log(`[${index}] ${c}`));
            userInput = readlineSync.question();
            playerChoice = parseInt(userInput);

            //Input validation
            if (isNaN(playerChoice) || playerChoice < 0 || playerChoice > choices.length - 1)
                readlineSync.question("Invalid option, try again.");
            else {
                readlineSync.question("Your choice is: " + choices[playerChoice]);
                return playerChoice;
            }
        }
    }

    static promptBoastIBelieveYou(reactivePlayer: Player): void {
        readlineSync.question(`${reactivePlayer.name} believes you. You score 1 point!`)
    }
    
    static promptBoastProveIt(reactivePlayer: Player, playMat: PlayMat): boolean {
        console.log(`${reactivePlayer.name} wants you to prove it. Name all the hidden tiles from left to right`);
        let hiddenSpots = playMat.spots
            .map((spot, index) => (spot && spot.hidden) ? [index, spot.name] : [-1, "visibleSpot"]) //format result as an array of arrays like [[playMatIndex1, spotName1], [playMatIndex2, spotName2]...]
            .filter(spot => spot[0] == -1 ? false : true);                                          //removes the visible spots, previously marked as [-1, "visibleSpot"]

        for (let i = 0; i < hiddenSpots.length; i++) {
            let spot = hiddenSpots[i];
            let spotName = readlineSync.question(`Tile at spot ${spot[0]}: `);

            if (spotName == spot[1])
                readlineSync.question("Correct!");
            else {
                readlineSync.question("Wrong! You named a tile incorrectly.");
                return false;
            };
        };

        readlineSync.question("You guessed all tiles correctly!");
        return true;
    }
    
    static promptBoastStealIt(playMat: PlayMat, reactivePlayer: Player, activePlayer: Player): number {
        console.log(`${reactivePlayer.name} stole your boast.`);
        return this.promptBoast(playMat, activePlayer, true);

    }

    static promptGameOver(winnerName: string) {
        readlineSync.question(`The game is over. ${chalk.greenBright(winnerName)} wins!`);
    }

    static promptEmpty(): void {
        readlineSync.question();
    }

}


interface IPlaceMoveOptions {
    tileName: string;
    spotPosition: number;
}

interface IPromptChallengeReturn {
    spotToBeGuessed: number; 
    playerGuess: string;
}

type NumberStringTuple = [number, string];