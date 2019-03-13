const $ = require("jquery");
const ButtonStateData = require("../data/button_state_data");
//const UniButton = require("./uni_button");
const Button3D = require("./button_3d");

const HOME_SCREEN_ID = require("../model/app_params").HOME_SCREEN_ID;
const GAME_SCREEN_ID = require("../model/app_params").GAME_SCREEN_ID;

module.exports = class MainMenu
{
    constructor(parentContainer, onMenuClick)
    {
        this.onMenuClick = onMenuClick;

        this.container = $("<div/>");
        this.container.addClass("mainMenuClass");
        parentContainer.append(this.container);

        this.onHomeClicked = this.onHomeClicked.bind(this);
        this.onGameClicked = this.onGameClicked.bind(this);

        this.homeButton = new Button3D("Home", 200, 100, 100, 100, "button3DFrontClass", "button3DActiveClass", "button3DSidesClass", this.onHomeClicked);
        this.homeButton.addToContainer(this.container);

        this.gameButton = new Button3D("Game", 200, 100, 100, 100, "button3DFrontClass", "button3DActiveClass", "button3DSidesClass", this.onGameClicked);
        this.gameButton.addToContainer(this.container);

        this.gameTitle = $("<div/>").addClass("gameTitleClass").text("CUBICALC");
        this.container.append(this.gameTitle);

        this.homeButton.setPosition("0.5rem", "0.1rem");
        this.gameButton.setPosition("0.5rem", "0.1rem");
    }

    onHomeClicked(event){
       this.gameButton.setInitialState();
       this.onMenuClick(HOME_SCREEN_ID);
    }

    onGameClicked(event){
        this.homeButton.setInitialState();
        this.onMenuClick(GAME_SCREEN_ID);
     }

     setZIndex(value)
     {
         this.container.css("zIndex", value);
     }

     setButtonSwitchState(buttonId)
     {
         if(buttonId === HOME_SCREEN_ID)
         {
            this.homeButton.setActiveState();
            this.gameButton.setInitialState();
         }
         else if(buttonId === GAME_SCREEN_ID)
         {           
            this.homeButton.setInitialState();
            this.gameButton.setActiveState();
         }
     }
}