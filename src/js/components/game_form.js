const $ = require("jquery");
const ButtonStateData = require("../data/button_state_data");
const SwitchButton = require("./switch_button");
const LabelAndInput = require("./label_and_input");
const LabelAndInputInitializer = require("../data/label_and_input_initializer");


module.exports = class GameForm
{
    constructor(name, titleColor, onStartClicked, initializers)
    {
        this.name = name;       
        this.onStartClicked = onStartClicked;
        this.initializers = initializers;

        this.onStartClickedHandler = this.onStartClickedHandler.bind(this);

        this.inputFields = [];

        this.container = $("<div/>").addClass("gameFormClass");

        this.title = $("<div/>").addClass("startPanelTitle");
        this.title.css("background-color", titleColor);
        this.title.text(this.name);
        this.container.append(this.title);

        for(var i = 0; i < this.initializers.length; i++)
        {
            var tempInputField = new LabelAndInput(initializers[i]);
            tempInputField.addToContainer(this.container);
            this.inputFields.push(tempInputField);
        }

        var placeholder = $("<div/>").css({"height": "3.5rem"});
        this.container.append(placeholder);

        var startButtonStates = [new ButtonStateData(null, null, "start game", null, this.onStartClickedHandler, "startButtonClass")];
        this.startButton = new SwitchButton(startButtonStates, "START_BUTTON_ID", false);
        this.startButton.addToContainer(this.container);
    }

    onStartClickedHandler(buttonInstance)
    {
        this.onStartClicked(buttonInstance);
    }

    setInputFields(values)
    {
        if (values[0])
        {
            this.inputFields[0].setFieldValue(values[0]);
        }
        if(values[1])
        {            
            this.inputFields[1].setFieldValue(values[1]);
        }
    }

    getInputFieldValue(index)
    {
        if(index >= this.inputFields.length)
        {
            throw("[InputAndButton] Supplied field index is higher than current input fields count!");
        }
        return this.inputFields[index].getFieldValue();
    }

    show()
    {
        this.container.show();
    }

    hide()
    {
        this.container.hide();
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
        this.startButton.clear();

        $.each(this.inputFields, function(index, object)
        {
            object.clear();
        });
        
        this.inputFields = null;
        this.container.empty();
     
        this.removeFromContainer();
    }
}

