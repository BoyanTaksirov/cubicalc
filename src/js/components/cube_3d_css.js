const $ = require("jquery");

module.exports = class Cube3DCSS
{
    constructor()
    {
        this.container = $("<div/>").addClass("cubeContainer");
        this.cube =  $("<div/>").addClass("cube");
        this.front = $("<div>cubi</div>");
        this.back = $("<div>calc</div>");
        this.left = $("<div/>");
        this.right = $("<div/>");
        this.top = $("<div/>");
        this.bottom = $("<div/>");

        this.cube.append(this.front, this.back, this.left, this.right, this.top, this.bottom);
        this.container.append(this.cube);

        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.currentRotationZ = 0;
    }

    setRotation(increment, axis1, axis2 = null, axis3 = null)
    {       
        var transformString = this.getRotationString(increment, axis1) + " " + this.getRotationString(increment, axis2) + " " + this.getRotationString(increment, axis3);
        this.cube.css("transform", transformString);
    }


    getRotationString(increment, axis)
    {
        if(!axis)
        {
            return "";
        }

        var rotation = null;

        if(axis === "X")
        {
            this.currentRotationX += increment;
            rotation = this.currentRotationX + "deg";
        }
        else  if(axis === "Y")
        {
            this.currentRotationY += increment;
            rotation = this.currentRotationY + "deg";
        }
        if(axis === "Z")
        {
            this.currentRotationZ += increment;
            rotation = this.currentRotationZ + "deg";
        }
        var transformString = "rotate" + axis + "(" + rotation + ")";
        return(transformString);
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
        this.removeFromContainer();
    }
}