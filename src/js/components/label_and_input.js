const $ = require("jquery");

module.exports = class LabelAndInput
{
    constructor(initializer)
    {
        this.initializer = initializer;

        this.container = $("<div/>").addClass("inputAndLabelContainer");
        this.container.append(this.container);

        this.onInputFieldEntered = this.onInputFieldEntered.bind(this);

        this.label = $("<div/>").addClass("inputLabel");
        this.label.text(this.initializer.labelText);
        this.container.append(this.label);

        this.inputField = $("<input/>", { type: "number" }).addClass("inputField");
        this.inputField.on("change", this.onInputFieldEntered);
        this.inputField.val(this.initializer.initialValue);
        this.container.append(this.inputField);
    }

    setFieldValue(value)
    {
        this.inputField.val(value);
    }

    getFieldValue()
    {
        return this.inputField.val();
    }

    onInputFieldEntered(event)
    {
        if($(event.currentTarget).val() < this.initializer.valueRange.min)
        {
           $(event.currentTarget).val(this.initializer.valueRange.min);
        }
        else if($(event.currentTarget).val() > this.initializer.valueRange.max)
        {
           $(event.currentTarget).val(this.initializer.valueRange.max);
        }
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
        this.inputField.off();
        this.container.empty();
        this.removeFromContainer();
    }
}