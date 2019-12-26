const Bacau = 1;
const Botosani = 2;
const Galati = 3;
const Iasi = 4;
const Neamt = 5;
const Suceava = 6;
const Vaslui = 7;
const Vrancea = 8;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
], function(Map, MapView, FeatureLayer) {

    var map = new Map({
        basemap: "topo-vector"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [27.6014,47.1585],
        zoom: 7
    });

    var moldova = new FeatureLayer({
        url: "https://services9.arcgis.com/ZGiMxit8DuB3m39w/arcgis/rest/services/moldova_region/FeatureServer"
    });

    map.add(moldova);
});

function showDropdown() {

    document.getElementById('dropdown').hidden = !document.getElementById('dropdown').hidden;
}

function showDetails(county) {

    alert(county);
}

function culturiPredominante() {

    alert("Culturi Predominante");
}

function calitateaSolului() {

    alert("Calitatea Solului");
}

function umiditateaSolului() {

    alert("Umiditatea Solului");
}