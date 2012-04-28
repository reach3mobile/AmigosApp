//function that either gets the quiz for today, or sends you to the page showing your score if there are none
function getTodaysQuiz() {
  // the date as a 8 digit number 04-27-2012
  var fullDate = new Date();
  //convert month to 2 digits
  var twoDigitMonth = ((fullDate.getMonth().length+1) === 1)? (fullDate.getMonth()+1) : '0' + (fullDate.getMonth()+1);

  var currentDate =  twoDigitMonth + "-" + fullDate.getDate() + "-" + fullDate.getFullYear();
  console.log(currentDate);
  // The last quiz that was taken
  var quizNumber = localStorage.getItem("quizNumber");
  if (quizNumber) {
    quizNumber = "quiz-1";
    localStorage.setItem("quizNumber", "quiz-1");
  };
  // new page url
  var pageUrl = "/quiz/" + currentDate + "/" + quizNumber + ".html";
  // transition to that page if it exists, otherwise transition to no quizes page
  console.log(pageUrl);
  if ($.mobile.changePage(pageUrl) == undefined) {
      $.mobile.changePage("quiz/index.html");
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
  if (localStorage.getItem(page) == "true") {
    //console.log(page + " returning true");
    return true;
  }else {
    //console.log(page + " returning false");
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
  };
  
  $('a.answer').click(function(e){
         // disable the buttons because this quiz has been completed
         if (quizCompleted(currentPage) == true) {
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
    

  });
  
});

