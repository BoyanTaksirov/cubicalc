const $ = require("jquery");

module.exports = class UniButton {
    constructor(buttonStates, id = null, autoToggle = false) {
        this.currentState = 0;
        this.buttonStates = buttonStates;
        this.buttonId = id;
        this.autoToggle = autoToggle;
        this.initializeButton();

        //this.onButtonEnter = this.onButtonEnter.bind(this);
        //this.onButtonOut = this.onButtonOut.bind(this);
    }

    initializeButton() {
        this.buttonContainer = $("<div></div>");
        this.buttonContainer.addClass("menuButtonContainer");

        this.buttonBackground = $("<div></div>");
        this.buttonBackground.addClass("backgroundButton");

        this.buttonSquare = $("<div></div>");
        this.buttonSquare.addClass("buttonSquare");

        this.buttonBackground.append(this.buttonSquare);

        this.buttonText = $("<div></div>");
        this.buttonText.addClass("menuButtonText");

        this.buttonContainer.append(this.buttonBackground, this.buttonText);

        this.setState(0, false);

        var thisClass = this;
        this.buttonContainer[0].baseClass = this;
        this.buttonContainer.click(this.onButtonClick);
        this.buttonContainer.hover(this.onButtonEnter, this.onButtonOut);
    }

    setState(state, anim = true) {
        if (state < this.buttonStates.length) {
            this.currentState = state;
            this.setAppearance(this.currentState, anim);
        }
        else {
            console.log("[UniButton] Given state number is higher than the current state count for this button");
        }
    }

    setAppearance(stateNumber) {
        this.buttonText.text(this.buttonStates[stateNumber].buttonLabel);

        if (this.buttonStates[stateNumber].backgroundWide) {
            this.buttonBackground.animate({ width: "7.5rem" }, 300);
        }
        else {
            this.buttonBackground.animate({ width: "2.2rem" }, 300);
        }

        this.buttonText.css("color", this.buttonStates[stateNumber].textColor);
        if(stateNumber === 0)
        {
            this.buttonSquare.css("background-color", "rgb(156, 211, 143)");
        }
        else
        {
            this.buttonSquare.css("background-color", "white");
        }
    }

    onButtonClick(event) {
        var currentButtonInstance = this.baseClass;
        if (currentButtonInstance.buttonStates[currentButtonInstance.currentState].stateHandler) {
            currentButtonInstance.buttonStates[currentButtonInstance.currentState].stateHandler();
        }
        else {
            return;
        }

        if (currentButtonInstance.autoToggle) {
            if (currentButtonInstance.buttonStates.length > 1) {
                var newState = currentButtonInstance.currentState + 1;
                if (newState >= currentButtonInstance.buttonStates.length) {
                    newState = 0;
                }

                currentButtonInstance.setState(newState);
            }
        }  
    }

    onButtonEnter(event) {
        var currentButtonInstance = this.baseClass;
        var hoverColor = currentButtonInstance.buttonStates[currentButtonInstance.currentState].hoverTextColor;
        currentButtonInstance.buttonText.css("color", hoverColor);

        if (currentButtonInstance.currentState === 0) {
            currentButtonInstance.buttonSquare.css("background-color", "white");
        }
    }

    onButtonOut(event) {
        var currentButtonInstance = this.baseClass;
        var color = currentButtonInstance.buttonStates[currentButtonInstance.currentState].textColor;
        currentButtonInstance.buttonText.css("color", color);
        if (currentButtonInstance.currentState === 0) {
            currentButtonInstance.buttonSquare.css("background-color", "rgb(156, 211, 143)");
        }
    }

    addToContainer(parentContainer) {
        if (!this.buttonContainer[0].parentElement) {
            parentContainer.append(this.buttonContainer);
        }
    }

    removeFromContainer() {
        this.buttonContainer.remove();
    }

    clear() {
        this.buttonContainer.off();
        this.buttonContainer.empty();
    }
}