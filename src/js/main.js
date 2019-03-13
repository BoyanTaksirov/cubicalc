    const $ = require("jquery");
    const css  = require("../css/styles.css");
    const MainContainer = require("./screens/main_container");

    var mainContainer;

    $(document).ready(function() {
        startApp();
      });

    function startApp(e){
        mainContainer = new MainContainer();
        mainContainer.addToContainer(document.body);
    }
    
  
    
