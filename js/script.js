var firstDay = 29;
// get the current date as mm-dd-yyyy
function getTodaysDate() {
  var fullDate = new Date();
  //convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);

  var finalDate =  twoDigitMonth + "-" + fullDate.getDate() + "-" + fullDate.getFullYear();
  return finalDate;
};

// get the day as a number 0-6
function getDayoftheMonth() {
  var today = new Date();
  today = today.getDate();

  return today;
};

function nextPageUrl(thisPage) {
  // WARNING: this could have problems if someone leaves the quiz open and then completes it the next day... Fix later.
  // get the current URL
  var url = $.mobile.path.parseUrl(window.location);
  console.log(url.pathname)
  // get the number out of the current page ID
   var pgNumb = parseInt(thisPage.match(/\d+/));
   // add 1
   pgNumb += 1;
   // there are only 40 questions so if the next page is 40 goto the total score page
   if (pgNumb == 41) {
     return "quizindex.html";
   };
   // insert it back into the page ID
   var newPage = thisPage.replace(/(\d+)/g, pgNumb);
   // return the complete URL
   console.log(url.pathname + "#" + newPage);
   return url.pathname + "#" + newPage;
};

function remainingQuiz() {
  // check to see if the storage contains the number of answered questions if not init to 0
  if (localStorage.getItem("answered") == null) {
    localStorage.setItem("answered", 0);
  };
  // check to see if the score for today has be created if not make it 0
  if (localStorage.getItem("scoreToday") == null) {
    localStorage.setItem("scoreToday", 0);
  };
  // todays date
  var today = new Date();
  // check to see if the storage contains the date, if not set to today
  if (localStorage.getItem("today") == null) {
    localStorage.setItem("today", getTodaysDate());
    console.log(today);
  };
  // if the date is not today then we need to reset to 0 again
  if (localStorage.getItem("today") != getTodaysDate()) {
    console.log(today + "saved today " + localStorage.getItem("today"));
    console.log("resetting quizes");
    localStorage.setItem("lastQuiz", "quiz-day-" + getDayoftheMonth() +".html#quiz-1");
    localStorage.setItem("today", today);
    localStorage.setItem("answered", 0);
    localStorage.setItem("scoreToday", 0);
  };
  // number of questions answered today
  var answered = localStorage.getItem("answered");
  // how many can be answered
  var remaining = 5;
  // difference
  remaining -= answered;
  // if there are no more remaining questions we will just show the score, other wise keep going!
  if (remaining != 0) {
    return true;
  };
  return false;
}

function nextQuiz() {
  if (remainingQuiz() == true) {
    console.log("next page URL", localStorage.getItem("lastQuiz"));
    window.location = localStorage.getItem("lastQuiz"); 
  }else {
    $.mobile.changePage("quizindex.html");
  };
}

function prevQuiz() {
  var pgNumb = parseInt(currentPage.match(/\d+/));
   // subtract 1
   pgNumb -= 1;
   // get the current URL
   var url = $.mobile.path.parseUrl(window.location);
   // there are only 5 questions per page so it is 0 we need to go back a page
   url = url.pathname;
   //console.log(url);
   var page = getDayoftheMonth();
   var newUrl;
   if (pgNumb == 0) {
     // go back one page
      page -= 1;
      newUrl = url.replace(/(\d+)/g, page);
      // if that would put us before the first day of the quiz then just return to the quiz home page.
      if (page < firstDay) {
         $.mobile.changePage("quizindex.html");
         return;
      };
   }else {
     // otherwise just pass the current page through
     newUrl = url;
   };
   // insert it back into the page ID
   var newPage = currentPage.replace(/(\d+)/g, pgNumb);
   
   // return the complete URL
   //console.log(newUrl + "#" + newPage + ".html");
   window.location = newUrl + "#" + newPage;
}

//function that either gets the quiz for today, or sends you to the page showing your score if there are none
function getTodaysQuiz() {
  // the date
  var fullDate = new Date();
  
  // last day of the event, if it is past this date we just redirect to the final score page
  var endDate = new Date("May 21, 2012");
  if (fullDate >= endDate) {
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
      $.mobile.changePage("quizindex.html");
      return;
    };
    // player has never played before so send to first quiz
    window.location = "quiz-day-" + firstDay +".html#quiz-1";
    //window.location = "quiz-day-" + today + ".html#quiz-2";
  };

};

$("*").live("pageshow", function (event) {
  remainingQuiz(); 
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
      $("div.ui-page-active p.dayscore").text("Score Today: " + scoreToday + "/5");
      
      if (localStorage.getItem(currentPage + "win") != null) {
        // show the button to move to the next quiz
        $("div.ui-page-active a.nextQuizButton").removeClass("hidden");
        if (localStorage.getItem(currentPage + "win") == "true") {
          $("div.ui-page-active h1.banner.right").removeClass("hide");
        }else {
          $("div.ui-page-active h1.banner.wrong").removeClass("hide");
        };
      };
      
      var playerAnswer = localStorage.getItem(currentPage);
      if (playerAnswer != null) {
        var color;
        if (localStorage.getItem(currentPage + "win") == "true") {
          color = "green";
        }else{
          color = "red";
        };
        $("div.ui-page-active a." + playerAnswer).css('background-color', color);
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
           // change the background color of the clicked link (update needed to keep corners round)
            $(this).parent().css('background-color', 'red');
            // hide the correct banner and display the incorrect banner
            bannerWrong.removeClass("hide");
            bannerRight.addClass("hide");
            // store that this has been answered wrong
            localStorage.setItem(win, "false");
         }else if($(this).hasClass("right")) {
           // change the background color of the clicked link (update needed to keep corners round)
            $(this).parent().css('background-color', 'green');
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
            $("div.ui-page-active p.dayscore").text("Score Today: " + scoreToday + "/5");
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
         if (remainingQuiz() != 0) {
           $("div.ui-page-active a.nextQuizButton").removeClass("hidden");
         };
  });
  
});

