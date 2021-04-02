/* =====================
  Map Setup
===================== */
// Notice that we've been using an options object since week 1 without realizing it
var mapOpts = {
  center: [0, 0],
  zoom: 2
};
var map = L.map('map', mapOpts);

// Another options object
var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);

var data;
var markers;

var page1 = {
  title: "Welcome!", 
  content: "here's some random content",
  bbox: [[34.18, -14.15], [30.3, 59.4]]
}

var page2 = {
  title: "page2", 
  content: "here's some random content",
  bbox: [[-45.76, 105.2], [-2.02, 160.3]]
}

var slides = [
  page1,
  page2
]

var currentPage = 0

var nextPage = function() {

  // event handling for proceeding forward in slideshow

  tearDown()
  var nextPage = currentPage + 1
  currentPage = nextPage
  buildPage(slides[nextPage])
}

var prevPage = function() {

  // event handling for going backward in slideshow
  tearDown()
  var prevPage = currentPage - 1
  currentPage = prevPage
  console.log(currentPage)
  buildPage(slides[prevPage])

}




var buildPage = function(pageDefinition) {

  // build up a 'slide' given a page definition

  markers = data.map(function(site) {
    return L.marker([site.latitude, site.longitude])
  })

  markers.forEach(function(marker) { marker.addTo(map) })




  //set the title

  $('#title').text(pageDefinition.title)
  //set the content
  $('#content').text(pageDefinition.content)
  //move to the bounnding box
  map.flyToBounds(pageDefinition.bbox)



  if (currentPage === 0) {

    $('#prev').prop("disabled", true)
    
  } else {

    $('#prev').prop("disabled", false)
   
  }

if (currentPage === slides.length - 1) {
  $('#next').prop("disabled", true)
} else {
  $('#next').prop("disabled", false)
}

}

var tearDown = function() {

  // remove all plotted data in prep for building the page with new filters etc
  map.removeLayer(marker)

}

// Ajax to grab json
$.ajax('http://ihp-wins.unesco.org/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typename=geonode%3Aworldheritagesites&outputFormat=json&srs=EPSG%3A4326&srsName=EPSG%3A4326').done(function(json){
  var parsed = JSON.parse(json)
  data = parsed.map(function(datum){
    datum.latitude = Number(datum.latitude)
    datum.longitude = Number(datum.longitude)
    return datum;
})

buildPage(slides[currentPage])
})
$('#start').click(function(){
  document.getElementById("start").style.display="none"
  document.getElementById("back").style.display="";//隐藏
  document.getElementById("prev").style.display="";
  document.getElementById("next").style.display="";
  document.getElementById("map").style.visibility="visible";
})
$('#back').click(function(){
  document.getElementById("start").style.display=""
  document.getElementById("back").style.display="none";//隐藏
  document.getElementById("prev").style.display="none";
  document.getElementById("next").style.display="none";
  document.getElementById("map").style.visibility="hidden";
})
$('#next').click(nextPage)
$('#prev').click(prevPage)
//you can use jquery's "hide" function to hide a div, so that when you click 