const $ = require("jquery");

const ROTATION_LEFT = 1;
const ROTATION_RIGHT = 2;
const ROTATION_NONE = 3;

const FRONT_ROTATION_DEGREE = 0;
const LEFT_ROTATION_DEGREE = -90;

module.exports = class Button3D
{
    constructor(label, containerPerspective, containerWidth, containerHeight, cubeSize, frontClass, activeClass, sidesClass, clickHandler)
    {
        this.label = label;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
        this.containerPerspective = containerPerspective;
        this.cubeSize = cubeSize;
        this.frontClass = frontClass;
        this.activeClass = activeClass;
        this.sidesClass = sidesClass;
        this.clickHandler = clickHandler;

        this.isOn = false;

        this.onFrontClicked = this.onFrontClicked.bind(this);
        this.onBottomClicked = this.onBottomClicked.bind(this);
        this.rotateCube = this.rotateCube.bind(this);

        this.rotating = false;
        this.rotationStep = 3;
        this.currentRotationX = 0;
        this.currentRotationY = 0;
        this.currentRotationZ = 0;

        this.currentRotationState = ROTATION_NONE;

        this.intervalHandler;

        this.container = $("<div/>").css({
            position: "relative",
            margin: "0 1rem",
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
            lineHeight: this.cubeSize + "px"
        }

        this.front = $("<div/>").css(this.cubeSidesStyleObject);
        this.front.addClass(this.frontClass);
        this.front.css({ "transform": "translateZ(" + (this.cubeSize / 2) + "px)" });
        this.front.text(this.label);

        this.front.click(this.onFrontClicked);

        this.back = $("<div/>", { id: "back_ID" }).css(this.cubeSidesStyleObject);
        this.back.addClass(this.sidesClass);
        this.back.css("transform", "rotateX(180deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.back.text(this.label);

        this.left = $("<div/>").css(this.cubeSidesStyleObject);
        this.left.addClass(this.sidesClass);
        this.left.css("transform", "rotateY(-90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.left.text(this.label);

        this.right = $("<div/>").css(this.cubeSidesStyleObject);
        this.right.addClass(this.sidesClass);
        this.right.css("transform", "rotateY(90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.right.text(this.label);

        this.top = $("<div/>").css(this.cubeSidesStyleObject);
        this.top.addClass(this.sidesClass);
        this.top.css("transform", "rotateX(90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.top.text(this.label);

        this.bottom = $("<div/>").css(this.cubeSidesStyleObject);
        this.bottom.addClass(this.activeClass);
        this.bottom.css("transform", "rotateX(-90deg) translateZ(" + (this.cubeSize / 2) + "px)");
        this.bottom.text(this.label);

        //this.bottom.click(this.onBottomClicked);

        this.cube.append(this.front, this.back, this.left, this.right, this.top, this.bottom);
        this.container.append(this.cube);
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
        var transformString = "";
        if (this.currentRotationY <= LEFT_ROTATION_DEGREE)
        {
            this.currentRotationY = LEFT_ROTATION_DEGREE;
            this.currentRotationZ = LEFT_ROTATION_DEGREE;
            this.clearRotateInterval();
            this.currentRotationState = ROTATION_NONE;

            var transformString = this.getRotationString("Y") + " " + this.getRotationString("Z");
            this.cube.css("transform", transformString);
        }
        else
        {
            this.proceedRotation(-(this.rotationStep), "Y", "Z");
        }
    }

    rotateCubeRight()
    {
        var transformString = "";
        if (this.currentRotationY >= FRONT_ROTATION_DEGREE)
        {
            this.currentRotationY = FRONT_ROTATION_DEGREE;
            this.currentRotationZ = FRONT_ROTATION_DEGREE;
            this.clearRotateInterval();
            this.currentRotationState = ROTATION_NONE;

            var transformString = this.getRotationString("Y") + " " + this.getRotationString("Z");
            this.cube.css("transform", transformString);
        }
        else
        {
            this.proceedRotation(this.rotationStep, "Y", "Z");
        }
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

        var transformString = this.getRotationString(axis1) + " " + this.getRotationString(axis2) + " " + this.getRotationString(axis3);
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

    onFrontClicked(event)
    {
        if (this.isOn)
        {
            return;
        }
        this.isOn = true;
        this.clearRotateInterval();
        this.currentRotationState = ROTATION_LEFT;
        this.intervalHandler = setInterval(this.rotateCube, 20);

        this.clickHandler(this);
    }

    onBottomClicked(event)
    {
        if (!this.isOn)
        {
            return;
        }
        this.isOn = false;
        this.clearRotateInterval();
        this.currentRotationState = ROTATION_RIGHT;
        this.intervalHandler = setInterval(this.rotateCube, 20);
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
        this.front.off();
        this.bottom.off();
        this.clearRotateInterval();
        this.removeFromContainer();
    }
}