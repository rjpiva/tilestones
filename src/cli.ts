import { Game } from './Game/Game';
import { Print } from './Console/Print';
import { Prompt } from './Console/Prompt';
import { MAIN_MENU_OPTIONS, MainMenuOptions } from './Constants/MAIN_MENU_OPTIONS';

let gameOver: boolean = false;
let keepRunning: boolean = true;

export function play() {
    while (keepRunning) {
        mainMenu();
    }
}
    
function newGame() {
    const game = new Game("player1", "player2");
    game.events.on('game-over', onGameOver);
    
    Print.enableEmojis = Prompt.promptCheckEmojiSupport();
    Print.printUI(game);
    
    game.place(Prompt.promptFirstPlace(game.tilesPool), 3);
    
    while(!gameOver){
        Print.printUI(game);

        let playerMove = Prompt.promptOption();
        
        switch (playerMove) {
            case "Place":
                let placeMoveOptions = Prompt.promptPlace(game.tilesPool, game.playMat);
                if(placeMoveOptions)
                    game.place(placeMoveOptions.tileName, placeMoveOptions.spotPosition);
                break;

            case "Hide":
                let spotPosition = Prompt.promptHide(game.playMat);
                if(spotPosition >= 0){
                    game.hide(spotPosition);
                }
                break;

            case "Swap":
                let spotsToSwap = Prompt.promptSwap(game.playMat);
                if(spotsToSwap.length > 0)
                    game.swap(spotsToSwap[0], spotsToSwap[1]);
                break;
            
            case "Challenge":
                let challengeParms = Prompt.promptChallenge(game.playMat);
                let challengeResult = false;

                if(challengeParms && challengeParms.spotToBeGuessed >= 0){
                    challengeResult = game.challenge(challengeParms.spotToBeGuessed, challengeParms.playerGuess, false);
                    Prompt.promptChallengeResult(challengeResult);
                    
                    //End turn manually to ensure that all messages will be properly displayed. 
                    game.challenge(-1, "", true);
                };

                break;

            case "Peek":
                let reactivePlayer = game.currentTurn.reactivePlayer;
                let peekNTimes = Prompt.promptTryPeek(game.playMat, game.turns, reactivePlayer);
                let spots = game.playMat.spots;

                while(peekNTimes > 0 && spots.some(spot => spot && spot.hidden)){
                    let spotToPeek = Prompt.promptPeek(game.playMat);
                    let peekedTile = game.peek(spotToPeek, peekNTimes);
                    Prompt.promptPeekResult(peekedTile);
                    peekNTimes --;
                };
                break;

            case "Boast":
                let actvPlayer = game.currentTurn.activePlayer;
                let rctvPlayer = game.currentTurn.reactivePlayer;
                let rctvPlayerChoice = Prompt.promptBoast(game.playMat, rctvPlayer);

                //Reactive player believes active player
                if(rctvPlayerChoice == 0){
                    Prompt.promptBoastIBelieveYou(rctvPlayer);
                    game.boast('believe');
                    
                  //Reactive player wants active player to prove it
                } else if (rctvPlayerChoice == 1) {
                    let proveItResult = Prompt.promptBoastProveIt(rctvPlayer, game.playMat);
                    game.boast('prove', proveItResult);
                    
                  //Reactive player steals the boast from the active player
                } else if (rctvPlayerChoice == 2) {
                    let actvPlayerChoice = Prompt.promptBoastStealIt(game.playMat, rctvPlayer, actvPlayer);
                    
                    //Active player believes reactive player
                    if (actvPlayerChoice == 0) {
                        Prompt.promptBoastIBelieveYou(actvPlayer);
                        game.boast('steal-believe');

                      //Active player wants reactive player to prove it
                    } else {
                        let stolenProveItResult = Prompt.promptBoastProveIt(actvPlayer, game.playMat);
                        game.boast('steal-prove', stolenProveItResult);
                    };
                
                };
                break;
        };

    }
    gameOver = false;
};

function onGameOver(winnerName: string){
    Prompt.promptGameOver(winnerName);
    gameOver = true;
}

function mainMenu() {
    let option: MainMenuOptions;
    option = MAIN_MENU_OPTIONS[Prompt.promptMainMenu()] as MainMenuOptions;

    switch (option) {
        case MAIN_MENU_OPTIONS[0]: 
            newGame();
            break;

        case MAIN_MENU_OPTIONS[1]:
            showRules();
            break;

        case MAIN_MENU_OPTIONS[2]:
            keepRunning = false;
            break;
    }  
};

function showRules() {
    console.log("\nVisit https://www.youtube.com/watch?v=p0lol1-Xt3Q for detailed rules");
    console.log("You can acquire the physical board game at https://tellstones.com to play with family and friends");
    Prompt.promptEmpty();
};