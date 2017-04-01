//  Draws the inital map centered on LHL
function initalMap() {

  var location = new google.maps.LatLng(43.64443, -79.39483);

  var mapCanvas = document.getElementById('map');
  var mapOptions = {
      center: location,
      zoom: 16,
      panControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
}

$( document ).ready(function() {
  initalMap()

  //  Show the overlay and the addList partial when clicked
  $("#addList").click(function(ev) {
    ev.preventDefault();
    $("#overlay").show();
    $("#overlay").css("opacity", "0.9");
    $("#favourites_view").css("display", "none");
    $("#addList_view").show();
    $("#addList_view").css("opacity", "1");
  });

  //  Show the overlay and the favourites partial when clicked
  $("#favourites").click(function(ev) {
    ev.preventDefault();
    $("#overlay").show();
    $("#overlay").css("opacity", "0.9");
    $("#addList_view").css("display", "none");
    $("#favourites_view").show();
    $("#favourites_view").css("opacity", "1");
  });

  // Close / hide the overlay
  $("#overlay_close").click(function(ev) {
    ev.preventDefault();
    $("#overlay").hide();
  });

  //  Sign-in button hover state logic
  $( ".sign_in" ).hover(function() {
    $(this).css("opacity", "1");
  }, function() {
    $(this).css("opacity", "0.5");
  });

  //  Drop-down auto-close
  $( document ).click(function(){
    $(".collapse").collapse('hide');
  });
});
