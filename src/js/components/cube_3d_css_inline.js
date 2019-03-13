const $ = require("jquery");

const ROTATION_LEFT = 1;
const ROTATION_RIGHT = 2;
const ROTATION_NONE = 3;

const FRONT_ROTATION_DEGREE = 0;
const LEFT_ROTATION_DEGREE = -90;

module.exports = class Cube3DInline
{
    constructor(texts, containerPerspective, containerWidth, containerHeight, cubeSize, frontClass, sidesClass, clickHandler = null)
    {
        this.texts = texts;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.containerPerspective = containerPerspective;
        this.cubeSize = cubeSize;
        this.frontClass = frontClass;
        this.sidesClass = sidesClass;
        this.clickHandler = clickHandler;

        this.rotateCube = this.rotateCube.bind(this);

        this.rotating = false;
        this.rotationStep = 0.2;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.currentRotationZ = 0;

        this.currentRotationState = ROTATION_NONE;

        this.intervalHandler;

        this.container = $("<div/>").css({
            position: "relative",
            width: this.containerWidth + "px",
            height: this.containerHeight + "px",
            perspective: this.containerPerspective + "px",
            //backgroundColor: "red"
        });

        this.cube = $("<div/>", { id: "MainCube" }).css({
            position: "relative",
            width: cubeSize + "px",
            height: cubeSize + "px",
            top: "0px",
            left: "0px",
            transformStyle: "preserve-3d",
        });

        this.cubeSidesStyleObject = {
            position: "absolute",
            width: this.cubeSize + "px",
            height: this.cubeSize + "px",
            boxSizing: "border-box",
            padding: "10rem 1rem",
            //lineHeight: this.cubeSize + "px"
        }

        this.front = $("<div/>").css(this.cubeSidesStyleObject);
        this.front.addClass(this.frontClass);
        this.front.css({ "transform": "translateZ(" + (this.cubeSize / 2) + "px)" });
        this.front.text(this.texts.front);

        this.back = $("<div/>", { id: "back_ID" }).css(this.cubeSidesStyleObject);
        this.back.addClass(this.frontClass);
        this.back.css("transform", "rotateX(180deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.back.text(this.texts.back);

        this.left = $("<div/>").css(this.cubeSidesStyleObject);
        this.left.addClass(this.frontClass);
        this.left.css("transform", "rotateY(-90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.left.text(this.texts.left);

        this.right = $("<div/>").css(this.cubeSidesStyleObject);
        this.right.addClass(this.frontClass);
        this.right.css("transform", "rotateY(90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.right.text(this.texts.right);

        this.top = $("<div/>").css(this.cubeSidesStyleObject);
        this.top.addClass(this.frontClass);
        this.top.css("transform", "rotateX(90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.top.text(this.texts.top);
        this.top.css({fontSize: "10rem", padding: "7rem 1rem"});

        this.bottom = $("<div/>").css(this.cubeSidesStyleObject);
        this.bottom.addClass(this.frontClass);
        this.bottom.css("transform", "rotateX(-90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.bottom.text(this.texts.bottom);
        this.bottom.css({fontSize: "10rem", padding: "7rem 1rem"});

        this.cube.append(this.front, this.back, this.left, this.right, this.top, this.bottom);
        this.container.append(this.cube);
    }

    startRotation(step = 0.1)
    {
        this.clearRotateInterval();
        this.rotationStep = step;
        this.currentRotationState = ROTATION_LEFT;
        this.intervalHandler = setInterval(this.rotateCube, 20);
    }

    setRotation(axisValueArray)
    {
        var transformString = "";
        var rotationString = "";
        for(var i = 0; i < axisValueArray.length; i++)
        {
            if(axisValueArray[i].axis === "X")
            {
                this.currentRotationX += axisValueArray[i].step;
                rotationString = this.currentRotationX + "deg";
            }
            else if(axisValueArray[i].axis === "Y")
            {
                this.currentRotationY += axisValueArray[i].step;
                rotationString = this.currentRotationY + "deg";
            }
            else if(axisValueArray[i].axis === "Z")
            {
                this.currentRotationZ += axisValueArray[i].step;
                rotationString = this.currentRotationZ + "deg";
            }
            transformString += "rotate" + axisValueArray[i].axis + "(" + rotationString + ") ";
        }
        
        this.cube.css("transform", transformString);
    }

    setPosition(xPos, yPos)
    {
        this.container.css({ left: xPos, top: yPos });
    }

    rotateCube()
    {
        switch (this.currentRotationState)
        {
            case ROTATION_NONE:
                this.clearRotateInterval();
                break;

            case ROTATION_LEFT:
                this.rotateCubeLeft();
                break;

            case ROTATION_RIGHT:
                this.rotateCubeRight();
                break;
        }
    }

    rotateCubeLeft()
    {
        this.proceedRotation(-(this.rotationStep), "Y", "Z");
    }

    rotateCubeRight()
    {
        this.proceedRotation(this.rotationStep, "Y", "Z");
    }

    proceedRotation(increment, axis1, axis2 = null, axis3 = null)
    {
        if (axis1 === "X" || axis2 === "X" || axis3 === "X")
        {
            this.currentRotationX += increment;
        }
        if (axis1 === "Y" || axis2 === "Y" || axis3 === "Y")
        {
            this.currentRotationY += increment;
        }
        if (axis1 === "Z" || axis2 === "Z" || axis3 === "Z")
        {
            this.currentRotationZ += increment;
        }

        var transformString = this.getRotationString("X") + " " + this.getRotationString("Y") + " " + this.getRotationString("Z");
        this.cube.css("transform", transformString);
    }

    getRotationString(axis)
    {
        if (!axis)
        {
            return "";
        }

        var rotation = null;

        if (axis === "X")
        {
            rotation = this.currentRotationX + "deg";
        }
        else if (axis === "Y")
        {
            rotation = this.currentRotationY + "deg";
        }
        if (axis === "Z")
        {
            rotation = this.currentRotationZ + "deg";
        }
        var transformString = "rotate" + axis + "(" + rotation + ")";
        return (transformString);
    }

    setInitialState()
    {
        this.onBottomClicked();
    }

    setActiveState()
    {
        this.onFrontClicked();
    }

    clearRotateInterval()
    {
        clearInterval(this.intervalHandler);
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
        this.clearRotateInterval();
        this.removeFromContainer();
    }
}