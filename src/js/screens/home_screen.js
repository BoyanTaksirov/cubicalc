const $ = require("jquery");

const Cube3DCSS = require("../components/cube_3d_css");
const Cube3DCSS_Inline = require("../components/cube_3d_css_inline");
const Button3D = require("../components/button_3d");

module.exports = class HomeScreen
{
    constructor(parentContainer)
    {
        this.container = $("<div/>").addClass("homeScreen");
        this.textLabel = $("<div/>").addClass("textLabelClass").text("drag to rotate cube");
        this.container.append(this.textLabel);
        parentContainer.append(this.container);

        this.MOUSE_DOWN_FLAG = false;

        this.lastMouseX;
        this.lastMouseY;
        this.lastMouseZ;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        var cubeTexts = {
            front: "See two projections of cubes in 3D space.",
            back: "Guess how would the third projection look.",
            left: "Observe 3D view to clear the picture",
            right: "Train your spacial thinking",
            top: "CUBI",
            bottom: "CALC"
        }

        this.cube = new Cube3DCSS_Inline(cubeTexts, 1000, 100, 100, 400, "button3DFrontClass", "button3DActiveClass", "button3DSidesClass");
        this.cube.addToContainer(this.container);
        this.cube.setPosition("35%", "20%");
        this.cube.startRotation(0.05);
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
    }

    onMouseDown(event)
    {
        this.MOUSE_DOWN_FLAG = true;
    }

    onMouseMove(event)
    {
        if(this.MOUSE_DOWN_FLAG)
        {
            var distanceX = 0;
            var distanceY = 0;
            if(this.lastMouseX)
            {
                distanceX = event.clientX - this.lastMouseX; 
            }
            this.lastMouseX = event.clientX;

            if(this.lastMouseY)
            {
                distanceY = event.clientY - this.lastMouseY; 
            }
            this.lastMouseY = event.clientY;

            var params = [{axis: "X", step: distanceY}, {axis: "Y", step: distanceX}, {axis: "Z", step: 0}];
            this.cube.setRotation(params);
        }
    }

    onMouseUp(event)
    {
        this.MOUSE_DOWN_FLAG = false;
        this.lastMouseX = null;
        this.lastMouseY = null;
    }

    removeEventListeners()
    {
        window.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    }

    clear()
    {
        this.removeEventListeners();
        this.cube.clear();
        this.cube = null;
        this.container.empty();
        this.container.remove();
    }
}