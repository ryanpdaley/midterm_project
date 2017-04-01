function initMap() {

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


  var marker = new google.maps.Marker({
      position: location,
      map: map
  });

  var contentString = '<link href="../styles/custom.css" rel="stylesheet" type="text/css">' +
    '<div id="iw-container">' +
    '<div class="iw-title">46 Spadina Ave., Toronto, On</div>' +
    '<div class="iw-content">' +
    '<div class="iw-subTitle">Random Text</div>' +
    '<img src="../assets/lhl.jpg" alt="46 Spadina Ave., Toronto, On" height="80" width="80">' +
    '<p>This is a random description of the building / point.</p>' +
    '<div class="iw-bottom-gradient"></div>' +
    '</div>';
  var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 400
  });

  marker.addListener('click', function () {
      infowindow.open(map, marker);
  });
}

$( document ).ready(function() {
  initMap()

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
