module.exports = class ButtonStateData{
    constructor(textColor, hoverTextColor, buttonLabel, backgroundWide, stateHandler, buttonClassName = null)
    {
        this.textColor = textColor;   
        this.hoverTextColor = hoverTextColor;
        this.buttonLabel = buttonLabel;
        this.backgroundWide = backgroundWide;
        this.stateHandler = stateHandler;
        this.buttonClassName = buttonClassName;
    }
}