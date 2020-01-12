const Bacau = 1;
const Botosani = 2;
const Galati = 3;
const Iasi = 4;
const Neamt = 5;
const Suceava = 6;
const Vaslui = 7;
const Vrancea = 8;

let culturi = {
    "Grau": 0,
    "Orz": 0,
    "Porumb": 0,
    "Vie": 0,
    "Rosii": 0,
    "Ceapa": 0
};

let suprafete = {
    "Suceava": 8553 / 0.01,
    "Botosani": 4986 / 0.01,
    "Iasi": 5476 / 0.01,
    "Neamt": 5897 / 0.01,
    "Bacau": 6621 / 0.01,
    "Vaslui": 5318 / 0.01,
    "Vrancea": 4857 / 0.01,
    "Galati": 4466 / 0.01
}

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/TileLayer",
    "esri/renderers/ClassBreaksRenderer"
], function(Map, MapView, FeatureLayer, TileLayer, ClassBreaksRenderer) {

    var map = new Map({
        basemap: "topo-vector"
    });

    var moldova = new FeatureLayer({
        url: "https://services5.arcgis.com/SuDSWaJ2Qi7wzabn/arcgis/rest/services/AgriculturaMoldova/FeatureServer",
        outFields: ["*"]
    })

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

        view.hitTest(screenPoint).then(function (response) {
            if (response.results.length) {
                var graphic = response.results.filter(function (result) {
                        return result.graphic.layer === moldova;
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

    alert("Culturi Predominante");
}

function calitateaSolului() {

    alert("Calitatea Solului");
}

function umiditateaSolului() {

    alert("Umiditatea Solului");
}
