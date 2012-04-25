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

var $page;

$(".quizpage").live("pageshow", function (event) {
      $page = $.mobile.activePage;
      //console.log($page.attr("id"));
});

$( document ).delegate(".quizpage", "pageinit", function() {
  var score = parseInt(localStorage.getItem("score"));
  //alert('A page with a class of "quizpage" was just created by jQuery Mobile!');
  $('a.wrong').click(function(e){
        // change the background color of the clicked link (update needed to keep corners round)
         $(this).parent().css('background-color', 'red');

         // create selectors for the page banners
         var bannerWrong = $("div.ui-page-active h1.banner.wrong");
         var bannerRight = $("div.ui-page-active h1.banner.right");
         // hide the correct banner and display the incorrect banner
         bannerWrong.removeClass("hide");
         bannerRight.addClass("hide");
    

  });
  
$('a.right').click(function(e){
     // change the background color of the clicked link (update needed to keep corners round)
      $(this).parent().css('background-color', 'green');

      // create selectors for the page banners
      var bannerWrong = $("div.ui-page-active h1.banner.wrong");
      var bannerRight = $("div.ui-page-active h1.banner.right");
      // hide the correct banner and display the incorrect banner
      bannerRight.removeClass("hide");
      bannerWrong.addClass("hide");

      // update the score in the localStorage database
      score += 10;
      localStorage.setItem("score", score);
    });
});

