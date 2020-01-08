const Bacau = 1;
const Botosani = 2;
const Galati = 3;
const Iasi = 4;
const Neamt = 5;
const Suceava = 6;
const Vaslui = 7;
const Vrancea = 8;

var fileName = "c:\\fakepath\\judete.zip";
var map_;

var requestFunc = null;
var portalUrl = "https://www.arcgis.com";
var langLib = null;
var scaleUtilsLib = null;
var domLib = null;

require([
    "esri/config",
    "esri/InfoTemplate",
    "esri/map",
    "esri/request",
    "esri/geometry/scaleUtils",
    "esri/layers/FeatureLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/dom",
    "dojo/json",
    "dojo/on",
    "dojo/parser",
    "dojo/sniff",
    "dojo/_base/array",
    "esri/Color",
    "dojo/_base/lang",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
],
  function (
  esriConfig, InfoTemplate, Map, request, scaleUtils, FeatureLayer,
  SimpleRenderer, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
  dom, JSON, on, parser, sniff, arrayUtils, Color, lang
) {
    parser.parse();
	esriConfig.defaults.io.proxyUrl = "/proxy/";

    scaleUtilsLib = scaleUtils;
    requestFunc = request;
    langLib = lang;
    domLib = dom;

    map_ = new Map({
        basemap: "gray"
    });

    /*map_ = new Map("mapCanvas", {
        basemap: "gray",
        center: [-41.647, 36.41],
        zoom: 3,
        slider: false
    });*/

    console.log('cancer');
    console.log(map_);

	/*var initialExtent = new Extent({
		"xmin": -14048224.31,
		"ymin": -564100.20,
		"xmax": 4776075.51,
		"ymax": 9278543.05,
		"spatialReference": {
			"wkid": 102100
		}
    });

	map = new Map({
        basemap: "topo-vector",
		extent: initialExtent,
		wrapAround180: true,
		slider: false
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

	map.add(moldova);*/
});

function generateFeatureCollection(fileName) {
    var name = fileName;

    var params = {
      'name': name,
      'targetSR': map.spatialReference,
      'maxRecordCount': 1000,
      'enforceInputFileSizeLimit': true,
      'enforceOutputJsonSizeLimit': true
    };

    //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters
    //This should work well when using web mercator.
    var extent = scaleUtils.getExtentForScale(map_, 40000);
    var resolution = extent.getWidth() / map_.width;
    params.generalize = true;
    params.maxAllowableOffset = resolution;
    params.reducePrecision = true;
    params.numberOfDigitsAfterDecimal = 0;

    var myContent = {
        'filetype': 'shapefile',
        'publishParameters': JSON.stringify(params),
        'f': 'json',
        'callback.html': 'textarea'
    };

    //use the rest generate operation to generate a feature collection from the zipped shapefile
    request({
        url: portalUrl + '/sharing/rest/content/features/generate',
        content: myContent,
        form: dom.byId('uploadForm'),
        handleAs: 'json',
        load: langLib.hitch(this, function (response) {
            if (response.error) {
                errorHandler(response.error);
                return;
            }
            var layerName = response.featureCollection.layers[0].layerDefinition.name;
            addShapefileToMap(response.featureCollection);
        }),
        error: langLib.hitch(this, errorHandler)
    });

	//Chrome and IE add c:\fakepath to the value - we need to remove it
	//See this link for more info: http://davidwalsh.name/fakepath

    /*var params = {
        'name': name,
        'targetSR': map.spatialReference,
        'maxRecordCount': 1000,
        'enforceInputFileSizeLimit': true,
        'enforceOutputJsonSizeLimit': true
    };

    //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters
    //This should work well when using web mercator.
    //var extent = scaleUtils.getExtentForScale(map, 40000);
    //var resolution = extent.getWidth() / map.width;
    params.generalize = true;
    //params.maxAllowableOffset = resolution;
    params.reducePrecision = true;
    params.numberOfDigitsAfterDecimal = 0;

    var myContent = {
        'filetype': 'shapefile',
        'publishParameters': JSON.stringify(params),
        'f': 'json',
        'callback.html': 'textarea'
    };

    console.log('Sending request');
    requestFunc({
        url: portalUrl + '/sharing/rest/content/features/generate',
        content: myContent,
        handleAs: 'json',
        load: lang.hitch(this, function (response) {
            console.log('Got response');
            if (response.error) {
              errorHandler(response.error);
              return;
            }
            var layerName = response.featureCollection.layers[0].layerDefinition.name;
            addShapefileToMap(response.featureCollection);
        }),
        error: lang.hitch(this, errorHandler)
    });*/
}

function errorHandler (error) {
    console.log(error);
}

function addShapefileToMap(featureCollection) {
	//add the shapefile to the map and zoom to the feature collection extent
	//If you want to persist the feature collection when you reload browser you could store the collection in
	//local storage by serializing the layer using featureLayer.toJson()  see the 'Feature Collection in Local Storage' sample
	//for an example of how to work with local storage.
	var fullExtent;
	var layers = [];
	dojo.forEach(featureCollection.layers, function (layer) {
		var infoTemplate = new esri.InfoTemplate("Details", "${*}");
		var layer = new esri.layers.FeatureLayer(layer, {
			infoTemplate: infoTemplate
		});
		//associate the feature with the popup on click to enable highlight and zoomto
		dojo.connect(layer,'onClick',function(evt){
			map_.infoWindow.setFeatures([evt.graphic]);
		});
		//change default symbol if desired. Comment this out and the layer will draw with the default symbology
		changeRenderer(layer);
		fullExtent = fullExtent ? fullExtent.union(layer.fullExtent) : layer.fullExtent;
		layers.push(layer);
	});
	map_.addLayers(layers);
	map_.setExtent(fullExtent.expand(1.25), true);
}

function changeRenderer(layer) {
	//change the default symbol for the feature collection for polygons and points
	var symbol = null;
	switch (layer.geometryType) {
		case 'esriGeometryPoint':
			symbol = new esri.symbol.PictureMarkerSymbol({
				'angle':0,
				'xoffset':0,
				'yoffset':0,
				'type':'esriPMS',
				'url':'http://static.arcgis.com/images/Symbols/Shapes/BluePin1LargeB.png',
				'contentType':'image/png',
				'width':20,
				'height':20
			});
			break;
		case 'esriGeometryPolygon':
			symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([112, 112, 112]), 1), new dojo.Color([136, 136, 136, 0.25]));
			break;
	}
	if (symbol) {
		layer.setRenderer(new esri.renderer.SimpleRenderer(symbol));
	}
}

function showDropdown() {
	document.getElementById('dropdown').hidden = !document.getElementById('dropdown').hidden;
}

function showDetails(county) {
	//alert(county);
	generateFeatureCollection(fileName);
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
