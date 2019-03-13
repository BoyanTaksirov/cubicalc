const NUMBER_OF_CUBES_MIN_PERCENT = require("../model/app_params").NUMBER_OF_CUBES_MIN_PERCENT;
const NUMBER_OF_CUBES_MAX_PERCENT = require("../model/app_params").NUMBER_OF_CUBES_MAX_PERCENT;

const WIDTH_CELLS_MIN_NUMBER = require("../model/app_params").WIDTH_CELLS_MIN_NUMBER;
const WIDTH_CELLS_MAX_NUMBER = require("../model/app_params").WIDTH_CELLS_MAX_NUMBER;
const HEIGHT_CELLS_MIN_NUMBER = require("../model/app_params").HEIGHT_CELLS_MIN_NUMBER;
const HEIGHT_CELLS_MAX_NUMBER = require("../model/app_params").HEIGHT_CELLS_MAX_NUMBER;
const DEPTH_CELLS_MIN_NUMBER = require("../model/app_params").DEPTH_CELLS_MIN_NUMBER;
const DEPTH_CELLS_MAX_NUMBER = require("../model/app_params").DEPTH_CELLS_MAX_NUMBER;

let instance = null;

module.exports = class GameEngine
{
    constructor()
    {
        if (instance)
        {
            return instance;
        }

        this.instance = this;
    }

    createDataset(difficultyLevel)
    {
        var numberOfCubesPercent = Math.random() * (NUMBER_OF_CUBES_MAX_PERCENT - NUMBER_OF_CUBES_MIN_PERCENT) + NUMBER_OF_CUBES_MIN_PERCENT + (difficultyLevel - 1)*0.2;
        if(numberOfCubesPercent > 10)
        {
            numberOfCubesPercent = 10;
        }

        var cellsCountWidth = Math.random() * (WIDTH_CELLS_MAX_NUMBER - WIDTH_CELLS_MIN_NUMBER) + WIDTH_CELLS_MIN_NUMBER;
        cellsCountWidth = Math.round(cellsCountWidth) + (difficultyLevel - 1);

        var cellsCountHeight = Math.random() * (HEIGHT_CELLS_MAX_NUMBER - HEIGHT_CELLS_MIN_NUMBER) + HEIGHT_CELLS_MIN_NUMBER;
        cellsCountHeight = Math.round(cellsCountHeight) + (difficultyLevel - 1);

        var cellsCountDepth = Math.random() * (DEPTH_CELLS_MAX_NUMBER - DEPTH_CELLS_MIN_NUMBER) + DEPTH_CELLS_MIN_NUMBER;
        cellsCountDepth = Math.round(cellsCountDepth) + (difficultyLevel - 1);

        var numberOfCubes = (numberOfCubesPercent / 100) * (cellsCountWidth * cellsCountHeight * cellsCountDepth);
        numberOfCubes = Math.round(numberOfCubes);
        if(numberOfCubes < 1)
        {
            numberOfCubes = 1;
        }

        /*-------------DEBUG---------------
        cellsCountWidth = 5;
        cellsCountHeight = 3;
        cellsCountDepth = 7;
        numberOfCubes = 10; */
        //-------------------------------------

        var cellsArray = [];
        var cellsIndexesArray = [];
        var cellsTopViewArray = [];
        var cellsSideViewArray = [];
        var cellsFrontViewArray = [];

        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsArray.push([]);
            for (var h = 0; h < cellsCountHeight; h++)
            {
                cellsArray[w].push([]);
                for (var d = 0; d < cellsCountDepth; d++)
                {
                    cellsArray[w][h].push(false);
                    cellsIndexesArray.push({ w: w, h: h, d: d });
                }
            }
        }

        for (var c = 0; c < numberOfCubes; c++)
        {
            var index = Math.floor(Math.random() * cellsIndexesArray.length);
            var wCoord = cellsIndexesArray[index].w;
            var hCoord = cellsIndexesArray[index].h;
            var dCoord = cellsIndexesArray[index].d;
            cellsArray[wCoord][hCoord][dCoord] = true;

            cellsIndexesArray.splice(index, 1);
        }

        //--------------top projection---------------------------
        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsTopViewArray.push([]);

            for (var d = 0; d < cellsCountDepth; d++)
            {
                cellsTopViewArray[w].push(false);
                HeightCheck:
                for (var h = 0; h < cellsCountHeight; h++)
                {
                    cellsTopViewArray[w][d] = (cellsTopViewArray[w][d] || cellsArray[w][h][d]);
                    if (cellsTopViewArray[w][d])
                    {
                        break HeightCheck;
                    }
                }
            }
        }

        //------------------side projection------------------
        for (var d = 0; d < cellsCountDepth; d++) 
        {
            cellsSideViewArray.push([]);
            for (var h = 0; h < cellsCountHeight; h++) 
            {
                cellsSideViewArray[d].push(false);
                WidthCheck:
                for (var w = 0; w < cellsCountWidth; w++) 
                {
                    cellsSideViewArray[d][h] = (cellsSideViewArray[d][h] || cellsArray[w][h][d]);
                    if (cellsSideViewArray[d][h])
                    {
                        break WidthCheck;
                    }
                }
            }
        }

        //------------------front projection------------------
        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsFrontViewArray.push([]);

            for (var h = 0; h < cellsCountHeight; h++)
            {
                cellsFrontViewArray[w].push(false);
                DepthCheck:
                for (var d = 0; d < cellsCountDepth; d++)
                {
                    cellsFrontViewArray[w][h] = (cellsFrontViewArray[w][h] || cellsArray[w][h][d]);
                    if (cellsFrontViewArray[w][h])
                    {
                        break DepthCheck;
                    }
                }
            }
        }

        return ({
            allCells: cellsArray,
            topProjection: cellsTopViewArray,
            sideProjection: cellsSideViewArray,
            frontProjection: cellsFrontViewArray
        });
    }

    createCustomDataset(customParams)
    {     
        cellsCountWidth = customParams.gridWidth;
        cellsCountHeight = customParams.gridHeight;
        cellsCountDepth = customParams.gridDepth;
        numberOfCubes = customParams.cubesCount;

        var cellsArray = [];
        var cellsIndexesArray = [];
        var cellsTopViewArray = [];
        var cellsSideViewArray = [];
        var cellsFrontViewArray = [];

        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsArray.push([]);
            for (var h = 0; h < cellsCountHeight; h++)
            {
                cellsArray[w].push([]);
                for (var d = 0; d < cellsCountDepth; d++)
                {
                    cellsArray[w][h].push(false);
                    cellsIndexesArray.push({ w: w, h: h, d: d });
                }
            }
        }

        for (var c = 0; c < numberOfCubes; c++)
        {
            var index = Math.floor(Math.random() * cellsIndexesArray.length);
            var wCoord = cellsIndexesArray[index].w;
            var hCoord = cellsIndexesArray[index].h;
            var dCoord = cellsIndexesArray[index].d;
            cellsArray[wCoord][hCoord][dCoord] = true;

            cellsIndexesArray.splice(index, 1);
        }

        //--------------top projection---------------------------
        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsTopViewArray.push([]);

            for (var d = 0; d < cellsCountDepth; d++)
            {
                cellsTopViewArray[w].push(false);
                HeightCheck:
                for (var h = 0; h < cellsCountHeight; h++)
                {
                    cellsTopViewArray[w][d] = (cellsTopViewArray[w][d] || cellsArray[w][h][d]);
                    if (cellsTopViewArray[w][d])
                    {
                        break HeightCheck;
                    }
                }
            }
        }

        //------------------side projection------------------
        for (var d = 0; d < cellsCountDepth; d++) 
        {
            cellsSideViewArray.push([]);
            for (var h = 0; h < cellsCountHeight; h++) 
            {
                cellsSideViewArray[d].push(false);
                WidthCheck:
                for (var w = 0; w < cellsCountWidth; w++) 
                {
                    cellsSideViewArray[d][h] = (cellsSideViewArray[d][h] || cellsArray[w][h][d]);
                    if (cellsSideViewArray[d][h])
                    {
                        break WidthCheck;
                    }
                }
            }
        }

        //------------------front projection------------------
        for (var w = 0; w < cellsCountWidth; w++)
        {
            cellsFrontViewArray.push([]);

            for (var h = 0; h < cellsCountHeight; h++)
            {
                cellsFrontViewArray[w].push(false);
                DepthCheck:
                for (var d = 0; d < cellsCountDepth; d++)
                {
                    cellsFrontViewArray[w][h] = (cellsFrontViewArray[w][h] || cellsArray[w][h][d]);
                    if (cellsFrontViewArray[w][h])
                    {
                        break DepthCheck;
                    }
                }
            }
        }

        return ({
            allCells: cellsArray,
            topProjection: cellsTopViewArray,
            sideProjection: cellsSideViewArray,
            frontProjection: cellsFrontViewArray
        });
    }

}
