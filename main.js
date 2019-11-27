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
        url: "https://services9.arcgis.com/ZGiMxit8DuB3m39w/arcgis/rest/services/moldova/FeatureServer"
    });

    map.add(moldova);
});