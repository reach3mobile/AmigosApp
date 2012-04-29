// get the current date as mm-dd-yyyy
function getTodaysDate() {
  var fullDate = new Date();
  //convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);

  var finalDate =  twoDigitMonth + "-" + fullDate.getDate() + "-" + fullDate.getFullYear();
  return finalDate;
};

//function that either gets the quiz for today, or sends you to the page showing your score if there are none
function getTodaysQuiz() {
  // the date as a 8 digit number 04-27-2012
  var fullDate = new Date();
  
  // last day of the event, if it is past this date we just redirect to the final score page
  var endDate = new Date("May 20, 2012");
  if (fullDate >= endDate) {
    $.mobile.changePage("quiz/index.html");
  }else {
    if (localStorage.getItem("lastQuiz") != null) {
      console.log(localStorage.getItem("lastQuiz"));
      $.mobile.changePage(localStorage.getItem("lastQuiz"));
      return;
    };
    // new page url
    var pageUrl = "quiz/" + getTodaysDate() + "/quiz-1.html";
    // transition to that page if it exists, otherwise transition to no quizes page
    console.log(pageUrl);
    $.mobile.changePage(pageUrl);
  };
  //$.mobile.changePage(pageUrl, { transition: "slideup"} );
};

$("#quizone").live("pageshow", function (event) {
      var score = localStorage.getItem("score");
      //localStorage.removeItem("score");
      if (localStorage.getItem("score") == null) {
        localStorage.setItem("score", 0);
      };
      var score = localStorage.getItem("score");
      var scoreString = "Score: " + score;
      $("#score").text(scoreString);  
});
var currentPage;
function quizCompleted(page) {
  // check to see if this question has been answered, if so we need to disable it
  if (localStorage.getItem(page) == null) {
    //console.log(page + " returning true");
    return null;
  }else if (localStorage.getItem(page) == "true"){
    //console.log(page + " returning false");
    return true;
  }else if (localStorage.getItem(page) == "false") {
    return false;
  };
}

$(".quizpage").live("pageshow", function (event) {
      //console.log($page.attr("id"));
      currentPage = $(this).attr("id");
      if (quizCompleted(currentPage) == true) {
        $("div.ui-page-active h1.banner.right").removeClass("hide");
        $("div.ui-page-active a.right").css('background-color', 'green');
      };
      console.log(currentPage);
});

$( document ).delegate(".quizpage", "pageinit", function() {
  // grab the current score
  var score = parseInt(localStorage.getItem("score"));
  if (quizCompleted($(this).attr("id")) == true) {
    $("div.ui-page-active h1.banner.right").removeClass("hide");
    $("div.ui-page-active a.right").css('background-color', 'green');
  }else if (quizCompleted($(this).attr("id")) == false) {
    $("div.ui-page-active h1.banner.wrong").removeClass("hide");
  };
  
  //console.log($(this).data("url"));
  $('a.answer').click(function(e){
         // disable the buttons because this quiz has been completed
         if (quizCompleted(currentPage) != null) {
           e.preventDefault();
           return;
         }else {
           
         };
         // create selectors for the page banners
         var bannerWrong = $("div.ui-page-active h1.banner.wrong");
         var bannerRight = $("div.ui-page-active h1.banner.right");
         
         if ($(this).hasClass("wrong")) {
           // change the background color of the clicked link (update needed to keep corners round)
            $(this).parent().css('background-color', 'red');
            // hide the correct banner and display the incorrect banner
            bannerWrong.removeClass("hide");
            bannerRight.addClass("hide");
            // store that this has been answered wrong
            localStorage.setItem(currentPage, false);
         }else if($(this).hasClass("right")) {
           // change the background color of the clicked link (update needed to keep corners round)
            $(this).parent().css('background-color', 'green');
           // hide the correct banner and display the incorrect banner
            bannerRight.removeClass("hide");
            bannerWrong.addClass("hide");
            
            // update the score in the localStorage database
            score += 10;
            localStorage.setItem("score", score);
            
            // store that this quiz has been answered sucessfully
            //console.log("setting " +currentPage + " true");
            localStorage.setItem(currentPage, true);
         };
    
         // last completed quiz url so we can automatically return here
         localStorage.setItem("lastQuiz", "/quiz/" + getTodaysDate() + "/" + currentPage + ".html");
  });
  
});

