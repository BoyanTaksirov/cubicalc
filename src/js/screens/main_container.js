const $ = require("jquery");
const HomeScreen = require("./home_screen");
const GameScreen = require("./game_screen");
const MainMenu = require("../components/main_menu");

const HOME_SCREEN_ID = require("../model/app_params").HOME_SCREEN_ID;
const GAME_SCREEN_ID = require("../model/app_params").GAME_SCREEN_ID;

module.exports = class MainContainer{
    constructor()
    {
        this.container = $("<div></div>");
        this.container.addClass("mainContainerClass");

        this.menuButtonClicked = this.menuButtonClicked.bind(this);

        this.mainMenu = new MainMenu(this.container, this.menuButtonClicked);
        this.homeScreen;
        this.gameScreen;

        this.mainMenu.setButtonSwitchState(HOME_SCREEN_ID);
        this.switchScreen(HOME_SCREEN_ID);
    }

    addToContainer(parentContainer)
    {
        $(parentContainer).append(this.container);
    }

    menuButtonClicked(buttonId)
    {
        this.switchScreen(buttonId);
    }

    switchScreen(screenID)
    {
        if(this.homeScreen)
        {
            this.homeScreen.clear();
            this.homeScreen = null;
        }

        if(this.gameScreen)
        {
            this.gameScreen.clear();
            this.gameScreen = null;
        }

        switch(screenID)
        {
            case HOME_SCREEN_ID:
                 this.homeScreen = new HomeScreen(this.container);
                 break;

            case GAME_SCREEN_ID:
                this.gameScreen = new GameScreen(this.container);
                break;
        }
    }
}