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
    "esri/layers/FeatureLayer",
    "esri/layers/TileLayer"
], function(Map, MapView, FeatureLayer, TileLayer) {

    var map = new Map({
        basemap: "topo-vector"
    });

    var moldova = new FeatureLayer({
    url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/JudeteMoldova/FeatureServer",
    outFields: ["*"]
    })

    // var moldova = new FeatureLayer({
    //     url: "https://services7.arcgis.com/8UggeJRGvsoPqZKc/arcgis/rest/services/Judete_Romania/MapServer"
    // });

    map.add(moldova);

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [27.6014,47.1585],
        zoom: 7
    });


    view.on("click", function (event) {
    var screenPoint = {
        x: event.x,
        y: event.y
    };

    // Search for graphics at the clicked location
    view.hitTest(screenPoint).then(function (response) {
        if (response.results.length) {
        var graphic = response.results.filter(function (result) {
                // check if the graphic belongs to the layer of interest
                return result.graphic.layer === moldova;
            })[0].graphic;
            // do something with the result graphic
            //console.log(response.results.features[0]);
            console.log(graphic.attributes);
        }
        });
    });
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
