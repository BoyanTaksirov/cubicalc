const $ = require("jquery");

const ViewTableInteractive = require("../components/view_table_interactive");
const SwitchButton = require("../components/switch_button");
const GameEngine = require("../logic/game_engine");
const Cubes3D = require("../components/cubes_3d_view");
const ButtonStateData = require("../data/button_state_data");
const GameModel = require("../model/game_model");
const KeyValue = require("../components/key_value");
const Timer = require("../components/timer");

const CELLS_GUESSED = require("../model/app_params").CELLS_GUESSED;
const CELLS_WRONG = require("../model/app_params").CELLS_WRONG;

const RIGHT_COLOR = "rgb(49, 255, 0)";
const WRONG_COLOR = "rgb(255, 45, 11)";

const MESSAGE_COLOR = "rgb(118, 255, 163)";

module.exports = class GameRunningScreen
{
    constructor(cancelHandler, continueHandler)
    {
        this.cancelHandler = cancelHandler;
        this.continueHandler = continueHandler;

        this.onCancelClicked = this.onCancelClicked.bind(this);
        this.onContinueClicked = this.onContinueClicked.bind(this);
        this.onAnswerSubmit = this.onAnswerSubmit.bind(this);
        this.onNextClicked = this.onNextClicked.bind(this);

        this.customGame = false;

        this.gameModel = new GameModel();
        this.gameEngine = new GameEngine();

        this.tablesContainer;
        this.topView;
        this.sideView;
        this.frontView;

        this.createInterface();
    }

    createInterface()
    {
        this.container = $("<div/>");

        this.scoreLabel = $("<div/>").addClass("infoLabel");
        this.slQuestions = new KeyValue("question", "not set", this.scoreLabel);
        this.slRightAnswers  = new KeyValue("right answers", "not set", this.scoreLabel);
        this.slWrongAnswers  = new KeyValue("wrong answers", "not set", this.scoreLabel);
        this.slRightAnswersPercent = new KeyValue("right answers %", "not set", this.scoreLabel);
        this.slScore = new KeyValue("score", "not set", this.scoreLabel);
        this.slDifficultyLevel = new KeyValue("difficulty level", "not set", this.scoreLabel);
        this.slTimer = new Timer(1000, this.scoreLabel);

        this.container.append(this.scoreLabel);

        this.tablesContainer = $("<div/>");
        this.tablesContainer.addClass("tablesContainer");
        this.container.append(this.tablesContainer);

        this.viewCubes3D = new Cubes3D(this.tablesContainer);

        this.topView = new ViewTableInteractive("topTable");
        this.sideView = new ViewTableInteractive("sideTable");
        this.frontView = new ViewTableInteractive("frontTable");
        this.topView.addToContainer(this.tablesContainer);
        this.sideView.addToContainer(this.tablesContainer);
        this.frontView.addToContainer(this.tablesContainer);

        this.infoLabel = $("<div/>").addClass("infoLabel");
        this.container.append(this.infoLabel);

        var submitButtonStates = [
            new ButtonStateData(null, null, "submit", null, this.onAnswerSubmit, "submitButton"),
            new ButtonStateData(null, null, "next", null, this.onNextClicked, "nextButton"),
            new ButtonStateData(null, null, "Game Over. Press to continuie.", null, this.onContinueClicked, "continueButtonClass"),
        ]

        this.submitButton = new SwitchButton(submitButtonStates, "SUBMIT_BUTTON_ID", false);
        this.submitButton.addToContainer(this.container);

        this.cancelButton = new SwitchButton([new ButtonStateData(null, null, "cancel game", null, this.onCancelClicked, "cancelButtonClass")]);
        this.cancelButton.addToContainer(this.container);
    }

    startGame(params)
    {
        this.gameModel.startGame(params.difficultyLevel, params.numQuestions);
        this.customGame = false;
        this.initInterface();
    }

    startCustomGame(customParams)
    {
        this.gameModel.startCustomGame(customParams);
        this.customGame = true;
        this.initInterface();
    }

    initInterface()
    {
        this.initTables();
        this.submitButton.setState(0);

        this.slTimer.start();

        this.infoLabel.empty();
        this.infoLabel.css("color", MESSAGE_COLOR);
        this.infoLabel.text("Mark supposed cube places and click submit");

        this.setScoreLabel(this.gameModel.getScoreData());
    }

    endGame()
    {
        this.slTimer.stop();
        this.viewCubes3D.removeCubes();
        this.submitButton.setState(0);
        this.infoLabel.text();
        this.gameModel.resetAll();
    }

    onCancelClicked(buttonInstance)
    {
        this.endGame();
        buttonInstance.setState(0);
        this.cancelHandler();
    }

    onContinueClicked(buttonInstance)
    {
        this.endGame();
        buttonInstance.setState(0);
        this.continue();
    }

    onAnswerSubmit(buttonInstance)
    {
        var topViewResult = this.topView.checkResult();
        var sideViewResult = this.sideView.checkResult();
        var frontViewResult = this.frontView.checkResult();

        var finalResult = true;

        var guessedCells = -1;
        var wrongCells = -1;
        var allCells = -1;
        var missedCells = -1;

        if (topViewResult)
        {
            if (topViewResult.result === CELLS_WRONG)
            {
                finalResult = false;
            }
            guessedCells = topViewResult.guessedCells;
            wrongCells = topViewResult.wrongCells;
            allCells = topViewResult.allCells;
        }

        if (sideViewResult)
        {
            if (sideViewResult.result === CELLS_WRONG)
            {
                finalResult = false;
            }
            guessedCells = sideViewResult.guessedCells;
            wrongCells = sideViewResult.wrongCells;
            allCells = sideViewResult.allCells;
        }

        if (frontViewResult)
        {
            if (frontViewResult.result === CELLS_WRONG)
            {
                finalResult = false;
            }
            guessedCells = frontViewResult.guessedCells;
            wrongCells = frontViewResult.wrongCells;
            allCells = frontViewResult.allCells;
        }

        var scoreData = this.gameModel.updateScore(finalResult);
        this.setScoreLabel(scoreData, false);

        missedCells = allCells - guessedCells;

        var resultLabel = (finalResult) ? "RIGHT!" : "WRONG!";
        var infoColor = (finalResult) ? RIGHT_COLOR : WRONG_COLOR;
        this.infoLabel.css("color", MESSAGE_COLOR);

        this.infoLabel.empty();

        var result = new KeyValue("result:", resultLabel, this.infoLabel);
        result.setValueStyle("color", infoColor);
        var guessed = new KeyValue("guessed:", guessedCells, this.infoLabel);
        var wrong = new KeyValue("wrong cells:", wrongCells, this.infoLabel);
        var missed = new KeyValue("missed cells:", missedCells, this.infoLabel);
        var all = new KeyValue("all cells:", allCells, this.infoLabel);

        if (scoreData.lastQuestion)
        {
            this.slTimer.stop();
            buttonInstance.setState(2);
            return;
        }

        buttonInstance.setState(1);
    }

    onNextClicked(buttonInstance)
    {
        this.infoLabel.css("color", MESSAGE_COLOR);
        this.infoLabel.text("Mark supposed cube places and click submit");
        this.initTables();
        this.setScoreLabel(this.gameModel.getScoreData());

        buttonInstance.setState(0);
    }

    setScoreLabel(scoreData, newQuestion = true)
    {
        var questions;

        if (newQuestion)
        {
            questions = this.gameModel.getQuestionNumber() + "/" + scoreData.allQuestions;
        }
        else
        {
            questions = this.gameModel.questionsPassed + "/" + scoreData.allQuestions;
        }
        this.slQuestions.setValue(questions);

        this.slRightAnswers.setValue(scoreData.rightAnswers);

        this.slWrongAnswers.setValue(scoreData.wrongAnswers);

        if (scoreData.wrongAnswers > 0)
        {
            this.slWrongAnswers.setValueStyle("color", WRONG_COLOR);
        }
        this.slRightAnswersPercent.setValue(Math.round(scoreData.rightAnswersPercent));

        this.slScore.setValue(scoreData.score);
        if (scoreData.score < 0)
        {
            this.slScore.setValueStyle("color", WRONG_COLOR);
        }
        else if (scoreData.score > 0)
        {
            this.slScore.setValueStyle("color", RIGHT_COLOR);
        }
        else
        {
            this.slScore.setValueStyle("color", "white");
        }

       this.slDifficultyLevel.setValue(scoreData.difficultyLevel);
    }

    initTables()
    {
        var cubesData;
        if (!this.customGame)
        {
            cubesData = this.gameEngine.createDataset(this.gameModel.getDifficultyLevel());
        }
        else
        {
            cubesData = this.gameEngine.createCustomDataset(this.gameModel.getCustomParams());
        }

        this.viewCubes3D.startSwitchCubes(cubesData.allCells);

        this.topView.setTableConfig(cubesData.topProjection, false, "Top View", "Back Side", "Right Side", "Front Side", "Left Side");
        this.sideView.setTableConfig(cubesData.sideProjection, false, "Side View", "Top Side", "Front Side", "Bottom Side", "Back side");
        this.frontView.setTableConfig(cubesData.frontProjection, true, "Front View", "Top Side", "Right Side", "Bottom Side", "Left Side");
    }

    continue()
    {
        this.continueHandler();
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

    clearTables()
    {
        this.viewCubes3D.clear();

        this.topView.clear();
        this.sideView.clear();
        this.frontView.clear();

        this.container.empty();
    }

    removeFromContainer()
    {
        this.container.remove();
    }

    clear()
    {
        this.clearTables();
        this.slTimer.clear();
        this.scoreLabel.empty();
        this.submitButton.clear();
        this.cancelButton.clear();
        this.container.empty();
        this.removeFromContainer();
    }

}