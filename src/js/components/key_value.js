const $ = require("jquery");

module.exports = class KeyValue{
    constructor(key, value, parentContainer)
    {
        this.container = $("<div/>").addClass("keyValueContainer");
        this.key = $(`<div>${key}</div>)`).addClass("keyLabel");
        this.value = $(`<div>${value}</div>)`).addClass("valueLabel");
        this.container.append(this.key, this.value);
        parentContainer.append(this.container);
    }

    setKeyAndValue(keyValue)
    {
        setKey(keyValue.key);
        setValue(keyValue.value);
    }

    setKey(key)
    {
        this.key.text(key);
    }

    setValue(value)
    {
        this.value.text(value);
    }

    setKeyStyle(property, value)
    {
        this.key.css(property, value);
    }

    setValueStyle(property, value)
    {
        this.value.css(property, value);
    }

    show()
    {
        this.container.show();
    }

    hide()
    {
        this.container.hide();
    }

    clear()
    {
        this.container.empty();
        this.container.remove();
    }
}