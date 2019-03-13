const $ = require("jquery");

const reverseRowCol_2DArray = require("../utils/utils").reverseRowCol_2DArray;

module.exports = class ViewTable
{
    constructor()
    {
        this.container = $("<div/>").addClass("viewTableContainer");
        this.tableInfo = $("<div/>").addClass("tableNameLabel");
        this.container.append(this.tableInfo);
        this.table;
        this.tableData;
    }

    setTableConfig(tableData, name, side1, side2, side3, side4)
    {
        this.resetTable();

        this.tableData = tableData;

        tableData = reverseRowCol_2DArray(tableData);

        var classInstance = this;
        this.tableData = tableData;
        this.table = $("<table/>").addClass('table');

        var headerRow = $("<tr/>");
        var headerCell = $("<th/>", { id: "top", "colspan": tableData[0].length + 2 }).text(name);
        headerCell.addClass("tableBorderCells");
        headerRow.append(headerCell);
        this.table.append(headerRow);

        $.each(tableData, function (rowIndex, r)
        {
            var row = $("<tr/>");
            if (rowIndex === 0)
            {
                var leftmostTableCell = $("<td></td>", {id: "left"});
                leftmostTableCell.addClass("tableBorderCellsVertical");
                leftmostTableCell.attr("rowspan", tableData.length).text("side view");
                row.append(leftmostTableCell);
            }
            $.each(r, function (colIndex, c)
            {
                var tableCell = $("<td/>");
                row.append(tableCell);
                if (c)
                {
                    tableCell.data("full", true);
                    tableCell.addClass("tableCellActive");

                }
                else
                {
                    tableCell.data("full", false);
                    tableCell.addClass("tableCellInactive");
                }
            });
            if (rowIndex === 0)
            {
                var rightmostTableCell = $("<td></td>", {id: "right"});
                rightmostTableCell.addClass("tableBorderCellsVertical");
                rightmostTableCell.attr("rowspan", tableData.length);
                row.append(rightmostTableCell);
            }
            classInstance.table.append(row);
        });

        var footerRow = $("<tr/>");
        var footerCell = $("<td/>", { id: "bottom", "colspan": tableData[0].length + 2 }).text(name);
        footerCell.addClass("tableBorderCells");
        footerRow.append(footerCell);
        this.table.append(footerRow);

        this.tableInfo.text(name);

        this.container.append(this.table);

        $("#top").text(side1);
        $("#right").text(side2);
        $("#bottom").text(side3);
        $("#left").text(side4);
    }

    resetTable()
    {
        if (this.table)
        {
            this.table.remove();
            this.table.empty();
        }

        this.table = null;
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
        this.container.empty();
        this.removeFromContainer();
    }
}