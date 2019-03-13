const $ = require("jquery");
const ViewTable = require("./view_table");
const reverseRowCol_2DArray = require("../utils/utils").reverseRowCol_2DArray;

const CELLS_GUESSED = require("../model/app_params").CELLS_GUESSED;
const CELLS_WRONG = require("../model/app_params").CELLS_WRONG;

const ACTIVE_ORANGE = "rgb(255, 105, 59)";

module.exports = class ViewTableInteractive
{
    constructor(tableId)
    {
        this.tableId = tableId;
        this.container = $("<div/>", { id: tableId }).addClass("viewTableContainer");
        this.tableInfo = $("<div/>").addClass("tableNameLabel");
        this.container.append(this.tableInfo);
        this.table;
        this.tableData;

        this.onTableClicked = this.onTableClicked.bind(this);

        this.filledCells = 0;
        this.guessedCells = 0;
        this.wrongCells = 0;
        this.tableData;
        this.interactive;
    }

    setTableConfig(tableData, interactive, name, side1, side2, side3, side4)
    {
        this.interactive = interactive;

        if(this.interactive)
        {
            this.container.removeClass().addClass("viewTableContainerActive");
        }

        this.resetTable();

        this.tableData = tableData;

        tableData = reverseRowCol_2DArray(tableData);

        var classInstance = this;
        this.tableData = tableData;
        this.table = $("<table/>").addClass("table");

        if (this.interactive)
        {
            this.table.on("click", this.onTableClicked);
        }

        var instance = this;

        var headerRow = $("<tr/>");
        this.topLabel = $("<th/>", { id: "top", "colspan": tableData[0].length + 2 });
        this.topLabel.addClass("tableBorderCells");
        headerRow.append(this.topLabel);
        this.table.append(headerRow);

        $.each(tableData, function (rowIndex, r)
        {
            var row = $("<tr/>");
            if (rowIndex === 0)
            {
                instance.leftLabel = $("<td/>", { id: "left" });
                instance.leftLabel.addClass("tableBorderCellsVertical");
                instance.leftLabel.attr("rowspan", tableData.length).text("side view");
                row.append(instance.leftLabel);
            }
            $.each(r, function (colIndex, c)
            {
                var tableCell = $("<td></td>");
                var tableCellContent = $("<div/>");
                tableCellContent.addClass("cellSelectedContent");
                tableCell.append(tableCellContent);

                var tableResult = $("<div/>");
                tableResult.addClass("cellResultIndicator");
                tableCell.append(tableResult);

                row.append(tableCell);
                if (c)
                {
                    tableCell.data("full", true);
                    classInstance.filledCells++;

                    if (!interactive)
                    {
                        tableCell.addClass("tableCellActive");
                    }
                    else
                    {
                        tableCell.addClass("tableCellInactive");
                    }
                }
                else
                {
                    tableCell.data("full", false);
                    if(!interactive)
                    {
                        tableCell.addClass("tableCellNormal");
                    }
                    else
                    {
                        tableCell.addClass("tableCellInactive");
                    }                   
                }

                tableCell.css("position", "relative");

                if (interactive)
                {
                    tableCell.css("cursor", "pointer");
                }
                tableCell.data("cellClicked", false);
            });
            if (rowIndex === 0)
            {
                instance.rightLabel = $("<td></td>", { id: "right" });
                instance.rightLabel.addClass("tableBorderCellsVertical");
                instance.rightLabel.attr("rowspan", tableData.length);
                row.append(instance.rightLabel);
            }
            classInstance.table.append(row);
        });

        var footerRow = $("<tr/>");
        this.bottomLabel = $("<td/>", { id: "bottom", "colspan": tableData[0].length + 2 }).text(name);
        this.bottomLabel.addClass("tableBorderCells");
        footerRow.append(this.bottomLabel);
        this.table.append(footerRow);

        if(this.interactive)
        {
            this.tableInfo.text(name + " (fill here)");
            this.tableInfo.css("background-color", ACTIVE_ORANGE);
        }
        else 
        {
            this.tableInfo.text(name);
        }

        

        this.container.append(this.table);

        this.topLabel.text(side1);
        this.rightLabel.text(side2);
        this.bottomLabel.text(side3);
        this.leftLabel.text(side4);
    }

    onTableClicked(event)
    {
        if(!this.interactive)
        {
            return;
        }

        if (!($(event.target).hasClass("tableCellInactive") || $(event.target).hasClass("tableCellActive") || $(event.target).hasClass("cellSelectedContent")))
        {
            return;
        }

        var contentDiv;
        var parentContentDiv;
        if (event.target.children.length != 0)
        {
            contentDiv = $(event.target.children[0]);
            parentContentDiv = $(event.target);
        }
        else
        {
            contentDiv = $(event.target);
            parentContentDiv = contentDiv.parent();
        }

        var isFull = parentContentDiv.data().full;
        var newClickedCellState = !parentContentDiv.data().cellClicked;
        parentContentDiv.data("cellClicked", newClickedCellState);

        if (newClickedCellState)
        {
            if (isFull)
            {
                this.guessedCells++;
            }
            else
            {
                this.wrongCells++;
            }
        }
        else
        {
            if (isFull)
            {
                this.guessedCells--;
            }
            else
            {
                this.wrongCells--;
            }
        }

        if (newClickedCellState)
        {
            var style = getComputedStyle(document.body);
            var cellSize = style.getPropertyValue("--tableCellSize");

            contentDiv.animate({
                width: cellSize,
                height: cellSize
            }, 150);
        }
        else 
        {
            contentDiv.animate({
                width: "0px",
                height: "0px"
            }, 150);
        }
    }

    resetTable()
    {
        if (this.table)
        {
            this.table.remove();
            this.table.off();
            this.table.empty();
        }

        this.table = null;

        this.filledCells = 0;
        this.guessedCells = 0;
        this.wrongCells = 0;
    }

    isInteractive()
    {
        return this.interactive;
    }

    checkResult()
    {
        if (!this.interactive)
        {
            return false;
        }

        this.showCells();

        this.interactive = false;

        if (this.guessedCells === this.filledCells && this.wrongCells === 0)
        {
            return({
                result: CELLS_GUESSED,
                guessedCells: this.guessedCells,
                allCells: this.filledCells,
                wrongCells: this.wrongCells
            });
        }
        else
        {
            return({
                result: CELLS_WRONG,
                guessedCells: this.guessedCells,
                allCells: this.filledCells,
                wrongCells: this.wrongCells
            });
        }    
    }

    showCells()
    {
        var idSelector = "#" + this.tableId + " td";
        var allCells = $(idSelector);
        $.each(allCells, function (index, value)
        {
            if ($(value).data().full && $(value).data().cellClicked)
            {
                $(value).removeClass().addClass("tableCellGuessed");
                $(value.children[1]).css({
                    display: "block",
                    color: "rgb(30, 255, 0)",
                    fontSize: "2rem"
                });
                $(value.children[1]).text("+");
            }
            else if (!$(value).data().full && $(value).data().cellClicked)
            {
                $(value).removeClass().addClass("tableCellWrongClick");
                $(value.children[1]).css({
                    display: "block",
                    color: "red"
                });
                $(value.children[1]).text("X");
            }
            else if ($(value).data().full && !$(value).data().cellClicked)
            {
                $(value).removeClass().addClass("tableCellMissed");
                $(value.children[1]).css({
                    display: "block",
                    color: "red"
                });
                $(value.children[1]).text("?");
            }
        })
    }

    addToContainer(parentContainer)
    {
        if (!this.container[0].parentElement)
        {
            parentContainer.append(this.container);
        }
    }

    removeFromContainer()
    {
        this.container.remove();
    }

    clear()
    {
        if (this.table)
        {
            this.table.off();
        }
        this.container.empty();
        this.removeFromContainer();
    }
}