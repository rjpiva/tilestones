import chalk from 'chalk';
import { Game, IScore } from '../Game/Game';
import { PlayMat } from '../Game/PlayMat';
import { TilesPool } from '../Game/TilesPool';

export class Print {

    static enableEmojis: boolean = false;

    static printUI(game: Game) {
        console.clear();
        Print.printPlayerScore(game.score);
        Print.printTilesPool(game.tilesPool);
        Print.printPlayMat(game.playMat);
        Print.printActivePlayer(game.currentTurn.activePlayer.name);
    }

    static printTilesPool(tilesPool: TilesPool) {
        if (this.enableEmojis) {
            this.printEmojiTilesPool(tilesPool);
        } else {
            let formattedTilesPool = [];
            for (var tile in tilesPool.tiles) {
                formattedTilesPool.push(tilesPool.tiles[tile].name);
            }
            console.log(chalk.blueBright("Tiles pool"));
            console.table(formattedTilesPool);
        }
    }

    static printEmojiTilesPool(tilesPool: TilesPool){
        const numberOfTiles = Object.keys(tilesPool.tiles).length;
        const maxNumOfTiles = 7;
        const bufferSize = maxNumOfTiles - numberOfTiles;
        let tileIndex = 0;

        console.log(chalk.blueBright("Tiles pool"));
        console.log("===================================");
        console.log("== Index ==  Name    ===  Tile  ===");
        console.log("-----------------------------------");
        for(let tile in tilesPool.tiles){
            console.log(`==   ${tileIndex}   ==  ${tilesPool.tiles[tile].name.padEnd(6)}  ===   ${tilesPool.tiles[tile].icon}   ===`);
            tileIndex++;
        };
        for(let i=bufferSize; i>0; i--){
            console.log(chalk.dim("==       ==          ===        ==="));
        }
        console.log("===================================");
        console.log();
    }
    
    static printPlayMat(playMat: PlayMat) {
        if (this.enableEmojis) {
            this.printEmojiPlayMat(playMat);
        } else {
            let formattedPlayMat: IObjectOfStrings = {};

            playMat.spots.forEach((tile, index) => {
                if (tile != null) {
                    formattedPlayMat[index] = (tile.hidden ? "  ?  " : tile.name);
                } else {
                    formattedPlayMat[index] = "    ";
                }
            })
            console.log(chalk.blueBright("Play mat"));
            console.table([formattedPlayMat]);
        }
    }

    static printEmojiPlayMat(playMat: PlayMat) {
        let formattedPlayMat: string[];

        formattedPlayMat = playMat.spots.map(spot => {
            if (spot != null) {
                return spot.hidden ? "❔" : spot.icon;
            } else {
                return "➖";
            }
        });

        console.log(chalk.blueBright("Play mat"));
        console.log("╭──────┬──────┬──────┬──────┬──────┬──────┬──────╮");
        console.log("│  0   │  1   │  2   │  3   │  4   │  5   │  6   │");
        console.log("├──────┼──────┼──────┼──────┼──────┼──────┼──────┤");
        console.log("│ ",
            formattedPlayMat[0]," │ ",
            formattedPlayMat[1]," │ ",
            formattedPlayMat[2]," │ ",
            formattedPlayMat[3]," │ ",
            formattedPlayMat[4]," │ ",
            formattedPlayMat[5]," │ ",
            formattedPlayMat[6]," │ ");
        console.log("╰──────┴──────┴──────┴──────┴──────┴──────┴──────╯");
        console.log("");
    }

    static printPlayerScore(gameScore: IScore) {
        if (this.enableEmojis) {
            this.printEmojiPlayerScore(gameScore);
        } else {
            console.log(`${chalk.blueBright("Score")} P1:${gameScore.player1} | P2:${gameScore.player2}`);
        }
    }

    static printEmojiPlayerScore(gameScore: IScore) {
        const scoreOptions: IObjectOfStrings = {
            1: "🔵⚪⚪",
            2: "🔵🔵⚪",
            3: "🔵🔵🔵"
        };

        console.log(`${chalk.blueBright("Score")} P1:${scoreOptions[gameScore.player1]} | P2:${scoreOptions[gameScore.player2]}`);
        console.log();
    }

    static printActivePlayer(activePlayerName: string) {
        console.log(chalk.redBright(activePlayerName) + " plays \n");
    }

}

interface IObjectOfStrings {
    [key: number]: string
}