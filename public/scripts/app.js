$( document ).ready(function() {

  //  Show the overlay and the addList partial when clicked
  $("#addList").click(function(ev) {
    ev.preventDefault();
    $("#overlay").show();
    $("#overlay").css("opacity", "0.9");
    $("#favourites_view").css("display", "none");
    $(".right").css("float", "left");
    $("#myLists_view").css("display", "none");
    $("#addList_view").show();
    $("#addList_view").css("opacity", "1");
  });

  // Close / hide the overlay
  $("#overlay_close").click(function(ev) {
    ev.preventDefault();
    $("#overlay").hide();
    $(".right").css("float", "right");
  });

  //  Sign-in button hover state logic
  $( "#sign_in" ).hover(function() {
    $(this).css("opacity", "1");
  }, function() {
    $(this).css("opacity", "0.5");
  });

  //  Drop-down auto-close
  $( document ).click(function(){
    $(".collapse").collapse('hide');
  });
});
