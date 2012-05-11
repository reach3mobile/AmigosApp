var firstDay = new Date(2012, 4, 3); // YYYY M(0 based) D
var version = 4;
//check to make sure that the current database is up to date
function versionCheck() {
  if (localStorage.getItem("version") != version) {
    console.log("Version out of date, blasting storage");
    localStorage.clear();
    localStorage.setItem("version", version);
  };
};

// get the current date as mm-dd-yyyy
function getTodaysDate() {
  var fullDate = new Date();
  //convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);

  var finalDate =  twoDigitMonth + "-" + fullDate.getDate() + "-" + fullDate.getFullYear();
  return finalDate;
};

function nextPageUrl(thisPage) {
  // get the current URL
  var url = $.mobile.path.parseUrl(window.location.href);
  
  // get the number out of the current page ID
   var pgNumb = parseInt(thisPage.match(/\d+/));
   // there are 5 questions per page, if this is question 5 the next one is on a different page
   
   var newUrl = url.filename;
   if (pgNumb % 5 == 0) {
     // get the number from the page name
     var dateNumb = parseInt(newUrl.match(/\d+/));
     // store this variable 
     
     // add 1
     dateNumb += 1;
     
     // there are eight pages so send home if the new page would be higher
     if (dateNumb > 8) {
       return "quizindex.html";
     };
     localStorage.setItem("pageNumber", dateNumb);
     newUrl = "quiz-day-" + dateNumb + ".html";
     
   };
   // add 1
   pgNumb += 1;
   // insert it back into the page ID
   var newPage = thisPage.replace(/(\d+)/g, pgNumb);
   // return the complete URL
  
   return newUrl + "#" + newPage;
};

function daysSinceStart() {
  var today = new Date();
  var oneDay=1000*60*60*24;
  var days = Math.ceil((today.getTime()-firstDay.getTime())/(oneDay));
  console.log("days: " + days);
  return days;
};

function remainingQuiz() {
  // check to see if the storage contains the number of unlocked days, if not init 1
  if (localStorage.getItem("unlocked") == null) {
    localStorage.setItem("unlocked", 1);
  };
  // check to see if the storage contains the number of the last page played, if not 1
  if (localStorage.getItem("pageNumber") == null) {
    localStorage.setItem("pageNumber", 1);
  };
  // check to see if the score for today has be created if not make it 0
  if (localStorage.getItem("scoreToday") == null) {
    localStorage.setItem("scoreToday", 0);
  };
  // todays date
  var today = getTodaysDate();
  // check to see if the storage contains the date, if not set to today
  if (localStorage.getItem("today") == null) {
    localStorage.setItem("today", getTodaysDate());
  };
  var days = daysSinceStart();
  // if the date is not today then we need to reset to 0 again
  if (localStorage.getItem("today") != getTodaysDate()) {
    console.log("resetting quizes");
    // we might should set the player on the first quiz for this day.
    localStorage.setItem("lastQuiz", "quiz-day-" + days + ".html");
    localStorage.setItem("unlocked", days);
    localStorage.setItem("today", today);
    localStorage.setItem("scoreToday", 0);
  };
  // if there are no more remaining questions we will just show the score, other wise keep going!
  var pageNumber = localStorage.getItem("pageNumber");
  if (pageNumber <= days) {
    return true;
  };
  return false;
}

//function that either gets the quiz for today, or sends you to the page showing your score if there are none
function getTodaysQuiz() {
  // the date
  var fullDate = getTodaysDate();
  
  // last day of the event, if it is past this date we just redirect to the final score page
  //var endDate = new Date("May 21, 2012");
  if (daysSinceStart() > 8) {
    $.mobile.changePage("quizindex.html");
  }else {
    
    // it is within the play period, lets see if they player left off somewhere
    var lastQuiz = localStorage.getItem("lastQuiz");
    // if they did, AND we still have quizes left for today then go to that quiz
    if (lastQuiz != null && remainingQuiz() == true) {
      console.log(localStorage.getItem("lastQuiz"));
      window.location = localStorage.getItem("lastQuiz");
      return;
    // otherwise send them to the score page again
    }else if (remainingQuiz() == false) {
      console.log("out of quizes today");
      window.location = "quizindex.html"; //$.mobile.changePage("quizindex.html");
      return;
    };
    // player has never played before so send to first quiz
    window.location = "quiz-day-1.html#quiz-1";
    //window.location = "quiz-day-" + today + ".html#quiz-2";
  };

};

function getTodaysItin() {
  // if it has been more than 8 days we are just going to send them to the first day instead so they dont get a 404
  if (daysSinceStart() > 8) {
    window.location = "itinerary.html#day-8";
    return;
  };
  window.location = "itinerary.html#day-" + daysSinceStart();
};

function getTodaysBio() {
  // if it has been more than 8 days we are just going to send them to the first day instead so they dont get a 404
  if (daysSinceStart() > 8) {
    window.location = "bios.html#bio-8";
    return;
  };
  window.location = "bios.html#bio-" + daysSinceStart();
};

function getTodaysPhoto() {
  // if it has been more than 8 days we are just going to send them to the first day instead so they dont get a 404
  if (daysSinceStart() > 8) {
    window.location = "photos.html#pic-8";
    return;
  };
  window.location = "photos.html#pic-" + daysSinceStart();
};

function nextQuiz(){
  // if there are no more quizzes for today override and return to the quiz index
  if (remainingQuiz() == false) {
    window.location = "quizindex.html";
    return;
  };
  // get the current URL
  var url = $.mobile.path.parseUrl(window.location.href);

  //console.log(thisPage);
  // get the number out of the current page ID
   var pgNumb = parseInt(currentPage.match(/\d+/));
   // there are 5 questions per page, if this is question 5 the next one is on a different page
   
   // this gives us the file name for the current page
   var newUrl = url.filename;
   // if the quiz is a multiple of 5 then the next question is on another file
   if (pgNumb % 5 == 0) {
     // get the number from the page name
     var dateNumb = parseInt(newUrl.match(/\d+/));
     // store this variable 
     
     // add 1
     dateNumb += 1;
     // there are eight pages so send home if the new page would be higher
     if (dateNumb > 8) {
       return "quizindex.html";
     };
     localStorage.setItem("pageNumber", dateNumb);
     newUrl = "quiz-day-" + dateNumb + ".html";
     
   };
   // add 1
   pgNumb += 1;
   // insert it back into the page ID
   var newPage = currentPage.replace(/(\d+)/g, pgNumb);
   // return the complete URL
  // send the user to the next quiz
  window.location = newUrl + "#" + newPage;
};

function prevQuiz(){
  // get the current URL
  var url = $.mobile.path.parseUrl(window.location.href);
  
  // get the number out of the current page ID
   var pgNumb = parseInt(currentPage.match(/\d+/));
   // there are 5 questions per page, if this is question 5 the next one is on a different page
   
   var newUrl = url.filename;
   
   // subtract 1
   pgNumb -= 1;
    
   if (pgNumb % 5 == 0) {
     // get the number from the page name
     var dateNumb = parseInt(newUrl.match(/\d+/));
     // store this variable 
     
     // subtract 1
     dateNumb -= 1;
     
     // there are eight pages so send home if the new page would be higher
     if (dateNumb <= 0) {
       window.location = "quizindex.html";
       return;
     };
     newUrl = "quiz-day-" + dateNumb + ".html";
     
   };
   
   // insert it back into the page ID
   var newPage = currentPage.replace(/(\d+)/g, pgNumb);
   // return the complete URL
   window.location = newUrl + "#" + newPage;
};

$("*").live("pageshow", function (event) {
  versionCheck();
  remainingQuiz();
});

$("#goodbyePage").live("pageshow", function (event) {
  // just in case they never played the quiz 0 it out if it doesnt exist
  if (localStorage.getItem("score") == null) {
    localStorage.setItem("score", 0);
  };
  var score = localStorage.getItem("score");

  var scoreString = score + "/40";
  $(".totalscore").text(scoreString);
});

// called when the index page is shown.
$(".navbar_index").live("pageshow", function (event) {
  // the button at the top of the index page
  var button = $("div.ui-page-active a.introbutton");
  // if it is not the first day or the last day then hide the button
  if (daysSinceStart() > 1 && daysSinceStart() < 8) {
    button.addClass("hidden");
  // if it is the last day or beyond then change to goodbye and update url
  }else if (daysSinceStart() >= 8) {
    $("div.ui-page-active a.introbutton > span > span").text("Goodbye! (click me)");
    button.attr("href", "#goodbyePage");
  };
});

$(".bio-page").live("pageshow", function (event) {
  var url = $.mobile.path.parseUrl(window.location);
  url = url.hash;
  var pgNumb = parseInt(url.match(/\d+/));
  console.log(pgNumb);
  
  if (pgNumb >= daysSinceStart()) {
    console.log("today");
    $("div.ui-page-active a.nextbiobutton").addClass("hidden");
  };
  
});

$(".photo-page").live("pageshow", function (event) {
  var url = $.mobile.path.parseUrl(window.location);
  url = url.hash;
  var pgNumb = parseInt(url.match(/\d+/));
  console.log(pgNumb);
  
  if (pgNumb >= daysSinceStart()) {
    console.log("today");
    $("div.ui-page-active a.nextphotobutton").addClass("hidden");
  };
  
});

$("#quizindex").live("pageshow", function (event) {
      var score = localStorage.getItem("score");
      //localStorage.removeItem("score");
      if (localStorage.getItem("score") == null) {
        localStorage.setItem("score", 0);
      };
      var score = localStorage.getItem("score");
      if (score == 0) {
        $(".goodjob").addClass("hidden");
      };
      var scoreString = score + "/40";
      $(".totalscore").text(scoreString);
      if (remainingQuiz() == true) {
        $(".noquiz").addClass("hidden");
      }else {
        $("div.ui-page-active a.nextQuizButton").addClass("hidden");
      };
      if (daysSinceStart() > 8) {
        $("div.ui-page-active a.nextQuizButton").addClass("hidden");
      };  
});
var currentPage;

$(".quizpage").live("pageshow", function (event) {
      //console.log($page.attr("id"));
      currentPage = $(this).attr("id");
      // grab the current score
      if (localStorage.getItem("score") == null) {
        localStorage.setItem("score", 0);
      };
      // check to see if the score for today has be created if not make it 0
      if (localStorage.getItem("scoreToday") == null) {
        localStorage.setItem("scoreToday", 0);
      };
      
      var score = parseInt(localStorage.getItem("score"));
      var scoreToday = parseInt(localStorage.getItem("scoreToday"));
      // update the displays
      $("div.ui-page-active p.score").text("Total Score: " + score + "/40");
      $("div.ui-page-active p.dayscore").text("Score Today: " + scoreToday);
      
      if (localStorage.getItem(currentPage + "win") != null) {
        // show the button to move to the next quiz
        if (remainingQuiz() == false) {
          $("div.ui-page-active a.nextQuizButton > span > span:first-child").text("See Score");
        };
        $("div.ui-page-active a.nextQuizButton").removeClass("hidden");
        if (localStorage.getItem(currentPage + "win") == "true") {
          $("div.ui-page-active h1.banner.right").removeClass("hide");
        }else {
          $("div.ui-page-active h1.banner.wrong").removeClass("hide");
        };
      };
      
      var playerAnswer = localStorage.getItem(currentPage);
      if (playerAnswer != null) {
        var icon;
        if (localStorage.getItem(currentPage + "win") == "true") {
          icon = "ui-icon-check";
        }else{
          icon = "ui-icon-delete";
        };
        $("div.ui-page-active a." + playerAnswer).parent().next().removeClass("ui-icon-arrow-r");
        $("div.ui-page-active a." + playerAnswer).parent().next().addClass(icon);
        //$("div.ui-page-active a." + playerAnswer).css('background-color', color);
      };
      console.log(currentPage);
});

$( document ).delegate(".quizpage", "pageinit", function() {
  if (localStorage.getItem("score") == null) {
    localStorage.setItem("score", 0);
  };
  if (localStorage.getItem("scoreToday") == null) {
    localStorage.setItem("scoreToday", 0);
  };
  var score = parseInt(localStorage.getItem("score"));
  //console.log($(this).data("url"));
  $('a.answer').click(function(e){
         // disable the buttons because this quiz has been completed
         if (localStorage.getItem(currentPage) != null) {
           e.preventDefault();
           return;
         }else {
           
         };
         // create selectors for the page banners
         var bannerWrong = $("div.ui-page-active h1.banner.wrong");
         var bannerRight = $("div.ui-page-active h1.banner.right");
         
         // this is the key for wheather this quest is right or wrong for when we need to reload the page
         var win = currentPage + "win";
         console.log(win);
         if ($(this).hasClass("wrong")) {
           // change the icon of the tapped button
            $(this).parent().next().removeClass("ui-icon-arrow-r");
            $(this).parent().next().addClass("ui-icon-delete");
            
            
            // hide the correct banner and display the incorrect banner
            bannerWrong.removeClass("hide");
            bannerRight.addClass("hide");
            // store that this has been answered wrong
            localStorage.setItem(win, "false");
         }else if($(this).hasClass("right")) {
           // change the icon of the tapped button
            $(this).parent().next().removeClass("ui-icon-arrow-r");
            $(this).parent().next().addClass("ui-icon-check");
           // hide the correct banner and display the incorrect banner
            bannerRight.removeClass("hide");
            bannerWrong.addClass("hide");
            
            // update the score in the localStorage database
            score += 1;
            localStorage.setItem("score", score);
            
            // update the score for today
            var scoreToday = parseInt(localStorage.getItem("scoreToday"));
            scoreToday += 1;
            console.log(scoreToday);
            localStorage.setItem("scoreToday", scoreToday);
            
            // store that this quiz has been answered sucessfully
            
            localStorage.setItem(win, "true");
            
            // update the score display
            $("div.ui-page-active p.score").text("Total Score: " + score + "/40");
            $("div.ui-page-active p.dayscore").text("Score Today: " + scoreToday);
         };
         // store the button that was pressed
         var buttonSelector = $(this).attr("class").replace(/\s/g , ".");
         //console.log(buttonSelector);
         localStorage.setItem(currentPage, buttonSelector);
         // we answered a quiz so update the storage to reflect that
         var answered = parseInt(localStorage.getItem("answered"));
         answered += 1;
         localStorage.setItem("answered", answered);
         // the url for the next page so we can automatically return there
         //console.log("next page: " + nextPageUrl(currentPage));
         localStorage.setItem("lastQuiz", nextPageUrl(currentPage));
         
         // show the button to move to the next quiz (if we havent used all the quizes today)
         if (remainingQuiz() == true) {
           $("div.ui-page-active a.nextQuizButton").removeClass("hidden");
         }else {
           $("div.ui-page-active a.nextQuizButton > span > span:first-child").text("See Score");
           $("div.ui-page-active a.nextQuizButton").removeClass("hidden");
         };
  });
  
});

// Check if a new cache is available on page load
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      //if (confirm('A new version of this site is available. Load it?')) {
      window.location.reload();
      //}
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);
