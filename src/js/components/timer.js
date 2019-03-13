const KeyValue = require("./key_value");

module.exports = class Timer{
    constructor(intervalMs, parentContainer){
        this.interval = intervalMs;
        this.parentContainer = parentContainer;

        this.handler;
        this.startTime;

        this.timeFromStartSeconds = 0;
        this.beginTimeString = "00:00:00";
        this.onInterval = this.onInterval.bind(this);

        this.container = document.createElement("div");
        this.container.className = "keyValueContainer";
        this.displayField = new KeyValue("time passed: ", this.beginTimeString, this.parentContainer);
    }

    start(){
        this.stop();
        this.displayField.setValue(this.beginTimeString);
        this.handler = setInterval(this.onInterval, this.interval);
        this.startTime = new Date();
    }

    stop(){
        clearInterval(this.handler);
    }

    reset(){
        this.stop();
        this.timeFromStartSeconds = 0;
        this.displayField.setValue(this.beginTimeString);
    }

    onInterval(){
        var currentTime = new Date();
        this.timeFromStartSeconds = (currentTime.getTime() - this.startTime.getTime())/1000;
        var minutes = Math.floor(this.timeFromStartSeconds/60);
        var hours = Math.floor(minutes/60);

        var secondsLabel;
        if(minutes > 0){
            secondsLabel = this.timeFromStartSeconds % 60;
        }
        else{
             secondsLabel = this.timeFromStartSeconds;
        }

        secondsLabel = this.prependZero(secondsLabel);

        var minutesLabel;
        if(hours > 0){
            minutesLabel = minutes % 60;
        }
        else{
            minutesLabel = minutes;
        }

        minutesLabel = this.prependZero(minutesLabel);

        var hoursLabel = hours;      

        hoursLabel = this.prependZero(hoursLabel);

        var timeString = hoursLabel + ":" + minutesLabel + ":" + secondsLabel;

        this.displayField.setValue(timeString);
    }

    prependZero(value){
        value = Math.round(value);
        if(String(value).length === 1){
            value = "0" + value;
        }

        return value;
    }

    clear(){
        this.stop();
        this.displayField.clear();
    }
}