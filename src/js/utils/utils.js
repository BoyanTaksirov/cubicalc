module.exports.reverseRowCol_2DArray = function (tData)
{
    var newTableData = new Array(tData[0].length);
    for (var d = 0; d < newTableData.length; d++)
    {
        newTableData[d] = new Array(tData.length);
    }

    for (var i = 0; i < tData.length; i++)
    {
        for (var n = 0; n < tData[i].length; n++)
        {
            newTableData[n][i] = tData[i][n];
        }
    }

    return (newTableData);
}

module.exports.roundTo = function (number, roundUnits)
{
    var multiply = Math.pow(10, roundUnits);

    number /= multiply;

    number = Math.round(number) * multiply;

    return (number);
}

module.exports.remToPx = function (rem)
{
    var remValue;
    if (typeof rem === "string")
    {
        if (rem.search("rem") === -1)
        {
            throw ("[utils.remToPx] Supplied css value is not in rem units!");
        }
        remValue = parseFloat(rem);
    }
    else if (typeof rem === "number")   
    {
        remValue = rem;
    }
    return remValue * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

module.exports.getCSSRuleByName = function (selector, property = null)
{
    var rules = document.styleSheets[0].cssRules;

    for (i = 0; i < rules.length; i++)
    {
        if (rules[i].selectorText === selector)
        {
            if (!property)
            {
                return (rules[i]);
            }
            else
            {
                var propertyValue = rules[i].style[property];
                return (propertyValue);
            }
        }
    }
}