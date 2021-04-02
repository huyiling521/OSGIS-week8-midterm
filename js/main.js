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
var selectValue = "All";
var stringFilter = "";

var page1 = {
  title: "Welcome!", 
  content: "A World Heritage Site is a landmark or area with legal protection by an international convention administered by the United Nations Educational, Scientific and Cultural Organization (UNESCO). World Heritage Sites are designated by UNESCO for having cultural, historical, scientific or other form of significance. The sites are judged to contain \"cultural and natural heritage around the world considered to be of outstanding value to humanity\". To be selected, a World Heritage Site must be a somehow unique landmark which is geographically and historically identifiable and has special cultural or physical significance.As of June 2020, a total of 1,121 World Heritage Sites (869 cultural, 213 natural, and 39 mixed properties) exist across 167 countries. With 55 selected areas, China and Italy are the countries with the most sites on the list."
}

var page2 = {
  title: "Asia", 
  content: "Home to ancient civilizations and a diverse geography, Asia boasts a mind-boggling number of UNESCO World Heritage Sites. ",
  bbox: [[ -0.7031073524364783, 35.5078125], [63.23362741232569, 147.12890625]]
}

var page3 = {
  title: "Europe", 
  content: "There are over 400 listed heritages in Europe.",
  bbox: [[24.84656534821976, -37.96875], [72.0739114882038, 82.96875]]
}

var page4 = {
  title: "Africa", 
  content: "Africa possesses 96 heritages which takes up 8.5% in total.",
  bbox: [[ -38.8225909761771,  -36.38671875], [39.639537564366684, 80.85937499999999]]
}

var page5 = {
  title: "North America", 
  content: "North America is often classified with European countries.",
  bbox: [[ 7.710991655433217, -169.27734375], [70.90226826757711, -52.3828125]]
}

var page6 = {
  title: "South America", 
  content: "Including Latin America and Caribbean area, South America has nearly 150 heritages.",
  bbox: [[ -56.072035471800866,  -113.02734374999999], [ 17.97873309555617, -21.62109375]]
}

var page7 = {
  title: "Oceania", 
  content: "Due to its relatively shorter history, Oceania has fewer heritages and it's often calculated with Asin countries.",
  bbox: [[ -47.5172006978394, 98.61328125], [4.039617826768437,  188.26171875]]
}

var slides = [page1, page2, page3, page4, page5, page6, page7]

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
  buildPage(slides[prevPage])

}

var buildPage = function(pageDefinition) {


  markers = data.map(function(datum) {
    var customIcon = L.divIcon({className: datum.category.replace(' ', '')});
    var markerOptions = { icon: customIcon };  // An options object

  // Actually make the marker object a part of our data for later use.
  datum.marker = L.marker([datum.latitude, datum.longitude], markerOptions)
    .bindPopup(datum.site + " Listed in " +datum.date_inscribed);
    return datum.marker
  })

  markers.forEach(function(marker) { marker.addTo(map) })

  //set the title
  $('#title').text(pageDefinition.title)
  //set the content
  $('#content').text(pageDefinition.content)
  //move to the bounnding box
  map.fitBounds(pageDefinition.bbox)


  if (currentPage == 0 || currentPage == 1) {
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
  markers.forEach(function(marker){map.removeLayer(marker)})
}


var onStringFilterChange = function(e) {
  stringFilter = e.target.value;
  filterAndPlot();
};

var onSelectChange = function(e) {
  selectValue = e.target.value;
  filterAndPlot();
};

var filterAndPlot = function() {

  if (typeof filteredMarkers != "object"){
    tearDown();
  } else{
    filteredMarkers.forEach(function(marker){map.removeLayer(marker)})
  }

  dataFiltered = _.filter(data, function(site) {
    var condition = true;
    if (stringFilter != "") {
      condition = condition && site.date_inscribed.includes(stringFilter);
    }
    if (selectValue !== 'All') {
      condition = condition && site.category.toLowerCase() === selectValue;
    }
    return condition;
    })

  filteredMarkers = dataFiltered.map(function(datum) {
    var customIcon = L.divIcon({className: datum.category.replace(' ', '')});
    var markerOptions = { icon: customIcon };  

  datum.marker = L.marker([datum.latitude, datum.longitude], markerOptions)
    .bindPopup(datum.site + " Listed in " +datum.date_inscribed);
    return datum.marker
  })

  filteredMarkers.forEach(function(marker) { marker.addTo(map) })}

   
var bindEvents = function() {
  $('#str').keyup(onStringFilterChange);
  $('#sel').change(onSelectChange);
};

$.ajax('https://gist.githubusercontent.com/bwobst/a7d6e4d0a196b7cc3d3fbd49a3c40470/raw/1d4bb28867ea681766b0777cde372fa5e0864842/whl.json').done(function(json){
  var parsed = JSON.parse(json)
    dataDirty = parsed;
    data = dataDirty["row"]
    .map(function(datum){
    datum.latitude = Number(datum.latitude)
    datum.longitude = Number(datum.longitude)
    return datum;
  
})

$('#start').click(function(){
  document.getElementById("start").style.display="none"
  document.getElementById("back").style.display="";
  document.getElementById("bycontinent").style.display="";
  document.getElementById("byfree").style.display="";
  document.getElementById("bysearch").style.display="";
  document.getElementById("map").style.visibility="visible";
  document.getElementById("img").style.visibility="hidden";
  $('#content').text("Now, please choose the way you like to explore these incredible heritages!")
  currentPage = 0;
})

$('#back').click(function(){
  document.getElementById("start").style.display=""
  document.getElementById("back").style.display="none";
  document.getElementById("prev").style.display="none";
  document.getElementById("next").style.display="none";
  document.getElementById("bycontinent").style.display="none";
  document.getElementById("byfree").style.display="none";
  document.getElementById("bysearch").style.display="none";
  document.getElementById("map").style.visibility="hidden";
  document.getElementById("img").style.visibility="visible";
  document.getElementById("str").style.display="none";
  document.getElementById("sel").style.display="none";
  document.getElementById("labelForSel").style.display="none";
  document.getElementById("labelForStr").style.display="none";
  $('#title').text(page1.title)
  $('#content').text(page1.content)
})

$('#bycontinent').click(function(){
  document.getElementById("prev").style.display="";
  document.getElementById("next").style.display="";
  if (currentPage == 0 || currentPage == 1) {
    $('#prev').prop("disabled", true)
  } else {
    $('#prev').prop("disabled", false) 
  }
  $('#title').text("By Continent")
  $('#content').text("Now, explore by continent!")
})

$('#byfree').click(function(){
  document.getElementById("prev").style.display="none";
  document.getElementById("next").style.display="none";
  document.getElementById("str").style.display="none";
  document.getElementById("sel").style.display="none";
  document.getElementById("labelForSel").style.display="none";
  document.getElementById("labelForStr").style.display="none";
  map.fitBounds([[-50.95842672335992, -44.6484375],[248.203125,77.8418477505252]])
  $('#title').text("View Freely")
  $('#content').text("Now, explore as you like!")
})

$('#bysearch').click(function(){
  document.getElementById("str").style.display="";
  document.getElementById("sel").style.display="";
  document.getElementById("labelForSel").style.display="";
  document.getElementById("labelForStr").style.display="";
  $('#title').text("Search")
  $('#content').text("Search heritages by yourself!")
  bindEvents();
})

$('#next').click(nextPage)

$('#prev').click(prevPage)

buildPage(slides[currentPage])
})

