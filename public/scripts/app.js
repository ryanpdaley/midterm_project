let authenticated = false;

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

function show_addList() {
  $("#overlay").show();
  return false;
}

$( document ).ready(function() {

  initMap()
  $("#overlay").hide()
  if (authenticated){
    $(this).find( ".sign_in" ).hide();
    $(this).find( ".onAuth" ).show();
    $("addList").click(function(event) {
      event.preventDefault();
      $("#overlay").show();
    });
  } else {
    $( ".sign_in" ).hover(function() {
      $(this).css("opacity", "1");
    }, function() {
      $(this).css("opacity", "0.5");
    });
  }
});
