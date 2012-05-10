$(document).bind("mobileinit", function(){
            $.mobile.defaultPageTransition = 'none';
            //$.mobile.page.prototype.options.addBackBtn = true;
            $.mobile.ajaxEnabled = false;
            $.mobile.pushStateEnabled = false;
            $.mobile.buttonMarkup.hoverDelay = 25;
});