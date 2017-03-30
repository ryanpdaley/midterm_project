function initMap() {

  var location = new google.maps.LatLng(43.64443, -79.39483);

  var mapCanvas = document.getElementById('map');
  var mapOptions = {
      center: location,
      zoom: 16,
      panControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);


  var marker = new google.maps.Marker({
      position: location,
      map: map
  });

  var contentString = '<link href="../styles/custom.css" rel="stylesheet" type="text/css">' +
'<div id="iw-container">' +
'<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
'<div class="iw-content">' +
'<div class="iw-subTitle">History</div>' +
'<img src="../assets/lhl.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
'<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
'<div class="iw-subTitle">Contacts</div>' +
'<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
'<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
'</div>' +
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
});
