const Bacau = 1;
const Botosani = 2;
const Galati = 3;
const Iasi = 4;
const Neamt = 5;
const Suceava = 6;
const Vaslui = 7;
const Vrancea = 8;

var map;
var moldovaLayer;
var humusLayer;
var umiditateLayer;
var culturiPredominanteLayer;
var culturiPredominanteBackground;

var iconUrls = {
    "Porumb": "https://vignette.wikia.nocookie.net/gardenpaws/images/f/f8/Corn.png/revision/latest?cb=20181221051418",
    "Vie": "https://img.icons8.com/cotton/2x/grape.png",
    "Orz": "https://image.flaticon.com/icons/png/128/2316/2316448.png",
    "Grau": "https://cdn2.iconfinder.com/data/icons/vegetable-filled/64/vegetable-14-512.png",
    "Ceapa": "https://cdn3.iconfinder.com/data/icons/fruits-vegetables-color-2/128/onion-red-512.png    ",
    "Rosii": "http://www.myiconfinder.com/uploads/iconsets/256-256-871cc5a8a5f00c21047fd7342403b4d3-tomato.png"
};

var judete = [];

let culturi = {
    "Grau": 0,
    "Orz": 0,
    "Porumb": 0,
    "Vie": 0,
    "Rosii": 0,
    "Ceapa": 0
};

let suprafete = {
    "Suceava": 8553 / 0.1,
    "Botosani": 4986 / 0.1,
    "Iasi": 5476 / 0.1,
    "Neamt": 5897 / 0.1,
    "Bacau": 6621 / 0.1,
    "Vaslui": 5318 / 0.1,
    "Vrancea": 4857 / 0.1,
    "Galati": 4466 / 0.1
}

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/TileLayer",
    "esri/renderers/ClassBreaksRenderer",
    "esri/widgets/Legend",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
], function(Map, MapView, FeatureLayer, TileLayer, ClassBreaksRenderer, Legend, Graphic, GraphicsLayer) {

    map = new Map({
        basemap: "topo-vector"
    });

    moldovaLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/Judete/FeatureServer",
        outFields: ["*"]
    });

    humusLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/Humus/FeatureServer"
    });
    humusLayer.visible = false;

    
    umiditateLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/Umiditate/FeatureServer"
    });
    umiditateLayer.visible = false;

    culturiPredominanteBackground = new FeatureLayer({
        url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/CulturiPredominante/FeatureServer"
    });
    culturiPredominanteBackground.visible = false;

    culturiPredominanteLayer = new GraphicsLayer();
    culturiPredominanteLayer.visible = false;

    fetch('http://localhost/judete')
    .then(response => response.json())
    .then(res => {

        res.result.forEach(function (judet) {
            
            var point = {
                type: "point",
                longitude: judet.coordonate.long,
                latitude: judet.coordonate.lat
            };
        
            var simpleMarkerSymbol = {
                type: "picture-marker",
                url: iconUrls[judet.culturaPredominanta],
                width: "40px",
                height: "40px"
            };
        
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: simpleMarkerSymbol
            });
        
            culturiPredominanteLayer.add(pointGraphic);
        }
    )
});

    

    map.add(moldovaLayer);
    map.add(humusLayer);
    map.add(umiditateLayer);
    map.add(culturiPredominanteBackground);
    map.add(culturiPredominanteLayer);

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [27.6014,47.1585],
        zoom: 7
    });

    view.ui.add(new Legend({ view: view }), "bottom-right");

    view.on("click", function (event) {
        var screenPoint = {
            x: event.x,
            y: event.y
        };

        view.hitTest(screenPoint).then(function (response) {
            if (response.results.length) {
                var graphic = response.results.filter(function (result) {
                        return result.graphic.layer === moldovaLayer;
                    })[0].graphic;

                for (var key in culturi) {
                    culturi[key] = graphic.attributes[key];
                }

                var items = Object.keys(culturi).map(function(key) {
                    return [key, culturi[key]];
                });

                items.sort(function(first, second) {
                    return second[1] - first[1];
                });

                var content = "<b>Suprafata totala:</b> " + suprafete[graphic.attributes['JUDET']] + " ha<br>";
                var i = 0;

                for (const [key, value] of items) {
                    if (i == 3) {
                        break;
                    }

                    content = content + "<b>" + key + ":</b> " + value + " ha<br>";
                    i += 1;
                }

                view.popup.open({
                    title: graphic.attributes['JUDET'],
                    content: content
                });
            }
            });
    });
});

function showDropdown() {

    document.getElementById('dropdown').hidden = !document.getElementById('dropdown').hidden;
}

function culturiPredominante() {

    moldovaLayer.visible = false;
    humusLayer.visible = false;
    umiditateLayer.visible = false;
    culturiPredominanteLayer.visible = true;
    culturiPredominanteBackground.visible = true;
}

function calitateaSolului() {

    moldovaLayer.visible = false;
    humusLayer.visible = true;
    umiditateLayer.visible = false;
    culturiPredominanteLayer.visible = false;
    culturiPredominanteBackground.visible = false;
}

function umiditateaSolului() {

    moldovaLayer.visible = false;
    humusLayer.visible = false;
    umiditateLayer.visible = true;
    culturiPredominanteLayer.visible = false;
    culturiPredominanteBackground.visible = false;
}

function refresh() {

    moldovaLayer.visible = true;
    moldovaLayer.labelsVisible = true;
    humusLayer.visible = false;
    umiditateLayer.visible = false;
    culturiPredominanteLayer.visible = false;
    culturiPredominanteBackground.visible = false;
}