const $ = require("jquery");

module.exports = class SwitchButton {
    constructor(buttonStates, id = null, autoToggle = true) {
        this.currentState = 0;
        this.buttonStates = buttonStates;
        this.buttonId = id;
        this.autoToggle = autoToggle;
        this.initializeButton();
    }

    initializeButton() {
        this.buttonContainer = $("<button/>");

        this.setState(0, false);

        this.buttonContainer[0].baseClass = this;
        this.buttonContainer.click(this.onButtonClick);
    }

    setState(state, anim = true) {
        if (state < this.buttonStates.length) {
            this.currentState = state;
            this.setAppearance(this.currentState, anim);
        }
        else {
            console.log("[SwitchButton] Given state number is higher than the current state count for this button");
        }
    }

    setAppearance(stateNumber) {
        this.buttonContainer.text(this.buttonStates[stateNumber].buttonLabel);
        this.setClass(this.buttonStates[stateNumber].buttonClassName);
    }

    setClass(className){
        this.buttonContainer.removeClass();
        this.buttonContainer.addClass(className);
    }

    onButtonClick(event) {
        var currentButtonInstance = this.baseClass;
        if (currentButtonInstance.buttonStates[currentButtonInstance.currentState].stateHandler) {
            currentButtonInstance.buttonStates[currentButtonInstance.currentState].stateHandler(currentButtonInstance);
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

    hide()
    {
        this.buttonContainer.hide();
    }

    show()
    {
        this.buttonContainer.show();
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