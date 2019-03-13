const $ = require("jquery");

const GameForm = require("../components/game_form");
const LabelAndInputInitializer = require("../data/label_and_input_initializer");

const MAX_DIFFICULTY_LEVEL = require("../model/app_params").MAX_DIFFICULTY_LEVEL;
const MAX_QUESTIONS_COUNT = require("../model/app_params").MAX_QUESTIONS_COUNT;

const NORMAL_GREEN =  "rgb(73, 148, 89)";
const ACTIVE_ORANGE = "rgb(255, 105, 59)";

module.exports = class GameIntroScreen
{
    constructor(normalStartHandler, customStartHandler)
    {
        this.normalStartHandler = normalStartHandler;
        this.customStartHandler = customStartHandler;

        this.normalGameStartClicked = this.normalGameStartClicked.bind(this);
        this.customGameStartClicked = this.customGameStartClicked.bind(this);

        this.container = $("<div/>").addClass("gameFormContainer");

        //-----------------------------------normal game form---------------------------------------------
        var difficultyInitializer = new LabelAndInputInitializer("difficulty level(1-10):", 1, { min: 1, max: MAX_DIFFICULTY_LEVEL });
        var questionsInitializer = new LabelAndInputInitializer("questions count(1-100):", 1, { min: 1, max: MAX_QUESTIONS_COUNT });

        var normalGameInitializers = [difficultyInitializer, questionsInitializer];

        this.normalGameForm = new GameForm("Normal Game", NORMAL_GREEN, this.normalGameStartClicked, normalGameInitializers);
        this.normalGameForm.addToContainer(this.container);
        //------------------------------------------------------------------------------------------------------

        //--------------------------------------------custom game form-------------------------------------------
        var cubesWidthInit = new LabelAndInputInitializer("grid width(3-12):", 3, { min: 3, max: 12 });
        var cubesHeightInit = new LabelAndInputInitializer("grid height(3-12):", 3, { min: 3, max: 12 });
        var cubesDepthInit = new LabelAndInputInitializer("grid depth(3-12):", 3, { min: 3, max: 12 });
        var cubesCountInit = new LabelAndInputInitializer("cubes count(1-100):", 1, { min: 1, max: 100 });

        var customGameInitializers = [cubesWidthInit, cubesHeightInit, cubesDepthInit, cubesCountInit];

        this.customGameForm = new GameForm("Custom Game", ACTIVE_ORANGE, this.customGameStartClicked, customGameInitializers);
        this.customGameForm.addToContainer(this.container);
    }

    normalGameStartClicked(buttonInstance)
    {
        var difficultyLevel = this.normalGameForm.getInputFieldValue(0);
        var numQuestions = this.normalGameForm.getInputFieldValue(1);    

        var params = {
            difficultyLevel: difficultyLevel,
            numQuestions: numQuestions
        }
        this.normalStartHandler(params);
    }

    customGameStartClicked(buttonInstance)
    {
        var gridWidth = this.customGameForm.getInputFieldValue(0);
        var gridHeight = this.customGameForm.getInputFieldValue(1);
        var gridDepth = this.customGameForm.getInputFieldValue(2);
        var cubesCount = this.customGameForm.getInputFieldValue(3);
        
        var params = {
            gridWidth: gridWidth,
            gridHeight: gridHeight,
            gridDepth: gridDepth,
            cubesCount: cubesCount
        }
        this.customStartHandler(params);
    }

    setNormalGameFields(params)
    {
        this.normalGameForm.setInputFields(params);
    }

    addToContainer(parentContainer)
    {
        if (!this.container[0].parentElement)
        {
            parentContainer.append(this.container);
        }
    }

    show()
    {
        this.container.show();
    }

    hide()
    {
        this.container.hide();
    }

    removeFromContainer()
    {
        this.container.remove();
    }

    clear()
    {
        this.normalGameForm.clear();
        this.customGameForm.clear();
        this.container.empty();
    }

}