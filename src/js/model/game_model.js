const QUESTIONS_COUNT_DIFFICULTY_STEP = require("./app_params").QUESTIONS_COUNT_DIFFICULTY_STEP;
const MIN_ANSWERS_PERCENT_DIFFICULTY_STEP = require("./app_params").MIN_ANSWERS_PERCENT_DIFFICULTY_STEP;


let instance = null;

module.exports = class GameModel
{
    constructor()
    {
        if (instance)
        {
            return instance;
        }

        this.instance = this;
    }

    startGame(difficultyLevel, numQuestions)
    {
        this.resetAll();

        this.difficultyLevel = difficultyLevel;
        this.allQuestions = numQuestions;
        this.questionsRemained = numQuestions;

        this.gameStarted = true;
    }

    startCustomGame(customParams)
    {
        this.resetAll();

        this.customParams = customParams;

        this.difficultyLevel = "custom";
        this.allQuestions = 1;
        this.questionsRemained = 1;

        this.gameStarted = true;
    }

    getCustomParams()
    {
        return(this.customParams);
    }

    updateScore(isAnswerRight)
    {
        if (!this.gameStarted)
        {
            throw ("[GameModel] GAME NOT STARTED!");
        }

        if (isAnswerRight)
        {
            this.score++;
            this.rightAnswers++;
        }
        else
        {
            this.score--;
            this.wrongAnswers++;
        }
        this.questionsPassed++;

        this.updateDifficultyLevel();

        return (this.getScoreData());
    }

    updateDifficultyLevel()
    {
        if (this.questionsPassed % 5 === 0)
        {
            if (this.rightAnswersPercent >= MIN_ANSWERS_PERCENT_DIFFICULTY_STEP)
            {
                this.difficultyLevel++;
            }
        }
    }

    getDifficultyLevel()
    {
        return this.difficultyLevel;
    }

    getScoreData()
    {
        this.questionsRemained = this.allQuestions - this.questionsPassed;
        if (this.questionsPassed != 0)
        {
            this.rightAnswersPercent = (this.rightAnswers / this.questionsPassed) * 100;
            this.rightAnswerPercent = Math.round(this.rightAnswerPercent);
        }
        else
        {
            this.rightAnswersPercent = 0;
        }

        return ({
            questionsPassed: this.questionsPassed,
            allQuestions: this.allQuestions,
            questionsRemaining: this.questionsRemained,
            rightAnswers: this.rightAnswers,
            wrongAnswers: this.wrongAnswers,
            rightAnswersPercent: this.rightAnswersPercent,
            difficultyLevel: this.difficultyLevel,
            score: this.score,
            lastQuestion: (this.questionsRemained === 0)?true:false
        })
    }

    getQuestionNumber()
    {
        return this.questionsPassed + 1;
    }

    resetAll()
    {
        this.gameStarted = false;

        this.customParams = null;

        this.score = 0;
        this.allQuestions = 0;
        this.rightAnswers = 0;
        this.wrongAnswers = 0;
        this.questionsPassed = 0;
        this.questionsRemained = 0;
        this.rightAnswersPercent = 0;
    }
}