const $ = require("jquery");
const GameIntroScreen = require("./game_intro_screen");
const GameRunningScreen = require("./game_running_screen");

module.exports = class GameScreen
{
    constructor(parentContainer)
    {
        this.container = $("<div/>").addClass("gameScreenContainer");
        
        this.onStartNormalClicked = this.onStartNormalClicked.bind(this);
        this.onStartCustomClicked = this.onStartCustomClicked.bind(this);

        this.continue = this.continue.bind(this);
        this.cancelGame = this.cancelGame.bind(this);

        parentContainer.append(this.container);

        this.createInterface();

        this.setInitialMode();
    }

    createInterface()
    {
        this.gameIntroScreen = new GameIntroScreen(this.onStartNormalClicked, this.onStartCustomClicked);
        this.gameIntroScreen.hide();
        this.gameIntroScreen.addToContainer(this.container);

        this.gameRunningScreen = new GameRunningScreen(this.cancelGame, this.continue);
        this.gameRunningScreen.hide();
        this.gameRunningScreen.addToContainer(this.container);      
    }

    onStartNormalClicked(params)
    {
        this.setNormalGameMode(params);
    }

    onStartCustomClicked(customParams)
    {
        this.setCustomGameMode(customParams);
    }

    setInitialMode()
    {
        this.gameRunningScreen.hide();
        this.gameRunningScreen.endGame();

        this.gameIntroScreen.show();
        this.gameIntroScreen.setNormalGameFields([1,20]);     
    }

    setNormalGameMode(params)
    {
        this.gameIntroScreen.hide();
        this.gameRunningScreen.show();
        this.gameRunningScreen.startGame(params);
    }

    setCustomGameMode(customParams)
    {
        this.gameIntroScreen.hide();
        this.gameRunningScreen.show();
        this.gameRunningScreen.startCustomGame(customParams);
    }

    cancelGame()
    {
        this.setInitialMode();
    }

    continue()
    {
        this.setInitialMode();
    }

    clear()
    {
        this.gameIntroScreen.clear();
        this.gameRunningScreen.clear();
        this.container.remove();
    }
}